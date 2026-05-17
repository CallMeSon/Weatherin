import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import CurrentWeather from './components/CurrentWeather';
import DetailCards from './components/DetailCards';
import SunriseSunset from './components/SunriseSunset';
import Forecast from './components/Forecast';
import AirQuality from './components/AirQuality';
import { NotificationProvider } from './contexts/NotificationContext';
import { searchCity, reverseGeocode, getWeather, getAirQuality } from './services/api';
import { Map } from 'lucide-react';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [airData, setAirData] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const coordsRef = useRef({ lat: null, lon: null });

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
    coordsRef.current = { lat, lon };
    try {
      const [weather, air] = await Promise.all([
        getWeather(lat, lon),
        getAirQuality(lat, lon)
      ]);
      setWeatherData(weather);
      setAirData(air);

      if (!name) {
        const geoInfo = await reverseGeocode(lat, lon);
        setLocationName(`${geoInfo.name}, ${geoInfo.country}`);
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
          const bestMatch = results[0];
          const locationStr = bestMatch.admin1
            ? `${bestMatch.name}, ${bestMatch.admin1}`
            : `${bestMatch.name}, ${bestMatch.country}`;
          await fetchWeatherForCoords(bestMatch.latitude, bestMatch.longitude, locationStr);
        } else {
          setError('Kota tidak ditemukan.');
          setLoading(false);
        }
      } else {
        const bestMatch = queryOrCityObj;
        const locationStr = bestMatch.admin1
          ? `${bestMatch.name}, ${bestMatch.admin1}`
          : `${bestMatch.name}, ${bestMatch.country}`;
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
        () => {
          setLoading(false);
          handleSearch('Jakarta');
        }
      );
    } else {
      setLoading(false);
      handleSearch('Jakarta');
    }
  };

  return (
    <NotificationProvider weatherData={weatherData} airData={airData}>
      <Navbar onSearch={handleSearch} onGeolocate={handleGeolocate} />

      <main className="app-container">
        {error && <div className="error-message">{error}</div>}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <span className="loading-text">Memuat data cuaca...</span>
          </div>
        )}

        {!loading && !error && weatherData && (
          <>
            {/* Top section: Hero + Detail Cards */}
            <div className="dashboard-grid">
              <CurrentWeather data={weatherData} locationName={locationName} />

              <div className="detail-cards-column" style={{ display: 'contents' }}>
                <DetailCards data={weatherData} />
              </div>

              <SunriseSunset data={weatherData} />
            </div>

            {/* Forecast */}
            <div style={{ marginTop: '1.25rem' }}>
              <Forecast data={weatherData} />
            </div>

            {/* Bottom section: Air Quality + Radar */}
            <div className="bottom-grid" style={{ marginTop: '1.25rem' }}>
              <AirQuality airData={airData} />
              <div className="card radar-card">
                <div className="radar-card-overlay"></div>
                <div className="radar-card-content">
                  <div className="radar-card-title">
                    <Map size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                    Peta Radar
                  </div>
                  <div className="radar-card-subtitle">Pantau awan di sekitar {locationName.split(',')[0]}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </NotificationProvider>
  );
}

export default App;
