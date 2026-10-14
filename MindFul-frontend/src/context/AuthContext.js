import React, { createContext, useContext, useState } from 'react';
import { authApi, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      if (response && response.token) {
        setToken(response.token);
        setUser(response.user);
        setAuthToken(response.token);
        return { success: true, user: response.user };
      }
      throw new Error(response?.error || 'Invalid credentials');
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await authApi.register({ name, email, password });
      if (response && response.token) {
        setToken(response.token);
        setUser(response.user);
        setAuthToken(response.token);
        return { success: true, user: response.user };
      }
      throw new Error(response?.error || 'Registration failed');
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
