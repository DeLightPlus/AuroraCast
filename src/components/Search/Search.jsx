
import { useState, useCallback } from 'react';
import { GlobalSearch } from 'iconsax-react';
import './Search.css';

const Search = ({ onSearch, recentSearches = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = useCallback((query) => {
    if (query.trim()) {
      onSearch(query);
      setIsExpanded(false);
    }
  }, [onSearch]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  const popularCities = [
    { name: 'Johannesburg', temp: '23°C', condition: '🌤' },
    { name: 'Cape Town', temp: '19°C', condition: '⛅' },
    { name: 'Durban', temp: '25°C', condition: '☀' },
    { name: 'Pretoria', temp: '22°C', condition: '🌤' },
    { name: 'Port Elizabeth', temp: '20°C', condition: '⛅' }
  ];

  return (
    <div className="search">
      <div className={`search__container ${isExpanded ? 'search__container--expanded' : ''}`}>
        <GlobalSearch 
          size="20" 
          className="search__icon"
          color="currentColor" 
        />
        <input
          className="search__input"
          type="text"
          placeholder="Search for a city..."
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[A-Za-z\s]*$/.test(value)) {
              setSearchQuery(value);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsExpanded(true)}
        />
        {searchQuery && (
          <button 
            className="search__clear"
            onClick={() => setSearchQuery('')}
          >
            ×
          </button>
        )}
      </div>
      
      <div className="search__cards">
        {popularCities.map((city) => (
          <div key={city.name} className="search__card" onClick={() => handleSearch(city.name)}>
            <div className="search__card-main">
              <span className="search__card-condition">{city.condition}</span>
              <span className="search__card-temp">{city.temp}</span>
            </div>
            <div className="search__card-name">{city.name}</div>
          </div>
        ))}
      </div>

      {isExpanded && (
        <div className="search__dropdown">
          <div className="search__recent">
            <h3>Recent Searches</h3>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                className="search__recent-item"
                onClick={() => handleSearch(search)}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
