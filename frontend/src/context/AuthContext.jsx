import React, { createContext, useState, useEffect } from 'react';
import { login, register, logout, getCurrentUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cachedUser = getCurrentUser();
    if (cachedUser) {
      setUser(cachedUser);
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const registerUser = async (name, email, password, phone, role) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register(name, email, password, phone, role);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
