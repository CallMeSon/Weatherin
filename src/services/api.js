// src/services/api.js

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

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
}

export const getWeather = async (lat, lon) => {
  try {
    const response = await fetch(
      `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw new Error("Gagal mengambil data cuaca");
  }
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
