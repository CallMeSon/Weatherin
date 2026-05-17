// src/services/notificationService.js
// Handles browser push notifications via Notification API

const COOLDOWN_KEY = 'weatherin_notif_cooldown';
const COOLDOWN_MS = 3 * 60 * 60 * 1000; // 3 hours cooldown per category

/**
 * Request notification permission from the browser
 * @returns {Promise<string>} 'granted' | 'denied' | 'default'
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('Browser tidak mendukung notifikasi.');
    return 'denied';
  }
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';

  const result = await Notification.requestPermission();
  return result;
}

/**
 * Check if a notification category is on cooldown
 */
function isOnCooldown(category) {
  try {
    const cooldowns = JSON.parse(localStorage.getItem(COOLDOWN_KEY) || '{}');
    const lastSent = cooldowns[category];
    if (!lastSent) return false;
    return Date.now() - lastSent < COOLDOWN_MS;
  } catch {
    return false;
  }
}

/**
 * Set cooldown for a category
 */
function setCooldown(category) {
  try {
    const cooldowns = JSON.parse(localStorage.getItem(COOLDOWN_KEY) || '{}');
    cooldowns[category] = Date.now();
    localStorage.setItem(COOLDOWN_KEY, JSON.stringify(cooldowns));
  } catch {
    // ignore
  }
}

/**
 * Send a browser push notification
 */
function sendBrowserNotification(title, body, icon = '🌤️', tag = '') {
  if (Notification.permission !== 'granted') return null;

  try {
    const notification = new Notification(title, {
      body,
      icon: '/logo.svg',
      badge: '/logo.svg',
      tag: tag || title, // prevents duplicate notifications
      requireInteraction: false,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  } catch (err) {
    console.error('Error sending notification:', err);
    return null;
  }
}

/**
 * Weather codes that trigger notifications
 */
const SEVERE_WEATHER_CODES = {
  // Rain
  61: 'Hujan Ringan',
  63: 'Hujan Sedang',
  65: 'Hujan Lebat',
  // Drizzle
  55: 'Gerimis Lebat',
  // Thunderstorm
  95: 'Badai Petir',
  96: 'Badai Petir & Hujan Es',
  99: 'Badai Petir Lebat',
  // Snow
  71: 'Salju Ringan',
  73: 'Salju Sedang',
  75: 'Salju Lebat',
  // Fog
  45: 'Berkabut',
  48: 'Kabut Tebal',
};

/**
 * Check weather data and generate notifications
 * @param {Object} weatherData - Weather data from Open-Meteo API
 * @param {Object} airData - Air quality data
 * @returns {Array} Array of notification objects for in-app panel
 */
export function checkAndNotify(weatherData, airData) {
  const notifications = [];
  const current = weatherData?.current;
  if (!current) return notifications;

  const now = Date.now();

  // 1. Temperature check: below 10°C or above 34°C
  const temp = current.temperature_2m;
  if (temp !== undefined) {
    if (temp < 10 && !isOnCooldown('temp_low')) {
      const notif = {
        id: `temp_low_${now}`,
        category: 'temperature',
        type: 'cold',
        icon: '🥶',
        title: 'Suhu Rendah',
        message: `Suhu saat ini ${temp}°C — di bawah 10°C. Kenakan pakaian hangat!`,
        timestamp: now,
        read: false,
      };
      notifications.push(notif);
      sendBrowserNotification('🥶 Suhu Rendah', notif.message, '🥶', 'temp_low');
      setCooldown('temp_low');
    }

    if (temp > 34 && !isOnCooldown('temp_high')) {
      const notif = {
        id: `temp_high_${now}`,
        category: 'temperature',
        type: 'hot',
        icon: '🔥',
        title: 'Suhu Tinggi',
        message: `Suhu saat ini ${temp}°C — di atas 34°C. Tetap terhidrasi dan hindari aktivitas luar!`,
        timestamp: now,
        read: false,
      };
      notifications.push(notif);
      sendBrowserNotification('🔥 Suhu Tinggi', notif.message, '🔥', 'temp_high');
      setCooldown('temp_high');
    }
  }

  // 2. Weather condition check
  const weatherCode = current.weather_code;
  if (weatherCode !== undefined && SEVERE_WEATHER_CODES[weatherCode] && !isOnCooldown('weather')) {
    const conditionName = SEVERE_WEATHER_CODES[weatherCode];
    const notif = {
      id: `weather_${now}`,
      category: 'weather',
      type: 'severe',
      icon: weatherCode >= 95 ? '⛈️' : weatherCode >= 61 ? '🌧️' : weatherCode >= 45 ? '🌫️' : '🌨️',
      title: `Peringatan Cuaca: ${conditionName}`,
      message: `Kondisi cuaca saat ini: ${conditionName}. Berhati-hatilah saat beraktivitas di luar.`,
      timestamp: now,
      read: false,
    };
    notifications.push(notif);
    sendBrowserNotification(`⚠️ ${conditionName}`, notif.message, '⛈️', 'weather');
    setCooldown('weather');
  }

  // 3. Air Quality check: AQI > 100
  const aqi = airData?.current?.us_aqi;
  if (aqi !== undefined && aqi > 100 && !isOnCooldown('aqi')) {
    let severity = 'Tidak Sehat untuk Sensitif';
    let emoji = '😷';
    if (aqi > 200) {
      severity = 'Sangat Tidak Sehat';
      emoji = '🚨';
    } else if (aqi > 150) {
      severity = 'Tidak Sehat';
      emoji = '⚠️';
    }

    const notif = {
      id: `aqi_${now}`,
      category: 'air_quality',
      type: 'unhealthy',
      icon: emoji,
      title: `Kualitas Udara: ${severity}`,
      message: `AQI saat ini ${aqi} (${severity}). Kurangi aktivitas luar ruangan dan gunakan masker.`,
      timestamp: now,
      read: false,
    };
    notifications.push(notif);
    sendBrowserNotification(`${emoji} Kualitas Udara Buruk`, notif.message, emoji, 'aqi');
    setCooldown('aqi');
  }

  return notifications;
}

/**
 * Get notification permission status
 */
export function getPermissionStatus() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}
