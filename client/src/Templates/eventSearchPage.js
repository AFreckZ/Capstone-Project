import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MapPin, Calendar, DollarSign, Clock, Users } from 'lucide-react';

const EventSearchPage = () => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    location: '',
    eventType: 'all',
    dateFrom: '',
    dateTo: '',
    minCost: '',
    maxCost: '',
    sortBy: 'start_datetime',
    sortOrder: 'ASC'
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    eventTypes: [],
    locations: [],
    costRange: { min_cost: 0, max_cost: 10000 }
  });

  // Load filter options on component mount
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Load available filter options
  const loadFilterOptions = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/search/filters');
      const data = await response.json();
      setFilterOptions(data);
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  // Debounced search function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Get search suggestions
  const getSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5001/api/search/suggestions?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    }
  };

  const debouncedGetSuggestions = useCallback(debounce(getSuggestions, 300), []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedGetSuggestions(value);
    setShowSuggestions(true);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.suggestion);
    setShowSuggestions(false);
    performSearch(suggestion.suggestion, filters, 1);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (searchQuery || Object.values(newFilters).some(v => v !== '' && v !== 'all')) {
      performSearch(searchQuery, newFilters, 1);
    }
  };

  // Perform search
  const performSearch = async (query = searchQuery, searchFilters = filters, page = currentPage) => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      
      if (query) params.append('query', query);
      if (searchFilters.location) params.append('location', searchFilters.location);
      if (searchFilters.eventType !== 'all') params.append('eventType', searchFilters.eventType);
      if (searchFilters.dateFrom) params.append('dateFrom', searchFilters.dateFrom);
      if (searchFilters.dateTo) params.append('dateTo', searchFilters.dateTo);
      if (searchFilters.minCost) params.append('minCost', searchFilters.minCost);
      if (searchFilters.maxCost) params.append('maxCost', searchFilters.maxCost);
      params.append('sortBy', searchFilters.sortBy);
      params.append('sortOrder', searchFilters.sortOrder);
      params.append('page', page);
      params.append('limit', 12);

      const response = await fetch(`http://localhost:5001/api/search/events?${params.toString()}`);
      const data = await response.json();
      
      setSearchResults(data.events);
      setPagination(data.pagination);
      setCurrentPage(page);
      
    } catch (error) {
      setError('Failed to search events. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    performSearch();
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      location: '',
      eventType: 'all',
      dateFrom: '',
      dateTo: '',
      minCost: '',
      maxCost: '',
      sortBy: 'start_datetime',
      sortOrder: 'ASC'
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    setSearchResults([]);
    setPagination({});
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Events & Venues in Jamaica
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing events happening near you
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(e);
                  }
                }}
                placeholder="Search for events, venues, or activities..."
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSearchSubmit}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    {suggestion.type === 'event' ? (
                      <Calendar className="w-4 h-4 text-blue-500 mr-3" />
                    ) : (
                      <MapPin className="w-4 h-4 text-green-500 mr-3" />
                    )}
                    <span className="text-gray-800">{suggestion.suggestion}</span>
                    <span className="ml-auto text-xs text-gray-500 capitalize">
                      {suggestion.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter Toggle & Controls */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {Object.values(filters).some(v => v !== '' && v !== 'all') && (
              <span className="ml-2 bg-blue-600 text-white rounded-full w-2 h-2"></span>
            )}
          </button>
          
          {searchResults.length > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {pagination.totalEvents} events found
              </span>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="start_datetime-ASC">Date: Earliest First</option>
                <option value="start_datetime-DESC">Date: Latest First</option>
                <option value="name-ASC">Name: A-Z</option>
                <option value="name-DESC">Name: Z-A</option>
                <option value="cost-ASC">Price: Low to High</option>
                <option value="cost-DESC">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="Enter location..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Event Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  value={filters.eventType}
                  onChange={(e) => handleFilterChange('eventType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">All Types</option>
                  {filterOptions.eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} ({type.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min={filters.dateFrom || new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Min Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Cost (JMD)
                </label>
                <input
                  type="number"
                  value={filters.minCost}
                  onChange={(e) => handleFilterChange('minCost', e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Max Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Cost (JMD)
                </label>
                <input
                  type="number"
                  value={filters.maxCost}
                  onChange={(e) => handleFilterChange('maxCost', e.target.value)}
                  placeholder="10000"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 px-4 py-2"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Searching events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && searchResults.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {searchResults.map((event) => (
                <div key={event.event_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Event Image */}
                  {event.flyer_image_path && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={`http://localhost:5001${event.flyer_image_path}`}
                        alt={event.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Event Type Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                        {event.event_type}
                      </span>
                      {event.formatted_cost && (
                        <span className="text-green-600 font-semibold">
                          {event.formatted_cost}
                        </span>
                      )}
                    </div>

                    {/* Event Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {event.name}
                    </h3>

                    {/* Event Description */}
                    {event.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    {/* Event Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(event.formatted_start)}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.venue_location}</span>
                      </div>

                      {event.business_name && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Users className="w-4 h-4 mr-2" />
                          <span>By {event.business_name}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => performSearch(searchQuery, filters, currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => performSearch(searchQuery, filters, currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && searchResults.length === 0 && (searchQuery || Object.values(filters).some(v => v !== '' && v !== 'all')) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all upcoming events.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Initial State */}
        {!loading && searchResults.length === 0 && !searchQuery && Object.values(filters).every(v => v === '' || v === 'all') && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Start your search
            </h3>
            <p className="text-gray-600">
              Search for events by name, location, or browse by category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSearchPage;