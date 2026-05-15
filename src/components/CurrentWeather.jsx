import { Droplets, Wind, Thermometer } from 'lucide-react';
import { getWeatherDescription } from '../services/api';

export default function CurrentWeather({ data, locationName }) {
  if (!data) return null;

  const current = data.current;
  const description = getWeatherDescription(current.weather_code);

  return (
    <div className="glass-panel current-weather">
      <h2 className="location">{locationName}</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <div className="weather-icon" style={{ fontSize: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {codeToEmoji(current.weather_code, current.is_day)}
           </div>
        </div>
        
        <div style={{ textAlign: 'left' }}>
          <p className="temperature">{Math.round(current.temperature_2m)}°C</p>
          <p className="condition">{description}</p>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-item">
          <Thermometer size={24} />
          <span className="detail-label">Terasa Seperti</span>
          <span className="detail-value">{Math.round(current.apparent_temperature)}°C</span>
        </div>
        <div className="detail-item">
          <Droplets size={24} />
          <span className="detail-label">Kelembapan</span>
          <span className="detail-value">{current.relative_humidity_2m}%</span>
        </div>
        <div className="detail-item">
          <Wind size={24} />
          <span className="detail-label">Angin</span>
          <span className="detail-value">{current.wind_speed_10m} km/h</span>
        </div>
      </div>
    </div>
  );
}

// Helper for emoji icons
function codeToEmoji(code, isDay) {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code >= 1 && code <= 3) return isDay ? '⛅' : '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 65) return '🌧️';
  if (code >= 71 && code <= 75) return '❄️';
  if (code >= 95) return '⛈️';
  return '☁️';
}
