
import { useState, useCallback } from 'react';
import { GlobalSearch } from 'iconsax-react';
import WeatherCard from '../Cards/WeatherCardMini/WeatherCardMini';
import './Search.css';

const Search = ({ onSearch, recentSearches = [] }) => {
  const popularCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];
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
          <div className="search__popular">
            <h3>Popular Cities</h3>
            <div className="search__cards-grid">
              {popularCities.map((city) => (
                <div key={city} onClick={() => handleSearch(city)}>
                  <WeatherCard name={city} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
