import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrentUser, loginUser as apiLogin, logoutUser as apiLogout } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await fetchCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load authenticated user:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    const userData = await fetchCurrentUser();
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      try {
        await apiLogout(refresh);
      } catch (err) {
        console.warn('Logout warning:', err);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
