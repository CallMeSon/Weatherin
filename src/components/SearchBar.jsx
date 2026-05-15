import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

export default function SearchBar({ onSearch, onGeolocate }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Cari kota..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-btn" aria-label="Search">
          <Search size={20} />
        </button>
      </form>
      <button 
        type="button" 
        className="geo-btn" 
        onClick={onGeolocate}
        title="Gunakan Lokasi Saat Ini"
        aria-label="Use current location"
      >
        <MapPin size={24} />
      </button>
    </div>
  );
}
