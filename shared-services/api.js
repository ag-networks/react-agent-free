// Base API Service Class
class ApiService {
  constructor() {
    this.baseURL = 'https://api.agentfree.com';
  }

  async request(endpoint, options = {}) {
    // Mock implementation - in production this would make real HTTP requests
    return this.mockRequest(endpoint, options);
  }

  async mockRequest(endpoint, options = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : null;

    // Route to appropriate mock handler
    if (endpoint.startsWith('/auth')) {
      return this.handleAuthRequests(endpoint, method, body);
    } else if (endpoint.startsWith('/properties')) {
      return this.handlePropertyRequests(endpoint, method, body);
    } else if (endpoint.startsWith('/transactions')) {
      return this.handleTransactionRequests(endpoint, method, body);
    } else if (endpoint.startsWith('/contracts')) {
      return this.handleContractRequests(endpoint, method, body);
    } else if (endpoint.startsWith('/documents')) {
      return this.handleDocumentRequests(endpoint, method, body);
    } else if (endpoint.startsWith('/messages')) {
      return this.handleMessageRequests(endpoint, method, body);
    } else if (endpoint.startsWith('/attorneys')) {
      return this.handleAttorneyRequests(endpoint, method, body);
    } else if (endpoint.startsWith('/pricing')) {
      return this.handlePricingRequests(endpoint, method, body);
    }

    throw new Error(`Unhandled endpoint: ${endpoint}`);
  }

  handleAuthRequests(endpoint, method, body) {
    if (endpoint === '/auth/login' && method === 'POST') {
      return {
        success: true,
        user: {
          id: '1',
          name: body.email === 'attorney@agentfree.com' ? 'Sarah Johnson' : 'John Smith',
          email: body.email,
          role: body.email === 'attorney@agentfree.com' ? 'attorney' : 'client'
        },
        token: 'mock-jwt-token'
      };
    }
    
    if (endpoint === '/auth/register' && method === 'POST') {
      return {
        success: true,
        user: {
          id: '2',
          name: body.name,
          email: body.email,
          role: 'client'
        },
        token: 'mock-jwt-token'
      };
    }

    throw new Error(`Unhandled auth endpoint: ${endpoint}`);
  }

  handlePropertyRequests(endpoint, method, body) {
    const mockProperties = [
      {
        id: '1',
        address: '123 Oak Street, San Francisco, CA 94102',
        price: 850000,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1200,
        type: 'Condo',
        status: 'For Sale',
        images: ['/api/placeholder/400/300'],
        description: 'Beautiful condo in the heart of San Francisco',
        yearBuilt: 2015,
        lotSize: '0.1 acres',
        schoolDistrict: 'SFUSD'
      },
      {
        id: '2',
        address: '456 Pine Avenue, Oakland, CA 94610',
        price: 650000,
        bedrooms: 2,
        bathrooms: 1,
        sqft: 900,
        type: 'Townhouse',
        status: 'For Sale',
        images: ['/api/placeholder/400/300'],
        description: 'Charming townhouse with modern amenities',
        yearBuilt: 2010,
        lotSize: '0.15 acres',
        schoolDistrict: 'Oakland USD'
      },
      {
        id: '3',
        address: '789 Elm Drive, Berkeley, CA 94704',
        price: 1200000,
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2000,
        type: 'Single Family',
        status: 'For Sale',
        images: ['/api/placeholder/400/300'],
        description: 'Spacious family home near UC Berkeley',
        yearBuilt: 1995,
        lotSize: '0.25 acres',
        schoolDistrict: 'Berkeley USD'
      }
    ];

    if (endpoint.includes('/properties/search')) {
      return { properties: mockProperties };
    }

    if (endpoint.match(/\/properties\/\d+$/)) {
      const propertyId = endpoint.split('/').pop();
      const property = mockProperties.find(p => p.id === propertyId);
      return property || { error: 'Property not found' };
    }

    throw new Error(`Unhandled property endpoint: ${endpoint}`);
  }

  handleTransactionRequests(endpoint, method, body) {
    const mockTransactions = [
      {
        id: '1',
        property: '123 Oak Street, San Francisco, CA',
        status: 'Contract Review',
        amount: 550000,
        progress: 25,
        nextMilestone: 'Inspection',
        dueDate: '2024-05-09',
        buyer: 'Alice Johnson',
        seller: 'Bob Wilson',
        attorney: 'Sarah Johnson'
      },
      {
        id: '2',
        property: '456 Pine Avenue, Oakland, CA',
        status: 'Inspection Period',
        amount: 325000,
        progress: 50,
        nextMilestone: 'Financing',
        dueDate: '2024-05-15',
        buyer: 'Carol Davis',
        seller: 'David Brown',
        attorney: 'Michael Chen'
      },
      {
        id: '3',
        property: '789 Elm Drive, Berkeley, CA',
        status: 'Financing',
        amount: 450000,
        progress: 75,
        nextMilestone: 'Closing',
        dueDate: '2024-05-30',
        buyer: 'Eve Martinez',
        seller: 'Frank Taylor',
        attorney: 'Sarah Johnson'
      }
    ];

    if (endpoint === '/transactions') {
      return { transactions: mockTransactions };
    }

    throw new Error(`Unhandled transaction endpoint: ${endpoint}`);
  }

  handleContractRequests(endpoint, method, body) {
    const mockTemplates = [
      { 
        id: '1', 
        name: 'Purchase Agreement', 
        description: 'Standard real estate purchase agreement',
        category: 'purchase',
        fields: [
          { name: 'buyerName', label: 'Buyer Name', type: 'text', required: true },
          { name: 'sellerName', label: 'Seller Name', type: 'text', required: true },
          { name: 'propertyAddress', label: 'Property Address', type: 'text', required: true },
          { name: 'purchasePrice', label: 'Purchase Price', type: 'currency', required: true },
          { name: 'closingDate', label: 'Closing Date', type: 'date', required: true }
        ]
      },
      { 
        id: '2', 
        name: 'Lease Agreement', 
        description: 'Residential lease agreement',
        category: 'lease',
        fields: [
          { name: 'tenantName', label: 'Tenant Name', type: 'text', required: true },
          { name: 'landlordName', label: 'Landlord Name', type: 'text', required: true },
          { name: 'propertyAddress', label: 'Property Address', type: 'text', required: true },
          { name: 'monthlyRent', label: 'Monthly Rent', type: 'currency', required: true },
          { name: 'leaseStartDate', label: 'Lease Start Date', type: 'date', required: true },
          { name: 'leaseEndDate', label: 'Lease End Date', type: 'date', required: true }
        ]
      },
      { 
        id: '3', 
        name: 'Amendment', 
        description: 'Contract amendment form',
        category: 'amendment',
        fields: [
          { name: 'originalContractDate', label: 'Original Contract Date', type: 'date', required: true },
          { name: 'amendmentDescription', label: 'Amendment Description', type: 'text', required: true },
          { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true }
        ]
      }
    ];

    if (endpoint === '/contracts/templates') {
      return { templates: mockTemplates };
    }

    throw new Error(`Unhandled contract endpoint: ${endpoint}`);
  }

  handleDocumentRequests(endpoint, method, body) {
    const mockDocuments = [
      {
        id: '1',
        name: 'Purchase Agreement.pdf',
        type: 'Contract',
        size: '2.4 MB',
        uploadDate: '2024-04-15',
        status: 'Signed',
        signatures: [
          { party: 'buyer', signed: true, signedDate: '2024-04-15' },
          { party: 'seller', signed: true, signedDate: '2024-04-16' }
        ]
      },
      {
        id: '2',
        name: 'Inspection Report.pdf',
        type: 'Report',
        size: '1.8 MB',
        uploadDate: '2024-04-20',
        status: 'Pending Review',
        signatures: []
      },
      {
        id: '3',
        name: 'Title Insurance.pdf',
        type: 'Insurance',
        size: '956 KB',
        uploadDate: '2024-04-22',
        status: 'In Review',
        signatures: []
      }
    ];

    if (endpoint === '/documents') {
      return { documents: mockDocuments };
    }

    throw new Error(`Unhandled document endpoint: ${endpoint}`);
  }

  handleMessageRequests(endpoint, method, body) {
    const mockConversations = [
      {
        id: '1',
        participants: ['John Smith', 'Sarah Johnson'],
        lastMessage: 'The contract review is complete. Please review the attached documents.',
        timestamp: '2024-04-25 14:30',
        unreadCount: 2,
        type: 'attorney'
      },
      {
        id: '2',
        participants: ['Alice Johnson', 'Michael Chen'],
        lastMessage: 'Inspection scheduled for tomorrow at 10 AM.',
        timestamp: '2024-04-25 11:15',
        unreadCount: 0,
        type: 'attorney'
      }
    ];

    const mockMessages = [
      {
        id: '1',
        senderId: '1',
        senderName: 'Sarah Johnson',
        content: 'The contract review is complete. Please review the attached documents.',
        timestamp: '2024-04-25 14:30',
        type: 'text'
      },
      {
        id: '2',
        senderId: '2',
        senderName: 'John Smith',
        content: 'Thank you! I\'ll review them this afternoon.',
        timestamp: '2024-04-25 14:45',
        type: 'text'
      }
    ];

    if (endpoint === '/messages/conversations') {
      return { conversations: mockConversations };
    }

    if (endpoint.includes('/messages/conversations/') && endpoint.includes('/messages')) {
      return { messages: mockMessages };
    }

    throw new Error(`Unhandled message endpoint: ${endpoint}`);
  }

  handleAttorneyRequests(endpoint, method, body) {
    const mockAttorneys = [
      {
        id: '1',
        name: 'Sarah Johnson',
        specialization: 'Real Estate Law',
        experience: '12 years',
        rating: 4.9,
        reviews: 127,
        hourlyRate: 350,
        availability: 'Available',
        bio: 'Experienced real estate attorney specializing in residential transactions.',
        education: 'Harvard Law School, J.D.',
        barAdmissions: ['California', 'New York'],
        languages: ['English', 'Spanish'],
        activeCases: 15,
        completedTransactions: 450,
        successRate: 98.5,
        responseTime: '< 2 hours',
        location: 'San Francisco, CA',
        phone: '(415) 555-0123',
        email: 'sarah.johnson@agentfree.com'
      },
      {
        id: '2',
        name: 'Michael Chen',
        specialization: 'Contract Law',
        experience: '8 years',
        rating: 4.7,
        reviews: 89,
        hourlyRate: 275,
        availability: 'Busy',
        bio: 'Contract law specialist with expertise in real estate transactions.',
        education: 'Stanford Law School, J.D.',
        barAdmissions: ['California'],
        languages: ['English', 'Mandarin'],
        activeCases: 22,
        completedTransactions: 320,
        successRate: 96.8,
        responseTime: '< 4 hours',
        location: 'Oakland, CA',
        phone: '(510) 555-0456',
        email: 'michael.chen@agentfree.com'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        specialization: 'Residential Real Estate',
        experience: '15 years',
        rating: 4.8,
        reviews: 203,
        hourlyRate: 400,
        availability: 'Available',
        bio: 'Senior attorney with extensive experience in residential real estate.',
        education: 'UC Berkeley Law, J.D.',
        barAdmissions: ['California', 'Nevada'],
        languages: ['English', 'Spanish', 'Portuguese'],
        activeCases: 18,
        completedTransactions: 680,
        successRate: 99.1,
        responseTime: '< 1 hour',
        location: 'Berkeley, CA',
        phone: '(510) 555-0789',
        email: 'emily.rodriguez@agentfree.com'
      }
    ];

    const mockConsultations = [
      {
        id: '1',
        clientName: 'Michelle Lee',
        clientId: 'client_001',
        address: '123 Oak Street, San Francisco, CA',
        type: 'Purchase Agreement Review',
        status: 'pending',
        priority: 'high',
        scheduledDate: '2024-05-02',
        scheduledTime: '10:00 AM',
        duration: '60 minutes',
        notes: 'First-time homebuyer, needs comprehensive review',
        action: 'Schedule Call',
        propertyValue: 850000,
        loanAmount: 680000,
        downPayment: 170000,
        contingencies: ['Inspection', 'Financing', 'Appraisal'],
        timeline: {
          contractSigned: '2024-04-28',
          inspectionDeadline: '2024-05-05',
          financingDeadline: '2024-05-12',
          closingDate: '2024-05-30'
        }
      },
      {
        id: '2',
        clientName: 'Robert Chen',
        clientId: 'client_002',
        address: '456 Pine Avenue, Oakland, CA',
        type: 'Contract Negotiation',
        status: 'approved',
        priority: 'medium',
        scheduledDate: '2024-05-03',
        scheduledTime: '2:00 PM',
        duration: '45 minutes',
        notes: 'Seller representation, multiple offers situation',
        action: 'Review Terms',
        propertyValue: 650000,
        offers: [
          { buyer: 'Alice Johnson', amount: 650000, terms: 'Standard' },
          { buyer: 'Bob Wilson', amount: 675000, terms: 'Cash offer' },
          { buyer: 'Carol Davis', amount: 660000, terms: 'Quick close' }
        ],
        timeline: {
          listingDate: '2024-04-20',
          offerDeadline: '2024-05-01',
          expectedClosing: '2024-05-25'
        }
      },
      {
        id: '3',
        clientName: 'Jennifer Walsh',
        clientId: 'client_003',
        address: '789 Elm Drive, Berkeley, CA',
        type: 'Title Issue Resolution',
        status: 'urgent',
        priority: 'urgent',
        scheduledDate: '2024-05-01',
        scheduledTime: '9:00 AM',
        duration: '90 minutes',
        notes: 'Title defect discovered, needs immediate attention',
        action: 'Emergency Review',
        propertyValue: 1200000,
        titleIssues: [
          'Unresolved lien from previous owner',
          'Boundary dispute with neighbor',
          'Missing easement documentation'
        ],
        timeline: {
          issueDiscovered: '2024-04-29',
          resolutionDeadline: '2024-05-06',
          closingDate: '2024-05-15'
        }
      }
    ];

    const mockContractReviews = [
      {
        id: '1',
        clientName: 'Daniel Martinez',
        clientId: 'client_004',
        address: '321 Maple Street, San Jose, CA',
        type: 'Purchase Agreement',
        stage: 'review',
        priority: 'high',
        assignedDate: '2024-04-29',
        dueDate: '2024-05-02',
        action: 'Complete Review',
        contractValue: 950000,
        reviewProgress: 75,
        issues: [
          { type: 'Contingency', description: 'Inspection period too short', severity: 'medium' },
          { type: 'Financing', description: 'Interest rate cap missing', severity: 'high' },
          { type: 'Closing', description: 'Closing costs allocation unclear', severity: 'low' }
        ],
        timeline: {
          received: '2024-04-29',
          initialReview: '2024-04-30',
          clientFeedback: '2024-05-01',
          finalReview: '2024-05-02'
        }
      },
      {
        id: '2',
        clientName: 'Sarah Green',
        clientId: 'client_005',
        address: '654 Cedar Lane, Fremont, CA',
        type: 'Lease Agreement',
        stage: 'pending',
        priority: 'medium',
        assignedDate: '2024-04-30',
        dueDate: '2024-05-03',
        action: 'Begin Review',
        contractValue: 3600, // monthly rent
        reviewProgress: 25,
        issues: [],
        timeline: {
          received: '2024-04-30',
          initialReview: '2024-05-01',
          clientFeedback: '2024-05-02',
          finalReview: '2024-05-03'
        }
      },
      {
        id: '3',
        clientName: 'Thomas Anderson',
        clientId: 'client_006',
        address: '987 Birch Road, Palo Alto, CA',
        type: 'Amendment',
        stage: 'approved',
        priority: 'low',
        assignedDate: '2024-04-28',
        dueDate: '2024-05-01',
        action: 'Finalize',
        contractValue: 1500000,
        reviewProgress: 100,
        issues: [],
        timeline: {
          received: '2024-04-28',
          initialReview: '2024-04-29',
          clientFeedback: '2024-04-30',
          finalReview: '2024-05-01'
        }
      }
    ];

    const mockLegalTasks = [
      {
        id: '1',
        title: 'Conduct legal review for Michelle Lee',
        description: 'Review purchase agreement and identify potential issues',
        clientName: 'Michelle Lee',
        clientId: 'client_001',
        type: 'Document Review',
        priority: 'high',
        status: 'in_progress',
        assignedTo: 'Sarah Johnson',
        dueDate: '2024-05-02',
        estimatedHours: 3,
        actualHours: 2.5,
        completed: false,
        completedDate: null,
        notes: 'Initial review completed, waiting for client clarification on financing terms',
        subtasks: [
          { id: '1a', title: 'Review contract terms', completed: true },
          { id: '1b', title: 'Check contingencies', completed: true },
          { id: '1c', title: 'Verify legal descriptions', completed: false },
          { id: '1d', title: 'Prepare summary report', completed: false }
        ]
      },
      {
        id: '2',
        title: 'Obtain client approval for contract amendments',
        description: 'Get client sign-off on proposed changes to purchase agreement',
        clientName: 'Robert Chen',
        clientId: 'client_002',
        type: 'Client Communication',
        priority: 'medium',
        status: 'pending',
        assignedTo: 'Michael Chen',
        dueDate: '2024-05-03',
        estimatedHours: 1,
        actualHours: 0,
        completed: false,
        completedDate: null,
        notes: 'Amendments drafted, scheduling call with client',
        subtasks: [
          { id: '2a', title: 'Draft amendment language', completed: true },
          { id: '2b', title: 'Schedule client call', completed: false },
          { id: '2c', title: 'Present amendments', completed: false },
          { id: '2d', title: 'Obtain signatures', completed: false }
        ]
      },
      {
        id: '3',
        title: 'Prepare closing documents for Walsh transaction',
        description: 'Draft and review all closing documentation',
        clientName: 'Jennifer Walsh',
        clientId: 'client_003',
        type: 'Document Preparation',
        priority: 'urgent',
        status: 'not_started',
        assignedTo: 'Emily Rodriguez',
        dueDate: '2024-05-01',
        estimatedHours: 4,
        actualHours: 0,
        completed: false,
        completedDate: null,
        notes: 'Waiting for title company to resolve lien issue',
        subtasks: [
          { id: '3a', title: 'Review title report', completed: false },
          { id: '3b', title: 'Prepare HUD-1 settlement statement', completed: false },
          { id: '3c', title: 'Draft deed and transfer documents', completed: false },
          { id: '3d', title: 'Coordinate with title company', completed: false }
        ]
      },
      {
        id: '4',
        title: 'File HOA disclosure documents',
        description: 'Submit required HOA documentation to county recorder',
        clientName: 'Daniel Martinez',
        clientId: 'client_004',
        type: 'Filing',
        priority: 'low',
        status: 'completed',
        assignedTo: 'Sarah Johnson',
        dueDate: '2024-04-30',
        estimatedHours: 0.5,
        actualHours: 0.75,
        completed: true,
        completedDate: '2024-04-30',
        notes: 'Filed successfully, confirmation number: HOA-2024-0430-001',
        subtasks: [
          { id: '4a', title: 'Gather HOA documents', completed: true },
          { id: '4b', title: 'Prepare filing package', completed: true },
          { id: '4c', title: 'Submit to recorder', completed: true },
          { id: '4d', title: 'Obtain confirmation', completed: true }
        ]
      }
    ];

    const mockDocumentTemplates = [
      {
        id: '1',
        name: 'Purchase Agreement',
        category: 'Contracts',
        description: 'Standard residential purchase agreement template',
        lastModified: '2024-04-15',
        usage: 45,
        tags: ['purchase', 'residential', 'standard']
      },
      {
        id: '2',
        name: 'Amendment',
        category: 'Contracts',
        description: 'Contract amendment template for modifications',
        lastModified: '2024-04-10',
        usage: 23,
        tags: ['amendment', 'modification', 'contract']
      },
      {
        id: '3',
        name: 'Disclosure Statement',
        category: 'Disclosures',
        description: 'Property disclosure statement template',
        lastModified: '2024-04-20',
        usage: 67,
        tags: ['disclosure', 'property', 'seller']
      },
      {
        id: '4',
        name: 'Addendum',
        category: 'Contracts',
        description: 'General addendum template for additional terms',
        lastModified: '2024-04-12',
        usage: 34,
        tags: ['addendum', 'additional', 'terms']
      },
      {
        id: '5',
        name: 'Bill of Sale',
        category: 'Transfer',
        description: 'Personal property bill of sale template',
        lastModified: '2024-04-18',
        usage: 12,
        tags: ['bill of sale', 'personal property', 'transfer']
      }
    ];

    const mockClients = [
      {
        id: 'client_001',
        name: 'Michelle Lee',
        email: 'michelle.lee@email.com',
        phone: '(415) 555-0101',
        address: '123 Oak Street, San Francisco, CA 94102',
        type: 'Buyer',
        status: 'active',
        rating: 4.8,
        joinDate: '2024-04-15',
        lastContact: '2024-04-29',
        totalTransactions: 1,
        currentTransactions: 1,
        preferredContact: 'email',
        notes: 'First-time homebuyer, very responsive and detail-oriented',
        avatar: null
      },
      {
        id: 'client_002',
        name: 'Robert Chen',
        email: 'robert.chen@email.com',
        phone: '(510) 555-0202',
        address: '456 Pine Avenue, Oakland, CA 94610',
        type: 'Seller',
        status: 'active',
        rating: 4.6,
        joinDate: '2024-03-20',
        lastContact: '2024-04-28',
        totalTransactions: 2,
        currentTransactions: 1,
        preferredContact: 'phone',
        notes: 'Experienced investor, prefers quick decisions',
        avatar: null
      },
      {
        id: 'client_003',
        name: 'Jennifer Walsh',
        email: 'jennifer.walsh@email.com',
        phone: '(510) 555-0303',
        address: '789 Elm Drive, Berkeley, CA 94704',
        type: 'Buyer',
        status: 'urgent',
        rating: 4.9,
        joinDate: '2024-04-01',
        lastContact: '2024-04-30',
        totalTransactions: 3,
        currentTransactions: 1,
        preferredContact: 'email',
        notes: 'High-value client, requires immediate attention for title issues',
        avatar: null
      },
      {
        id: 'client_004',
        name: 'Daniel Martinez',
        email: 'daniel.martinez@email.com',
        phone: '(408) 555-0404',
        address: '321 Maple Street, San Jose, CA 95110',
        type: 'Buyer',
        status: 'pending',
        rating: 4.7,
        joinDate: '2024-04-25',
        lastContact: '2024-04-29',
        totalTransactions: 1,
        currentTransactions: 1,
        preferredContact: 'phone',
        notes: 'Young professional, needs guidance through process',
        avatar: null
      },
      {
        id: 'client_005',
        name: 'Sarah Green',
        email: 'sarah.green@email.com',
        phone: '(510) 555-0505',
        address: '654 Cedar Lane, Fremont, CA 94536',
        type: 'Tenant',
        status: 'active',
        rating: 4.5,
        joinDate: '2024-04-28',
        lastContact: '2024-04-30',
        totalTransactions: 1,
        currentTransactions: 1,
        preferredContact: 'email',
        notes: 'Commercial lease client, detail-oriented',
        avatar: null
      },
      {
        id: 'client_006',
        name: 'Thomas Anderson',
        email: 'thomas.anderson@email.com',
        phone: '(650) 555-0606',
        address: '987 Birch Road, Palo Alto, CA 94301',
        type: 'Seller',
        status: 'inactive',
        rating: 4.9,
        joinDate: '2024-02-10',
        lastContact: '2024-04-28',
        totalTransactions: 4,
        currentTransactions: 0,
        preferredContact: 'phone',
        notes: 'VIP client, multiple high-value transactions',
        avatar: null
      }
    ];

    const mockPerformanceMetrics = {
      overview: {
        activeCases: 15,
        completedThisMonth: 8,
        totalRevenue: 45600,
        averageRating: 4.8,
        responseTime: '1.5 hours',
        successRate: 98.5
      },
      monthlyStats: [
        { month: 'Jan', cases: 12, revenue: 42000, rating: 4.7 },
        { month: 'Feb', cases: 15, revenue: 52500, rating: 4.8 },
        { month: 'Mar', cases: 18, revenue: 63000, rating: 4.9 },
        { month: 'Apr', cases: 14, revenue: 49000, rating: 4.8 }
      ],
      caseTypes: [
        { type: 'Purchase Agreement', count: 25, percentage: 45 },
        { type: 'Contract Review', count: 15, percentage: 27 },
        { type: 'Title Issues', count: 8, percentage: 14 },
        { type: 'Amendments', count: 7, percentage: 13 }
      ],
      clientSatisfaction: {
        excellent: 78,
        good: 18,
        average: 3,
        poor: 1
      }
    };

    if (endpoint === '/attorneys') {
      return { attorneys: mockAttorneys };
    }

    if (endpoint.match(/\/attorneys\/\d+$/)) {
      const attorneyId = endpoint.split('/').pop();
      const attorney = mockAttorneys.find(a => a.id === attorneyId);
      return attorney || { error: 'Attorney not found' };
    }

    if (endpoint === '/attorneys/consultations' || endpoint.includes('getPendingConsultations')) {
      return { consultations: mockConsultations };
    }

    if (endpoint === '/attorneys/contract-reviews' || endpoint.includes('getContractReviews')) {
      return { reviews: mockContractReviews };
    }

    if (endpoint === '/attorneys/legal-tasks' || endpoint.includes('getLegalTasks')) {
      return { tasks: mockLegalTasks };
    }

    if (endpoint === '/attorneys/document-templates' || endpoint.includes('getDocumentTemplates')) {
      return { templates: mockDocumentTemplates };
    }

    if (endpoint === '/attorneys/clients' || endpoint.includes('getClients')) {
      return { clients: mockClients };
    }

    if (endpoint === '/attorneys/performance' || endpoint.includes('getPerformanceMetrics')) {
      return { metrics: mockPerformanceMetrics };
    }

    if (endpoint.includes('/attorneys/') && endpoint.includes('/consultations') && method === 'POST') {
      return { success: true, consultationId: 'new_consultation_id' };
    }

    throw new Error(`Unhandled attorney endpoint: ${endpoint}`);
  }

  handlePricingRequests(endpoint, method, body) {
    const mockPricing = {
      plans: [
        {
          id: 'basic',
          name: 'Basic',
          price: 99,
          features: ['Document Review', 'Basic Support', '1 Transaction/Month']
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 199,
          features: ['Everything in Basic', 'Priority Support', '5 Transactions/Month', 'Attorney Consultation']
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 499,
          features: ['Everything in Premium', 'Dedicated Attorney', 'Unlimited Transactions', '24/7 Support']
        }
      ]
    };

    if (endpoint === '/pricing') {
      return mockPricing;
    }

    if (endpoint.includes('/pricing/calculate')) {
      const homePrice = new URLSearchParams(endpoint.split('?')[1]).get('homePrice');
      const savings = Math.floor(homePrice * 0.02); // 2% savings
      return { savings, homePrice: parseInt(homePrice) };
    }

    throw new Error(`Unhandled pricing endpoint: ${endpoint}`);
  }
}

export class AuthService extends ApiService {
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  }

  async logout() {
    // In a real implementation, this would invalidate the token
    return { success: true };
  }
}

export class PropertyService extends ApiService {
  async searchProperties(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/properties/search?${queryString}`);
  }

  async getPropertyDetails(propertyId) {
    return this.request(`/properties/${propertyId}`);
  }

  async saveProperty(propertyId) {
    return this.request(`/properties/${propertyId}/save`, { method: 'POST' });
  }
}

export class TransactionService extends ApiService {
  async getTransactions() {
    return this.request('/transactions');
  }

  async getTransactionDetails(transactionId) {
    return this.request(`/transactions/${transactionId}`);
  }

  async createTransaction(transactionData) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData)
    });
  }

  async updateTransaction(transactionId, updates) {
    return this.request(`/transactions/${transactionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }
}

export class ContractService extends ApiService {
  async getContractTemplates() {
    return this.request('/contracts/templates');
  }

  async generateContract(templateId, data) {
    return this.request('/contracts/generate', {
      method: 'POST',
      body: JSON.stringify({ templateId, data })
    });
  }

  async signContract(contractId, signature) {
    return this.request(`/contracts/${contractId}/sign`, {
      method: 'POST',
      body: JSON.stringify(signature)
    });
  }
}

export class DocumentService extends ApiService {
  async getDocuments(transactionId = null) {
    const endpoint = transactionId ? `/documents?transactionId=${transactionId}` : '/documents';
    return this.request(endpoint);
  }

  async uploadDocument(file, metadata) {
    // In a real implementation, this would handle file upload
    return this.request('/documents/upload', {
      method: 'POST',
      body: JSON.stringify({ fileName: file.name, ...metadata })
    });
  }

  async downloadDocument(documentId) {
    return this.request(`/documents/${documentId}/download`);
  }

  async deleteDocument(documentId) {
    return this.request(`/documents/${documentId}`, { method: 'DELETE' });
  }
}

export class MessageService extends ApiService {
  async getConversations() {
    return this.request('/messages/conversations');
  }

  async getMessages(conversationId) {
    return this.request(`/messages/conversations/${conversationId}/messages`);
  }

  async sendMessage(conversationId, content) {
    return this.request(`/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }

  async markAsRead(conversationId) {
    return this.request(`/messages/conversations/${conversationId}/read`, {
      method: 'POST'
    });
  }
}

export class AttorneyService extends ApiService {
  async getAttorneys() {
    return this.request('/attorneys');
  }

  async getAttorneyDetails(attorneyId) {
    return this.request(`/attorneys/${attorneyId}`);
  }

  async scheduleConsultation(attorneyId, datetime) {
    return this.request(`/attorneys/${attorneyId}/consultations`, {
      method: 'POST',
      body: JSON.stringify({ datetime })
    });
  }

  // Enhanced attorney-specific methods
  async getPendingConsultations() {
    return this.request('/attorneys/consultations');
  }

  async getContractReviews() {
    return this.request('/attorneys/contract-reviews');
  }

  async getLegalTasks() {
    return this.request('/attorneys/legal-tasks');
  }

  async getDocumentTemplates() {
    return this.request('/attorneys/document-templates');
  }

  async getClients() {
    return this.request('/attorneys/clients');
  }

  async getPerformanceMetrics() {
    return this.request('/attorneys/performance');
  }

  async updateTaskStatus(taskId, status) {
    return this.request(`/attorneys/legal-tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async addTaskNote(taskId, note) {
    return this.request(`/attorneys/legal-tasks/${taskId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note })
    });
  }

  async updateConsultationStatus(consultationId, status) {
    return this.request(`/attorneys/consultations/${consultationId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async updateContractReviewProgress(reviewId, progress) {
    return this.request(`/attorneys/contract-reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify({ progress })
    });
  }

  async getClientDetails(clientId) {
    return this.request(`/attorneys/clients/${clientId}`);
  }

  async addClientNote(clientId, note) {
    return this.request(`/attorneys/clients/${clientId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note })
    });
  }

  async scheduleClientMeeting(clientId, datetime, type) {
    return this.request(`/attorneys/clients/${clientId}/meetings`, {
      method: 'POST',
      body: JSON.stringify({ datetime, type })
    });
  }

  async getCalendarEvents(startDate, endDate) {
    return this.request(`/attorneys/calendar?start=${startDate}&end=${endDate}`);
  }

  async createCalendarEvent(eventData) {
    return this.request('/attorneys/calendar', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  }

  async updateCalendarEvent(eventId, updates) {
    return this.request(`/attorneys/calendar/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteCalendarEvent(eventId) {
    return this.request(`/attorneys/calendar/${eventId}`, {
      method: 'DELETE'
    });
  }
}

export class PricingService extends ApiService {
  async getPricingPlans() {
    return this.request('/pricing');
  }

  async calculateSavings(homePrice) {
    return this.request(`/pricing/calculate?homePrice=${homePrice}`);
  }
}

// Export singleton instances
export const authService = new AuthService();
export const propertyService = new PropertyService();
export const transactionService = new TransactionService();
export const contractService = new ContractService();
export const documentService = new DocumentService();
export const messageService = new MessageService();
export const attorneyService = new AttorneyService();
export const pricingService = new PricingService();

export default ApiService;

