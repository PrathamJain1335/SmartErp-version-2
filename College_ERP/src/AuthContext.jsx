// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import authManager from "./utils/authManager";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state from AuthManager
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authManager.getCurrentUser();
        if (currentUser.isAuthenticated) {
          setUser({
            role: currentUser.role,
            userId: currentUser.userId,
            profile: currentUser.profile,
            token: currentUser.token
          });
          console.log('✅ AuthContext: Restored user session:', currentUser.role);
        } else {
          console.log('ℹ️ AuthContext: No valid session found');
        }
      } catch (error) {
        console.error('❌ AuthContext: Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (authData) => {
    try {
      // authData should contain { token, role, userId, user }
      if (typeof authData === 'string') {
        // Legacy support - just role string
        setUser({ role: authData });
        console.log('⚠️ AuthContext: Legacy login with role only:', authData);
      } else {
        // Full auth data
        authManager.setAuthData(authData);
        setUser({
          role: authData.role,
          userId: authData.userId,
          profile: authData.user,
          token: authData.token
        });
        console.log('✅ AuthContext: User logged in:', authData.role);
      }
    } catch (error) {
      console.error('❌ AuthContext: Error during login:', error);
    }
  };

  const logout = () => {
    try {
      authManager.clearAuth();
      setUser(null);
      console.log('✅ AuthContext: User logged out');
    } catch (error) {
      console.error('❌ AuthContext: Error during logout:', error);
    }
  };

  const isAuthenticated = () => {
    return authManager.isAuthenticated();
  };

  const getCurrentUser = () => {
    return authManager.getCurrentUser();
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);