import { useMemo } from 'react';
import { Droplets, Wind, Eye } from 'lucide-react';

export default function DetailCards({ data }) {
  if (!data) return null;

  const current = data.current;

  // Convert visibility from meters to km
  const visibilityKm = useMemo(() => {
    return current.visibility ? (current.visibility / 1000).toFixed(0) : '—';
  }, [current.visibility]);

  return (
    <>
      <div className="card detail-card">
        <div className="detail-card-icon">
          <Droplets size={22} />
        </div>
        <div className="detail-card-content">
          <span className="detail-card-label">Kelembapan</span>
          <span className="detail-card-value">{current.relative_humidity_2m}%</span>
        </div>
      </div>

      <div className="card detail-card">
        <div className="detail-card-icon">
          <Wind size={22} />
        </div>
        <div className="detail-card-content">
          <span className="detail-card-label">Kecepatan Angin</span>
          <span className="detail-card-value">{current.wind_speed_10m} km/h</span>
        </div>
      </div>

      <div className="card detail-card">
        <div className="detail-card-icon">
          <Eye size={22} />
        </div>
        <div className="detail-card-content">
          <span className="detail-card-label">Visibilitas</span>
          <span className="detail-card-value">{visibilityKm} km</span>
        </div>
      </div>
    </>
  );
}
