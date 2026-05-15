import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Forecast({ data }) {
  if (!data || !data.daily) return null;

  const { time, temperature_2m_max, temperature_2m_min, weather_code } = data.daily;

  // Skip the first day (today) and show next 6 days
  const forecastDays = time.slice(1, 7).map((t, index) => ({
    date: t,
    max: temperature_2m_max[index + 1],
    min: temperature_2m_min[index + 1],
    code: weather_code[index + 1]
  }));

  return (
    <div className="glass-panel forecast-container">
      <h3 className="forecast-title">Prakiraan 6 Hari</h3>
      <div className="forecast-grid">
        {forecastDays.map((day, i) => (
          <div key={i} className="forecast-card">
            <span className="forecast-day">
              {format(parseISO(day.date), 'EEEE', { locale: id })}
            </span>
            <div style={{ fontSize: '2rem' }}>
               {codeToEmoji(day.code)}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="forecast-temp">{Math.round(day.max)}°</span>
              <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{Math.round(day.min)}°</span>
            </div>
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
