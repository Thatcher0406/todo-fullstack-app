import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { clearTokens, getAccessToken, registerLogoutHandler, setTokens } from '../services/session';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      return null;
    }

    try {
      const response = await API.get('auth/me/');
      setUser(response.data || null);
      return response.data || null;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const login = useCallback(
    async ({ access, refresh }) => {
      setTokens({ access, refresh });
      return fetchUser();
    },
    [fetchUser]
  );

  useEffect(() => {
    const bootstrap = async () => {
      await fetchUser();
      setIsInitializing(false);
    };

    bootstrap();
  }, [fetchUser]);

  useEffect(() => {
    registerLogoutHandler(logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      fetchUser,
      login,
      logout,
      setUser,
    }),
    [user, isInitializing, fetchUser, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
