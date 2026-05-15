import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { getWeatherDescription } from '../services/api';

export default function Forecast({ data }) {
  if (!data || !data.daily) return null;

  const { time, temperature_2m_max, temperature_2m_min, weather_code } = data.daily;

  // Skip the first day (today) and show next 6 days
  const forecastDays = time.slice(1, 7).map((t, index) => ({
    date: t,
    max: temperature_2m_max[index + 1],
    min: temperature_2m_min[index + 1],
    code: weather_code[index + 1],
    description: getWeatherDescription(weather_code[index + 1])
  }));

  return (
    <div className="forecast-section">
      <div className="forecast-header">
        <h3 className="forecast-title">Prakiraan 6 Hari</h3>
      </div>
      <div className="forecast-grid">
        {forecastDays.map((day, i) => (
          <div key={i} className="card forecast-card">
            <span className="forecast-day">
              {format(parseISO(day.date), 'EEEE', { locale: id })}
            </span>
            <span className="forecast-icon">
              {codeToEmoji(day.code)}
            </span>
            <div className="forecast-temps">
              <span className="forecast-temp-max">{Math.round(day.max)}°</span>
              <span className="forecast-temp-min">{Math.round(day.min)}°</span>
            </div>
            <span className="forecast-desc">{day.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function codeToEmoji(code) {
  if (code === 0) return '☀️';
  if (code >= 1 && code <= 3) return '⛅';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 65) return '🌧️';
  if (code >= 71 && code <= 75) return '❄️';
  if (code >= 95) return '⛈️';
  return '☁️';
}
