// Central Authentication Manager
// Handles all token storage, retrieval, and migration consistently across the app

class AuthManager {
  constructor() {
    // Standard token key - we'll use 'authToken' as the single source of truth
    this.TOKEN_KEY = 'authToken';
    this.USER_ROLE_KEY = 'userRole';
    this.USER_ID_KEY = 'userId';
    this.USER_PROFILE_KEY = 'userProfile';
    
    // Legacy keys that might exist from older versions
    this.LEGACY_KEYS = ['token', 'access_token', 'accessToken', 'jwt_token'];
    
    // Initialize - migrate any legacy tokens on first load
    this.migrateLegacyTokens();
  }

  /**
   * Migrate legacy token keys to standard format
   */
  migrateLegacyTokens() {
    console.log('🔄 AuthManager: Checking for legacy tokens...');
    
    // Check if we already have the standard token
    const currentToken = localStorage.getItem(this.TOKEN_KEY);
    if (currentToken) {
      console.log('✅ Standard authToken already exists, cleaning up legacy tokens');
      this.clearLegacyTokens();
      return;
    }

    // Look for legacy tokens and migrate the first one found
    for (const legacyKey of this.LEGACY_KEYS) {
      const legacyToken = localStorage.getItem(legacyKey);
      if (legacyToken) {
        console.log(`🔄 Migrating token from '${legacyKey}' to '${this.TOKEN_KEY}'`);
        localStorage.setItem(this.TOKEN_KEY, legacyToken);
        localStorage.removeItem(legacyKey);
        console.log('✅ Token migration completed');
        break;
      }
    }

    // Clean up any remaining legacy tokens
    this.clearLegacyTokens();
  }

  /**
   * Clear all legacy token keys
   */
  clearLegacyTokens() {
    this.LEGACY_KEYS.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🧹 Removing legacy token key: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Get authentication token
   * @returns {string|null} The auth token or null if not found
   */
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Set authentication token
   * @param {string} token - The JWT token to store
   */
  setToken(token) {
    if (!token) {
      console.error('❌ AuthManager: Cannot set empty token');
      return false;
    }
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log('✅ AuthManager: Token stored successfully');
    return true;
  }

  /**
   * Remove authentication token and all user data
   */
  clearAuth() {
    console.log('🔄 AuthManager: Clearing all authentication data');
    
    // Remove standard keys
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_ROLE_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.USER_PROFILE_KEY);
    
    // Remove any legacy keys that might still exist
    this.clearLegacyTokens();
    
    console.log('✅ AuthManager: Authentication data cleared');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has valid token
   */
  isAuthenticated() {
    const token = this.getToken();
    const userId = this.getUserId();
    const userRole = this.getUserRole();
    
    const isAuth = !!(token && userId && userRole);
    console.log('🔍 AuthManager: Authentication check:', {
      hasToken: !!token,
      hasUserId: !!userId,
      hasUserRole: !!userRole,
      isAuthenticated: isAuth
    });
    
    return isAuth;
  }

  /**
   * Get user role
   * @returns {string|null} User role or null
   */
  getUserRole() {
    return localStorage.getItem(this.USER_ROLE_KEY);
  }

  /**
   * Set user role
   * @param {string} role - User role (student, faculty, admin)
   */
  setUserRole(role) {
    localStorage.setItem(this.USER_ROLE_KEY, role);
  }

  /**
   * Get user ID
   * @returns {string|null} User ID or null
   */
  getUserId() {
    return localStorage.getItem(this.USER_ID_KEY);
  }

  /**
   * Set user ID
   * @param {string} userId - User ID
   */
  setUserId(userId) {
    localStorage.setItem(this.USER_ID_KEY, userId);
  }

  /**
   * Get user profile
   * @returns {object|null} User profile object or null
   */
  getUserProfile() {
    const profileStr = localStorage.getItem(this.USER_PROFILE_KEY);
    try {
      return profileStr ? JSON.parse(profileStr) : null;
    } catch (error) {
      console.error('❌ AuthManager: Failed to parse user profile', error);
      return null;
    }
  }

  /**
   * Set user profile
   * @param {object} profile - User profile object
   */
  setUserProfile(profile) {
    if (typeof profile !== 'object' || profile === null) {
      console.error('❌ AuthManager: Invalid profile data');
      return false;
    }
    localStorage.setItem(this.USER_PROFILE_KEY, JSON.stringify(profile));
    return true;
  }

  /**
   * Get complete current user info
   * @returns {object} Complete user information
   */
  getCurrentUser() {
    return {
      token: this.getToken(),
      role: this.getUserRole(),
      userId: this.getUserId(),
      profile: this.getUserProfile(),
      isAuthenticated: this.isAuthenticated()
    };
  }

  /**
   * Set complete authentication data
   * @param {object} authData - Complete auth data object
   */
  setAuthData({ token, role, userId, user }) {
    console.log('🔄 AuthManager: Setting complete auth data');
    
    if (token) this.setToken(token);
    if (role) this.setUserRole(role);
    if (userId) this.setUserId(userId);
    if (user) this.setUserProfile(user);
    
    console.log('✅ AuthManager: Auth data set successfully');
  }

  /**
   * Get authorization header for API requests
   * @returns {object|null} Authorization header object or null
   */
  getAuthHeader() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : null;
  }

  /**
   * Debug authentication state
   * @returns {object} Debug information
   */
  debug() {
    const debugInfo = {
      hasToken: !!this.getToken(),
      tokenPreview: this.getToken() ? this.getToken().substring(0, 20) + '...' : null,
      userRole: this.getUserRole(),
      userId: this.getUserId(),
      hasProfile: !!this.getUserProfile(),
      isAuthenticated: this.isAuthenticated(),
      localStorageKeys: Object.keys(localStorage),
      legacyTokensFound: this.LEGACY_KEYS.filter(key => localStorage.getItem(key))
    };

    console.log('🔍 AuthManager Debug:', debugInfo);
    return debugInfo;
  }

  /**
   * Validate token format (basic validation)
   * @param {string} token - Token to validate
   * @returns {boolean} True if token appears valid
   */
  isValidTokenFormat(token) {
    if (!token || typeof token !== 'string') return false;
    
    // Basic JWT format check (3 parts separated by dots)
    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Check if token is expired (basic check without decoding)
   * Note: This is a simple check - for production, you'd want to decode the JWT
   * @returns {boolean} True if token appears expired based on storage time
   */
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    // For now, we'll assume tokens are valid for 7 days (matching backend)
    // In production, you'd decode the JWT and check the 'exp' claim
    const tokenStorageTime = localStorage.getItem(`${this.TOKEN_KEY}_timestamp`);
    if (!tokenStorageTime) return false; // Can't determine, assume valid
    
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return (Date.now() - parseInt(tokenStorageTime)) > sevenDaysInMs;
  }

  /**
   * Store token with timestamp for expiry checking
   * @param {string} token - Token to store
   */
  setTokenWithTimestamp(token) {
    this.setToken(token);
    localStorage.setItem(`${this.TOKEN_KEY}_timestamp`, Date.now().toString());
  }

  /**
   * Handle authentication errors (401, 403, etc.)
   * @param {Error} error - API error
   */
  handleAuthError(error) {
    if (error.response?.status === 401) {
      console.warn('⚠️ AuthManager: 401 Unauthorized - clearing auth data');
      this.clearAuth();
      // Optionally redirect to login
      if (typeof window !== 'undefined' && window.location) {
        console.log('🔄 Redirecting to login page');
        window.location.href = '/';
      }
    } else if (error.response?.status === 403) {
      console.warn('⚠️ AuthManager: 403 Forbidden - insufficient permissions');
    }
  }
}

// Create singleton instance
const authManager = new AuthManager();

// Export singleton instance and class for flexibility
export default authManager;
export { AuthManager };

// Auto-run migration on module load
console.log('🚀 AuthManager initialized and ready');