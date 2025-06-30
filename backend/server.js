const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 80;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'agent_free_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Validation schemas
const schemas = {
  user: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone: Joi.string().optional(),
    user_type: Joi.string().valid('client', 'attorney', 'admin').required()
  }),
  
  client: Joi.object({
    client_type: Joi.string().valid('buyer', 'seller', 'both').required(),
    preferred_contact: Joi.string().valid('email', 'phone', 'text').default('email'),
    budget_min: Joi.number().optional(),
    budget_max: Joi.number().optional(),
    preferred_locations: Joi.array().items(Joi.string()).optional(),
    notes: Joi.string().optional()
  }),

  property: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip_code: Joi.string().required(),
    property_type: Joi.string().valid('house', 'condo', 'townhouse', 'apartment', 'commercial', 'land').required(),
    bedrooms: Joi.number().integer().min(0).optional(),
    bathrooms: Joi.number().min(0).optional(),
    square_feet: Joi.number().integer().min(0).optional(),
    price: Joi.number().min(0).required(),
    description: Joi.string().optional(),
    features: Joi.array().items(Joi.string()).optional()
  }),

  transaction: Joi.object({
    property_id: Joi.number().integer().required(),
    client_id: Joi.number().integer().required(),
    transaction_type: Joi.string().valid('purchase', 'sale', 'lease', 'refinance').required(),
    offer_amount: Joi.number().min(0).optional(),
    closing_date: Joi.date().optional(),
    notes: Joi.string().optional()
  }),

  calendarEvent: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    event_type: Joi.string().valid('consultation', 'contract_review', 'closing', 'inspection', 'meeting', 'court_appearance', 'deadline').required(),
    start_time: Joi.date().required(),
    end_time: Joi.date().required(),
    location: Joi.string().optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    client_id: Joi.number().integer().optional(),
    transaction_id: Joi.number().integer().optional()
  }),

  message: Joi.object({
    recipient_id: Joi.number().integer().required(),
    subject: Joi.string().optional(),
    message_text: Joi.string().required(),
    transaction_id: Joi.number().integer().optional(),
    is_urgent: Joi.boolean().default(false)
  })
};

// Helper functions
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, user_type: user.user_type },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Agent Free Backend API',
    version: '1.0.0'
  });
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { error, value } = schemas.user.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, first_name, last_name, phone, user_type } = value;

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name, user_type',
      [email, hashedPassword, first_name, last_name, phone, user_type]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      message: 'User created successfully',
      user: user,
      token: token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name, user_type, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_type: user.user_type
      },
      token: token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, phone, user_type, avatar_url, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Attorney routes
app.get('/api/attorneys', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, u.first_name, u.last_name, u.email, u.phone, u.avatar_url
      FROM attorneys a
      JOIN users u ON a.user_id = u.id
      WHERE u.is_active = true
      ORDER BY u.last_name, u.first_name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Attorneys fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/attorneys/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT a.*, u.first_name, u.last_name, u.email, u.phone, u.avatar_url
      FROM attorneys a
      JOIN users u ON a.user_id = u.id
      WHERE a.id = $1 AND u.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attorney not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Attorney fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/attorneys/:id/dashboard', async (req, res) => {
  try {
    const { id } = req.params;

    // Get attorney stats
    const statsResult = await pool.query(`
      SELECT 
        COUNT(CASE WHEN pt.status IN ('initiated', 'under_contract', 'pending_inspection', 'pending_appraisal', 'pending_financing', 'pending_closing') THEN 1 END) as active_cases,
        COUNT(CASE WHEN pt.status = 'completed' THEN 1 END) as completed_cases,
        COUNT(CASE WHEN ce.status = 'scheduled' AND ce.start_time > NOW() THEN 1 END) as upcoming_appointments,
        COUNT(CASE WHEN m.is_read = false AND m.recipient_id = (SELECT user_id FROM attorneys WHERE id = $1) THEN 1 END) as unread_messages
      FROM attorneys a
      LEFT JOIN property_transactions pt ON a.id = pt.attorney_id
      LEFT JOIN calendar_events ce ON a.id = ce.attorney_id
      LEFT JOIN messages m ON (SELECT user_id FROM attorneys WHERE id = $1) = m.recipient_id
      WHERE a.id = $1
    `, [id]);

    // Get recent transactions
    const transactionsResult = await pool.query(`
      SELECT pt.*, p.address, p.city, p.state, c.user_id,
             u.first_name || ' ' || u.last_name as client_name
      FROM property_transactions pt
      JOIN properties p ON pt.property_id = p.id
      JOIN clients c ON pt.client_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE pt.attorney_id = $1
      ORDER BY pt.created_at DESC
      LIMIT 5
    `, [id]);

    // Get upcoming events
    const eventsResult = await pool.query(`
      SELECT ce.*, u.first_name || ' ' || u.last_name as client_name
      FROM calendar_events ce
      LEFT JOIN clients c ON ce.client_id = c.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE ce.attorney_id = $1 AND ce.start_time > NOW()
      ORDER BY ce.start_time ASC
      LIMIT 5
    `, [id]);

    res.json({
      stats: statsResult.rows[0],
      recent_transactions: transactionsResult.rows,
      upcoming_events: eventsResult.rows
    });
  } catch (err) {
    console.error('Attorney dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Client routes
app.get('/api/clients', authenticateToken, async (req, res) => {
  try {
    const { status, search, attorney_id } = req.query;
    let query = `
      SELECT c.*, u.first_name, u.last_name, u.email, u.phone, u.avatar_url,
             a.user_id as attorney_user_id, au.first_name as attorney_first_name, au.last_name as attorney_last_name
      FROM clients c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN attorneys a ON c.assigned_attorney_id = a.id
      LEFT JOIN users au ON a.user_id = au.id
      WHERE u.is_active = true
    `;
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND c.status = $${paramCount}`;
      params.push(status);
    }

    if (attorney_id) {
      paramCount++;
      query += ` AND c.assigned_attorney_id = $${paramCount}`;
      params.push(attorney_id);
    }

    if (search) {
      paramCount++;
      query += ` AND (u.first_name ILIKE $${paramCount} OR u.last_name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY u.last_name, u.first_name';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Clients fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/clients', authenticateToken, async (req, res) => {
  try {
    const { error: userError, value: userData } = schemas.user.validate(req.body.user);
    const { error: clientError, value: clientData } = schemas.client.validate(req.body.client);

    if (userError) {
      return res.status(400).json({ error: userError.details[0].message });
    }
    if (clientError) {
      return res.status(400).json({ error: clientError.details[0].message });
    }

    const client = await pool.query('BEGIN');

    try {
      // Create user
      const hashedPassword = await hashPassword(userData.password);
      const userResult = await pool.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [userData.email, hashedPassword, userData.first_name, userData.last_name, userData.phone, 'client']
      );

      // Create client
      const clientResult = await pool.query(
        'INSERT INTO clients (user_id, client_type, preferred_contact, budget_min, budget_max, preferred_locations, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [userResult.rows[0].id, clientData.client_type, clientData.preferred_contact, clientData.budget_min, clientData.budget_max, clientData.preferred_locations, clientData.notes]
      );

      await pool.query('COMMIT');

      res.status(201).json({
        message: 'Client created successfully',
        client: clientResult.rows[0]
      });
    } catch (err) {
      await pool.query('ROLLBACK');
      throw err;
    }
  } catch (err) {
    console.error('Client creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Property routes
app.get('/api/properties', async (req, res) => {
  try {
    const { status, min_price, max_price, property_type, city, bedrooms, bathrooms } = req.query;
    let query = 'SELECT * FROM properties WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (min_price) {
      paramCount++;
      query += ` AND price >= $${paramCount}`;
      params.push(min_price);
    }

    if (max_price) {
      paramCount++;
      query += ` AND price <= $${paramCount}`;
      params.push(max_price);
    }

    if (property_type) {
      paramCount++;
      query += ` AND property_type = $${paramCount}`;
      params.push(property_type);
    }

    if (city) {
      paramCount++;
      query += ` AND city ILIKE $${paramCount}`;
      params.push(`%${city}%`);
    }

    if (bedrooms) {
      paramCount++;
      query += ` AND bedrooms >= $${paramCount}`;
      params.push(bedrooms);
    }

    if (bathrooms) {
      paramCount++;
      query += ` AND bathrooms >= $${paramCount}`;
      params.push(bathrooms);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Properties fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/properties', authenticateToken, async (req, res) => {
  try {
    const { error, value } = schemas.property.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await pool.query(
      'INSERT INTO properties (address, city, state, zip_code, property_type, bedrooms, bathrooms, square_feet, price, description, features) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [value.address, value.city, value.state, value.zip_code, value.property_type, value.bedrooms, value.bathrooms, value.square_feet, value.price, value.description, value.features]
    );

    res.status(201).json({
      message: 'Property created successfully',
      property: result.rows[0]
    });
  } catch (err) {
    console.error('Property creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Transaction routes
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { client_id, attorney_id, status } = req.query;
    let query = `
      SELECT pt.*, p.address, p.city, p.state, p.price as property_price,
             u.first_name || ' ' || u.last_name as client_name,
             au.first_name || ' ' || au.last_name as attorney_name
      FROM property_transactions pt
      JOIN properties p ON pt.property_id = p.id
      JOIN clients c ON pt.client_id = c.id
      JOIN users u ON c.user_id = u.id
      JOIN attorneys a ON pt.attorney_id = a.id
      JOIN users au ON a.user_id = au.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (client_id) {
      paramCount++;
      query += ` AND pt.client_id = $${paramCount}`;
      params.push(client_id);
    }

    if (attorney_id) {
      paramCount++;
      query += ` AND pt.attorney_id = $${paramCount}`;
      params.push(attorney_id);
    }

    if (status) {
      paramCount++;
      query += ` AND pt.status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY pt.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Transactions fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { error, value } = schemas.transaction.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await pool.query(
      'INSERT INTO property_transactions (property_id, client_id, attorney_id, transaction_type, offer_amount, closing_date, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [value.property_id, value.client_id, req.user.attorney_id || value.attorney_id, value.transaction_type, value.offer_amount, value.closing_date, value.notes]
    );

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: result.rows[0]
    });
  } catch (err) {
    console.error('Transaction creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Document routes
app.get('/api/documents', authenticateToken, async (req, res) => {
  try {
    const { transaction_id, client_id, status } = req.query;
    let query = `
      SELECT d.*, u.first_name || ' ' || u.last_name as created_by_name
      FROM documents d
      LEFT JOIN users u ON d.created_by = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (transaction_id) {
      paramCount++;
      query += ` AND d.transaction_id = $${paramCount}`;
      params.push(transaction_id);
    }

    if (client_id) {
      paramCount++;
      query += ` AND d.client_id = $${paramCount}`;
      params.push(client_id);
    }

    if (status) {
      paramCount++;
      query += ` AND d.status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY d.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Documents fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/documents', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { transaction_id, client_id, document_type, title, requires_signature } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const result = await pool.query(
      'INSERT INTO documents (transaction_id, client_id, attorney_id, document_type, title, file_name, file_path, file_size, mime_type, requires_signature, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [transaction_id, client_id, req.user.attorney_id, document_type, title, req.file.originalname, req.file.path, req.file.size, req.file.mimetype, requires_signature === 'true', req.user.id]
    );

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: result.rows[0]
    });
  } catch (err) {
    console.error('Document upload error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Calendar routes
app.get('/api/calendar/events', authenticateToken, async (req, res) => {
  try {
    const { attorney_id, start_date, end_date } = req.query;
    let query = `
      SELECT ce.*, u.first_name || ' ' || u.last_name as client_name
      FROM calendar_events ce
      LEFT JOIN clients c ON ce.client_id = c.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (attorney_id) {
      paramCount++;
      query += ` AND ce.attorney_id = $${paramCount}`;
      params.push(attorney_id);
    }

    if (start_date) {
      paramCount++;
      query += ` AND ce.start_time >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      query += ` AND ce.end_time <= $${paramCount}`;
      params.push(end_date);
    }

    query += ' ORDER BY ce.start_time ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Calendar events fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/calendar/events', authenticateToken, async (req, res) => {
  try {
    const { error, value } = schemas.calendarEvent.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await pool.query(
      'INSERT INTO calendar_events (attorney_id, client_id, transaction_id, title, description, event_type, start_time, end_time, location, priority) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [req.user.attorney_id, value.client_id, value.transaction_id, value.title, value.description, value.event_type, value.start_time, value.end_time, value.location, value.priority]
    );

    res.status(201).json({
      message: 'Event created successfully',
      event: result.rows[0]
    });
  } catch (err) {
    console.error('Event creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Message routes
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { conversation_with } = req.query;
    let query = `
      SELECT m.*, 
             sender.first_name || ' ' || sender.last_name as sender_name,
             sender.avatar_url as sender_avatar,
             recipient.first_name || ' ' || recipient.last_name as recipient_name
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users recipient ON m.recipient_id = recipient.id
      WHERE (m.sender_id = $1 OR m.recipient_id = $1)
    `;
    const params = [req.user.id];

    if (conversation_with) {
      query += ' AND (m.sender_id = $2 OR m.recipient_id = $2)';
      params.push(conversation_with);
    }

    query += ' ORDER BY m.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Messages fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { error, value } = schemas.message.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await pool.query(
      'INSERT INTO messages (sender_id, recipient_id, subject, message_text, transaction_id, is_urgent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, value.recipient_id, value.subject, value.message_text, value.transaction_id, value.is_urgent]
    );

    res.status(201).json({
      message: 'Message sent successfully',
      message_data: result.rows[0]
    });
  } catch (err) {
    console.error('Message creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contract template routes
app.get('/api/contract-templates', authenticateToken, async (req, res) => {
  try {
    const { category, attorney_id } = req.query;
    let query = `
      SELECT ct.*, u.first_name || ' ' || u.last_name as attorney_name
      FROM contract_templates ct
      LEFT JOIN attorneys a ON ct.attorney_id = a.id
      LEFT JOIN users u ON a.user_id = u.id
      WHERE ct.is_active = true
    `;
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND ct.category = $${paramCount}`;
      params.push(category);
    }

    if (attorney_id) {
      paramCount++;
      query += ` AND (ct.attorney_id = $${paramCount} OR ct.is_public = true)`;
      params.push(attorney_id);
    } else {
      query += ' AND ct.is_public = true';
    }

    query += ' ORDER BY ct.usage_count DESC, ct.template_name ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Contract templates fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/contract-templates', authenticateToken, async (req, res) => {
  try {
    const { template_name, template_type, category, description, template_content, form_fields, is_public } = req.body;

    if (!template_name || !template_type || !category || !template_content) {
      return res.status(400).json({ error: 'Required fields: template_name, template_type, category, template_content' });
    }

    const result = await pool.query(
      'INSERT INTO contract_templates (attorney_id, template_name, template_type, category, description, template_content, form_fields, is_public) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [req.user.attorney_id, template_name, template_type, category, description, template_content, form_fields, is_public || false]
    );

    res.status(201).json({
      message: 'Contract template created successfully',
      template: result.rows[0]
    });
  } catch (err) {
    console.error('Contract template creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contract generation routes
app.post('/api/contracts/generate', authenticateToken, async (req, res) => {
  try {
    const { template_id, transaction_id, client_id, contract_data } = req.body;

    if (!template_id || !contract_data) {
      return res.status(400).json({ error: 'Template ID and contract data are required' });
    }

    // Get template
    const templateResult = await pool.query('SELECT * FROM contract_templates WHERE id = $1', [template_id]);
    if (templateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const template = templateResult.rows[0];

    // Generate contract content (simple template replacement)
    let generatedContent = template.template_content;
    for (const [key, value] of Object.entries(contract_data)) {
      const placeholder = `{{${key}}}`;
      generatedContent = generatedContent.replace(new RegExp(placeholder, 'g'), value);
    }

    // Save generation record
    const result = await pool.query(
      'INSERT INTO contract_generations (template_id, transaction_id, attorney_id, client_id, contract_data, generated_content) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [template_id, transaction_id, req.user.attorney_id, client_id, JSON.stringify(contract_data), generatedContent]
    );

    // Update template usage count
    await pool.query('UPDATE contract_templates SET usage_count = usage_count + 1 WHERE id = $1', [template_id]);

    res.status(201).json({
      message: 'Contract generated successfully',
      contract: result.rows[0],
      generated_content: generatedContent
    });
  } catch (err) {
    console.error('Contract generation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM property_transactions WHERE status IN ('initiated', 'under_contract', 'pending_inspection', 'pending_appraisal', 'pending_financing', 'pending_closing')) as active_transactions,
        (SELECT COUNT(*) FROM documents WHERE status = 'review') as pending_reviews,
        (SELECT COUNT(*) FROM property_transactions WHERE status = 'completed') as completed_deals,
        (SELECT COUNT(*) FROM properties WHERE status = 'available') as saved_properties
    `);

    res.json(statsResult.rows[0]);
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Agent Free Backend API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

