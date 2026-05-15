import { Sunrise, Sunset } from 'lucide-react';

export default function SunriseSunset({ data }) {
  if (!data || !data.daily) return null;

  const sunrise = data.daily.sunrise?.[0];
  const sunset = data.daily.sunset?.[0];

  const formatTime = (isoStr) => {
    if (!isoStr) return '—';
    const date = new Date(isoStr);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="card sunrise-sunset-card">
      <div className="sunrise-sunset-title">Terbit & Terbenam</div>
      <div className="sunrise-sunset-content">
        <div className="sun-item">
          <Sunrise size={28} />
          <span className="sun-time">{formatTime(sunrise)}</span>
          <span className="sun-label">Terbit</span>
        </div>
        <div className="sun-item">
          <Sunset size={28} />
          <span className="sun-time">{formatTime(sunset)}</span>
          <span className="sun-label">Terbenam</span>
        </div>
      </div>
    </div>
  );
}
