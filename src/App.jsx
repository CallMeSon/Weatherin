import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import { searchCity, reverseGeocode, getWeather } from './services/api';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initial load: Geolocation
  useEffect(() => {
    handleGeolocate();
  }, []);

  // Update theme based on is_day
  useEffect(() => {
    if (weatherData?.current) {
      if (weatherData.current.is_day) {
        document.body.classList.remove('night-mode');
      } else {
        document.body.classList.add('night-mode');
      }
    }
  }, [weatherData]);

  const fetchWeatherForCoords = async (lat, lon, name) => {
    setLoading(true);
    setError('');
    try {
      const data = await getWeather(lat, lon);
      setWeatherData(data);
      
      if (!name) {
        const geoInfo = await reverseGeocode(lat, lon);
        setLocationName(geoInfo.name);
      } else {
        setLocationName(name);
      }
    } catch (err) {
      setError('Gagal memuat data cuaca. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (queryOrCityObj) => {
    setLoading(true);
    setError('');
    try {
      if (typeof queryOrCityObj === 'string') {
        const results = await searchCity(queryOrCityObj);
        if (results && results.length > 0) {
          // Find the best match or take the first one
          const bestMatch = results[0];
          const locationStr = bestMatch.admin1 ? `${bestMatch.name}, ${bestMatch.admin1}` : `${bestMatch.name}, ${bestMatch.country}`;
          await fetchWeatherForCoords(bestMatch.latitude, bestMatch.longitude, locationStr);
        } else {
          setError('Kota tidak ditemukan.');
          setLoading(false);
        }
      } else {
        // It's a city object from autocomplete
        const bestMatch = queryOrCityObj;
        const locationStr = bestMatch.admin1 ? `${bestMatch.name}, ${bestMatch.admin1}` : `${bestMatch.name}, ${bestMatch.country}`;
        await fetchWeatherForCoords(bestMatch.latitude, bestMatch.longitude, locationStr);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mencari kota.');
      setLoading(false);
    }
  };

  const handleGeolocate = () => {
    setLoading(true);
    setError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherForCoords(latitude, longitude);
        },
        (err) => {
          setError('Akses lokasi ditolak atau tidak tersedia. Silakan cari kota secara manual.');
          setLoading(false);
          // Set default to Jakarta if geolocation fails
          handleSearch('Jakarta');
        }
      );
    } else {
      setError('Geolocation tidak didukung oleh browser Anda.');
      setLoading(false);
      handleSearch('Jakarta');
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Weatherin</h1>
        <SearchBar onSearch={handleSearch} onGeolocate={handleGeolocate} />
      </header>

      {loading && <div className="loading">Memuat data...</div>}
      
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && weatherData && (
        <div className="weather-grid">
          <CurrentWeather data={weatherData} locationName={locationName} />
          <Forecast data={weatherData} />
        </div>
      )}
    </div>
  );
}

export default App;
