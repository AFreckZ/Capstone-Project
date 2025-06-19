import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../css/searchpage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search state
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [venueType, setVenueType] = useState(searchParams.get('venue_type') || '');
  const [eventType, setEventType] = useState(searchParams.get('event_type') || '');
  const [dateFrom, setDateFrom] = useState(searchParams.get('date_from') || '');
  const [dateTo, setDateTo] = useState(searchParams.get('date_to') || '');
  const [minCost, setMinCost] = useState(searchParams.get('min_cost') || '');
  const [maxCost, setMaxCost] = useState(searchParams.get('max_cost') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'name');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort_order') || 'ASC');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  // Results state
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter options state
  const [venueTypes, setVenueTypes] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [featuredContent, setFeaturedContent] = useState(null);

  // Show/hide filters
  const [showFilters, setShowFilters] = useState(false);

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
    fetchFeaturedContent();
  }, []);

  // Perform search when parameters change
  useEffect(() => {
    if (hasSearchQuery()) {
      performSearch();
    }
  }, [query, type, location, venueType, eventType, dateFrom, dateTo, minCost, maxCost, sortBy, sortOrder, currentPage]);

  const hasSearchQuery = () => {
    return query || location || venueType || eventType || dateFrom || dateTo || minCost || maxCost || type !== 'all';
  };

  const fetchFilterOptions = async () => {
    try {
      const [venueTypesRes, eventTypesRes, locationsRes] = await Promise.all([
        fetch('http://localhost:5001/api/search/venue-types'),
        fetch('http://localhost:5001/api/search/event-types'),
        fetch('http://localhost:5001/api/search/locations')
      ]);

      if (venueTypesRes.ok) {
        const venueTypesData = await venueTypesRes.json();
        setVenueTypes(venueTypesData);
      }

      if (eventTypesRes.ok) {
        const eventTypesData = await eventTypesRes.json();
        setEventTypes(eventTypesData);
      }

      if (locationsRes.ok) {
        const locationsData = await locationsRes.json();
        setLocations(locationsData);
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const fetchFeaturedContent = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/search/featured');
      if (response.ok) {
        const data = await response.json();
        setFeaturedContent(data);
      }
    } catch (err) {
      console.error('Error fetching featured content:', err);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (type !== 'all') params.append('type', type);
      if (location) params.append('location', location);
      if (venueType) params.append('venue_type', venueType);
      if (eventType) params.append('event_type', eventType);
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      if (minCost) params.append('min_cost', minCost);
      if (maxCost) params.append('max_cost', maxCost);
      if (sortBy) params.append('sort_by', sortBy);
      if (sortOrder) params.append('sort_order', sortOrder);
      if (currentPage) params.append('page', currentPage);

      // Update URL
      setSearchParams(params);

      const response = await fetch(`http://localhost:5001/api/search?${params}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Search failed');
        setResults([]);
        setPagination(null);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search');
      setResults([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    performSearch();
  };

  const clearFilters = () => {
    setQuery('');
    setType('all');
    setLocation('');
    setVenueType('');
    setEventType('');
    setDateFrom('');
    setDateTo('');
    setMinCost('');
    setMaxCost('');
    setSortBy('name');
    setSortOrder('ASC');
    setCurrentPage(1);
    setResults([]);
    setPagination(null);
    setSearchParams({});
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Not specified';
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return timeString.slice(0, 5);
  };

  const formatCost = (cost) => {
    if (!cost || cost === 0) return 'Free';
    return `$${parseFloat(cost).toFixed(2)}`;
  };

  const renderResultCard = (item) => {
    const isVenue = item.result_type === 'venue';
    
    return (
      <div key={`${item.result_type}-${item.venue_id || item.event_id}`} className="result-card">
        <div className="result-image">
          {item.flyer_image_path ? (
            <img src={item.flyer_image_path} alt={item.name} />
          ) : (
            <div className="placeholder-image">
              <span>{isVenue ? '🏢' : '🎉'}</span>
              <p>{isVenue ? item.venue_type : item.event_type}</p>
            </div>
          )}
          <div className="result-type-badge">
            {isVenue ? 'Venue' : 'Event'}
          </div>
        </div>
        
        <div className="result-content">
          <h3>{item.name}</h3>
          
          <div className="result-details">
            <p className="location">
              📍 {isVenue ? item.address : item.venue_location}
            </p>
            
            <p className="type">
              🏷️ {isVenue ? item.venue_type : item.event_type}
            </p>
            
            {!isVenue && (
              <p className="event-date">
                📅 {formatDateTime(item.start_datetime)}
                {item.end_datetime && ` - ${formatDateTime(item.end_datetime)}`}
              </p>
            )}
            
            {isVenue && (
              <p className="venue-hours">
                🕒 {formatTime(item.opening_time)} - {formatTime(item.closing_time)}
              </p>
            )}
            
            <p className="cost">
              💰 {formatCost(item.cost)}
            </p>
            
            {item.description && (
              <p className="description">{item.description}</p>
            )}
            
            {isVenue && item.status_text && (
              <span className={`status ${item.status_text}`}>
                {item.status_text}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFeaturedContent = () => {
    if (!featuredContent) return null;

    return (
      <div className="featured-section">
        <h2>✨ Featured Venues & Upcoming Events</h2>
        
        {featuredContent.featured_venues.length > 0 && (
          <div className="featured-category">
            <h3> Featured Venues</h3>
            <div className="featured-grid">
              {featuredContent.featured_venues.map(venue => renderResultCard(venue))}
            </div>
          </div>
        )}
        
        {featuredContent.upcoming_events.length > 0 && (
          <div className="featured-category">
            <h3>Upcoming Events</h3>
            <div className="featured-grid">
              {featuredContent.upcoming_events.map(event => renderResultCard(event))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="search-page">
      {/* Header */}
      <header className="search-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            Yaad Quest
          </div>
          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/explore">Explore</a>
            <a href="/search" className="active">Search</a>
            <a href="/about">About</a>
          </nav>
        </div>
      </header>

      {/* Search Form */}
      <div className="search-container">
        <div className="search-form-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="main-search">
              <input
                type="text"
                placeholder="Search venues, events, locations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button" disabled={loading}>
                {loading ? '🔄' : '🔍'} Search
              </button>
            </div>

            <div className="search-controls">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="filter-toggle"
              >
                Filters {showFilters ? '▲' : '▼'}
              </button>
              
              <button
                type="button"
                onClick={clearFilters}
                className="clear-button"
              >
                 Clear All
              </button>
            </div>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filter-grid">
                <div className="filter-group">
                  <label>Type:</label>
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="all">All</option>
                    <option value="venues">Venues Only</option>
                    <option value="events">Events Only</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Location:</label>
                  <select value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option value="">Any Location</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Venue Type:</label>
                  <select value={venueType} onChange={(e) => setVenueType(e.target.value)}>
                    <option value="">Any Venue Type</option>
                    {venueTypes.map(vType => (
                      <option key={vType} value={vType}>{vType}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Event Type:</label>
                  <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                    <option value="">Any Event Type</option>
                    {eventTypes.map(eType => (
                      <option key={eType} value={eType}>{eType}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Date From:</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>Date To:</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>Min Cost ($):</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minCost}
                    onChange={(e) => setMinCost(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="filter-group">
                  <label>Max Cost ($):</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={maxCost}
                    onChange={(e) => setMaxCost(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="filter-group">
                  <label>Sort By:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="cost">Cost</option>
                    <option value="date">Date</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Order:</label>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="results-container">
        {error && (
          <div className="error-message">
             {error}
          </div>
        )}

        {loading && (
          <div className="loading-message">
            Searching...
          </div>
        )}

        {!hasSearchQuery() && !loading && renderFeaturedContent()}

        {hasSearchQuery() && results.length > 0 && (
          <div className="search-results">
            <div className="results-header">
              <h2>
                Found {pagination?.total_results} result{pagination?.total_results !== 1 ? 's' : ''}
              </h2>
              <p>
                Page {pagination?.current_page} of {pagination?.total_pages}
              </p>
            </div>

            <div className="results-grid">
              {results.map(renderResultCard)}
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.has_prev}
                  className="page-button"
                >
                  ← Previous
                </button>

                <span className="page-info">
                  Page {pagination.current_page} of {pagination.total_pages}
                </span>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.has_next}
                  className="page-button"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}

        {hasSearchQuery() && results.length === 0 && !loading && (
          <div className="no-results">
            <h2>🔍 No Results Found</h2>
            <p>Try adjusting your search terms or filters</p>
            <button onClick={clearFilters} className="clear-button">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;