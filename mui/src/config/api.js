// Shared API Configuration for Agent Free Frontend
// This file contains all API-related configuration and constants

// API Base URL Configuration
const getApiBaseUrl = () => {
  // Check for environment-specific API URLs
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Default to localhost for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/api';
  }
  
  // Production API URL (update this when deploying)
  return 'http://localhost:3001/api';
};

// API Configuration Object
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/users/profile',
  },

  // Users
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },

  // Attorneys
  ATTORNEYS: {
    BASE: '/attorneys',
    BY_ID: (id) => `/attorneys/${id}`,
    DASHBOARD: (id) => `/attorneys/${id}/dashboard`,
    CLIENTS: (id) => `/attorneys/${id}/clients`,
    CALENDAR: (id) => `/attorneys/${id}/calendar`,
  },

  // Clients
  CLIENTS: {
    BASE: '/clients',
    BY_ID: (id) => `/clients/${id}`,
    TRANSACTIONS: (id) => `/clients/${id}/transactions`,
    DOCUMENTS: (id) => `/clients/${id}/documents`,
  },

  // Properties
  PROPERTIES: {
    BASE: '/properties',
    BY_ID: (id) => `/properties/${id}`,
    SEARCH: '/properties/search',
    FAVORITES: '/properties/favorites',
  },

  // Transactions
  TRANSACTIONS: {
    BASE: '/transactions',
    BY_ID: (id) => `/transactions/${id}`,
    UPDATE_STATUS: (id) => `/transactions/${id}/status`,
    DOCUMENTS: (id) => `/transactions/${id}/documents`,
  },

  // Documents
  DOCUMENTS: {
    BASE: '/documents',
    BY_ID: (id) => `/documents/${id}`,
    UPLOAD: '/documents/upload',
    DOWNLOAD: (id) => `/documents/${id}/download`,
    SIGN: (id) => `/documents/${id}/sign`,
  },

  // Calendar
  CALENDAR: {
    EVENTS: '/calendar/events',
    EVENT_BY_ID: (id) => `/calendar/events/${id}`,
    CREATE_EVENT: '/calendar/events',
    UPDATE_EVENT: (id) => `/calendar/events/${id}`,
    DELETE_EVENT: (id) => `/calendar/events/${id}`,
  },

  // Messages
  MESSAGES: {
    BASE: '/messages',
    BY_ID: (id) => `/messages/${id}`,
    CONVERSATIONS: '/messages/conversations',
    SEND: '/messages/send',
    MARK_READ: (id) => `/messages/${id}/read`,
  },

  // Contract Templates
  CONTRACT_TEMPLATES: {
    BASE: '/contract-templates',
    BY_ID: (id) => `/contract-templates/${id}`,
    BY_CATEGORY: (category) => `/contract-templates?category=${category}`,
    GENERATE: '/contracts/generate',
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ACTIVITY: '/dashboard/recent-activity',
    NOTIFICATIONS: '/dashboard/notifications',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// Request Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Authentication Token Management
export const TOKEN_STORAGE = {
  KEY: 'agent_free_auth_token',
  
  get: () => {
    try {
      return localStorage.getItem(TOKEN_STORAGE.KEY);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },
  
  set: (token) => {
    try {
      localStorage.setItem(TOKEN_STORAGE.KEY, token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  },
  
  remove: () => {
    try {
      localStorage.removeItem(TOKEN_STORAGE.KEY);
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  },
};

// API Error Types
export const API_ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// Request Configuration Presets
export const REQUEST_CONFIGS = {
  // Standard GET request
  GET: {
    method: 'GET',
    headers: DEFAULT_HEADERS,
  },
  
  // Standard POST request
  POST: {
    method: 'POST',
    headers: DEFAULT_HEADERS,
  },
  
  // Standard PUT request
  PUT: {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
  },
  
  // Standard DELETE request
  DELETE: {
    method: 'DELETE',
    headers: DEFAULT_HEADERS,
  },
  
  // File upload request
  UPLOAD: {
    method: 'POST',
    // Don't set Content-Type for file uploads (let browser set it)
    headers: {
      'Accept': 'application/json',
    },
  },
};

// Utility function to build full API URL
export const buildApiUrl = (endpoint) => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Utility function to get authenticated headers
export const getAuthHeaders = () => {
  const token = TOKEN_STORAGE.get();
  const headers = { ...DEFAULT_HEADERS };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (!error.response) {
    return {
      type: API_ERROR_TYPES.NETWORK_ERROR,
      message: 'Network error. Please check your internet connection.',
      originalError: error,
    };
  }
  
  const { status, data } = error.response;
  
  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
      TOKEN_STORAGE.remove(); // Clear invalid token
      return {
        type: API_ERROR_TYPES.AUTH_ERROR,
        message: 'Authentication required. Please log in again.',
        status,
        data,
      };
      
    case HTTP_STATUS.FORBIDDEN:
      return {
        type: API_ERROR_TYPES.AUTH_ERROR,
        message: 'Access denied. You do not have permission to perform this action.',
        status,
        data,
      };
      
    case HTTP_STATUS.BAD_REQUEST:
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return {
        type: API_ERROR_TYPES.VALIDATION_ERROR,
        message: data?.error || 'Invalid request data.',
        status,
        data,
      };
      
    case HTTP_STATUS.NOT_FOUND:
      return {
        type: API_ERROR_TYPES.VALIDATION_ERROR,
        message: 'The requested resource was not found.',
        status,
        data,
      };
      
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
    case HTTP_STATUS.BAD_GATEWAY:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return {
        type: API_ERROR_TYPES.SERVER_ERROR,
        message: 'Server error. Please try again later.',
        status,
        data,
      };
      
    default:
      return {
        type: API_ERROR_TYPES.UNKNOWN_ERROR,
        message: data?.error || 'An unexpected error occurred.',
        status,
        data,
      };
  }
};

// Export default configuration
export default API_CONFIG;

