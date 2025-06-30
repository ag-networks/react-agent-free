// Import shared API configuration
import { 
  API_CONFIG, 
  API_ENDPOINTS, 
  buildApiUrl, 
  getAuthHeaders, 
  handleApiError,
  TOKEN_STORAGE,
  HTTP_STATUS 
} from '../mui/src/config/api.js';

// Base API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  async request(endpoint, options = {}) {
    try {
      const url = buildApiUrl(endpoint);
      const config = {
        method: options.method || 'GET',
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      };

      // Add body for POST/PUT requests
      if (config.method !== 'GET' && config.method !== 'DELETE' && options.body) {
        if (options.body instanceof FormData) {
          // For file uploads, don't set Content-Type (let browser set it)
          delete config.headers['Content-Type'];
          config.body = options.body;
        } else {
          config.body = JSON.stringify(options.body);
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          response: {
            status: response.status,
            data: errorData,
          },
        };
      }

      // Handle empty responses
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        return null;
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw {
          type: 'TIMEOUT_ERROR',
          message: 'Request timeout',
        };
      }
      
      throw handleApiError(error);
    }
  }

  // Convenience methods for different HTTP verbs
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async upload(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for file uploads
      },
    });
  }
}

// Authentication Service
export class AuthService extends ApiService {
  async login(email, password) {
    try {
      const response = await this.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      if (response.token) {
        TOKEN_STORAGE.set(response.token);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.post(API_ENDPOINTS.AUTH.REGISTER, userData);

      if (response.token) {
        TOKEN_STORAGE.set(response.token);
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      TOKEN_STORAGE.remove();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getProfile() {
    try {
      return await this.get(API_ENDPOINTS.AUTH.PROFILE);
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  isAuthenticated() {
    return !!TOKEN_STORAGE.get();
  }
}

// Property Service
export class PropertyService extends ApiService {
  async getProperties(filters = {}) {
    try {
      return await this.get(API_ENDPOINTS.PROPERTIES.BASE, filters);
    } catch (error) {
      console.error('Properties fetch error:', error);
      throw error;
    }
  }

  async getProperty(id) {
    try {
      return await this.get(API_ENDPOINTS.PROPERTIES.BY_ID(id));
    } catch (error) {
      console.error('Property fetch error:', error);
      throw error;
    }
  }

  async searchProperties(searchParams) {
    try {
      return await this.get(API_ENDPOINTS.PROPERTIES.SEARCH, searchParams);
    } catch (error) {
      console.error('Property search error:', error);
      throw error;
    }
  }

  async createProperty(propertyData) {
    try {
      return await this.post(API_ENDPOINTS.PROPERTIES.BASE, propertyData);
    } catch (error) {
      console.error('Property creation error:', error);
      throw error;
    }
  }
}

// Transaction Service
export class TransactionService extends ApiService {
  async getTransactions(filters = {}) {
    try {
      return await this.get(API_ENDPOINTS.TRANSACTIONS.BASE, filters);
    } catch (error) {
      console.error('Transactions fetch error:', error);
      throw error;
    }
  }

  async getTransaction(id) {
    try {
      return await this.get(API_ENDPOINTS.TRANSACTIONS.BY_ID(id));
    } catch (error) {
      console.error('Transaction fetch error:', error);
      throw error;
    }
  }

  async createTransaction(transactionData) {
    try {
      return await this.post(API_ENDPOINTS.TRANSACTIONS.BASE, transactionData);
    } catch (error) {
      console.error('Transaction creation error:', error);
      throw error;
    }
  }

  async updateTransactionStatus(id, status) {
    try {
      return await this.put(API_ENDPOINTS.TRANSACTIONS.UPDATE_STATUS(id), { status });
    } catch (error) {
      console.error('Transaction status update error:', error);
      throw error;
    }
  }
}

// Document Service
export class DocumentService extends ApiService {
  async getDocuments(filters = {}) {
    try {
      return await this.get(API_ENDPOINTS.DOCUMENTS.BASE, filters);
    } catch (error) {
      console.error('Documents fetch error:', error);
      throw error;
    }
  }

  async getDocument(id) {
    try {
      return await this.get(API_ENDPOINTS.DOCUMENTS.BY_ID(id));
    } catch (error) {
      console.error('Document fetch error:', error);
      throw error;
    }
  }

  async uploadDocument(formData) {
    try {
      return await this.upload(API_ENDPOINTS.DOCUMENTS.UPLOAD, formData);
    } catch (error) {
      console.error('Document upload error:', error);
      throw error;
    }
  }

  async downloadDocument(id) {
    try {
      const url = buildApiUrl(API_ENDPOINTS.DOCUMENTS.DOWNLOAD(id));
      const headers = getAuthHeaders();
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      return response.blob();
    } catch (error) {
      console.error('Document download error:', error);
      throw error;
    }
  }
}

// Client Service
export class ClientService extends ApiService {
  async getClients(filters = {}) {
    try {
      return await this.get(API_ENDPOINTS.CLIENTS.BASE, filters);
    } catch (error) {
      console.error('Clients fetch error:', error);
      throw error;
    }
  }

  async getClient(id) {
    try {
      return await this.get(API_ENDPOINTS.CLIENTS.BY_ID(id));
    } catch (error) {
      console.error('Client fetch error:', error);
      throw error;
    }
  }

  async createClient(clientData) {
    try {
      return await this.post(API_ENDPOINTS.CLIENTS.BASE, clientData);
    } catch (error) {
      console.error('Client creation error:', error);
      throw error;
    }
  }
}

// Attorney Service
export class AttorneyService extends ApiService {
  async getAttorneys() {
    try {
      return await this.get(API_ENDPOINTS.ATTORNEYS.BASE);
    } catch (error) {
      console.error('Attorneys fetch error:', error);
      throw error;
    }
  }

  async getAttorney(id) {
    try {
      return await this.get(API_ENDPOINTS.ATTORNEYS.BY_ID(id));
    } catch (error) {
      console.error('Attorney fetch error:', error);
      throw error;
    }
  }

  async getAttorneyDashboard(id) {
    try {
      return await this.get(API_ENDPOINTS.ATTORNEYS.DASHBOARD(id));
    } catch (error) {
      console.error('Attorney dashboard fetch error:', error);
      throw error;
    }
  }

  async getAttorneyClients(id, filters = {}) {
    try {
      return await this.get(API_ENDPOINTS.CLIENTS.BASE, { attorney_id: id, ...filters });
    } catch (error) {
      console.error('Attorney clients fetch error:', error);
      throw error;
    }
  }

  async getAttorneyCalendar(id, filters = {}) {
    try {
      return await this.get(API_ENDPOINTS.CALENDAR.EVENTS, { attorney_id: id, ...filters });
    } catch (error) {
      console.error('Attorney calendar fetch error:', error);
      throw error;
    }
  }
}

// Calendar Service
export class CalendarService extends ApiService {
  async getEvents(filters = {}) {
    try {
      return await this.get(API_ENDPOINTS.CALENDAR.EVENTS, filters);
    } catch (error) {
      console.error('Calendar events fetch error:', error);
      throw error;
    }
  }

  async createEvent(eventData) {
    try {
      return await this.post(API_ENDPOINTS.CALENDAR.CREATE_EVENT, eventData);
    } catch (error) {
      console.error('Event creation error:', error);
      throw error;
    }
  }

  async updateEvent(id, eventData) {
    try {
      return await this.put(API_ENDPOINTS.CALENDAR.UPDATE_EVENT(id), eventData);
    } catch (error) {
      console.error('Event update error:', error);
      throw error;
    }
  }

  async deleteEvent(id) {
    try {
      return await this.delete(API_ENDPOINTS.CALENDAR.DELETE_EVENT(id));
    } catch (error) {
      console.error('Event deletion error:', error);
      throw error;
    }
  }
}

// Message Service
export class MessageService extends ApiService {
  async getMessages(filters = {}) {
    try {
      return await this.get(API_ENDPOINTS.MESSAGES.BASE, filters);
    } catch (error) {
      console.error('Messages fetch error:', error);
      throw error;
    }
  }

  async sendMessage(messageData) {
    try {
      return await this.post(API_ENDPOINTS.MESSAGES.SEND, messageData);
    } catch (error) {
      console.error('Message send error:', error);
      throw error;
    }
  }

  async markAsRead(id) {
    try {
      return await this.put(API_ENDPOINTS.MESSAGES.MARK_READ(id));
    } catch (error) {
      console.error('Mark message as read error:', error);
      throw error;
    }
  }

  async getConversations() {
    try {
      return await this.get(API_ENDPOINTS.MESSAGES.CONVERSATIONS);
    } catch (error) {
      console.error('Conversations fetch error:', error);
      throw error;
    }
  }
}

// Contract Service
export class ContractService extends ApiService {
  async getContractTemplates(filters = {}) {
    try {
      return await this.get(API_ENDPOINTS.CONTRACT_TEMPLATES.BASE, filters);
    } catch (error) {
      console.error('Contract templates fetch error:', error);
      throw error;
    }
  }

  async getContractTemplate(id) {
    try {
      return await this.get(API_ENDPOINTS.CONTRACT_TEMPLATES.BY_ID(id));
    } catch (error) {
      console.error('Contract template fetch error:', error);
      throw error;
    }
  }

  async generateContract(templateId, contractData) {
    try {
      return await this.post(API_ENDPOINTS.CONTRACT_TEMPLATES.GENERATE, {
        template_id: templateId,
        contract_data: contractData,
      });
    } catch (error) {
      console.error('Contract generation error:', error);
      throw error;
    }
  }

  async createTemplate(templateData) {
    try {
      return await this.post(API_ENDPOINTS.CONTRACT_TEMPLATES.BASE, templateData);
    } catch (error) {
      console.error('Contract template creation error:', error);
      throw error;
    }
  }
}

// Dashboard Service
export class DashboardService extends ApiService {
  async getStats() {
    try {
      return await this.get(API_ENDPOINTS.DASHBOARD.STATS);
    } catch (error) {
      console.error('Dashboard stats fetch error:', error);
      throw error;
    }
  }

  async getRecentActivity() {
    try {
      return await this.get(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITY);
    } catch (error) {
      console.error('Recent activity fetch error:', error);
      throw error;
    }
  }

  async getNotifications() {
    try {
      return await this.get(API_ENDPOINTS.DASHBOARD.NOTIFICATIONS);
    } catch (error) {
      console.error('Notifications fetch error:', error);
      throw error;
    }
  }
}

// Create service instances
export const authService = new AuthService();
export const propertyService = new PropertyService();
export const transactionService = new TransactionService();
export const documentService = new DocumentService();
export const clientService = new ClientService();
export const attorneyService = new AttorneyService();
export const calendarService = new CalendarService();
export const messageService = new MessageService();
export const contractService = new ContractService();
export const dashboardService = new DashboardService();

// Export API configuration for direct use
export { API_CONFIG, API_ENDPOINTS, buildApiUrl, getAuthHeaders, TOKEN_STORAGE };

// Default export
export default {
  auth: authService,
  property: propertyService,
  transaction: transactionService,
  document: documentService,
  client: clientService,
  attorney: attorneyService,
  calendar: calendarService,
  message: messageService,
  contract: contractService,
  dashboard: dashboardService,
};

