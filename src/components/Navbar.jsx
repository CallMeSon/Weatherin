import { MapPin } from 'lucide-react';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import NotificationPanel from './NotificationPanel';

export default function Navbar({ onSearch, onGeolocate }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Weatherin</div>
      <div className="navbar-center">
        <SearchBar onSearch={onSearch} />
      </div>
      <div className="navbar-actions">
        <NotificationPanel />
        <button
          className="navbar-icon-btn"
          onClick={onGeolocate}
          title="Gunakan Lokasi Saat Ini"
          aria-label="Use current location"
        >
          <MapPin size={18} />
        </button>
        <UserMenu />
      </div>
    </nav>
  );
}
