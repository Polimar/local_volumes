import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
          api.defaults.headers.common['Authorization'] = '';
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, [token]);
  
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', credentials);
      const { user, token, redirectToAdmin } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setToken(token);
      
      return { user, redirectToAdmin };
    } catch (error) {
      setError(error.response?.data?.message || 'Errore durante il login');
      throw error;
    }
  };
  
  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setToken(token);
      
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Errore durante la registrazione');
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Errore durante il logout:', error);
    } finally {
      localStorage.removeItem('token');
      api.defaults.headers.common['Authorization'] = '';
      setUser(null);
      setToken(null);
      navigate('/login');
    }
  };
  
  const isAuthenticated = !!user;
  
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
}; 