// Mock Authentication Service
// This simulates a real authentication API for development and testing

const MOCK_USER = {
  id: '1',
  username: 'manusrocks',
  password: 'thankyoumanus',
  email: 'demo@agentfree.com',
  firstName: 'Demo',
  lastName: 'User',
  role: 'customer',
  avatar: null,
  createdAt: new Date().toISOString(),
};

const MOCK_ATTORNEY = {
  id: '2',
  username: 'attorney',
  password: 'thankyoumanus',
  email: 'attorney@agentfree.com',
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: 'attorney',
  avatar: null,
  licenseNumber: 'CA-12345',
  createdAt: new Date().toISOString(),
};

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MockAuthService {
  constructor() {
    this.users = [MOCK_USER, MOCK_ATTORNEY];
    this.currentUser = null;
    this.token = null;
  }

  async login(username, password) {
    await delay(800); // Simulate network request

    const user = this.users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Generate mock JWT token
    this.token = `mock-jwt-token-${user.id}-${Date.now()}`;
    this.currentUser = { ...user };
    delete this.currentUser.password;

    // Store in localStorage for persistence
    localStorage.setItem('auth_token', this.token);
    localStorage.setItem('current_user', JSON.stringify(this.currentUser));

    return {
      user: this.currentUser,
      token: this.token,
    };
  }

  async signup(userData) {
    await delay(1000); // Simulate network request

    // Check if username already exists
    const existingUser = this.users.find(u => u.username === userData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Create new user
    const newUser = {
      id: String(this.users.length + 1),
      ...userData,
      role: 'customer',
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    
    // Auto-login after signup
    return this.login(userData.username, userData.password);
  }

  async logout() {
    await delay(300);
    
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }

  async getCurrentUser() {
    await delay(200);

    // Check localStorage first
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('current_user');

    if (token && userData) {
      this.token = token;
      this.currentUser = JSON.parse(userData);
      return this.currentUser;
    }

    return null;
  }

  async refreshToken() {
    await delay(500);
    
    if (!this.token) {
      throw new Error('No token to refresh');
    }

    // Generate new token
    this.token = `mock-jwt-token-${this.currentUser.id}-${Date.now()}`;
    localStorage.setItem('auth_token', this.token);
    
    return this.token;
  }

  async resetPassword(email) {
    await delay(1000);
    
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('Email not found');
    }

    // In a real app, this would send an email
    console.log(`Password reset email sent to ${email}`);
    return { message: 'Password reset email sent' };
  }

  isAuthenticated() {
    return !!this.token && !!this.currentUser;
  }

  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  getUser() {
    if (this.currentUser) return this.currentUser;
    
    const userData = localStorage.getItem('current_user');
    return userData ? JSON.parse(userData) : null;
  }
}

// Export singleton instance
export const authService = new MockAuthService();

// Auth context helpers
export const AUTH_EVENTS = {
  LOGIN: 'auth:login',
  LOGOUT: 'auth:logout',
  TOKEN_REFRESH: 'auth:token_refresh',
  ERROR: 'auth:error',
};

// Mock API endpoints for testing
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  RESET_PASSWORD: '/api/auth/reset-password',
  CURRENT_USER: '/api/auth/me',
};

export default authService;

