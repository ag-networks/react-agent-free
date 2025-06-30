// Agent Free Platform - API Service Classes
// Mock implementation with realistic data structure

class ApiService {
  constructor() {
    this.baseUrl = 'http://localhost:3001/api'; // Simplified for mock implementation
    this.delay = 500; // Simulate network delay
  }

  async request(endpoint, options = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    // Mock API responses based on endpoint
    return this.getMockResponse(endpoint, options);
  }

  getMockResponse(endpoint, options) {
    const { method = 'GET', body } = options;
    
    switch (true) {
      case endpoint.includes('/auth/login'):
        return this.mockLogin(JSON.parse(body || '{}'));
      case endpoint.includes('/auth/logout'):
        return this.mockLogout();
      case endpoint.includes('/properties/search'):
        return this.mockPropertySearch();
      case endpoint.includes('/properties/'):
        return this.mockPropertyDetails(endpoint);
      case endpoint.includes('/transactions'):
        return this.mockTransactions();
      case endpoint.includes('/contracts'):
        return this.mockContracts();
      case endpoint.includes('/documents'):
        return this.mockDocuments();
      case endpoint.includes('/messages'):
        return this.mockMessages();
      case endpoint.includes('/attorneys'):
        return this.mockAttorneys();
      case endpoint.includes('/pricing'):
        return this.mockPricing();
      default:
        throw new Error(`Mock endpoint not implemented: ${endpoint}`);
    }
  }

  mockLogin(credentials) {
    if (credentials.username === 'manusrocks' && credentials.password === 'thankyoumanus') {
      return {
        success: true,
        user: {
          id: 1,
          username: 'manusrocks',
          email: 'demo@agentfree.com',
          firstName: 'Demo',
          lastName: 'User',
          role: 'client',
          avatar: null,
          createdAt: '2024-01-15T10:00:00Z'
        },
        token: 'mock-jwt-token-12345'
      };
    }
    throw new Error('Invalid credentials');
  }

  mockLogout() {
    return { success: true, message: 'Logged out successfully' };
  }

  mockPropertySearch() {
    return {
      properties: [
        {
          id: 1,
          address: '123 Maple Street, Austin, TX 78701',
          price: 450000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1850,
          lotSize: 0.25,
          yearBuilt: 2018,
          propertyType: 'Single Family',
          status: 'For Sale',
          images: ['/api/images/property1-1.jpg', '/api/images/property1-2.jpg'],
          description: 'Beautiful modern home in downtown Austin with updated kitchen and hardwood floors.',
          features: ['Hardwood Floors', 'Updated Kitchen', 'Garage', 'Backyard'],
          listingAgent: 'Sarah Johnson',
          listingDate: '2024-06-15T00:00:00Z',
          daysOnMarket: 15
        },
        {
          id: 2,
          address: '456 Oak Avenue, Austin, TX 78702',
          price: 325000,
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1200,
          lotSize: 0.15,
          yearBuilt: 2015,
          propertyType: 'Townhome',
          status: 'For Sale',
          images: ['/api/images/property2-1.jpg', '/api/images/property2-2.jpg'],
          description: 'Charming townhome with modern amenities and great location.',
          features: ['Open Floor Plan', 'Patio', 'HOA Pool', 'Parking'],
          listingAgent: 'Mike Chen',
          listingDate: '2024-06-20T00:00:00Z',
          daysOnMarket: 10
        },
        {
          id: 3,
          address: '789 Pine Road, Austin, TX 78704',
          price: 675000,
          bedrooms: 4,
          bathrooms: 3,
          sqft: 2400,
          lotSize: 0.35,
          yearBuilt: 2020,
          propertyType: 'Single Family',
          status: 'For Sale',
          images: ['/api/images/property3-1.jpg', '/api/images/property3-2.jpg'],
          description: 'Luxury home with premium finishes and spacious layout.',
          features: ['Master Suite', 'Gourmet Kitchen', 'Pool', 'Three Car Garage'],
          listingAgent: 'Lisa Rodriguez',
          listingDate: '2024-06-10T00:00:00Z',
          daysOnMarket: 20
        }
      ],
      totalCount: 3,
      page: 1,
      limit: 10
    };
  }

  mockPropertyDetails(endpoint) {
    const propertyId = endpoint.split('/').pop();
    const properties = this.mockPropertySearch().properties;
    const property = properties.find(p => p.id.toString() === propertyId);
    
    if (!property) {
      throw new Error('Property not found');
    }

    return {
      ...property,
      neighborhood: 'Downtown Austin',
      schoolDistrict: 'Austin ISD',
      propertyTax: 8500,
      hoaFees: property.propertyType === 'Townhome' ? 150 : 0,
      utilities: ['Electric', 'Gas', 'Water', 'Sewer', 'Internet'],
      nearbyAmenities: ['Whole Foods', 'Austin FC Stadium', 'Zilker Park', 'Lady Bird Lake'],
      marketAnalysis: {
        pricePerSqft: Math.round(property.price / property.sqft),
        neighborhoodAverage: property.price * 0.95,
        priceHistory: [
          { date: '2024-01-01', price: property.price * 0.92 },
          { date: '2024-03-01', price: property.price * 0.96 },
          { date: '2024-06-01', price: property.price }
        ]
      }
    };
  }

  mockTransactions() {
    return {
      transactions: [
        {
          id: 1,
          propertyAddress: '123 Maple Street, Austin, TX 78701',
          status: 'Under Contract',
          purchasePrice: 450000,
          clientRole: 'buyer',
          attorney: {
            id: 1,
            name: 'Jennifer Martinez',
            email: 'j.martinez@agentfree.com',
            phone: '(512) 555-0123'
          },
          timeline: {
            contractSigned: '2024-06-25T00:00:00Z',
            inspectionDeadline: '2024-07-05T00:00:00Z',
            financingDeadline: '2024-07-15T00:00:00Z',
            closingDate: '2024-07-30T00:00:00Z'
          },
          progress: {
            contract: 'completed',
            inspection: 'in-progress',
            financing: 'pending',
            closing: 'pending'
          },
          documents: [
            { id: 1, name: 'Purchase Agreement', status: 'signed', uploadDate: '2024-06-25T00:00:00Z' },
            { id: 2, name: 'Inspection Report', status: 'pending', uploadDate: null },
            { id: 3, name: 'Loan Application', status: 'in-review', uploadDate: '2024-06-26T00:00:00Z' }
          ],
          savings: {
            traditionalCommission: 27000,
            agentFreeFee: 2500,
            totalSavings: 24500
          }
        },
        {
          id: 2,
          propertyAddress: '456 Oak Avenue, Austin, TX 78702',
          status: 'Closed',
          purchasePrice: 325000,
          clientRole: 'seller',
          attorney: {
            id: 2,
            name: 'David Kim',
            email: 'd.kim@agentfree.com',
            phone: '(512) 555-0124'
          },
          timeline: {
            contractSigned: '2024-05-15T00:00:00Z',
            inspectionDeadline: '2024-05-25T00:00:00Z',
            financingDeadline: '2024-06-05T00:00:00Z',
            closingDate: '2024-06-15T00:00:00Z'
          },
          progress: {
            contract: 'completed',
            inspection: 'completed',
            financing: 'completed',
            closing: 'completed'
          },
          documents: [
            { id: 4, name: 'Purchase Agreement', status: 'signed', uploadDate: '2024-05-15T00:00:00Z' },
            { id: 5, name: 'Inspection Report', status: 'signed', uploadDate: '2024-05-24T00:00:00Z' },
            { id: 6, name: 'Closing Documents', status: 'signed', uploadDate: '2024-06-15T00:00:00Z' }
          ],
          savings: {
            traditionalCommission: 19500,
            agentFreeFee: 2500,
            totalSavings: 17000
          }
        }
      ]
    };
  }

  mockContracts() {
    return {
      templates: [
        {
          id: 1,
          name: 'Standard Purchase Agreement',
          type: 'purchase',
          description: 'Standard residential purchase agreement for Texas',
          fields: [
            { name: 'buyerName', label: 'Buyer Name', type: 'text', required: true },
            { name: 'sellerName', label: 'Seller Name', type: 'text', required: true },
            { name: 'propertyAddress', label: 'Property Address', type: 'text', required: true },
            { name: 'purchasePrice', label: 'Purchase Price', type: 'currency', required: true },
            { name: 'earnestMoney', label: 'Earnest Money', type: 'currency', required: true },
            { name: 'closingDate', label: 'Closing Date', type: 'date', required: true },
            { name: 'inspectionPeriod', label: 'Inspection Period (days)', type: 'number', required: true },
            { name: 'financingDeadline', label: 'Financing Deadline', type: 'date', required: true }
          ]
        },
        {
          id: 2,
          name: 'Lease Agreement',
          type: 'lease',
          description: 'Residential lease agreement template',
          fields: [
            { name: 'landlordName', label: 'Landlord Name', type: 'text', required: true },
            { name: 'tenantName', label: 'Tenant Name', type: 'text', required: true },
            { name: 'propertyAddress', label: 'Property Address', type: 'text', required: true },
            { name: 'monthlyRent', label: 'Monthly Rent', type: 'currency', required: true },
            { name: 'securityDeposit', label: 'Security Deposit', type: 'currency', required: true },
            { name: 'leaseStart', label: 'Lease Start Date', type: 'date', required: true },
            { name: 'leaseEnd', label: 'Lease End Date', type: 'date', required: true }
          ]
        }
      ]
    };
  }

  mockDocuments() {
    return {
      documents: [
        {
          id: 1,
          name: 'Purchase Agreement - 123 Maple Street',
          type: 'contract',
          status: 'signed',
          uploadDate: '2024-06-25T10:30:00Z',
          size: '2.4 MB',
          url: '/api/documents/1/download',
          transactionId: 1,
          uploadedBy: 'Demo User',
          signatures: [
            { party: 'buyer', signed: true, signedDate: '2024-06-25T10:30:00Z' },
            { party: 'seller', signed: true, signedDate: '2024-06-25T11:15:00Z' }
          ]
        },
        {
          id: 2,
          name: 'Inspection Report - 123 Maple Street',
          type: 'inspection',
          status: 'pending',
          uploadDate: null,
          size: null,
          url: null,
          transactionId: 1,
          uploadedBy: null,
          signatures: []
        },
        {
          id: 3,
          name: 'Loan Pre-approval Letter',
          type: 'financing',
          status: 'in-review',
          uploadDate: '2024-06-26T14:20:00Z',
          size: '1.1 MB',
          url: '/api/documents/3/download',
          transactionId: 1,
          uploadedBy: 'Demo User',
          signatures: []
        }
      ]
    };
  }

  mockMessages() {
    return {
      conversations: [
        {
          id: 1,
          participants: [
            { id: 1, name: 'Demo User', role: 'client' },
            { id: 2, name: 'Jennifer Martinez', role: 'attorney' }
          ],
          transactionId: 1,
          lastMessage: {
            id: 5,
            content: 'The inspection is scheduled for tomorrow at 2 PM. I\'ll send you the report as soon as it\'s complete.',
            senderId: 2,
            timestamp: '2024-06-30T16:45:00Z'
          },
          unreadCount: 1
        }
      ],
      messages: [
        {
          id: 1,
          conversationId: 1,
          senderId: 2,
          content: 'Welcome to Agent Free! I\'m Jennifer, your assigned attorney for the 123 Maple Street transaction.',
          timestamp: '2024-06-25T11:00:00Z',
          type: 'text'
        },
        {
          id: 2,
          conversationId: 1,
          senderId: 1,
          content: 'Thank you! I\'m excited to work with you. When can we schedule the inspection?',
          timestamp: '2024-06-25T11:30:00Z',
          type: 'text'
        },
        {
          id: 3,
          conversationId: 1,
          senderId: 2,
          content: 'I\'ve contacted the seller\'s agent. We have a few options available this week.',
          timestamp: '2024-06-26T09:15:00Z',
          type: 'text'
        },
        {
          id: 4,
          conversationId: 1,
          senderId: 1,
          content: 'Perfect! What about Thursday afternoon?',
          timestamp: '2024-06-26T09:45:00Z',
          type: 'text'
        },
        {
          id: 5,
          conversationId: 1,
          senderId: 2,
          content: 'The inspection is scheduled for tomorrow at 2 PM. I\'ll send you the report as soon as it\'s complete.',
          timestamp: '2024-06-30T16:45:00Z',
          type: 'text'
        }
      ]
    };
  }

  mockAttorneys() {
    return {
      attorneys: [
        {
          id: 1,
          name: 'Jennifer Martinez',
          email: 'j.martinez@agentfree.com',
          phone: '(512) 555-0123',
          specialties: ['Residential Real Estate', 'Contract Law'],
          experience: '8 years',
          rating: 4.9,
          avatar: '/api/avatars/jennifer.jpg',
          bio: 'Jennifer specializes in residential real estate transactions and has helped over 500 families buy and sell homes.',
          activeTransactions: 12,
          completedTransactions: 487
        },
        {
          id: 2,
          name: 'David Kim',
          email: 'd.kim@agentfree.com',
          phone: '(512) 555-0124',
          specialties: ['Commercial Real Estate', 'Investment Properties'],
          experience: '12 years',
          rating: 4.8,
          avatar: '/api/avatars/david.jpg',
          bio: 'David focuses on commercial and investment properties, bringing extensive experience in complex transactions.',
          activeTransactions: 8,
          completedTransactions: 623
        }
      ]
    };
  }

  mockPricing() {
    return {
      plans: [
        {
          id: 'basic',
          name: 'Basic Service',
          price: 2500,
          description: 'Essential legal support for your real estate transaction',
          features: [
            'Licensed attorney review',
            'Contract generation and review',
            'Document management',
            'Email support',
            'Basic transaction tracking'
          ],
          popular: false
        },
        {
          id: 'premium',
          name: 'Premium Service',
          price: 3500,
          description: 'Comprehensive support with priority service',
          features: [
            'Everything in Basic',
            'Priority attorney support',
            'Phone consultations',
            'Advanced document templates',
            'Real-time messaging',
            'Closing coordination'
          ],
          popular: true
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 5000,
          description: 'Full-service support for complex transactions',
          features: [
            'Everything in Premium',
            'Dedicated attorney',
            '24/7 support',
            'Custom contract templates',
            'Investment property expertise',
            'Multi-property discounts'
          ],
          popular: false
        }
      ],
      comparison: {
        traditionalAgent: {
          commission: 0.06,
          averageHomePriceExample: 400000,
          averageCost: 24000
        },
        agentFree: {
          flatFee: 2500,
          savings: 21500,
          savingsPercentage: 89.6
        }
      }
    };
  }
}

// Specific service classes
export class AuthService extends ApiService {
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
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

