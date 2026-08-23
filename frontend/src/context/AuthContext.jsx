import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fraudnet_auth_token') || null);
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('fraudnet_auth_user');
    try {
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Bootstrap user profile if token is present on initial load
  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      if (!token) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        if (isMounted && response?.user) {
          setUser(response.user);
          localStorage.setItem('fraudnet_auth_user', JSON.stringify(response.user));
        }
      } catch (err) {
        // Token invalid or expired
        if (isMounted) {
          setToken(null);
          setUser(null);
          localStorage.removeItem('fraudnet_auth_token');
          localStorage.removeItem('fraudnet_auth_user');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [token]);

  /**
   * Log in user with credentials
   */
  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    if (data?.token && data?.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('fraudnet_auth_token', data.token);
      localStorage.setItem('fraudnet_auth_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error('Invalid response from authentication server.');
  }, []);

  /**
   * Log out user and clear state
   */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fraudnet_auth_token');
    localStorage.removeItem('fraudnet_auth_user');
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
