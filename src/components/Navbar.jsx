import { Search, MapPin, Bell } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Navbar({ onSearch, onGeolocate }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Weatherin</div>
      <div className="navbar-center">
        <SearchBar onSearch={onSearch} />
      </div>
      <div className="navbar-actions">
        <button className="navbar-icon-btn" title="Notifikasi" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <button
          className="navbar-icon-btn"
          onClick={onGeolocate}
          title="Gunakan Lokasi Saat Ini"
          aria-label="Use current location"
        >
          <MapPin size={18} />
        </button>
      </div>
    </nav>
  );
}
