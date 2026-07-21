import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');

      if (urlToken) {
        localStorage.setItem('token', urlToken);
        try {
          const response = await getCurrentUser();
          if (response.data && response.data.success) {
            const userData = response.data.data;
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('auth', JSON.stringify({ user: userData }));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('auth');
          }
        } catch (error) {
          console.error('Failed to fetch user with token', error);
          localStorage.removeItem('token');
          localStorage.removeItem('auth');
        } finally {
          urlParams.delete('token');
          const newSearch = urlParams.toString();
          const newPath = window.location.pathname + (newSearch ? `?${newSearch}` : '');
          window.history.replaceState({}, '', newPath);
        }
      } else {
        const storedAuth = localStorage.getItem('auth');
        const token = localStorage.getItem('token');
        if (storedAuth && token) {
          try {
            const parsed = JSON.parse(storedAuth);
            setUser(parsed.user);
            setIsAuthenticated(true);
          } catch (e) {
            console.error('Failed to parse stored auth', e);
            localStorage.removeItem('auth');
            localStorage.removeItem('token');
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('auth', JSON.stringify({ user: userData }));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
