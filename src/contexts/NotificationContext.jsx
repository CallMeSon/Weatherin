import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { checkAndNotify, requestNotificationPermission, getPermissionStatus } from '../services/notificationService';

const NotificationContext = createContext(null);

const STORAGE_PREFIX = 'weatherin_notifications_';
const MAX_NOTIFICATIONS = 50;

function getStorageKey(userEmail) {
  return `${STORAGE_PREFIX}${userEmail || 'anonymous'}`;
}

export function NotificationProvider({ children, weatherData, airData }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [permissionStatus, setPermissionStatus] = useState('default');
  const processedDataRef = useRef(null);

  // Load notifications from localStorage when user changes
  useEffect(() => {
    if (user?.email) {
      try {
        const stored = localStorage.getItem(getStorageKey(user.email));
        if (stored) {
          setNotifications(JSON.parse(stored));
        } else {
          setNotifications([]);
        }
      } catch {
        setNotifications([]);
      }
    } else {
      setNotifications([]);
    }
  }, [user?.email]);

  // Save notifications to localStorage
  const saveNotifications = useCallback((notifs) => {
    if (user?.email) {
      try {
        localStorage.setItem(getStorageKey(user.email), JSON.stringify(notifs));
      } catch {
        // storage full, clear old notifications
      }
    }
  }, [user?.email]);

  // Check permission status
  useEffect(() => {
    setPermissionStatus(getPermissionStatus());
  }, []);

  // Check weather data for notification triggers
  useEffect(() => {
    if (!user || !weatherData?.current) return;

    // Avoid processing the same data twice
    const dataHash = `${weatherData.current.temperature_2m}_${weatherData.current.weather_code}_${airData?.current?.us_aqi}`;
    if (processedDataRef.current === dataHash) return;
    processedDataRef.current = dataHash;

    const newNotifs = checkAndNotify(weatherData, airData);
    if (newNotifs.length > 0) {
      setNotifications((prev) => {
        const updated = [...newNotifs, ...prev].slice(0, MAX_NOTIFICATIONS);
        saveNotifications(updated);
        return updated;
      });
    }
  }, [user, weatherData, airData, saveNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((notifId) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === notifId ? { ...n, read: true } : n
      );
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveNotifications([]);
  }, [saveNotifications]);

  const removeNotification = useCallback((notifId) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== notifId);
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  const enableNotifications = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermissionStatus(result);
    return result;
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        permissionStatus,
        markAsRead,
        markAllAsRead,
        clearAll,
        removeNotification,
        enableNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
