# AuthManager Implementation Guide

## Overview

The **AuthManager** is a centralized authentication management system that solves token storage inconsistencies in the College ERP frontend. It standardizes all authentication operations and automatically migrates legacy token storage formats.

## Problem Solved

Previously, the application used different token keys inconsistently:
- `authToken` (intended standard)
- `token` (legacy)
- `access_token` (legacy)
- `accessToken` (variant)

This caused 401 Unauthorized errors when components looked for tokens under different keys.

## Solution Architecture

### 1. **Centralized AuthManager (`src/utils/authManager.js`)**

A singleton class that:
- ✅ Uses single token key: `authToken`
- 🔄 Automatically migrates legacy tokens on app startup
- 🧹 Cleans up old token keys
- 🛡️ Provides comprehensive authentication methods
- 🔍 Includes debugging utilities
- ⚡ Handles authentication errors consistently

### 2. **Key Features**

#### **Automatic Migration**
```javascript
// On app startup, migrates any legacy tokens:
// localStorage.getItem('token') → localStorage.setItem('authToken', token)
// Then removes: 'token', 'access_token', 'accessToken', 'jwt_token'
```

#### **Unified API**
```javascript
import authManager from '../utils/authManager';

// Set complete auth data
authManager.setAuthData({
  token: 'jwt-token-here',
  role: 'student',
  userId: 'student-123',
  user: { name: 'John Doe', email: 'john@example.com' }
});

// Check authentication
const isAuth = authManager.isAuthenticated();

// Get current user info
const currentUser = authManager.getCurrentUser();

// Get auth headers for API calls
const headers = authManager.getAuthHeader();

// Debug authentication state
authManager.debug();

// Clear all auth data
authManager.clearAuth();
```

## Components Updated

### 1. **ERPChatbot** (`src/components/ERPChatbot.jsx`)
- ✅ Replaced direct localStorage access with AuthManager
- ✅ Uses `authManager.getToken()` instead of checking multiple keys
- ✅ Better error handling for authentication failures

### 2. **API Client** (`src/services/api.js`)
- ✅ All auth methods now delegate to AuthManager
- ✅ Consistent authentication error handling
- ✅ Login process uses `authManager.setAuthData()`

### 3. **AuthContext** (`src/AuthContext.jsx`)
- ✅ Integrated with AuthManager for state management
- ✅ Automatic session restoration on app startup
- ✅ Enhanced with loading state and auth checking

### 4. **Login Component** (`src/components/Login.jsx`)
- ✅ Already compatible (uses authAPI which now uses AuthManager)

## Testing

### AuthManager Test Suite (`src/components/AuthManagerTest.jsx`)

Comprehensive test component that verifies:
- ✅ Token migration from legacy keys
- ✅ Authentication state management
- ✅ Data persistence and retrieval
- ✅ Cleanup functionality
- ✅ Debug utilities

**Usage:**
1. Import and use the `AuthManagerTest` component in your app
2. Run migration tests to verify functionality
3. Simulate legacy users to test migration
4. Check current authentication state

## Migration Strategy

### Automatic Migration (Zero Downtime)
1. **On App Load**: AuthManager automatically detects legacy tokens
2. **Migration**: Moves first found legacy token to `authToken` key
3. **Cleanup**: Removes all legacy token keys
4. **Logging**: Provides clear console feedback about migration

### Manual Testing Steps
1. **Clear Storage**: `localStorage.clear()`
2. **Set Legacy Token**: `localStorage.setItem('token', 'test-token')`
3. **Refresh Page**: AuthManager migrates automatically
4. **Verify**: Check that token is now under `authToken` key

## Authentication Flow

```mermaid
graph TD
    A[App Startup] --> B[AuthManager Initializes]
    B --> C{Legacy Tokens Found?}
    C -->|Yes| D[Migrate to authToken]
    C -->|No| E[Use Existing authToken]
    D --> F[Clean Legacy Keys]
    F --> G[Authentication Ready]
    E --> G
    
    H[User Login] --> I[authAPI.login()]
    I --> J[authManager.setAuthData()]
    J --> K[Store Standard Format]
    
    L[API Calls] --> M[authManager.getToken()]
    M --> N[Consistent Token Access]
    
    O[Logout] --> P[authManager.clearAuth()]
    P --> Q[Remove All Auth Data]
```

## Error Handling

### 401 Unauthorized
```javascript
// AuthManager automatically handles 401 errors
authManager.handleAuthError(error);
// - Clears all auth data
// - Optionally redirects to login
```

### Token Validation
```javascript
// Basic JWT format validation
const isValid = authManager.isValidTokenFormat(token);
// Checks for 3-part JWT structure (header.payload.signature)
```

## Debugging

### Debug Console Output
```javascript
authManager.debug();
// Outputs:
// - Authentication status
// - Token presence (preview only)
// - User role and ID
// - Profile availability
// - localStorage keys
// - Legacy tokens found
```

### ERPChatbot Debug
The ERPChatbot now shows detailed authentication status:
- 🔓 Authenticated / 🔒 Not authenticated in welcome message
- Clear error messages for authentication failures
- Token presence logging

## Benefits

### For Users
- ✅ **No more 401 errors** due to token key mismatches
- ✅ **Seamless login experience** with automatic migration
- ✅ **Clear error messages** when authentication fails

### For Developers
- ✅ **Single source of truth** for authentication
- ✅ **Consistent API** across all components
- ✅ **Comprehensive debugging** tools
- ✅ **Automatic error handling**
- ✅ **Type-safe authentication state**

### For System
- ✅ **Backward compatibility** with zero downtime migration
- ✅ **Reduced localStorage pollution** through cleanup
- ✅ **Better security** through centralized auth management

## Configuration

### Token Key (Standard)
```javascript
TOKEN_KEY = 'authToken'  // Single source of truth
```

### Legacy Keys (Migrated)
```javascript
LEGACY_KEYS = ['token', 'access_token', 'accessToken', 'jwt_token']
```

### Additional Keys
```javascript
USER_ROLE_KEY = 'userRole'
USER_ID_KEY = 'userId'
USER_PROFILE_KEY = 'userProfile'
```

## Best Practices

### ✅ Do
- Use `authManager` for all authentication operations
- Check `authManager.isAuthenticated()` before API calls
- Use `authManager.getAuthHeader()` for request headers
- Handle authentication errors with `authManager.handleAuthError()`

### ❌ Don't
- Access localStorage directly for auth data
- Use multiple token keys
- Store authentication data in component state only
- Skip error handling for auth failures

## Troubleshooting

### ERPChatbot 401 Errors
1. Check if user is logged in: `authManager.isAuthenticated()`
2. Verify token exists: `authManager.getToken()`
3. Check debug output: `authManager.debug()`
4. Clear and re-login if needed: `authManager.clearAuth()`

### Migration Issues
1. Check console for migration logs
2. Manually run: `authManager.migrateLegacyTokens()`
3. Use AuthManagerTest component for verification
4. Clear localStorage completely and start fresh if needed

### API Authentication
1. Ensure `authManager.getAuthHeader()` is used
2. Check token format: `authManager.isValidTokenFormat(token)`
3. Verify backend is receiving Bearer token correctly

## Future Enhancements

### Planned Features
- 🔄 **Token Refresh**: Automatic token renewal before expiry
- 🔒 **Encrypted Storage**: Optional encryption for sensitive data
- 📊 **Analytics**: Authentication event tracking
- 🎯 **Role-based Features**: Enhanced role management
- ⏰ **Session Management**: Advanced session timeout handling

### Extension Points
- Custom storage backends (sessionStorage, cookies)
- Integration with external identity providers
- Multi-tenant authentication support
- Audit logging for authentication events

---

## Quick Start

1. **Import AuthManager**:
   ```javascript
   import authManager from './utils/authManager';
   ```

2. **Check Authentication**:
   ```javascript
   if (authManager.isAuthenticated()) {
     // User is logged in
   }
   ```

3. **Make Authenticated API Calls**:
   ```javascript
   const headers = authManager.getAuthHeader();
   fetch('/api/endpoint', { headers });
   ```

4. **Debug Issues**:
   ```javascript
   authManager.debug(); // Check console for details
   ```

This implementation provides a robust, maintainable, and user-friendly authentication system that eliminates the token storage inconsistencies that were causing 401 errors in your ERP application.