import { getAqiStatus } from '../services/api';

export default function AirQuality({ airData }) {
  if (!airData || !airData.current) return null;

  const current = airData.current;
  const aqi = current.us_aqi ?? 0;
  const status = getAqiStatus(aqi);
  const progressPercent = Math.min((aqi / 300) * 100, 100);

  return (
    <div className="card aqi-card">
      <div className="aqi-header">
        <span className="aqi-title">Kualitas Udara</span>
      </div>

      <div className="aqi-main">
        <span className="aqi-value">{aqi}</span>
        <span className="aqi-badge" style={{ background: status.color }}>{status.label}</span>
      </div>

      <div className="aqi-progress-bar">
        <div
          className="aqi-progress-fill"
          style={{ width: `${progressPercent}%`, background: status.color }}
        />
      </div>

      <p className="aqi-description">{status.description}</p>

      <div className="aqi-pollutants">
        <div className="pollutant-item">
          <span className="pollutant-label">PM2.5</span>
          <span className="pollutant-value">{current.pm2_5?.toFixed(1) ?? '—'}</span>
        </div>
        <div className="pollutant-item">
          <span className="pollutant-label">PM10</span>
          <span className="pollutant-value">{current.pm10?.toFixed(1) ?? '—'}</span>
        </div>
        <div className="pollutant-item">
          <span className="pollutant-label">SO2</span>
          <span className="pollutant-value">{current.sulphur_dioxide?.toFixed(1) ?? '—'}</span>
        </div>
      </div>
    </div>
  );
}
