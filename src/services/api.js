// src/services/api.js

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export const searchCity = async (query) => {
  try {
    const response = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching city:", error);
    throw new Error("Gagal mencari kota");
  }
};

export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`);
    const data = await response.json();
    return {
      name: data.city || data.locality || "Lokasi Anda",
      country: data.countryName
    };
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return { name: "Lokasi Anda", country: "" };
  }
};

export const getWeather = async (lat, lon) => {
  try {
    const response = await fetch(
      `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,uv_index,visibility,surface_pressure` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
      `&timezone=auto`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw new Error("Gagal mengambil data cuaca");
  }
};

export const getAirQuality = async (lat, lon) => {
  try {
    const response = await fetch(
      `${AIR_QUALITY_API_URL}?latitude=${lat}&longitude=${lon}` +
      `&current=us_aqi,pm2_5,pm10,sulphur_dioxide` +
      `&timezone=auto`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching air quality:", error);
    return null;
  }
};

export const getAqiStatus = (aqi) => {
  if (aqi <= 50) return { label: 'Baik', color: '#22c55e', description: 'Udara bersih dan aman untuk aktivitas luar ruangan bagi mayoritas orang.' };
  if (aqi <= 100) return { label: 'Sedang', color: '#eab308', description: 'Kualitas udara cukup diterima. Beberapa polutan mungkin sedikit berpengaruh bagi orang yang sangat sensitif.' };
  if (aqi <= 150) return { label: 'Tidak Sehat (Sensitif)', color: '#f97316', description: 'Kelompok sensitif mungkin mengalami efek kesehatan. Masyarakat umum kemungkinan tidak terpengaruh.' };
  if (aqi <= 200) return { label: 'Tidak Sehat', color: '#ef4444', description: 'Semua orang mungkin mulai mengalami efek kesehatan. Kelompok sensitif mungkin mengalami efek yang lebih serius.' };
  return { label: 'Sangat Tidak Sehat', color: '#7c3aed', description: 'Peringatan kesehatan: semua orang mungkin mengalami efek kesehatan yang lebih serius.' };
};

export const getWeatherDescription = (code) => {
  // WMO Weather interpretation codes (WW)
  const weatherCodes = {
    0: "Cerah",
    1: "Sebagian Cerah",
    2: "Berawan Sebagian",
    3: "Mendung",
    45: "Berkabut",
    48: "Kabut Tebal",
    51: "Gerimis Ringan",
    53: "Gerimis Sedang",
    55: "Gerimis Lebat",
    61: "Hujan Ringan",
    63: "Hujan Sedang",
    65: "Hujan Lebat",
    71: "Salju Ringan",
    73: "Salju Sedang",
    75: "Salju Lebat",
    95: "Badai Petir",
    96: "Badai Petir & Hujan Es",
    99: "Badai Petir Lebat",
  };
  return weatherCodes[code] || "Tidak diketahui";
};
