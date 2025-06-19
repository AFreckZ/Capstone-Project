
// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import '../css/TouristPreferences.css';
// import JamaicanAddressForm from "./JamaicanAddressForm";
// import beachImg from '../images/beach2.jpg';
// import natureImg from '../images/bluemountain.jpg';
// import cultureImg from '../images/halfwaytree.jpg';
// import adventureImg from '../images/mysticmountain.png';
// import foodImg from '../images/patty.png';
// import musicImg from '../images/bobmarley.jpg';
// import shoppingImg from '../images/craftmarket.png';
// import nightlifeImg from '../images/party.png';
// import wellnessImg from '../images/spa.jpg';
// import foreigncuisine from '../images/foreigncuisine.jpeg';

// const TouristPreferencesForm = () => {
//   // Add useAuth hook to get current user data
//   const { user, userId, isAuthenticated, getAuthHeaders } = useAuth();
//   const [selectedPreferences, setSelectedPreferences] = useState([]);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [success, setSuccess] = useState(null);
//   const [convertedAmount, setConvertedAmount] = useState(0);
  
//   const [userInfo, setUserInfo] = useState({
//     budget: '',
//     currency: 'USD',
//     startDate: '',
//     startTime: '',
//     endDate: '',
//     endTime: '',
//     parish: '',
//     accommodation: '',
//     groupSize: '',
//     preferredDays: [],
//     preferredStartTime: '09:00', // NEW: Simple start time
//     preferredEndTime: '17:00'   // NEW: Simple end time
//   });

//   const currencies = [
//     { code: 'USD', symbol: '$', name: 'US Dollar' },
//     { code: 'JMD', symbol: 'J$', name: 'Jamaican Dollar' },
//     { code: 'EUR', symbol: '€', name: 'Euro' },
//     { code: 'GBP', symbol: '£', name: 'British Pound' },
//     { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
//     { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
//     { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
//     { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
//     { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
//     { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
//   ];
//   const currencyToJMD = {
//     'USD': 157.50,  // 1 USD = 157.50 JMD (approximate)
//     'JMD': 1.00,    // 1 JMD = 1 JMD
//     'EUR': 172.30,  // 1 EUR = 172.30 JMD (approximate)
//     'GBP': 200.45,  // 1 GBP = 200.45 JMD (approximate)
//     'CAD': 116.25,  // 1 CAD = 116.25 JMD (approximate)
//     'AUD': 102.80,  // 1 AUD = 102.80 JMD (approximate)
//     'CHF': 175.90,  // 1 CHF = 175.90 JMD (approximate)
//     'JPY': 1.05,    // 1 JPY = 1.05 JMD (approximate)
//     'CNY': 21.75,   // 1 CNY = 21.75 JMD (approximate)
//     'INR': 1.88     // 1 INR = 1.88 JMD (approximate)
//   };
//   // Preference categories without fixed weights - weights calculated dynamically
//   const preferenceCategories = [
//     { 
//       id: 'beaches', 
//       name: 'Pristine Beaches', 
//       description: 'Crystal clear waters and pristine white sand beaches',
//       image: beachImg,
//       tags: ['Beach/River', 'beach', 'river' ]
//     },
//     { 
//       id: 'nature', 
//       name: 'Nature & Wildlife', 
//       description: 'Lush rainforests, cascading waterfalls, and exotic wildlife',
//       image: natureImg,
//       tags: ['outdoor adventure', 'nature']
//     },
//     { 
//       id: 'culture', 
//       name: 'Cultural Heritage', 
//       description: 'Rich history, museums, and cultural landmarks',
//       image: cultureImg,
//       tags: ['culture', 'history', 'museum', 'heritage', 'historical site']
//     },
//     { 
//       id: 'adventure', 
//       name: 'Adventure Sports', 
//       description: 'Thrilling zip-lines, diving, and extreme sports',
//       image: adventureImg,
//       tags: ['adventure', 'extreme sports', 'zip-line', 'diving', 'outdoor adventure']
//     },
//     { 
//       id: 'food', 
//       name: 'Local Cuisine', 
//       description: 'Authentic jerk cuisine and local delicacies',
//       image: foodImg,
//       tags: ['food', 'dining', 'local cuisine', 'jerk chicken', 'restaurant']
//     },
//     { 
//       id: 'music', 
//       name: 'Music & Festivals', 
//       description: 'Reggae rhythms and vibrant cultural festivals',
//       image: musicImg,
//       tags: ['concert','live music', 'festival']
//     },
//     { 
//       id: 'shopping', 
//       name: 'Local Markets', 
//       description: 'Artisan crafts and bustling local markets',
//       image: shoppingImg,
//       tags: ['shopping', 'market', 'crafts', 'souvenirs', 'local market']
//     },
//     { 
//       id: 'nightlife', 
//       name: 'Vibrant Nightlife', 
//       description: 'Exciting bars, clubs, and evening entertainment',
//       image: nightlifeImg,
//       tags: ['bars', 'clubs', 'party', 'entertainment', 'Bar/Club/Party']
//     },
//     // { 
//     //   id: 'wellness', 
//     //   name: 'Wellness & Spa', 
//     //   description: 'Rejuvenating spas and peaceful relaxation',
//     //   image: wellnessImg,
//     //   tags: ['wellness', 'spa', 'relaxation', 'massage', 'health']
//     // },
//     {
//       id: 'unique food',
//       name:'Foreign Cuisine',
//       description:'Enjoy our local twist on foreign cuisine from other cultures',
//       image: foreigncuisine,
//       tags:['Unique Food & Dining']

//     }
//   ];

//   const jamaicaParishes = [
//     'Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary', 'St. Ann',
//     'Trelawny', 'St. James', 'Hanover', 'Westmoreland', 'St. Elizabeth', 
//     'Manchester', 'Clarendon', 'St. Catherine'
//   ];

//   const getCurrencySymbol = (currencyCode) => {
//     const currency = currencies.find(c => c.code === currencyCode);
//     return currency ? currency.symbol : '$';
//   };
//   const formatCurrencyDisplay = (amount, currency) => {
//   if (!amount) return '';
//   const symbol = getCurrencySymbol(currency);
//   return `${symbol}${parseFloat(amount).toLocaleString()}`;
//   };

//   const convertToJMD = (amount, fromCurrency) => {
//   if (!amount || !fromCurrency) return 0;
//   const rate = currencyToJMD[fromCurrency] || 1;
//   return parseFloat(amount) * rate;
//   };


//   // Dynamic preference selection with order-based weighting
//   const togglePreference = (preferenceId) => {
//     setSelectedPreferences(prev => {
//       const currentIndex = prev.indexOf(preferenceId);
      
//       if (currentIndex === -1) {
//         return [...prev, preferenceId];
//       } else {
//         return prev.filter(id => id !== preferenceId);
//       }
//     });
//   };

//   // Calculate dynamic weights based on selection order
//   const calculatePreferenceWeights = () => {
//     const weights = {};
//     const maxWeight = selectedPreferences.length;
    
//     selectedPreferences.forEach((prefId, index) => {
//       weights[prefId] = maxWeight - index;
//     });
    
//     return weights;
//   };

//   // Get weight for a specific preference
//   const getPreferenceWeight = (preferenceId) => {
//     const index = selectedPreferences.indexOf(preferenceId);
//     if (index === -1) return 0;
//     return selectedPreferences.length - index;
//   };

//   // Function to add preferred dates
//   const addPreferredDate = () => {
//     if (selectedDate && !userInfo.preferredDays.includes(selectedDate)) {
//       if (userInfo.startDate && userInfo.endDate) {
//         const dateToAdd = new Date(selectedDate);
//         const startDate = new Date(userInfo.startDate);
//         const endDate = new Date(userInfo.endDate);
        
//         if (dateToAdd < startDate || dateToAdd > endDate) {
//           setError('Selected date must be within your travel period');
//           return;
//         }
//       }
      
//       setUserInfo(prev => ({
//         ...prev,
//         preferredDays: [...prev.preferredDays, selectedDate].sort()
//       }));
//       setSelectedDate('');
//       if (error) setError(null);
//     }
//   };

//   const removePreferredDate = (dateToRemove) => {
//     setUserInfo(prev => ({
//       ...prev,
//       preferredDays: prev.preferredDays.filter(date => date !== dateToRemove)
//     }));
//   };

//   const getPreferenceRank = (preferenceId) => {
//     const index = selectedPreferences.indexOf(preferenceId);
//     return index === -1 ? null : index + 1;
//   };

// const handleUserInfoChange = (field, value) => {
//   setUserInfo(prev => ({ ...prev, [field]: value }));
  
//   // Calculate JMD conversion when budget or currency changes
//   if (field === 'budget' || field === 'currency') {
//     const newUserInfo = { ...userInfo, [field]: value };
//     const jmdAmount = convertToJMD(newUserInfo.budget, newUserInfo.currency);
//     setConvertedAmount(jmdAmount);
//   }
  
//   if (field === 'startDate' || field === 'endDate') {
//     const newUserInfo = { ...userInfo, [field]: value };
//     if (newUserInfo.startDate && newUserInfo.endDate) {
//       const startDate = new Date(newUserInfo.startDate);
//       const endDate = new Date(newUserInfo.endDate);
      
//       const validDates = userInfo.preferredDays.filter(dateStr => {
//         const date = new Date(dateStr);
//         return date >= startDate && date <= endDate;
//       });
      
//       if (validDates.length !== userInfo.preferredDays.length) {
//         setUserInfo(prevUserInfo => ({
//           ...prevUserInfo,
//           [field]: value,
//           preferredDays: validDates
//         }));
//       }
//     }
//   }
  
//   if (error) setError(null);
// };

//   const calculateDuration = () => {
//     if (userInfo.startDate && userInfo.endDate) {
//       const start = new Date(userInfo.startDate);
//       const end = new Date(userInfo.endDate);
//       const diffTime = Math.abs(end - start);
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//       return diffDays;
//     }
//     return 0;
//   };

//   const formatDate = (dateString, timeString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const options = { month: 'short', day: 'numeric', year: 'numeric' };
//     let formatted = date.toLocaleDateString('en-US', options);
//     if (timeString) {
//       formatted += ` at ${timeString}`;
//     }
//     return formatted;
//   };

//   const formatSingleDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const options = { 
//       weekday: 'short', 
//       month: 'short', 
//       day: 'numeric', 
//       year: 'numeric' 
//     };
//     return date.toLocaleDateString('en-US', options);
//   };

//   const formatPreferredDates = () => {
//     if (userInfo.preferredDays.length === 0) return 'No specific dates selected';
//     if (userInfo.preferredDays.length === 1) return '1 preferred date';
//     return `${userInfo.preferredDays.length} preferred dates`;
//   };

//   // NEW: Format time for display
//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     const [hours, minutes] = timeString.split(':');
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
//     return `${displayHour}:${minutes} ${ampm}`;
//   };

//   const nextStep = () => {
//     if (currentStep < 3) setCurrentStep(currentStep + 1);
//   };

//   const prevStep = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

  



// const handleSubmit = async () => {
//   if (!isAuthenticated || !userId) {
//     setError('You must be logged in to save preferences. Please log in and try again.');
//     return;
//   }

//   if (selectedPreferences.length === 0) {
//     setError('Please select at least one preference');
//     return;
//   }
//   if (!userInfo.budget || !userInfo.startDate || !userInfo.endDate || !userInfo.groupSize) {
//     setError('Please fill in all required fields (budget, dates, and group size)');
//     return;
//   }
//   if (new Date(userInfo.startDate) >= new Date(userInfo.endDate)) {
//     setError('End date must be after start date');
//     return;
//   }
//   if (userInfo.preferredStartTime && userInfo.preferredEndTime && userInfo.preferredStartTime >= userInfo.preferredEndTime) {
//     setError('Preferred end time must be after start time');
//     return;
//   }

//   try {
//     setLoading(true);
//     setError(null);

//     const duration = calculateDuration();
//     const preferenceWeights = calculatePreferenceWeights();

//     // Convert budget to JMD
//     const budgetInJMD = convertToJMD(userInfo.budget, userInfo.currency);

//     // Map category IDs to descriptive tag names
//     const categoryTagMapping = {
//       'beaches': 'Pristine Beaches',
//       'nature': 'Nature & Wildlife', 
//       'culture': 'Museum/Historical Site',
//       'adventure': 'Adventure Sports',
//       'food': 'Local Food/Dining',
//       'music': 'Live Music',
//       'shopping': 'Local Markets',
//       'nightlife': 'Club/Bar/Party',
//       'wellness': 'Wellness & Spa',
//       'unique food': 'Unique Food & Dining'
//     };

//     // Create simplified weighted preferences array
//     const weightedPreferences = selectedPreferences.map((prefId, index) => {
//       return {
//         tag: categoryTagMapping[prefId] || prefId,
//         weight: selectedPreferences.length - index
//       };
//     });

//     // Create trip data object with converted budget
//     const tripData = {
//       userId: userId,
//       userEmail: user?.email,
      
//       // Trip details - budget converted to JMD, currency saved as JMD
//       budget: parseFloat(budgetInJMD.toFixed(2)), // Convert to JMD and round to 2 decimals
//       originalBudget: parseFloat(userInfo.budget), // Keep original amount for reference
//       originalCurrency: userInfo.currency, // Keep original currency for reference
//       currency: 'JMD', // Always save as JMD in database
//       duration: duration,
//       startDate: userInfo.startDate,
//       startTime: userInfo.startTime || '09:00',
//       endDate: userInfo.endDate,
//       endTime: userInfo.endTime || '18:00',
      
//       // Location and accommodation
//       parish: userInfo.parish,
//       accommodation: userInfo.accommodation,
//       groupSize: parseInt(userInfo.groupSize),
      
//       // Activity preferences
//       preferredDays: userInfo.preferredDays,
//       preferredStartTime: userInfo.preferredStartTime || '09:00',
//       preferredEndTime: userInfo.preferredEndTime || '17:00',
      
//       // Metadata
//       createdAt: new Date().toISOString(),
//       formVersion: '2.0'
//     };

//     // Structure data the way backend expects it
//     const requestData = {
//       tripData: tripData,
//       weightedPreferences: weightedPreferences
//     };

//     console.log('=== CURRENCY CONVERSION INFO ===');
//     console.log(`Original: ${getCurrencySymbol(userInfo.currency)}${userInfo.budget} ${userInfo.currency}`);
//     console.log(`Converted: J$${budgetInJMD.toFixed(2)} JMD`);
//     console.log(`Conversion rate: 1 ${userInfo.currency} = ${currencyToJMD[userInfo.currency]} JMD`);
//     console.log('=== TRIP DATA BEING SENT ===');
//     console.log('Trip Data:', JSON.stringify(tripData, null, 2));
//     console.log('=== END REQUEST DATA ===');

//     const response = await fetch('http://localhost:5001/api/tourists/save-preferences', {
//       method: 'POST',
//       headers: {
//         ...getAuthHeaders(),
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(requestData)
//     });
    
//     if (response.ok) {
//       const result = await response.json();
//       console.log('Preferences saved successfully:', result);

//       // Save to localStorage with user ID
//       const completePreferencesData = {
//         ...tripData,
//         preferences: selectedPreferences,
//         weightedPreferences: weightedPreferences,
//         preferenceWeights: preferenceWeights
//       };

//       localStorage.setItem(`touristPreferences_${userId}`, JSON.stringify(completePreferencesData));
//       localStorage.setItem(`userInfo_${userId}`, JSON.stringify(userInfo));
//       localStorage.setItem(`selectedPreferences_${userId}`, JSON.stringify(selectedPreferences));
//       localStorage.setItem(`preferenceWeights_${userId}`, JSON.stringify(preferenceWeights));
      
//       sessionStorage.setItem('currentTouristPreferences', JSON.stringify(completePreferencesData));
      
//       window.touristData = {
//         preferences: completePreferencesData,
//         userInfo: userInfo,
//         selectedPreferences: selectedPreferences,
//         preferenceWeights: preferenceWeights,
//         userId: userId
//       };

//       setSuccess({
//         title: 'Preferences Saved Successfully!',
//         message: `Your top priority is ${weightedPreferences[0]?.tag} (weight: ${weightedPreferences[0]?.weight}). Budget converted: ${getCurrencySymbol(userInfo.currency)}${userInfo.budget} ${userInfo.currency} → J$${budgetInJMD.toFixed(2)} JMD. Preferred activity time: ${formatTime(userInfo.preferredStartTime || '09:00')} - ${formatTime(userInfo.preferredEndTime || '17:00')}.`,
//         redirect: 'Redirecting to itinerary planner in 3 seconds...'
//       });
      
//       setTimeout(() => {
//         window.location.href = '/generate';
//       }, 1000);
      
//     } else {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to save preferences');
//     }
//   } catch (error) {
//     console.error('Error saving preferences:', error);
//     if (error.message.includes('401') || error.message.includes('unauthorized')) {
//       setError('Your session has expired. Please log in again.');
//     } else {
//       setError('Sorry, there was an error saving your preferences. Please try again.');
//     }
//   } finally {
//     setLoading(false);
//   }
// };
//   // Authentication check
//   if (!isAuthenticated) {
//     return (
//       <div style={{ 
//         textAlign: 'center', 
//         padding: '50px', 
//         maxWidth: '600px', 
//         margin: '0 auto' 
//       }}>
//         <h2>Please Log In</h2>
//         <p>You need to be logged in to set your travel preferences.</p>
//         <button 
//           onClick={() => window.location.href = '/login'}
//           style={{
//             padding: '12px 24px',
//             backgroundColor: '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             fontSize: '16px'
//           }}
//         >
//           Go to Login
//         </button>
//       </div>
//     );
//   }

//   const getStepContent = () => {
//     switch(currentStep) {
//       case 1:
//         return (
//           <div className="tourist-preferences-main">
//             <div className="tourist-preferences-hero">
//               <h1 className="tourist-preferences-hero-title">
//                 Discover Your
//                 <span className="tourist-preferences-gradient-text">
//                   Perfect Jamaica
//                 </span>
//               </h1>
//               <p className="tourist-preferences-hero-subtitle">
//                 Select your interests in order of priority. Your first choice gets the highest weight in recommendations!
//               </p>
//             </div>
            
//             <div className="tourist-preferences-grid">
//               {preferenceCategories.map(category => {
//                 const rank = getPreferenceRank(category.id);
//                 const weight = getPreferenceWeight(category.id);
//                 const isSelected = rank !== null;
                
//                 return (
//                   <button
//                     key={category.id}
//                     onClick={() => togglePreference(category.id)}
//                     className={`tourist-preferences-card ${isSelected ? 'selected' : ''}`}
//                   >
//                     {isSelected && (
//                       <div className="tourist-preferences-rank-badge">
//                         #{rank}
//                       </div>
//                     )}
                    
//                     <div className="tourist-preferences-card-content">
//                       <div className="tourist-preferences-card-image">
//                         <img 
//                           src={category.image} 
//                           alt={category.name}
//                           className="tourist-preferences-card-gif"
//                         />
//                       </div>
//                       <div className="tourist-preferences-card-info">
//                         <h3 className="tourist-preferences-card-title">{category.name}</h3>
//                         <p className="tourist-preferences-card-description">{category.description}</p>
//                       </div>
//                     </div>
                    
//                     {isSelected && (
//                       <div className="tourist-preferences-priority-badge">
//                         Priority #{rank} • Weight: {weight}
//                       </div>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
            
//             <div className="tourist-preferences-stats">
//               <div className="tourist-preferences-stats-container">
//                 <div className="tourist-preferences-stats-item">
//                   <div className="tourist-preferences-stats-dot"></div>
//                   <span className="tourist-preferences-stats-text">
//                     {selectedPreferences.length} {selectedPreferences.length === 1 ? 'Experience' : 'Experiences'} Selected
//                   </span>
//                 </div>
//                 {selectedPreferences.length > 0 && (
//                   <div className="tourist-preferences-stats-subtext">
//                     ✨ Weighted by selection order: "{preferenceCategories.find(p => p.id === selectedPreferences[0])?.name}" has highest priority
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 2:
//         return (
//           <div className="tourist-preferences-main">
//             <div className="tourist-preferences-hero">
//               <h1 className="tourist-preferences-hero-title">
//                 Plan Your
//                 <span className="tourist-preferences-gradient-text">
//                   Perfect Journey
//                 </span>
//               </h1>
//               <p className="tourist-preferences-hero-subtitle">
//                 Tell us about your travel style and we'll customize every detail to perfection
//               </p>
//             </div>

//             <div className="tourist-preferences-forms-container">
              
//               {/* Budget Input */}
//               <div className="tourist-preferences-glass-container">
//                 <div className="tourist-preferences-section-header">
//                   <h3>Your Travel Budget *</h3>
//                   <p>Enter your daily budget per person (will be converted to JMD). 
//                      <p className="tourist-preferences-budget-help">
//                     <br />
//                     This helps us recommend experiences within your comfort zone
//                   </p>
//                   </p>
//                 </div>
                
//                 <div className="tourist-preferences-budget-input-container">
//                   <div className="tourist-preferences-currency-row">
//                     <div className="tourist-preferences-currency-select-wrapper">
//                       <select
//                         value={userInfo.currency}
//                         onChange={(e) => handleUserInfoChange('currency', e.target.value)}
//                         className="tourist-preferences-currency-select"
//                       >
//                         {currencies.map(currency => (
//                           <option key={currency.code} value={currency.code}>
//                             {currency.code} ({currency.symbol})
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="tourist-preferences-currency-input-wrapper">
//                       <span className="tourist-preferences-currency-symbol">
//                         {getCurrencySymbol(userInfo.currency)}
//                       </span>
//                       <input
//                         type="number"
//                         placeholder="Enter amount"
//                         value={userInfo.budget}
//                         onChange={(e) => handleUserInfoChange('budget', e.target.value)}
//                         className="tourist-preferences-budget-input"
//                         min="0"
//                         step="10"
//                         required
//                       />
//                                   </div>

//                                 {/* Conversion Display */}
//                   {userInfo.budget && userInfo.currency !== 'JMD' && (
//                     <div style={{
//                       backgroundColor: '#e8f5e8',
//                       border: '1px solid #4caf50',
//                       borderRadius: '8px',
//                       padding: '5px',
//                       marginTop: '0px',
//                       textAlign: 'center',
//                       display:'block',
//                       whiteSpace: 'pre-wrap' 
//                     }}>
//                       <p style={{ margin: 0, color: '#2e7d32', fontWeight: '500' }}>
//                         Converts to: <strong>J${convertedAmount.toLocaleString()} JMD</strong>
//                         <br />
//                         <span style={{ fontSize: '12px', opacity: 0.8 }}>
//                           (Rate: 1 {userInfo.currency} = {currencyToJMD[userInfo.currency]} JMD)
//                         </span>
//                       </p>
//                     </div>
//                   )}
                  
//                   {userInfo.budget && userInfo.currency === 'JMD' && (
//                     <div style={{
//                       backgroundColor: '#e3f2fd',
//                       border: '1px solid #2196f3',
//                       borderRadius: '8px',
//                       padding: '12px',
//                       marginTop: '10px',
//                       textAlign: 'center'
//                     }}>
//                       <p style={{ margin: 0, color: '#1565c0', fontWeight: '500' }}>
//                         Already in Jamaican Dollars
//                       </p>
//                     </div>
//                   )}
                  
            
//                 </div>
//               </div>

//               </div>

//               {/* Travel Dates */}
//               <div className="tourist-preferences-glass-container">
//                 <div className="tourist-preferences-section-header">
//                   <h3>Travel Dates & Times *</h3>
//                   <p>When will you arrive and depart?</p>
//                 </div>
                
//                 <div className="tourist-preferences-date-inputs-grid">
//                   <div className="tourist-preferences-date-input-group">
//                     <label className="tourist-preferences-input-label">Arrival Date *</label>
//                     <input
//                       type="date"
//                       value={userInfo.startDate}
//                       onChange={(e) => handleUserInfoChange('startDate', e.target.value)}
//                       className="tourist-preferences-date-input"
//                       required
//                     />
//                     <label className="tourist-preferences-input-label" style={{marginTop: '1rem'}}>Arrival Time</label>
//                     <input
//                       type="time"
//                       value={userInfo.startTime}
//                       onChange={(e) => handleUserInfoChange('startTime', e.target.value)}
//                       className="tourist-preferences-time-input"
//                     />
//                   </div>
                  
//                   <div className="tourist-preferences-date-input-group">
//                     <label className="tourist-preferences-input-label">Departure Date *</label>
//                     <input
//                       type="date"
//                       value={userInfo.endDate}
//                       onChange={(e) => handleUserInfoChange('endDate', e.target.value)}
//                       className="tourist-preferences-date-input"
//                       min={userInfo.startDate}
//                       required
//                     />
//                     <label className="tourist-preferences-input-label" style={{marginTop: '1rem'}}>Departure Time</label>
//                     <input
//                       type="time"
//                       value={userInfo.endTime}
//                       onChange={(e) => handleUserInfoChange('endTime', e.target.value)}
//                       className="tourist-preferences-time-input"
//                     />
//                   </div>
//                 </div>
                
//                 {calculateDuration() > 0 && (
//                   <div className="tourist-preferences-duration-info">
//                     <p className="tourist-preferences-duration-display">
//                       Total Duration: <span className="tourist-preferences-duration-days">{calculateDuration()} days</span>
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Preferred Activity Dates */}
//               <div className="tourist-preferences-glass-container">
//                 <div className="tourist-preferences-section-header">
//                   <h3>Preferred Activity Dates</h3>
//                   <p>Select specific dates when you'd prefer to do activities and tours</p>
//                 </div>
                
//                 <div className="tourist-preferences-date-selector">
//                   <div className="tourist-preferences-date-input-wrapper">
//                     <input
//                       type="date"
//                       value={selectedDate}
//                       onChange={(e) => setSelectedDate(e.target.value)}
//                       min={userInfo.startDate || undefined}
//                       max={userInfo.endDate || undefined}
//                       className="tourist-preferences-date-select-input"
//                     />
//                     <button
//                       type="button"
//                       onClick={addPreferredDate}
//                       disabled={!selectedDate || userInfo.preferredDays.includes(selectedDate)}
//                       style={{
//                         padding: '10px 20px',
//                         backgroundColor: !selectedDate || userInfo.preferredDays.includes(selectedDate) ? '#ccc' : '#007bff',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '5px',
//                         cursor: !selectedDate || userInfo.preferredDays.includes(selectedDate) ? 'not-allowed' : 'pointer',
//                         marginLeft: '10px'
//                       }}
//                     >
//                       Add Date
//                     </button>
//                   </div>
                  
//                   {userInfo.preferredDays.length > 0 && (
//                     <div className="tourist-preferences-selected-dates">
//                       <h4 style={{ marginBottom: '15px', color: '#333' }}>Selected Preferred Dates:</h4>
//                       <div className="tourist-preferences-dates-list">
//                         {userInfo.preferredDays.map((dateStr, index) => (
//                           <div
//                             key={index}
//                             className="tourist-preferences-date-item"
//                             style={{
//                               display: 'flex',
//                               justifyContent: 'space-between',
//                               alignItems: 'center',
//                               padding: '12px 16px',
//                               backgroundColor: '#f8f9fa',
//                               border: '1px solid #e9ecef',
//                               borderRadius: '8px',
//                               marginBottom: '8px'
//                             }}
//                           >
//                             <span style={{ fontWeight: '500', color: '#495057' }}>
//                               📅 {formatSingleDate(dateStr)}
//                             </span>
//                             <button
//                               type="button"
//                               onClick={() => removePreferredDate(dateStr)}
//                               style={{
//                                 backgroundColor: '#dc3545',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: '4px',
//                                 padding: '4px 8px',
//                                 cursor: 'pointer',
//                                 fontSize: '12px'
//                               }}
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="tourist-preferences-dates-help">
//                     <p>
//                       💡 <strong>Pro tip:</strong> Select specific dates when you want to be most active. 
//                       {userInfo.preferredDays.length === 0 && " Leave empty if you're flexible with any day during your trip."}
//                       {userInfo.preferredDays.length > 0 && ` You've selected ${userInfo.preferredDays.length} preferred date${userInfo.preferredDays.length === 1 ? '' : 's'}.`}
//                     </p>
//                     {userInfo.startDate && userInfo.endDate && (
//                       <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
//                         You can only select dates between {formatDate(userInfo.startDate)} and {formatDate(userInfo.endDate)}.
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* NEW: Preferred Activity Times */}
//               <div className="tourist-preferences-glass-container">
//                 <div className="tourist-preferences-section-header">
//                   <h3>Preferred Activity Times</h3>
//                   <p>Set your preferred start and end times for daily activities</p>
//                 </div>
                
//                 <div className="tourist-preferences-time-preferences">
//                   <div style={{
//                     display: 'grid',
//                     gridTemplateColumns: '1fr 1fr',
//                     gap: '20px',
//                     marginBottom: '20px'
//                   }}>
//                     <div>
//                       <label className="tourist-preferences-input-label">Preferred Start Time</label>
//                       <input
//                         type="time"
//                         value={userInfo.preferredStartTime}
//                         onChange={(e) => handleUserInfoChange('preferredStartTime', e.target.value)}
//                         className="tourist-preferences-time-input"
//                         style={{
//                           width: '100%',
//                           padding: '12px',
//                           border: '2px solid #e9ecef',
//                           borderRadius: '8px',
//                           fontSize: '16px'
//                         }}
//                       />
//                       <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
//                         When you prefer activities to begin
//                       </p>
//                     </div>
                    
//                     <div>
//                       <label className="tourist-preferences-input-label">Preferred End Time</label>
//                       <input
//                         type="time"
//                         value={userInfo.preferredEndTime}
//                         onChange={(e) => handleUserInfoChange('preferredEndTime', e.target.value)}
//                         className="tourist-preferences-time-input"
//                         style={{
//                           width: '100%',
//                           padding: '12px',
//                           border: '2px solid #e9ecef',
//                           borderRadius: '8px',
//                           fontSize: '16px'
//                         }}
//                       />
//                       <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
//                         When you prefer activities to end
//                       </p>
//                     </div>
//                   </div>
                  
//                   {userInfo.preferredStartTime && userInfo.preferredEndTime && (
//                     <div style={{
//                       backgroundColor: '#e8f5e8',
//                       border: '1px solid #4caf50',
//                       borderRadius: '8px',
//                       padding: '15px',
//                       textAlign: 'center'
//                     }}>
//                       <p style={{ margin: 0, color: '#2e7d32', fontWeight: '500' }}>
//                         🕐 Your preferred activity window: {formatTime(userInfo.preferredStartTime)} - {formatTime(userInfo.preferredEndTime)}
//                       </p>
//                     </div>
//                   )}
                  
//                   <div className="tourist-preferences-time-help" style={{ marginTop: '15px' }}>
//                     <p>
//                       💡 <strong>Pro tip:</strong> We'll try to schedule most activities within your preferred time window. 
//                       {!userInfo.preferredStartTime && !userInfo.preferredEndTime && " Default is 9:00 AM - 5:00 PM if not specified."}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Location Info */}
//               <div className="tourist-preferences-glass-container">
//                 <div className="tourist-preferences-section-header">
//                   <h3>Where Will You Stay?</h3>
//                   <p>Select your parish and accommodation</p>
//                 </div>
                
//                 <div>
//                   <label className="tourist-preferences-input-label">Select Parish</label>
//                   <select
//                     value={userInfo.parish}
//                     onChange={(e) => handleUserInfoChange('parish', e.target.value)}
//                     className="tourist-preferences-parish-select"
//                   >
//                     <option value="">Choose a parish...</option>
//                     {jamaicaParishes.map(parish => (
//                       <option key={parish} value={parish}>{parish}</option>
//                     ))}
//                   </select>
                  
//                   <input
//                     type="text"
//                     placeholder="Hotel/Resort/Accommodation name"
//                     value={userInfo.accommodation}
//                     onChange={(e) => handleUserInfoChange('accommodation', e.target.value)}
//                     className="tourist-preferences-accommodation-input"
//                   />
//                 </div>
//               </div>

//               {/* Group Size */}
//               <div className="tourist-preferences-glass-container">
//                 <div className="tourist-preferences-section-header">
//                   <h3>Group Size *</h3>
//                   <p>Who's joining the adventure?</p>
//                 </div>
                
//                 <div className="tourist-preferences-group-size">
//                   <div className="tourist-preferences-group-image">
//                     <img 
//                       src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXoxY25tdzQyZTRycDE0a3lmbDhwbWZmZmE4bmE2dnRremx5ZHdycCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UD40IQwpdvOegzsq4c/giphy.gif" 
//                       alt="Group of people"
//                       className="tourist-preferences-group-gif"
//                     />
//                   </div>
//                   <input
//                     type="number"
//                     placeholder="Number of travelers"
//                     value={userInfo.groupSize}
//                     onChange={(e) => handleUserInfoChange('groupSize', e.target.value)}
//                     className="tourist-preferences-input"
//                     min="1"
//                     max="50"
//                     required
//                   />
//                   <p className="tourist-preferences-input-help">Perfect for solo trips to group adventures</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 3:
//         return (
//           <div className="tourist-preferences-main">
//             <div className="tourist-preferences-hero">
//               <h1 className="tourist-preferences-hero-title">
//                 Your Journey
//                 <span className="tourist-preferences-gradient-text">
//                   Awaits
//                 </span>
//               </h1>
//               <p className="tourist-preferences-hero-subtitle">
//                 Everything looks perfect! Your personalized Jamaican adventure is ready to begin.
//               </p>
//             </div>

//             <div className="tourist-preferences-review-grid">
              
//               {/* Weighted priorities */}
//               <div className="tourist-preferences-glass-container">
//                 <div className="tourist-preferences-review-header">
//                   <span className="tourist-preferences-review-icon">🏆</span>
//                   <div>
//                     <h3 className="tourist-preferences-review-title">Your Weighted Priorities</h3>
//                     <p className="tourist-preferences-review-subtitle">Ranked by selection order with dynamic weights</p>
//                   </div>
//                 </div>
                
//                 {selectedPreferences.length > 0 ? (
//                   <div className="tourist-preferences-priority-list">
//                     {selectedPreferences.slice(0, 5).map((prefId, index) => {
//                       const pref = preferenceCategories.find(p => p.id === prefId);
//                       const weight = selectedPreferences.length - index;
//                       return (
//                         <div key={prefId} className="tourist-preferences-priority-item">
//                           <div className="tourist-preferences-priority-number">
//                             {index + 1}
//                           </div>
//                           <div className="tourist-preferences-priority-image">
//                             <img 
//                               src={pref.image} 
//                               alt={pref.name}
//                               className="tourist-preferences-priority-gif"
//                             />
//                           </div>
//                           <div className="tourist-preferences-priority-info">
//                             <div className="tourist-preferences-priority-name">{pref.name}</div>
//                             <div className="tourist-preferences-priority-desc">
//                               Weight: {weight} • {index === 0 ? 'Highest Priority' : `Priority ${index + 1}`}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     {selectedPreferences.length > 5 && (
//                       <div className="tourist-preferences-priority-more">
//                         + {selectedPreferences.length - 5} more experiences with weights {selectedPreferences.length - 5} to 1
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <p className="tourist-preferences-no-preferences">No preferences selected</p>
//                 )}
//               </div>

//               {/* Trip Summary */}
//               <div className="tourist-preferences-glass-container">
//                 <div className="tourist-preferences-review-header">
//                   <span className="tourist-preferences-review-icon">📋</span>
//                   <div>
//                     <h3 className="tourist-preferences-review-title">Trip Summary</h3>
//                     <p className="tourist-preferences-review-subtitle">Your perfect getaway details</p>
//                   </div>
//                 </div>
                
//                 <div className="tourist-preferences-summary-list">
//                   <div className="tourist-preferences-summary-item">
//                     <div className="tourist-preferences-summary-label">
//                       <span className="tourist-preferences-summary-icon"></span>
//                       <span>Daily Budget</span>
//                     </div>
//                     <span className="tourist-preferences-summary-value">
//                       {getCurrencySymbol(userInfo.currency)}{userInfo.budget || '0'} {userInfo.currency}
//                       {userInfo.currency !== 'JMD' && userInfo.budget && (
//                         <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
//                           (≈ J${convertToJMD(userInfo.budget, userInfo.currency).toLocaleString()} JMD)
//                         </div>
//                       )}
//                     </span>
//                 </div>

                  
//                   <div className="tourist-preferences-summary-item">
//                     <div className="tourist-preferences-summary-label">
//                       <span className="tourist-preferences-summary-icon">📅</span>
//                       <span>Travel Dates</span>
//                     </div>
//                     <span className="tourist-preferences-summary-value">
//                       {userInfo.startDate ? `${formatDate(userInfo.startDate, userInfo.startTime)} - ${formatDate(userInfo.endDate, userInfo.endTime)}` : 'Not selected'}
//                     </span>
//                   </div>
                  
//                   <div className="tourist-preferences-summary-item">
//                     <div className="tourist-preferences-summary-label">
//                       <span className="tourist-preferences-summary-icon">⏰</span>
//                       <span>Duration</span>
//                     </div>
//                     <span className="tourist-preferences-summary-value">
//                       {calculateDuration() || 0} days
//                     </span>
//                   </div>

//                   <div className="tourist-preferences-summary-item">
//                     <div className="tourist-preferences-summary-label">
//                       <span className="tourist-preferences-summary-icon">📆</span>
//                       <span>Preferred Activity Dates</span>
//                     </div>
//                     <span className="tourist-preferences-summary-value">
//                       {formatPreferredDates()}
//                     </span>
//                   </div>

//                   <div className="tourist-preferences-summary-item">
//                     <div className="tourist-preferences-summary-label">
//                       <span className="tourist-preferences-summary-icon">🕐</span>
//                       <span>Preferred Activity Times</span>
//                     </div>
//                     <span className="tourist-preferences-summary-value">
//                       {userInfo.preferredStartTime && userInfo.preferredEndTime 
//                         ? `${formatTime(userInfo.preferredStartTime)} - ${formatTime(userInfo.preferredEndTime)}`
//                         : 'Default hours (9:00 AM - 5:00 PM)'
//                       }
//                     </span>
//                   </div>
                  
//                   {userInfo.preferredDays.length > 0 && (
//                     <div className="tourist-preferences-summary-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
//                       <div className="tourist-preferences-summary-label" style={{ marginBottom: '8px' }}>
//                         <span className="tourist-preferences-summary-icon">📋</span>
//                         <span>Selected Dates</span>
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
//                         {userInfo.preferredDays.slice(0, 3).map((dateStr, index) => (
//                           <span
//                             key={index}
//                             style={{
//                               backgroundColor: '#e3f2fd',
//                               color: '#1565c0',
//                               padding: '4px 8px',
//                               borderRadius: '12px',
//                               fontSize: '12px',
//                               fontWeight: '500'
//                             }}
//                           >
//                             {formatSingleDate(dateStr)}
//                           </span>
//                         ))}
//                         {userInfo.preferredDays.length > 3 && (
//                           <span style={{ fontSize: '12px', color: '#666' }}>
//                             +{userInfo.preferredDays.length - 3} more
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="tourist-preferences-summary-item">
//                     <div className="tourist-preferences-summary-label">
//                       <span className="tourist-preferences-summary-icon">📍</span>
//                       <span>Location</span>
//                     </div>
//                     <span className="tourist-preferences-summary-value">
//                       {userInfo.parish || 'Not selected'}
//                     </span>
//                   </div>
                  
//                   <div className="tourist-preferences-summary-item">
//                     <div className="tourist-preferences-summary-label">
//                       <span className="tourist-preferences-summary-icon">🏨</span>
//                       <span>Accommodation</span>
//                     </div>
//                     <span className="tourist-preferences-summary-value">
//                       {userInfo.accommodation || 'Not specified'}
//                     </span>
//                   </div>
                  
//                   <div className="tourist-preferences-summary-item">
//                     <div className="tourist-preferences-summary-label">
//                       <span className="tourist-preferences-summary-icon">👥</span>
//                       <span>Travelers</span>
//                     </div>
//                     <span className="tourist-preferences-summary-value">
//                       {userInfo.groupSize || '0'} {userInfo.groupSize === '1' ? 'Person' : 'People'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {error && (
//               <div className="tourist-preferences-error-message">
//                 <span>⚠️</span>
//                 <span>{error}</span>
//               </div>
//             )}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="tourist-preferences-container">
      
//       {/* Header */}
//       <header className="tourist-preferences-header">
//         <div className="tourist-preferences-header-content">
//           <div className="tourist-preferences-brand">
//             <span className="tourist-preferences-brand-text">Yaad Quest</span>
//           </div>
          
//           <nav className="tourist-preferences-nav">
//             <a href="/tourist-profile" className="tourist-preferences-nav-link">Home</a>
//             <a href="/search" className="tourist-preferences-nav-link">Explore</a>
//             <a href="#" className="tourist-preferences-nav-link">About Us</a>
           
//           </nav>
          
//           <div className="tourist-preferences-avatar"></div>
//         </div>
//       </header>

//       {/* Progress Bar */}
//       <div className="tourist-preferences-progress-section">
//         <div className="tourist-preferences-progress">
//           <div className="tourist-preferences-progress-bar">
//             {[1, 2, 3].map((step, index) => (
//               <div key={step} className="tourist-preferences-progress-step">
//                 <div className={`tourist-preferences-progress-circle ${step <= currentStep ? 'active' : 'inactive'}`}>
//                   {step < currentStep ? '✓' : step}
//                 </div>
//                 {index < 2 && (
//                   <div className={`tourist-preferences-progress-line ${step < currentStep ? 'active' : 'inactive'}`} />
//                 )}
//               </div>
//             ))}
//           </div>
//           <div className="tourist-preferences-progress-labels">
//             <span>Discover</span>
//             <span>Customize</span>
//             <span>Confirm</span>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="tourist-preferences-content">
//         <div className="tourist-preferences-content-wrapper">
//           {getStepContent()}
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="tourist-preferences-navigation">
//         <button
//           onClick={prevStep}
//           disabled={currentStep === 1 || loading}
//           className={`tourist-preferences-nav-button ${currentStep === 1 || loading ? 'disabled' : 'secondary'}`}
//         >
//           <span>←</span>
//           <span>Previous</span>
//         </button>

//         <div className="tourist-preferences-step-indicator">
//           <div className="tourist-preferences-step-dot"></div>
//           <span className="tourist-preferences-step-text">Step {currentStep} of 3</span>
//         </div>

//         {currentStep < 3 ? (
//           <button
//             onClick={nextStep}
//             disabled={(currentStep === 1 && selectedPreferences.length === 0) || loading}
//             className={`tourist-preferences-nav-button ${(currentStep === 1 && selectedPreferences.length === 0) || loading ? 'disabled' : 'primary'}`}
//           >
//             <span>Continue</span>
//             <span>→</span>
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="tourist-preferences-nav-button submit"
//           >
//             <span>{loading ? 'Saving & Redirecting...' : 'Generate your Itinerary'}</span>
            
//           </button>
//         )}
//       </div>

//       {/* Loading Overlay */}
//       {loading && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.75)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 9999
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             padding: '2rem',
//             borderRadius: '1rem',
//             textAlign: 'center',
//             maxWidth: '400px'
//           }}>
//             <div style={{
//               width: '40px',
//               height: '40px',
//               border: '4px solid #e5e7eb',
//               borderTop: '4px solid #ff5b7f',
//               borderRadius: '50%',
//               animation: 'spin 1s linear infinite',
//               margin: '0 auto 1rem auto'
//             }}></div>
//             <h3>Saving Your Weighted Preferences</h3>
//             <p>Preparing your personalized Jamaica experience with priority weights and time preferences...</p>
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <footer className="tourist-preferences-footer">
//         <div className="tourist-preferences-footer-content">
//           <div className="tourist-preferences-footer-section">
//             <div className="tourist-preferences-footer-logo">Yaad Quest</div>
//           </div>
//           <div className="tourist-preferences-footer-section">
//             <h3>Company</h3>
//             <p>About Us</p>
//             <h3>Contact</h3>
//             <p>yaadQuest@gmail.com</p>
//           </div>
//           <div className="tourist-preferences-footer-section">
//             <h3>Further</h3>
//             <a href="/search"><p>Search for more places</p></a>
          
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default TouristPreferencesForm;
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../css/TouristPreferences.css';
import JamaicanAddressForm from "./JamaicanAddressForm";
import beachImg from '../images/beach2.jpg';
import natureImg from '../images/bluemountain.jpg';
import cultureImg from '../images/halfwaytree.jpg';
import adventureImg from '../images/mysticmountain.png';
import foodImg from '../images/patty.png';
import musicImg from '../images/bobmarley.jpg';
import shoppingImg from '../images/craftmarket.png';
import nightlifeImg from '../images/party.png';
import wellnessImg from '../images/spa.jpg';
import foreigncuisine from '../images/foreigncuisine.jpeg';

const TouristPreferencesForm = () => {
  // Add useAuth hook to get current user data
  const { user, userId, isAuthenticated, getAuthHeaders } = useAuth();
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [success, setSuccess] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(0);
  
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
    preferredDays: [],
    preferredStartTime: '09:00', // NEW: Simple start time
    preferredEndTime: '17:00',   // NEW: Simple end time
    needTransportation: 0    // NEW: Transportation toggle
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
  const currencyToJMD = {
    'USD': 157.50,  // 1 USD = 157.50 JMD (approximate)
    'JMD': 1.00,    // 1 JMD = 1 JMD
    'EUR': 172.30,  // 1 EUR = 172.30 JMD (approximate)
    'GBP': 200.45,  // 1 GBP = 200.45 JMD (approximate)
    'CAD': 116.25,  // 1 CAD = 116.25 JMD (approximate)
    'AUD': 102.80,  // 1 AUD = 102.80 JMD (approximate)
    'CHF': 175.90,  // 1 CHF = 175.90 JMD (approximate)
    'JPY': 1.05,    // 1 JPY = 1.05 JMD (approximate)
    'CNY': 21.75,   // 1 CNY = 21.75 JMD (approximate)
    'INR': 1.88     // 1 INR = 1.88 JMD (approximate)
  };
  // Preference categories without fixed weights - weights calculated dynamically
  const preferenceCategories = [
    { 
      id: 'beaches', 
      name: 'Pristine Beaches', 
      description: 'Crystal clear waters and pristine white sand beaches',
      image: beachImg,
      tags: ['Beach/River', 'beach', 'river' ]
    },
    { 
      id: 'nature', 
      name: 'Nature & Wildlife', 
      description: 'Lush rainforests, cascading waterfalls, and exotic wildlife',
      image: natureImg,
      tags: ['outdoor adventure', 'nature']
    },
    { 
      id: 'culture', 
      name: 'Cultural Heritage', 
      description: 'Rich history, museums, and cultural landmarks',
      image: cultureImg,
      tags: ['culture', 'history', 'museum', 'heritage', 'historical site']
    },
    { 
      id: 'adventure', 
      name: 'Adventure Sports', 
      description: 'Thrilling zip-lines, diving, and extreme sports',
      image: adventureImg,
      tags: ['adventure', 'extreme sports', 'zip-line', 'diving', 'outdoor adventure']
    },
    { 
      id: 'food', 
      name: 'Local Cuisine', 
      description: 'Authentic jerk cuisine and local delicacies',
      image: foodImg,
      tags: ['food', 'dining', 'local cuisine', 'jerk chicken', 'restaurant']
    },
    { 
      id: 'music', 
      name: 'Music & Festivals', 
      description: 'Reggae rhythms and vibrant cultural festivals',
      image: musicImg,
      tags: ['concert','live music', 'festival']
    },
    { 
      id: 'shopping', 
      name: 'Local Markets', 
      description: 'Artisan crafts and bustling local markets',
      image: shoppingImg,
      tags: ['shopping', 'market', 'crafts', 'souvenirs', 'local market']
    },
    { 
      id: 'nightlife', 
      name: 'Vibrant Nightlife', 
      description: 'Exciting bars, clubs, and evening entertainment',
      image: nightlifeImg,
      tags: ['bars', 'clubs', 'party', 'entertainment', 'Bar/Club/Party']
    },
    // { 
    //   id: 'wellness', 
    //   name: 'Wellness & Spa', 
    //   description: 'Rejuvenating spas and peaceful relaxation',
    //   image: wellnessImg,
    //   tags: ['wellness', 'spa', 'relaxation', 'massage', 'health']
    // },
    {
      id: 'unique food',
      name:'Foreign Cuisine',
      description:'Enjoy our local twist on foreign cuisine from other cultures',
      image: foreigncuisine,
      tags:['Unique Food & Dining']

    }
  ];

  const jamaicaParishes = [
    'Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary', 'St. Ann',
    'Trelawny', 'St. James', 'Hanover', 'Westmoreland', 'St. Elizabeth', 
    'Manchester', 'Clarendon', 'St. Catherine'
  ];

  const getCurrencySymbol = (currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '$';
  };
  const formatCurrencyDisplay = (amount, currency) => {
  if (!amount) return '';
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${parseFloat(amount).toLocaleString()}`;
  };

  const convertToJMD = (amount, fromCurrency) => {
  if (!amount || !fromCurrency) return 0;
  const rate = currencyToJMD[fromCurrency] || 1;
  return parseFloat(amount) * rate;
  };


  // Dynamic preference selection with order-based weighting
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

  // Calculate dynamic weights based on selection order
  const calculatePreferenceWeights = () => {
    const weights = {};
    const maxWeight = selectedPreferences.length;
    
    selectedPreferences.forEach((prefId, index) => {
      weights[prefId] = maxWeight - index;
    });
    
    return weights;
  };

  // Get weight for a specific preference
  const getPreferenceWeight = (preferenceId) => {
    const index = selectedPreferences.indexOf(preferenceId);
    if (index === -1) return 0;
    return selectedPreferences.length - index;
  };

  // Function to add preferred dates
  const addPreferredDate = () => {
    if (selectedDate && !userInfo.preferredDays.includes(selectedDate)) {
      if (userInfo.startDate && userInfo.endDate) {
        const dateToAdd = new Date(selectedDate);
        const startDate = new Date(userInfo.startDate);
        const endDate = new Date(userInfo.endDate);
        
        if (dateToAdd < startDate || dateToAdd > endDate) {
          setError('Selected date must be within your travel period');
          return;
        }
      }
      
      setUserInfo(prev => ({
        ...prev,
        preferredDays: [...prev.preferredDays, selectedDate].sort()
      }));
      setSelectedDate('');
      if (error) setError(null);
    }
  };

  const removePreferredDate = (dateToRemove) => {
    setUserInfo(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.filter(date => date !== dateToRemove)
    }));
  };

  const getPreferenceRank = (preferenceId) => {
    const index = selectedPreferences.indexOf(preferenceId);
    return index === -1 ? null : index + 1;
  };

const handleUserInfoChange = (field, value) => {
  setUserInfo(prev => ({ ...prev, [field]: value }));
  
  // Calculate JMD conversion when budget or currency changes
  if (field === 'budget' || field === 'currency') {
    const newUserInfo = { ...userInfo, [field]: value };
    const jmdAmount = convertToJMD(newUserInfo.budget, newUserInfo.currency);
    setConvertedAmount(jmdAmount);
  }
  
  if (field === 'startDate' || field === 'endDate') {
    const newUserInfo = { ...userInfo, [field]: value };
    if (newUserInfo.startDate && newUserInfo.endDate) {
      const startDate = new Date(newUserInfo.startDate);
      const endDate = new Date(newUserInfo.endDate);
      
      const validDates = userInfo.preferredDays.filter(dateStr => {
        const date = new Date(dateStr);
        return date >= startDate && date <= endDate;
      });
      
      if (validDates.length !== userInfo.preferredDays.length) {
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          [field]: value,
          preferredDays: validDates
        }));
      }
    }
  }
  
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

  const formatSingleDate = (dateString) => {
    if (!dateString) return '';
    // Fix timezone issue by creating date in local timezone
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day); // month is 0-indexed
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatPreferredDates = () => {
    if (userInfo.preferredDays.length === 0) return 'No specific dates selected';
    if (userInfo.preferredDays.length === 1) return '1 preferred date';
    return `${userInfo.preferredDays.length} preferred dates`;
  };

  // NEW: Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  



const handleSubmit = async () => {
  if (!isAuthenticated || !userId) {
    setError('You must be logged in to save preferences. Please log in and try again.');
    return;
  }

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
  if (userInfo.preferredStartTime && userInfo.preferredEndTime && userInfo.preferredStartTime >= userInfo.preferredEndTime) {
    setError('Preferred end time must be after start time');
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const duration = calculateDuration();
    const preferenceWeights = calculatePreferenceWeights();

    // Convert budget to JMD
    const budgetInJMD = convertToJMD(userInfo.budget, userInfo.currency);

    // Map category IDs to descriptive tag names
    const categoryTagMapping = {
      'beaches': 'Pristine Beaches',
      'nature': 'Nature & Wildlife', 
      'culture': 'Museum/Historical Site',
      'adventure': 'Adventure Sports',
      'food': 'Local Food/Dining',
      'music': 'Live Music',
      'shopping': 'Local Markets',
      'nightlife': 'Club/Bar/Party',
      'wellness': 'Wellness & Spa',
      'unique food': 'Unique Food & Dining'
    };

    // Create simplified weighted preferences array
    const weightedPreferences = selectedPreferences.map((prefId, index) => {
      return {
        tag: categoryTagMapping[prefId] || prefId,
        weight: selectedPreferences.length - index
      };
    });

    // Create trip data object with converted budget
    const tripData = {
      userId: userId,
      userEmail: user?.email,
      
      // Trip details - budget converted to JMD, currency saved as JMD
      budget: parseFloat(budgetInJMD.toFixed(2)), 
      originalBudget: parseFloat(userInfo.budget), // Keep original amount for reference
      originalCurrency: userInfo.currency, // Keep original currency for reference
      currency: 'JMD', // Always save as JMD in database
      duration: duration,
      startDate: userInfo.startDate,
      startTime: userInfo.startTime || '09:00',
      endDate: userInfo.endDate,
      endTime: userInfo.endTime || '18:00',
      
      // Location and accommodation
      parish: userInfo.parish,
      accommodation: userInfo.accommodation,
      groupSize: parseInt(userInfo.groupSize),
      
      // Activity preferences
      preferredDays: userInfo.preferredDays,
      preferredStartTime: userInfo.preferredStartTime || '09:00',
      preferredEndTime: userInfo.preferredEndTime || '17:00',
      
      // Transportation
      needTransportation: userInfo.needTransportation,
      
      // Metadata
      createdAt: new Date().toISOString(),
      formVersion: '2.0'
    };

    // Structure data the way backend expects it
    const requestData = {
      tripData: tripData,
      weightedPreferences: weightedPreferences
    };

    console.log('=== CURRENCY CONVERSION INFO ===');
    console.log(`Original: ${getCurrencySymbol(userInfo.currency)}${userInfo.budget} ${userInfo.currency}`);
    console.log(`Converted: J$${budgetInJMD.toFixed(2)} JMD`);
    console.log(`Conversion rate: 1 ${userInfo.currency} = ${currencyToJMD[userInfo.currency]} JMD`);
    console.log('=== TRIP DATA BEING SENT ===');
    console.log('Trip Data:', JSON.stringify(tripData, null, 2));
    console.log('=== END REQUEST DATA ===');

    const response = await fetch('http://localhost:5001/api/tourists/save-preferences', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Preferences saved successfully:', result);

      // Save to localStorage with user ID
      const completePreferencesData = {
        ...tripData,
        preferences: selectedPreferences,
        weightedPreferences: weightedPreferences,
        preferenceWeights: preferenceWeights
      };

      localStorage.setItem(`touristPreferences_${userId}`, JSON.stringify(completePreferencesData));
      localStorage.setItem(`userInfo_${userId}`, JSON.stringify(userInfo));
      localStorage.setItem(`selectedPreferences_${userId}`, JSON.stringify(selectedPreferences));
      localStorage.setItem(`preferenceWeights_${userId}`, JSON.stringify(preferenceWeights));
      
      sessionStorage.setItem('currentTouristPreferences', JSON.stringify(completePreferencesData));
      
      window.touristData = {
        preferences: completePreferencesData,
        userInfo: userInfo,
        selectedPreferences: selectedPreferences,
        preferenceWeights: preferenceWeights,
        userId: userId
      };

      setSuccess({
        title: 'Preferences Saved Successfully!',
        message: `Your top priority is ${weightedPreferences[0]?.tag} (weight: ${weightedPreferences[0]?.weight}). Budget converted: ${getCurrencySymbol(userInfo.currency)}${userInfo.budget} ${userInfo.currency} → J$${budgetInJMD.toFixed(2)} JMD. Preferred activity time: ${formatTime(userInfo.preferredStartTime || '09:00')} - ${formatTime(userInfo.preferredEndTime || '17:00')}. Transportation needed: ${userInfo.needTransportation ? '1' : '0'}.`,
        redirect: 'Redirecting to itinerary planner in 3 seconds...'
      });
      
      setTimeout(() => {
        window.location.href = '/generate';
      }, 1000);
      
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save preferences');
    }
  } catch (error) {
    console.error('Error saving preferences:', error);
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      setError('Your session has expired. Please log in again.');
    } else {
      setError('Sorry, there was an error saving your preferences. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};
  // Authentication check
  if (!isAuthenticated) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px', 
        maxWidth: '600px', 
        margin: '0 auto' 
      }}>
        <h2>Please Log In</h2>
        <p>You need to be logged in to set your travel preferences.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

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
                Select your interests in order of priority. Your first choice gets the highest weight in recommendations!
              </p>
            </div>
            
            <div className="tourist-preferences-grid">
              {preferenceCategories.map(category => {
                const rank = getPreferenceRank(category.id);
                const weight = getPreferenceWeight(category.id);
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
                        Priority #{rank} • Weight: {weight}
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
                    ✨ Weighted by selection order: "{preferenceCategories.find(p => p.id === selectedPreferences[0])?.name}" has highest priority
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
                  <p>Enter your daily budget per person (will be converted to JMD). 
                     <p className="tourist-preferences-budget-help">
                    <br />
                    This helps us recommend experiences within your comfort zone
                  </p>
                  </p>
                </div>
                
                <div className="tourist-preferences-budget-input-container">
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
                                  </div><br />

                                {/* Conversion Display */}
                  {userInfo.budget && userInfo.currency !== 'JMD' && (
                    <div style={{
                      backgroundColor: '#e8f5e8',
                      border: '1px solid #4caf50',
                      borderRadius: '8px',
                      padding: '5px',
                      marginTop: '0px',
                      textAlign: 'center',
                      display:'block',
                      whiteSpace: 'pre-wrap' 
                    }}>
                      <p style={{ margin: 0, color: '#2e7d32', fontWeight: '500' }}>
                        Converts to: <strong>J${convertedAmount.toLocaleString()} JMD</strong>
                        <br />
                        <span style={{ fontSize: '12px', opacity: 0.8 }}>
                          (Rate: 1 {userInfo.currency} = {currencyToJMD[userInfo.currency]} JMD)
                        </span>
                      </p>
                    </div>
                  )}
                  
                  {userInfo.budget && userInfo.currency === 'JMD' && (
                    <div style={{
                      backgroundColor: '#e3f2fd',
                      border: '1px solid #2196f3',
                      borderRadius: '8px',
                      padding: '12px',
                      marginTop: '10px',
                      textAlign: 'center'
                    }}>
                      <p style={{ margin: 0, color: '#1565c0', fontWeight: '500' }}>
                        Already in Jamaican Dollars
                      </p>
                    </div>
                  )}
                  
            
                </div>
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

              {/* Preferred Activity Dates */}
              <div className="tourist-preferences-glass-container">
                <div className="tourist-preferences-section-header">
                  <h3>Preferred Activity Dates</h3>
                  <p>Select specific dates when you'd prefer to do activities and tours</p>
                </div>
                
                <div className="tourist-preferences-date-selector">
                  <div className="tourist-preferences-date-input-wrapper">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={userInfo.startDate || undefined}
                      max={userInfo.endDate || undefined}
                      className="tourist-preferences-date-select-input"
                    />
                    <button
                      type="button"
                      onClick={addPreferredDate}
                      disabled={!selectedDate || userInfo.preferredDays.includes(selectedDate)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: !selectedDate || userInfo.preferredDays.includes(selectedDate) ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: !selectedDate || userInfo.preferredDays.includes(selectedDate) ? 'not-allowed' : 'pointer',
                        marginLeft: '10px'
                      }}
                    >
                      Add Date
                    </button>
                  </div>
                  
                  {userInfo.preferredDays.length > 0 && (
                    <div className="tourist-preferences-selected-dates">
                      <h4 style={{ marginBottom: '15px', color: '#333' }}>Selected Preferred Dates:</h4>
                      <div className="tourist-preferences-dates-list">
                        {userInfo.preferredDays.map((dateStr, index) => (
                          <div
                            key={index}
                            className="tourist-preferences-date-item"
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px 16px',
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #e9ecef',
                              borderRadius: '8px',
                              marginBottom: '8px'
                            }}
                          >
                            <span style={{ fontWeight: '500', color: '#495057' }}>
                              📅 {formatSingleDate(dateStr)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removePreferredDate(dateStr)}
                              style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="tourist-preferences-dates-help">
                    <p>
                      <strong>Pro tip:</strong> Select specific dates when you want to be most active. 
                      {userInfo.preferredDays.length === 0 && " Leave empty if you're flexible with any day during your trip."}
                      {userInfo.preferredDays.length > 0 && ` You've selected ${userInfo.preferredDays.length} preferred date${userInfo.preferredDays.length === 1 ? '' : 's'}.`}
                    </p>
                    {userInfo.startDate && userInfo.endDate && (
                      <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                        You can only select dates between {formatDate(userInfo.startDate)} and {formatDate(userInfo.endDate)}.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* NEW: Preferred Activity Times */}
              <div className="tourist-preferences-glass-container">
                <div className="tourist-preferences-section-header">
                  <h3>Preferred Activity Times</h3>
                  <p>Set your preferred start and end times for daily activities</p>
                </div>
                
                <div className="tourist-preferences-time-preferences">
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <label className="tourist-preferences-input-label">Preferred Start Time</label>
                      <input
                        type="time"
                        value={userInfo.preferredStartTime}
                        onChange={(e) => handleUserInfoChange('preferredStartTime', e.target.value)}
                        className="tourist-preferences-time-input"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                      />
                      <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        When you prefer activities to begin
                      </p>
                    </div>
                    
                    <div>
                      <label className="tourist-preferences-input-label">Preferred End Time</label>
                      <input
                        type="time"
                        value={userInfo.preferredEndTime}
                        onChange={(e) => handleUserInfoChange('preferredEndTime', e.target.value)}
                        className="tourist-preferences-time-input"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                      />
                      <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        When you prefer activities to end
                      </p>
                    </div>
                  </div>
                  
                  {userInfo.preferredStartTime && userInfo.preferredEndTime && (
                    <div style={{
                      backgroundColor: '#e8f5e8',
                      border: '1px solid #4caf50',
                      borderRadius: '8px',
                      padding: '15px',
                      textAlign: 'center'
                    }}>
                      <p style={{ margin: 0, color: '#2e7d32', fontWeight: '500' }}>
                         Your preferred activity window: {formatTime(userInfo.preferredStartTime)} - {formatTime(userInfo.preferredEndTime)}
                      </p>
                    </div>
                  )}
                  
                  <div className="tourist-preferences-time-help" style={{ marginTop: '15px' }}>
                    <p>
                      <strong>Pro tip:</strong> We'll try to schedule most activities within your preferred time window. 
                      {!userInfo.preferredStartTime && !userInfo.preferredEndTime && " Default is 9:00 AM - 5:00 PM if not specified."}
                    </p>
                  </div>
                </div>
              </div>

              {/* NEW: Transportation Toggle */}
              <div className="tourist-preferences-glass-container">
                <div className="tourist-preferences-section-header">
                  <h3>Transportation</h3>
                  <p>Do you need transportation assistance during your stay?</p>
                </div>
                
                <div className="tourist-preferences-transportation">
                  <button
                    type="button"
                    onClick={() => handleUserInfoChange('needTransportation', !userInfo.needTransportation)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '20px',
                      backgroundColor: userInfo.needTransportation ? '#e8f5e8' : '#f8f9fa',
                      border: userInfo.needTransportation ? '2px solid #4caf50' : '2px solid #e9ecef',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span>I need transportation assistance</span>
                    </div>
                    <div style={{
                      width: '50px',
                      height: '26px',
                      backgroundColor: userInfo.needTransportation ? '#4caf50' : '#ccc',
                      borderRadius: '13px',
                      position: 'relative',
                      transition: 'background-color 0.3s ease'
                    }}>
                      <div style={{
                        width: '22px',
                        height: '22px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        left: userInfo.needTransportation ? '26px' : '2px',
                        transition: 'left 0.3s ease'
                      }} />
                    </div>
                  </button>
                  
                  <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                    <p>
                       <strong>Pro tip:</strong> If enabled, we'll include transportation options and costs in your itinerary recommendations.
                      {userInfo.needTransportation && " Transportation assistance is enabled - we'll help you get around!"}
                      {!userInfo.needTransportation && " Transportation assistance is disabled - you'll handle your own transportation."}
                    </p>
                  </div>
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
              
              {/* Weighted priorities */}
              <div className="tourist-preferences-glass-container">
                <div className="tourist-preferences-review-header">
                  <div>
                    <h3 className="tourist-preferences-review-title">Your Weighted Priorities</h3>
                    <p className="tourist-preferences-review-subtitle">Ranked by selection order with dynamic weights</p>
                  </div>
                </div>
                
                {selectedPreferences.length > 0 ? (
                  <div className="tourist-preferences-priority-list">
                    {selectedPreferences.slice(0, 5).map((prefId, index) => {
                      const pref = preferenceCategories.find(p => p.id === prefId);
                      const weight = selectedPreferences.length - index;
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
                            <div className="tourist-preferences-priority-desc">
                              Weight: {weight} • {index === 0 ? 'Highest Priority' : `Priority ${index + 1}`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {selectedPreferences.length > 5 && (
                      <div className="tourist-preferences-priority-more">
                        + {selectedPreferences.length - 5} more experiences with weights {selectedPreferences.length - 5} to 1
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
                  <div>
                    <h3 className="tourist-preferences-review-title">Trip Summary</h3>
                    <p className="tourist-preferences-review-subtitle">Your perfect getaway details</p>
                  </div>
                </div>
                
                <div className="tourist-preferences-summary-list">
                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span className="tourist-preferences-summary-icon"></span>
                      <span>Daily Budget</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {getCurrencySymbol(userInfo.currency)}{userInfo.budget || '0'} {userInfo.currency}
                      {userInfo.currency !== 'JMD' && userInfo.budget && (
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                          (≈ J${convertToJMD(userInfo.budget, userInfo.currency).toLocaleString()} JMD)
                        </div>
                      )}
                    </span>
                </div>

                  
                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span>Travel Dates</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {userInfo.startDate ? `${formatDate(userInfo.startDate, userInfo.startTime)} - ${formatDate(userInfo.endDate, userInfo.endTime)}` : 'Not selected'}
                    </span>
                  </div>
                  
                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span>Duration</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {calculateDuration() || 0} days
                    </span>
                  </div>

                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span>Preferred Activity Dates</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {formatPreferredDates()}
                    </span>
                  </div>

                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span>Preferred Activity Times</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {userInfo.preferredStartTime && userInfo.preferredEndTime 
                        ? `${formatTime(userInfo.preferredStartTime)} - ${formatTime(userInfo.preferredEndTime)}`
                        : 'Default hours (9:00 AM - 5:00 PM)'
                      }
                    </span>
                  </div>

                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span>Transportation</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {userInfo.needTransportation ? 'Transportation needed' : 'No transportation needed'}
                    </span>
                  </div>
                  
                  {userInfo.preferredDays.length > 0 && (
                    <div className="tourist-preferences-summary-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <div className="tourist-preferences-summary-label" style={{ marginBottom: '8px' }}>
                        <span>Selected Dates</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {userInfo.preferredDays.slice(0, 3).map((dateStr, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: '#e3f2fd',
                              color: '#1565c0',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            {formatSingleDate(dateStr)}
                          </span>
                        ))}
                        {userInfo.preferredDays.length > 3 && (
                          <span style={{ fontSize: '12px', color: '#666' }}>
                            +{userInfo.preferredDays.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
                      <span>Location</span>
                    </div>
                    <span className="tourist-preferences-summary-value">
                      {userInfo.parish || 'Not selected'}
                    </span>
                  </div>
                  
                  <div className="tourist-preferences-summary-item">
                    <div className="tourist-preferences-summary-label">
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

            {error && (
              <div className="tourist-preferences-error-message">
                
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
            <a href="/tourist-profile" className="tourist-preferences-nav-link">Home</a>
            <a href="/search" className="tourist-preferences-nav-link">Explore</a>
            <a href="#" className="tourist-preferences-nav-link">About Us</a>
           
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
            <span>{loading ? 'Saving & Redirecting...' : 'Generate your Itinerary'}</span>
            
          </button>
        )}
      </div>

      {/* Loading Overlay */}
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
            <h3>Saving Your Weighted Preferences</h3>
            <p>Preparing your personalized Jamaica experience with priority weights and time preferences...</p>
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
            <p>yaadQuest@gmail.com</p>
          </div>
          <div className="tourist-preferences-footer-section">
            <h3>Further</h3>
            <a href="/search"><p>Search for more places</p></a>
          
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TouristPreferencesForm;