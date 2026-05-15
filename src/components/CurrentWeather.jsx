import { MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { getWeatherDescription } from '../services/api';
import { codeToEmoji } from '../utils/helpers';
import { Droplets, Wind, Gauge } from 'lucide-react';

export default function CurrentWeather({ data, locationName }) {
  if (!data) return null;

  const current = data.current;
  const description = getWeatherDescription(current.weather_code);
  const today = format(new Date(), 'EEEE, d MMMM yyyy', { locale: idLocale });

  return (
    <div className="hero-card">
      <div>
        <div className="hero-location">
          <MapPin size={18} />
          <span>{locationName}</span>
        </div>
        <div className="hero-date">{today}</div>
      </div>

      <div className="hero-weather-icon">
        {codeToEmoji(current.weather_code, current.is_day)}
      </div>

      <div className="hero-bottom">
        <div className="hero-temp-section">
          <span className="hero-temperature">{Math.round(current.temperature_2m)}°C</span>
          <div className="hero-condition-group">
            <div className="hero-condition">{description}</div>
            <div className="hero-feels-like">Terasa seperti {Math.round(current.apparent_temperature)}°C</div>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <Droplets size={18} />
            <span className="hero-stat-value">{current.relative_humidity_2m}%</span>
            <span className="hero-stat-label">Lembap</span>
          </div>
          <div className="hero-stat">
            <Wind size={18} />
            <span className="hero-stat-value">{current.wind_speed_10m} km/h</span>
            <span className="hero-stat-label">Angin</span>
          </div>
          <div className="hero-stat">
            <Gauge size={18} />
            <span className="hero-stat-value">{Math.round(current.surface_pressure)} hPa</span>
            <span className="hero-stat-label">Tekanan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
