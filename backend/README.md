# Agent Free - Real Estate Attorney Management System

A comprehensive real estate attorney management system with React frontend, Node.js backend, and PostgreSQL database.

## 🏗️ Architecture Overview

- **Frontend**: React with Material-UI and Radix UI implementations
- **Backend**: Node.js with Express.js REST API
- **Database**: PostgreSQL with comprehensive schema
- **Containerization**: Docker and Docker Compose
- **Authentication**: JWT-based authentication
- **File Storage**: Local file system with multer

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd react-agent-free
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### 3. Start with Docker (Recommended)

```bash
# Start all services (database + backend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Start Frontend Development Server

```bash
# Navigate to MUI implementation
cd mui

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:80
- **Database**: localhost:5432

## 🛠️ Development Setup

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Or start production server
npm start
```

### Frontend Development

```bash
# MUI Implementation
cd mui
npm install
npm start

# Radix Implementation
cd radix
npm install
npm start
```

### Database Management

```bash
# Connect to PostgreSQL
docker exec -it agent-free-db psql -U postgres -d agent_free_db

# Run migrations manually
docker exec -it agent-free-db psql -U postgres -d agent_free_db -f /docker-entrypoint-initdb.d/01-schema.sql

# Seed database
docker exec -it agent-free-db psql -U postgres -d agent_free_db -f /docker-entrypoint-initdb.d/02-seeds.sql
```

## 📁 Project Structure

```
react-agent-free/
├── backend/                 # Node.js Express API
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── Dockerfile          # Backend container config
│   └── .dockerignore       # Docker ignore rules
├── db/                     # Database files
│   ├── schema.sql          # PostgreSQL schema (DDL)
│   └── seeds.sql           # Sample data
├── mui/                    # Material-UI frontend
│   ├── src/
│   │   ├── components/     # Shared components
│   │   ├── pages/          # Page components
│   │   ├── config/         # API configuration
│   │   └── lib/            # Utilities
│   └── package.json
├── radix/                  # Radix UI frontend
├── shared-services/        # Shared API services
│   └── api.js             # API service classes
├── docker-compose.yml      # Multi-container setup
├── .env.example           # Environment template
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/profile` - Get user profile

### Attorneys
- `GET /api/attorneys` - List all attorneys
- `GET /api/attorneys/:id` - Get attorney details
- `GET /api/attorneys/:id/dashboard` - Attorney dashboard data

### Clients
- `GET /api/clients` - List clients (with filters)
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get client details

### Properties
- `GET /api/properties` - List properties (with filters)
- `POST /api/properties` - Create new property
- `GET /api/properties/:id` - Get property details

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id/status` - Update transaction status

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents` - Upload document
- `GET /api/documents/:id/download` - Download document

### Calendar
- `GET /api/calendar/events` - List calendar events
- `POST /api/calendar/events` - Create new event
- `PUT /api/calendar/events/:id` - Update event

### Messages
- `GET /api/messages` - List messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read

### Contract Templates
- `GET /api/contract-templates` - List templates
- `POST /api/contract-templates` - Create template
- `POST /api/contracts/generate` - Generate contract

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

## 🗄️ Database Schema

The system includes comprehensive database schema with the following main entities:

- **Users** - Base user accounts (attorneys, clients, admin)
- **Attorneys** - Attorney-specific information and metrics
- **Clients** - Client profiles and preferences
- **Properties** - Real estate property listings
- **Property Transactions** - Purchase/sale transactions
- **Documents** - Legal documents and contracts
- **Calendar Events** - Appointments and deadlines
- **Messages** - Communication between users
- **Contract Templates** - Reusable contract templates

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. Users login with email/password
2. Server returns JWT token
3. Frontend stores token in localStorage
4. Token included in Authorization header for API requests
5. Server validates token for protected endpoints

## 📱 Frontend Features

### Attorney Dashboard
- Performance metrics and statistics
- Active cases overview
- Quick actions panel
- Recent activity feed

### Client Management
- Comprehensive client profiles
- Advanced search and filtering
- Communication history
- Transaction tracking

### Property Search
- Advanced property filtering
- Interactive property cards
- Favorite properties
- Property details modal

### Document Management
- Document upload and storage
- Digital signature workflow
- Document status tracking
- Secure document sharing

### Calendar & Scheduling
- Full calendar interface
- Event creation and management
- Appointment scheduling
- Deadline tracking

### Messaging System
- Real-time messaging
- Conversation threads
- File attachments
- Message status indicators

### Contract Generation
- Template-based contract creation
- Dynamic form fields
- Contract preview and editing
- PDF generation

## 🐳 Docker Configuration

### Services

1. **PostgreSQL Database** (`database`)
   - Image: postgres:15-alpine
   - Port: 5432
   - Auto-initializes with schema and seed data

2. **Node.js Backend** (`backend`)
   - Custom Dockerfile
   - Port: 80
   - Depends on database health check

3. **Redis Cache** (`redis`)
   - Image: redis:7-alpine
   - Port: 6379
   - Optional caching layer

4. **Nginx Proxy** (`nginx`)
   - Image: nginx:alpine
   - Ports: 8080, 8443
   - Production profile only

### Volumes
- `postgres_data` - Database persistence
- `backend_uploads` - File uploads
- `redis_data` - Cache persistence

## 🔧 Configuration

### Environment Variables

```bash
# Application
NODE_ENV=development
PORT=80

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agent_free_db
DB_USER=postgres
DB_PASSWORD=password

# Security
JWT_SECRET=your-secret-key
BCRYPT_ROUNDS=10

# File Uploads
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads/

# CORS
CORS_ORIGIN=*
```

## 🧪 Testing

### Backend API Testing

```bash
# Health check
curl http://localhost:80/health

# Test authentication
curl -X POST http://localhost:80/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test protected endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:80/api/dashboard/stats
```

### Frontend Testing

```bash
cd mui
npm test
```

## 📊 Monitoring

### Health Checks
- Backend: `GET /health`
- Database: PostgreSQL health check
- Redis: Redis ping command

### Logs
```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f database
```

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Set production environment
export NODE_ENV=production

# Update environment variables
cp .env.example .env.production
# Edit .env.production with production values
```

### 2. Build and Deploy
```bash
# Build and start production services
docker-compose -f docker-compose.yml --profile production up -d

# Or deploy to cloud provider
# (Add specific deployment instructions for your platform)
```

### 3. Security Considerations
- Change default passwords
- Use strong JWT secrets
- Enable HTTPS with SSL certificates
- Configure firewall rules
- Regular security updates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with full attorney management system
  - React frontend with Material-UI and Radix implementations
  - Node.js backend with comprehensive API
  - PostgreSQL database with complete schema
  - Docker containerization
  - JWT authentication
  - File upload and document management
  - Calendar and scheduling system
  - Messaging and communication features
  - Contract generation and templates

