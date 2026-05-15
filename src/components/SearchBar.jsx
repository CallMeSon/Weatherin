import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchCity } from '../services/api';

export default function SearchBar({ onSearch }) {
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
    }, 400);

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
  }, []);

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
    <div className="search-wrapper" ref={wrapperRef}>
      <form onSubmit={handleSubmit}>
        <span className="search-icon-inside">
          <Search size={16} />
        </span>
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
      </form>

      {showSuggestions && query.trim().length >= 2 && (
        <div className="suggestions-dropdown">
          {isLoading ? (
            <div className="suggestion-item">Mencari...</div>
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
  );
}
