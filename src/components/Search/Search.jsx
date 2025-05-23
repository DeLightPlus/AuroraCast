import { useState, useCallback } from 'react';
import { ArrowRight, GlobalSearch } from 'iconsax-react';
import './Search.css';

const Search = ({ onSearch, recentSearches = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setSearchQuery('');
      setIsExpanded(false);
    }
  }, [onSearch, searchQuery]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search">
      <div className={`search__container ${isExpanded ? 'expanded' : ''}`}>
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
          <>
            <button 
              className="search__clear"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
            <button 
              className="search__button"
              onClick={handleSearch}
            >
              <ArrowRight />
            </button>
          </>
        )}
      </div>     
    </div>
  );
};

export default Search;
