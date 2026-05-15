import { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { searchCity } from '../services/api';

export default function SearchBar({ onSearch, onGeolocate }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const results = await searchCity(query);
          setSuggestions(results || []);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Failed to fetch suggestions", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleSelectSuggestion = (city) => {
    onSearch(city);
    setShowSuggestions(false);
    setQuery('');
  };

  return (
    <div className="search-container">
      <div className="search-form-wrapper" ref={wrapperRef}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Cari kota..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <Search size={20} />
          </button>
        </form>

        {/* Autocomplete Dropdown */}
        {showSuggestions && (query.trim().length >= 2) && (
          <div className="suggestions-dropdown">
            {isLoading ? (
              <div className="suggestion-item">Loading...</div>
            ) : suggestions.length > 0 ? (
              suggestions.map((city) => (
                <div 
                  key={city.id} 
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(city)}
                >
                  <span className="suggestion-name">{city.name}</span>
                  <span className="suggestion-details">
                    {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                  </span>
                </div>
              ))
            ) : (
              <div className="suggestion-item">Kota tidak ditemukan</div>
            )}
          </div>
        )}
      </div>
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
