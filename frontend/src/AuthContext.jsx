import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import api, { SOCKET_URL } from './services/api';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  useEffect(() => {
    function loadStorageData() {
      const storagedUser = localStorage.getItem('user');
      const storagedToken = localStorage.getItem('token');

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
      }
      const storagedDarkMode = localStorage.getItem('darkMode');
      setDarkMode(storagedDarkMode === 'true');
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function login(email, password) {
    const response = await api.post('/login', { email, password });
    const { user: userData, token, refreshToken } = response.data;

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  function logout() {
    localStorage.clear();
    setUser(null);
  }
  
  function toggleDarkMode() {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  }

  function updateUser(userData) {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) { console.error(err); }
  };

  const markNotificationsAsRead = async () => {
    try {
      await api.patch('/notifications/read');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  };

  const clearNotifications = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // O socket só é aberto após login para não manter conexão anônima desnecessária.
      const socket = io(SOCKET_URL, { transports: ['websocket'] });
      socket.on('statusChanged', (data) => {
        if (data.updatedBy !== user._id) {
          fetchNotifications();
          toast.info(`🔔 Chamado "${data.title}" alterado para ${data.status.toUpperCase()}`);
        }
      });
      return () => socket.disconnect();
    }
  }, [user]);

  const value = useMemo(() => ({
    signed: !!user,
    user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    updateUser,
    loading,
    notifications,
    unreadCount,
    markNotificationsAsRead,
    clearNotifications,
    darkMode,
    toggleDarkMode,
    isSidebarOpen,
    setIsSidebarOpen
  }), [user, loading, notifications, unreadCount, darkMode, isSidebarOpen]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
