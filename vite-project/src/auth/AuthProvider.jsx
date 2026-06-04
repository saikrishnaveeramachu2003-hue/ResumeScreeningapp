import React, { createContext, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(payload)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const payload = decodeJwt(token);
      if (payload) setUser((u) => ({ ...(u || {}), username: payload.sub || payload.username || u?.username }));
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }, [user]);

  const login = ({ token: newToken, user: newUser, roles }) => {
    if (newToken) setToken(newToken);
    if (newUser) setUser((prev) => ({ ...(prev || {}), ...newUser }));
    if (roles) {
      try {
        localStorage.setItem('roles', JSON.stringify(roles));
      } catch (e) {}
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('roles');
  };

  const roles = useMemo(() => {
    try {
      const raw = localStorage.getItem('roles');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }, [token]);

  const value = { token, user, roles, login, logout, isAuthenticated: Boolean(token) };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
