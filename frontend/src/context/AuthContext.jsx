import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if token is passed via URL query (Cross-domain login redirect)
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. Verify token with backend
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    // Quick client-side expiry check first
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        setLoading(false);
        return;
      }
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setUser(null);
      setLoading(false);
      return;
    }

    // Verify with backend - this is the real check
    api.get('/auth/me')
      .then((res) => {
        if (res.data.success && res.data.user) {
          const role = res.data.user.role;
          localStorage.setItem('role', role);
          setUser({ id: res.data.user.id, role });
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const token = response.data.token;
        const decoded = jwtDecode(token);
        const role = decoded.role?.toLowerCase();
        
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setUser({ id: decoded.id, role });
        
        return { success: true, role };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please check credentials.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    window.location.href = '/login';
  };

  if (loading) return null; // Wait for initial token resolution

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
