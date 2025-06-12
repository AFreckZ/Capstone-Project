import React, { useState } from 'react';
import '../css/TouristPreferences.css';
import beachImg from '../images/beach2.jpg';
import natureImg from '../images/bluemountain.jpg';
import cultureImg from '../images/halfwaytree.jpg';
import adventureImg from '../images/mysticmountain.png';
import foodImg from '../images/patty.png';
import musicImg from '../images/bobmarley.jpg';
import shoppingImg from '../images/craftmarket.png';
import nightlifeImg from '../images/party.png';
import wellnessImg from '../images/spa.jpg';

const TouristPreferencesForm = () => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [userInfo, setUserInfo] = useState({
    budget: '',
    currency: 'USD',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    parish: '',
    accommodation: '',
    groupSize: '',
    preferredDays: [] // NEW: Array to store preferred days
  });

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'JMD', symbol: 'J$', name: 'Jamaican Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ];

  // NEW: Days of the week for activity preferences
  const daysOfWeek = [
    { id: 'monday', name: 'Monday', short: 'Mon', emoji: '💼' },
    { id: 'tuesday', name: 'Tuesday', short: 'Tue', emoji: '🌟' },
    { id: 'wednesday', name: 'Wednesday', short: 'Wed', emoji: '⚡' },
    { id: 'thursday', name: 'Thursday', short: 'Thu', emoji: '🚀' },
    { id: 'friday', name: 'Friday', short: 'Fri', emoji: '🎉' },
    { id: 'saturday', name: 'Saturday', short: 'Sat', emoji: '🌴' },
    { id: 'sunday', name: 'Sunday', short: 'Sun', emoji: '☀️' }
  ];

  const getCurrencySymbol = (currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '$';
  };

  // UPDATED: Added weights and tags for itinerary integration
  const preferenceCategories = [
    { 
      id: 'beaches', 
      name: 'Pristine Beaches', 
      description: 'Crystal clear waters and pristine white sand beaches',
      image: beachImg,
      weight: 10,
      tags: ['beach', 'water sports', 'relaxation', 'swimming']
    },
    { 
      id: 'nature', 
      name: 'Nature & Wildlife', 
      description: 'Lush rainforests, cascading waterfalls, and exotic wildlife',
      image: natureImg,
      weight: 9,
      tags: ['nature', 'hiking', 'wildlife', 'outdoor adventure', 'waterfalls']
    },
    { 
      id: 'culture', 
      name: 'Cultural Heritage', 
      description: 'Rich history, museums, and cultural landmarks',
      image: cultureImg,
      weight: 8,
      tags: ['culture', 'history', 'museum', 'heritage', 'historical site']
    },
    { 
      id: 'adventure', 
      name: 'Adventure Sports', 
      description: 'Thrilling zip-lines, diving, and extreme sports',
      image: adventureImg,
      weight: 7,
      tags: ['adventure', 'extreme sports', 'zip-line', 'diving', 'outdoor adventure']
    },
    { 
      id: 'food', 
      name: 'Culinary Journey', 
      description: 'Authentic jerk cuisine and local delicacies',
      image: foodImg,
      weight: 6,
      tags: ['food', 'dining', 'local cuisine', 'jerk chicken', 'restaurant']
    },
    { 
      id: 'music', 
      name: 'Music & Festivals', 
      description: 'Reggae rhythms and vibrant cultural festivals',
      image: musicImg,
      weight: 5,
      tags: ['music', 'festival', 'reggae', 'entertainment', 'live music']
    },
    { 
      id: 'shopping', 
      name: 'Local Markets', 
      description: 'Artisan crafts and bustling local markets',
      image: shoppingImg,
      weight: 4,
      tags: ['shopping', 'market', 'crafts', 'souvenirs', 'local market']
    },
    { 
      id: 'nightlife', 
      name: 'Vibrant Nightlife', 
      description: 'Exciting bars, clubs, and evening entertainment',
      image: nightlifeImg,
      weight: 3,
      tags: ['nightlife', 'bars', 'clubs', 'party', 'entertainment']
    },
    { 
      id: 'wellness', 
      name: 'Wellness & Spa', 
      description: 'Rejuvenating spas and peaceful relaxation',
      image: wellnessImg,
      weight: 2,
      tags: ['wellness', 'spa', 'relaxation', 'massage', 'health']
    }
  ];

  const jamaicaParishes = [
    'Kingston',
    'St. Andrew',
    'St. Thomas',
    'Portland',
    'St. Mary',
    'St. Ann',
    'Trelawny',
    'St. James',
    'Hanover',
    'Westmoreland',
    'St. Elizabeth',
    'Manchester',
    'Clarendon',
    'St. Catherine'
  ];

  const togglePreference = (preferenceId) => {
    setSelectedPreferences(prev => {
      const currentIndex = prev.indexOf(preferenceId);
      
      if (currentIndex === -1) {
        return [...prev, preferenceId];
      } else {
        return prev.filter(id => id !== preferenceId);
      }
    });
  };

  // NEW: Function to toggle preferred days
  const togglePreferredDay = (dayId) => {
    setUserInfo(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(dayId)
        ? prev.preferredDays.filter(id => id !== dayId)
        : [...prev.preferredDays, dayId]
    }));
    
    // Clear error when user makes changes
    if (error) setError(null);
  };

  const getPreferenceRank = (preferenceId) => {
    const index = selectedPreferences.indexOf(preferenceId);
    return index === -1 ? null : index + 1;
  };

  const handleUserInfoChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
    // NEW: Clear error when user makes changes
    if (error) setError(null);
  };

  const calculateDuration = () => {
    if (userInfo.startDate && userInfo.endDate) {
      const start = new Date(userInfo.startDate);
      const end = new Date(userInfo.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const formatDate = (dateString, timeString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    let formatted = date.toLocaleDateString('en-US', options);
    if (timeString) {
      formatted += ` at ${timeString}`;
    }
    return formatted;
  };

  // NEW: Function to format preferred days for display
  const formatPreferredDays = () => {
    if (userInfo.preferredDays.length === 0) return 'Any day';
    if (userInfo.preferredDays.length === 7) return 'Every day';
    
    const dayNames = userInfo.preferredDays
      .map(dayId => daysOfWeek.find(d => d.id === dayId)?.short)
      .filter(Boolean)
      .join(', ');
    
    return dayNames;
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  
  const handleSubmit = async () => {
    // Basic validation
    if (selectedPreferences.length === 0) {
      setError('Please select at least one preference');
      return;
    }
    if (!userInfo.budget || !userInfo.startDate || !userInfo.endDate || !userInfo.groupSize) {
      setError('Please fill in all required fields (budget, dates, and group size)');
      return;
    }
    if (new Date(userInfo.startDate) >= new Date(userInfo.endDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      
      const duration = calculateDuration();

      // Format data for the backend 
      const preferencesData = {
        userId: 1, // You can get this from your auth system
        preferences: selectedPreferences,
        budget: parseFloat(userInfo.budget),
        currency: userInfo.currency,
        duration: duration,
        startDate: userInfo.startDate,
        startTime: userInfo.startTime || '09:00',
        endDate: userInfo.endDate,
        endTime: userInfo.endTime || '18:00',
        parish: userInfo.parish,
        accommodation: userInfo.accommodation,
        groupSize: parseInt(userInfo.groupSize),
        preferredDays: userInfo.preferredDays // NEW: Include preferred days
      };

      console.log('Saving preferences:', preferencesData);

      // Save preferences to your existing backend
      const response = await fetch('http://localhost:5001/preferences/save-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferencesData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Preferences saved:', result);

        
        
        // Method 1: Save to localStorage 
        localStorage.setItem('touristPreferences', JSON.stringify(preferencesData));
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('selectedPreferences', JSON.stringify(selectedPreferences));
        
        // Method 2: Save to sessionStorage (alternative)
        sessionStorage.setItem('touristPreferences', JSON.stringify(preferencesData));
        
        // Method 3: Set global window variable (if needed)
        window.touristData = {
          preferences: preferencesData,
          userInfo: userInfo,
          selectedPreferences: selectedPreferences
        };

        // Show success message
        alert('Preferences saved! Redirecting to itinerary planner...');
        
        
        setTimeout(() => {
          window.location.href = '/itinerarygen'; // Change this to your actual itinerary page path
        }, 1000);
        
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Sorry, there was an error saving your preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="tourist-preferences-main">
            <div className="tourist-preferences-hero">
              <h1 className="tourist-preferences-hero-title">
                Discover Your
                <span className="tourist-preferences-gradient-text">
                  Perfect Jamaica
                </span>
              </h1>
              <p className="tourist-preferences-hero-subtitle">
                Select your interests and let us craft a personalized journey through paradise. 
                Rank them by priority to get the perfect recommendations.
              </p>
            </div>
            
            <div className="tourist-preferences-grid">
              {preferenceCategories.map(category => {
                const rank = getPreferenceRank(category.id);
                const isSelected = rank !== null;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => togglePreference(category.id)}
                    className={`tourist-preferences-card ${isSelected ? 'selected' : ''}`}
                  >
                    {isSelected && (
                      <div className="tourist-preferences-rank-badge">
                        #{rank}
                      </div>
                    )}
                    
                    <div className="tourist-preferences-card-content">
                      <div className="tourist-preferences-card-image">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="tourist-preferences-card-gif"
                        />
                      </div>
                      <div className="tourist-preferences-card-info">
                        <h3 className="tourist-preferences-card-title">{category.name}</h3>
                        <p className="tourist-preferences-card-description">{category.description}</p>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="tourist-preferences-priority-badge">
                        Priority #{rank}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="tourist-preferences-stats">
              <div className="tourist-preferences-stats-container">
                <div className="tourist-preferences-stats-item">
                  <div className="tourist-preferences-stats-dot"></div>
                  <span className="tourist-preferences-stats-text">
                    {selectedPreferences.length} {selectedPreferences.length === 1 ? 'Experience' : 'Experiences'} Selected
                  </span>
                </div>
                {selectedPreferences.length > 0 && (
                  <div className="tourist-preferences-stats-subtext">
                    ✨ Perfectly ranked for you
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="tourist-preferences-main">
            <div className="tourist-preferences-hero">
              <h1 className="tourist-preferences-hero-title">
                Plan Your
                <span className="tourist-preferences-gradient-text">
                  Perfect Journey
                </span>
              </h1>
              <p className="tourist-preferences-hero-subtitle">
                Tell us about your travel style and we'll customize every detail to perfection
              </p>
            </div>

            <div className="tourist-preferences-forms-container">
              
              {/* Budget Input */}
              <div className="tourist-preferences-glass-container">
                <div className="tourist-preferences-section-header">
                  <h3>Your Travel Budget *</h3>
                  <p>Enter your daily budget per person</p>
                </div>
                
                <div className="tourist-preferences-budget-input-container">
                  <div className="tourist-preferences-budget-icon-display">💰</div>
                  <div className="tourist-preferences-currency-row">
                    <div className="tourist-preferences-currency-select-wrapper">
                      <select
                        value={userInfo.currency}
                        onChange={(e) => handleUserInfoChange('currency', e.target.value)}
                        className="tourist-preferences-currency-select"
                      >
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} ({currency.symbol})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="tourist-preferences-currency-input-wrapper">
                      <span className="tourist-preferences-currency-symbol">
                        {getCurrencySymbol(userInfo.currency)}
                      </span>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={userInfo.budget}
                        onChange={(e) => handleUserInfoChange('budget', e.target.value)}
                        className="tourist-preferences-budget-input"
                        min="0"
                        step="10"
                        required
                      />
                    </div>
                  </div>
                  <p className="tourist-preferences-budget-help">
                    This helps us recommend experiences within your comfort zone
                  </p>
                </div>
              </div>

              {/* Travel Dates */}
              <div className="tourist-preferences-glass-container">
                <div className="tourist-preferences-section-header">
                  <h3>Travel Dates & Times *</h3>
                  <p>When will you arrive and depart?</p>
                </div>
                
                <div className="tourist-preferences-date-inputs-grid">
                  <div className="tourist-preferences-date-input-group">
                    <label className="tourist-preferences-input-label">Arrival Date *</label>
                    <input
                      type="date"
                      value={userInfo.startDate}
                      onChange={(e) => handleUserInfoChange('startDate', e.target.value)}
                      className="tourist-preferences-date-input"
                      required
                    />
                    <label className="tourist-preferences-input-label" style={{marginTop: '1rem'}}>Arrival Time</label>
                    <input
                      type="time"
                      value={userInfo.startTime}
                      onChange={(e) => handleUserInfoChange('startTime', e.target.value)}
                      className="tourist-preferences-time-input"
                    />
                  </div>
                  
                  <div className="tourist-preferences-date-input-group">
                    <label className="tourist-preferences-input-label">Departure Date *</label>
                    <input
                      type="date"
                      value={userInfo.endDate}
                      onChange={(e) => handleUserInfoChange('endDate', e.target.value)}
                      className="tourist-preferences-date-input"
                      min={userInfo.startDate}
                      required
                    />
                    <label className="tourist-preferences-input-label" style={{marginTop: '1rem'}}>Departure Time</label>
                    <input
                      type="time"
                      value={userInfo.endTime}
                      onChange={(e) => handleUserInfoChange('endTime', e.target.value)}
                      className="tourist-preferences-time-input"
                    />
                  </div>
                </div>
                
                {calculateDuration() > 0 && (
                  <div className="tourist-preferences-duration-info">
                    <p className="tourist-preferences-duration-display">
                      Total Duration: <span className="tourist-preferences-duration-days">{calculateDuration()} days</span>
                    </p>
                  </div>
                )}
              </div>

              {/* NEW: Preferred Activity Days */}
              <div className="tourist-preferences-glass-container">
                <div className="tourist-preferences-section-header">
                  <h3>Preferred Activity Days</h3>
                  <p>Which days of the week do you prefer for activities and tours?</p>
                </div>
                
                <div className="tourist-preferences-days-grid">
                  {daysOfWeek.map(day => {
                    const isSelected = userInfo.preferredDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        onClick={() => togglePreferredDay(day.id)}
                        className={`tourist-preferences-day-button ${isSelected ? 'selected' : ''}`}
                        type="button"
                      >
                        <div className="tourist-preferences-day-emoji">{day.emoji}</div>
                        <div className="tourist-preferences-day-name">{day.name}</div>
                        <div className="tourist-preferences-day-short">{day.short}</div>
                        {isSelected && (
                          <div className="tourist-preferences-day-checkmark">✓</div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <div className="tourist-preferences-days-help">
                  <p>
                    💡 <strong>Pro tip:</strong> Select multiple days for more flexible scheduling. 
                    {userInfo.preferredDays.length === 0 && " We'll assume you're available any day if nothing is selected."}
                    {userInfo.preferredDays.length > 0 && ` You've selected ${userInfo.preferredDays.length} day${userInfo.preferredDays.length === 1 ? '' : 's'}.`}
                  </p>
                </div>
              </div>

              {/* Location Info */}
              <div className="tourist-preferences-glass-container">
                <div className="tourist-preferences-section-header">
                  <h3>Where Will You Stay?</h3>
                  <p>Select your parish and accommodation</p>
                </div>
                
                <div>
                  <label className="tourist-preferences-input-label">Select Parish</label>
                  <select
                    value={userInfo.parish}
                    onChange={(e) => handleUserInfoChange('parish', e.target.value)}
                    className="tourist-preferences-parish-select"
                  >
                    <option value="">Choose a parish...</option>
                    {jamaicaParishes.map(parish => (
                      <option key={parish} value={parish}>{parish}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    placeholder="Hotel/Resort/Accommodation name"
                    value={userInfo.accommodation}
                    onChange={(e) => handleUserInfoChange('accommodation', e.target.value)}
                    className="tourist-preferences-accommodation-input"
                  />
                </div>
              </div>

              {/* Group Size */}
              <div className="tourist-preferences-glass-container">
                <div className="tourist-preferences-section-header">
                  <h3>Group Size *</h3>
                  <p>Who's joining the adventure?</p>
                </div>
                
                <div className="tourist-preferences-group-size">
                  <div className="tourist-preferences-group-image">
                    <img 
                      src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXoxY25tdzQyZTRycDE0a3lmbDhwbWZmZmE4bmE2dnRremx5ZHdycCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UD40IQwpdvOegzsq4c/giphy.gif" 
                      alt="Group of people"
                      className="tourist-preferences-group-gif"
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Number of travelers"
                    value={userInfo.groupSize}
                    onChange={(e) => handleUserInfoChange('groupSize', e.target.value)}
                    className="tourist-preferences-input"
                    min="1"
                    max="50"
                    required
                  />
                  <p className="tourist-preferences-input-help">Perfect for solo trips to group adventures</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="tourist-preferences-main">
            <div className="tourist-preferences-hero">
              <h1 className="tourist-preferences-hero-title">
                Your Journey
                <span className="tourist-preferences-gradient-text">
                  Awaits
                </span>
              </h1>
              <p className="tourist-preferences-hero-subtitle">
                Everything looks perfect! Your personalized Jamaican adventure is ready to begin.
              </p>
            </div>

            <div className="tourist-preferences-review-grid">
              
              {/* Priorities */}
              <div className="tourist-preferences-glass-container">
                <div className="tourist-preferences-review-header">
                  <span className="tourist-preferences-review-icon">🏆</span>
                  <div>
                    <h3 className="tourist-preferences-review-title">Your Priorities</h3>
                    <p className="tourist-preferences-review-subtitle">Perfectly ranked experiences</p>
                  </div>
                </div>
                
                {selectedPreferences.length > 0 ? (
                  <div className="tourist-preferences-priority-list">
                    {selectedPreferences.slice(0, 5).map((prefId, index) => {
                      const pref = preferenceCategories.find(p => p.id === prefId);
                      return (
                        <div key={prefId} className="tourist-preferences-priority-item">
                          <div className="tourist-preferences-priority-number">
                            {index + 1}
                          </div>
                          <div className="tourist-preferences-priority-image">
                            <img 
                              src={pref.image} 
                              alt={pref.name}
                              className="tourist-preferences-priority-gif"
                            />
                          </div>
                          <div className="tourist-preferences-priority-info">
                            <div className="tourist-preferences-priority-name">{pref.name}</div>
                            <div className="tourist-preferences-priority-desc">Top priority experience</div>
                          </div>
                        </div>
                      );
                    })}
                    {selectedPreferences.length > 5 && (
                      <div className="tourist-preferences-priority-more">
                        + {selectedPreferences.length - 5} more experiences
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="tourist-preferences-no-preferences">No preferences selected</p>
                )}
              </div>

              {/* Trip Summary */}
              <div className="tourist-preferences-glass-container">
                <div className="tourist-preferences-review-header">
                  <span className="tourist-preferences-review-icon">📋</span>
                  <div>
                    <h3 className="tourist-preferences-review-title">Trip Summary</h3>
                    <p className="tourist-preferences-review-subtitle">Your perfect getaway details</p>
                  </div>
                </div>
                
                <div className="tourist-preferences-summary-list">
                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span className="tourist-preferences-summary-icon">💰</span>
                      <span>Daily Budget</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {getCurrencySymbol(userInfo.currency)}{userInfo.budget || '0'} {userInfo.currency} per person
                    </span>
                  </div>
                  
                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span className="tourist-preferences-summary-icon">📅</span>
                      <span>Travel Dates</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {userInfo.startDate ? `${formatDate(userInfo.startDate, userInfo.startTime)} - ${formatDate(userInfo.endDate, userInfo.endTime)}` : 'Not selected'}
                    </span>
                  </div>
                  
                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span className="tourist-preferences-summary-icon">⏰</span>
                      <span>Duration</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {calculateDuration() || 0} days
                    </span>
                  </div>

                  {/* NEW: Preferred Days Summary */}
                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span className="tourist-preferences-summary-icon">📆</span>
                      <span>Preferred Activity Days</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {formatPreferredDays()}
                    </span>
                  </div>
                  
                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span className="tourist-preferences-summary-icon">📍</span>
                      <span>Location</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {userInfo.parish || 'Not selected'}
                    </span>
                  </div>
                  
                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span className="tourist-preferences-summary-icon">🏨</span>
                      <span>Accommodation</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {userInfo.accommodation || 'Not specified'}
                    </span>
                  </div>
                  
                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span className="tourist-preferences-summary-icon">👥</span>
                      <span>Travelers</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {userInfo.groupSize || '0'} {userInfo.groupSize === '1' ? 'Person' : 'People'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* NEW: Error Display */}
            {error && (
              <div className="tourist-preferences-error-message">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="tourist-preferences-container">
      
      {/* Header */}
      <header className="tourist-preferences-header">
        <div className="tourist-preferences-header-content">
          <div className="tourist-preferences-brand">
            <span className="tourist-preferences-brand-text">Yaad Quest</span>
          </div>
          
          <nav className="tourist-preferences-nav">
            <a href="#" className="tourist-preferences-nav-link">Home</a>
            <a href="#" className="tourist-preferences-nav-link">Explore</a>
            <a href="#" className="tourist-preferences-nav-link">Activities</a>
            <a href="#" className="tourist-preferences-nav-link">About Us</a>
            <a href="#" className="tourist-preferences-nav-link">Contact</a>
          </nav>
          
          <div className="tourist-preferences-avatar"></div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="tourist-preferences-progress-section">
        <div className="tourist-preferences-progress">
          <div className="tourist-preferences-progress-bar">
            {[1, 2, 3].map((step, index) => (
              <div key={step} className="tourist-preferences-progress-step">
                <div className={`tourist-preferences-progress-circle ${step <= currentStep ? 'active' : 'inactive'}`}>
                  {step < currentStep ? '✓' : step}
                </div>
                {index < 2 && (
                  <div className={`tourist-preferences-progress-line ${step < currentStep ? 'active' : 'inactive'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="tourist-preferences-progress-labels">
            <span>Discover</span>
            <span>Customize</span>
            <span>Confirm</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="tourist-preferences-content">
        <div className="tourist-preferences-content-wrapper">
          {getStepContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="tourist-preferences-navigation">
        <button
          onClick={prevStep}
          disabled={currentStep === 1 || loading}
          className={`tourist-preferences-nav-button ${currentStep === 1 || loading ? 'disabled' : 'secondary'}`}
        >
          <span>←</span>
          <span>Previous</span>
        </button>

        <div className="tourist-preferences-step-indicator">
          <div className="tourist-preferences-step-dot"></div>
          <span className="tourist-preferences-step-text">Step {currentStep} of 3</span>
        </div>

        {currentStep < 3 ? (
          <button
            onClick={nextStep}
            disabled={(currentStep === 1 && selectedPreferences.length === 0) || loading}
            className={`tourist-preferences-nav-button ${(currentStep === 1 && selectedPreferences.length === 0) || loading ? 'disabled' : 'primary'}`}
          >
            <span>Continue</span>
            <span>→</span>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="tourist-preferences-nav-button submit"
          >
            <span>{loading ? 'Saving & Redirecting...' : 'Start My Journey'}</span>
            <span>{loading ? '⏳' : '🚀'}</span>
          </button>
        )}
      </div>

      {/* NEW: Loading Overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #ff5b7f',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem auto'
            }}></div>
            <h3>Saving Your Preferences</h3>
            <p>Preparing your personalized Jamaica experience...</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="tourist-preferences-footer">
        <div className="tourist-preferences-footer-content">
          <div className="tourist-preferences-footer-section">
            <div className="tourist-preferences-footer-logo">Yaad Quest</div>
          </div>
          <div className="tourist-preferences-footer-section">
            <h3>Company</h3>
            <p>About Us</p>
            <h3>Contact</h3>
            <p>Email</p>
          </div>
          <div className="tourist-preferences-footer-section">
            <h3>Further</h3>
            <p>Events</p>
            <p>Experiences</p>
            <div className="tourist-preferences-footer-icons">
              <div className="tourist-preferences-footer-icon"></div>
              <div className="tourist-preferences-store-badge">Google Play</div>
              <div className="tourist-preferences-store-badge">App Store</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TouristPreferencesForm;