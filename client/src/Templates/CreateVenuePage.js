// // // CreateVenuePage.js 
// // import React, { useState } from "react";
// // import "../css/CreateEventPage.css";
// // import JamaicanAddressForm from "./JamaicanAddressForm";

// // const daysOfWeek = [
// //   "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
// // ];

// // // Venue types 
// // const venueTypes = [
// //   'Beach/River',
// //   'Outdoor Adventure',
// //   'Indoor Adventure',
// //   'Museum/Historical Site',
// //   'Food & Dining (Local)',
// //   'Food & Dining (Unique)',
// //   'Club/Bar/Party',
// //   'Live Music',
// //   'Festival'
// // ];

// // // Generate time options (24-hour format for database)
// // const generateTimeOptions = () => {
// //   const times = [];
// //   for (let hour = 0; hour < 24; hour++) {
// //     for (let minute of ['00', '30']) {
// //       const time24 = `${hour.toString().padStart(2, '0')}:${minute}`;
// //       const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
// //       const ampm = hour < 12 ? 'AM' : 'PM';
// //       const display = `${hour12}:${minute} ${ampm}`;
// //       times.push({ value: time24, display });
// //     }
// //   }
// //   return times;
// // };

// // const timeOptions = generateTimeOptions();

// // function DaysSelector({ selectedDays, setSelectedDays }) {
// //   const toggleDay = (day) => {
// //     setSelectedDays(prev => 
// //       prev.includes(day) 
// //         ? prev.filter(d => d !== day)
// //         : [...prev, day]
// //     );
// //   };

// //   return (
// //     <div className="days-selector">
// //       <label>Days Open:</label>
// //       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
// //         {daysOfWeek.map(day => (
// //           <label key={day} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
// //             <input
// //               type="checkbox"
// //               checked={selectedDays.includes(day)}
// //               onChange={() => toggleDay(day)}
// //               style={{ marginRight: '5px' }}
// //             />
// //             {day}
// //           </label>
// //         ))}
// //       </div>
// //       {selectedDays.length > 0 && (
// //         <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
// //           Open {selectedDays.length} day{selectedDays.length === 1 ? '' : 's'} per week
// //         </p>
// //       )}
// //     </div>
// //   );
// // }

// // export default function CreateVenuePage() {
// //   const [name, setName] = useState("");
// //   const [venueType, setVenueType] = useState("");
// //   const [openingTime, setOpeningTime] = useState("");
// //   const [closingTime, setClosingTime] = useState("");
// //   const [cost, setCost] = useState("");
// //   const [address, setAddress] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [daysOpen, setDaysOpen] = useState([]);
// //   const [latitude, setLatitude] = useState("");
// //   const [longitude, setLongitude] = useState("");
  
// //   // Add loading and message states
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [success, setSuccess] = useState(null);

// //   // Get auth headers (adjust this based on your auth implementation)
// //   const getAuthHeaders = () => {
// //     const token = localStorage.getItem('token'); // Adjust based on your token storage
// //     return {
// //       'Authorization': `Bearer ${token}`,
// //       'Content-Type': 'application/json'
// //     };
// //   };

// //   // Format time for display
// //   const formatTimeDisplay = (time24) => {
// //     if (!time24) return '';
// //     const [hours, minutes] = time24.split(':');
// //     const hour = parseInt(hours);
// //     const ampm = hour >= 12 ? 'PM' : 'AM';
// //     const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
// //     return `${displayHour}:${minutes} ${ampm}`;
// //   };

// //   const handleCreateVenue = async () => {
// //     // Reset messages
// //     setError(null);
// //     setSuccess(null);

   
// //     if (!name.trim()) {
// //       setError("Venue name is required");
// //       return;
// //     }
// //     if (!venueType) {
// //       setError("Venue type is required");
// //       return;
// //     }
// //     if (!address.trim()) {
// //       setError("Address is required");
// //       return;
// //     }

   

// //     // Validate cost
// //     if (cost && (isNaN(parseFloat(cost)) || parseFloat(cost) < 0)) {
// //       setError("Cost must be a valid positive number");
// //       return;
// //     }

// //     // Validate times
// //     if (openingTime && closingTime && openingTime >= closingTime) {
// //       setError("Closing time must be after opening time");
// //       return;
// //     }

// //     // Validate coordinates if provided
// //     if (latitude && (isNaN(parseFloat(latitude)) || parseFloat(latitude) < -90 || parseFloat(latitude) > 90)) {
// //       setError("Latitude must be a number between -90 and 90");
// //       return;
// //     }

// //     if (longitude && (isNaN(parseFloat(longitude)) || parseFloat(longitude) < -180 || parseFloat(longitude) > 180)) {
// //       setError("Longitude must be a number between -180 and 180");
// //       return;
// //     }

// //     const venueData = {
// //       name: name.trim(),
// //       venue_type: venueType,
// //       opening_time: openingTime || null,
// //       closing_time: closingTime || null,
// //       cost: cost ? parseFloat(cost) : null,
// //       address: address.trim(),
// //       description: description.trim() || null,
// //       days_open: daysOpen,
// //       latitude: latitude ? parseFloat(latitude) : null,
// //       longitude: longitude ? parseFloat(longitude) : null
// //     };

// //     try {
// //       setLoading(true);
// //       console.log("Creating venue:", venueData);

// //       const response = await fetch('http://localhost:5001/api/venues/create', {
// //         method: 'POST',
// //         headers: getAuthHeaders(),
// //         body: JSON.stringify(venueData)
// //       });

// //       const result = await response.json();

// //       if (response.ok) {
// //         console.log('Venue created successfully:', result);
        
// //         setSuccess({
// //           title: 'Venue Created Successfully! 🎉',
// //           message: `"${name}" has been added to the database. Venue ID: ${result.venue.venue_id}`,
// //           details: `Type: ${venueType} • Address: ${address} • Cost: ${cost ? `JMD $${cost}` : 'Free'} • Days: ${daysOpen.length} days/week`
// //         });

// //         // Reset form after successful creation
// //         setName("");
// //         setVenueType("");
// //         setOpeningTime("");
// //         setClosingTime("");
// //         setCost("");
// //         setAddress("");
// //         setDescription("");
// //         setDaysOpen([]);
// //         setLatitude("");
// //         setLongitude("");

// //         // Optional: redirect after delay
// //         setTimeout(() => {
// //           // window.location.href = '/venues'; // Adjust to your venue list page
// //         }, 3000);

// //       } else {
// //         throw new Error(result.error || 'Failed to create venue');
// //       }

// //     } catch (error) {
// //       console.error('Error creating venue:', error);
      
// //       if (error.message.includes('401') || error.message.includes('unauthorized')) {
// //         setError('Your session has expired. Please log in again.');
// //       } else if (error.message.includes('Invalid business ID')) {
// //         setError('Invalid Business ID. Please check that the business exists in the system.');
// //       } else {
// //         setError(`Failed to create venue: ${error.message}`);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="event-container">
// //       <div className="event-form">
// //         {/* Error Message */}
// //         {error && (
// //           <div style={{
// //             backgroundColor: '#f8d7da',
// //             border: '1px solid #f5c6cb',
// //             borderRadius: '8px',
// //             padding: '15px',
// //             margin: '20px 0',
// //             color: '#721c24'
// //           }}>
// //             <strong>Error:</strong> {error}
// //           </div>
// //         )}

// //         {/* Success Message */}
// //         {success && (
// //           <div style={{
// //             backgroundColor: '#d4edda',
// //             border: '1px solid #c3e6cb',
// //             borderRadius: '8px',
// //             padding: '20px',
// //             margin: '20px 0',
// //             color: '#155724'
// //           }}>
// //             <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
// //               {success.title}
// //             </h3>
// //             <p style={{ margin: '0 0 5px 0' }}>{success.message}</p>
// //             <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>{success.details}</p>
// //           </div>
// //         )}

        

// //         <div className="form-group">
// //           <label>Venue Name: *</label>
// //           <input 
// //             type="text" 
// //             value={name} 
// //             onChange={(e) => setName(e.target.value)}
// //             placeholder="Enter venue name"
// //             disabled={loading}
// //             maxLength="100"
// //           />
// //         </div>

// //         <div className="form-group">
// //           <label>Venue Type: *</label>
// //           <select 
// //             value={venueType} 
// //             onChange={(e) => setVenueType(e.target.value)}
// //             disabled={loading}
// //             style={{
// //               width: '100%',
// //               padding: '12px',
// //               border: '2px solid #e9ecef',
// //               borderRadius: '8px',
// //               fontSize: '16px',
// //               backgroundColor: 'white',
// //               cursor: 'pointer'
// //             }}
// //           >
// //             <option value="">-- Please Select a Venue Type --</option>
// //             {venueTypes.map(type => (
// //               <option key={type} value={type}>{type}</option>
// //             ))}
// //           </select>
// //           <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
// //             Choose the category that best describes your venue
// //           </small>
// //           {venueType && (
// //             <p style={{ fontSize: '14px', color: '#28a745', marginTop: '5px' }}>
// //               Selected: <strong>{venueType}</strong>
// //             </p>
// //           )}
// //         </div>

// //         <div className="form-group">
// //           <label>Operating Hours:</label>
// //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
// //             <div>
// //               <label style={{ fontSize: '14px', fontWeight: 'normal' }}>Opening Time:</label>
// //               <select 
// //                 value={openingTime} 
// //                 onChange={(e) => setOpeningTime(e.target.value)}
// //                 disabled={loading}
// //               >
// //                 <option value="">-- Select Opening Time --</option>
// //                 {timeOptions.map(time => (
// //                   <option key={time.value} value={time.value}>{time.display}</option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div>
// //               <label style={{ fontSize: '14px', fontWeight: 'normal' }}>Closing Time:</label>
// //               <select 
// //                 value={closingTime} 
// //                 onChange={(e) => setClosingTime(e.target.value)}
// //                 disabled={loading}
// //               >
// //                 <option value="">-- Select Closing Time --</option>
// //                 {timeOptions.map(time => (
// //                   <option key={time.value} value={time.value}>{time.display}</option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>
// //           {openingTime && closingTime && (
// //             <p style={{ fontSize: '14px', color: '#28a745', marginTop: '5px' }}>
// //               Hours: {formatTimeDisplay(openingTime)} - {formatTimeDisplay(closingTime)}
// //             </p>
// //           )}
// //         </div>

// //         <DaysSelector selectedDays={daysOpen} setSelectedDays={setDaysOpen} />

// //         <div className="form-group">
// //           <label> Average Cost (JMD):</label>
// //           <input 
// //             type="number" 
// //             value={cost} 
// //             onChange={(e) => setCost(e.target.value)}
// //             placeholder="Enter cost per person (leave empty if free)"
// //             min="0"
// //             step="50"
// //             disabled={loading}
// //           />
// //         </div>

// //         <h3>Address: *</h3>
// //         <JamaicanAddressForm onAddressChange={setAddress} />

// //         <div className="form-group">
// //           <label>Description:</label>
// //           <textarea 
// //             rows="4" 
// //             value={description} 
// //             onChange={(e) => setDescription(e.target.value)}
// //             placeholder="Describe your venue..."
// //             disabled={loading}
// //           />
// //         </div>

       

// //         <div className="action-buttons">
// //           <button 
// //             className="finish-button" 
// //             onClick={handleCreateVenue}
// //             disabled={loading}
// //           >
// //             {loading ? 'Creating Venue...' : 'Create Venue'}
// //           </button>
// //           <button 
// //             className="cancel-button"
// //             onClick={() => {
// //               // Reset form
              
// //               setName("");
// //               setVenueType("");
// //               setOpeningTime("");
// //               setClosingTime("");
// //               setCost("");
// //               setAddress("");
// //               setDescription("");
// //               setDaysOpen([]);
// //               setLatitude("");
// //               setLongitude("");
// //               setError(null);
// //               setSuccess(null);
// //             }}
// //             disabled={loading}
// //           >
// //             Cancel
// //           </button>
// //         </div>
// //       </div>

// //       {/* Loading Overlay */}
// //       {loading && (
// //         <div style={{
// //           position: 'fixed',
// //           top: 0,
// //           left: 0,
// //           right: 0,
// //           bottom: 0,
// //           backgroundColor: 'rgba(0, 0, 0, 0.75)',
// //           display: 'flex',
// //           alignItems: 'center',
// //           justifyContent: 'center',
// //           zIndex: 9999
// //         }}>
// //           <div style={{
// //             backgroundColor: 'white',
// //             padding: '2rem',
// //             borderRadius: '1rem',
// //             textAlign: 'center',
// //             maxWidth: '400px'
// //           }}>
// //             <div style={{
// //               width: '40px',
// //               height: '40px',
// //               border: '4px solid #e5e7eb',
// //               borderTop: '4px solid #3b82f6',
// //               borderRadius: '50%',
// //               animation: 'spin 1s linear infinite',
// //               margin: '0 auto 1rem auto'
// //             }}></div>
// //             <h3>Creating Venue</h3>
// //             <p>Saving venue details to database...</p>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // CreateVenuePage.js 
// import React, { useState, useEffect } from "react";
// import "../css/CreateEventPage.css";
// import JamaicanAddressForm from "./JamaicanAddressForm";
// import { useAuth } from "../contexts/AuthContext"; // Import your existing AuthContext

// const daysOfWeek = [
//   "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
// ];

// // Venue types 
// const venueTypes = [
//   'Beach/River',
//   'Outdoor Adventure',
//   'Indoor Adventure',
//   'Museum/Historical Site',
//   'Food & Dining (Local)',
//   'Food & Dining (Unique)',
//   'Club/Bar/Party',
//   'Live Music',
//   'Festival'
// ];

// // Generate time options (24-hour format for database)
// const generateTimeOptions = () => {
//   const times = [];
//   for (let hour = 0; hour < 24; hour++) {
//     for (let minute of ['00', '30']) {
//       const time24 = `${hour.toString().padStart(2, '0')}:${minute}`;
//       const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
//       const ampm = hour < 12 ? 'AM' : 'PM';
//       const display = `${hour12}:${minute} ${ampm}`;
//       times.push({ value: time24, display });
//     }
//   }
//   return times;
// };

// const timeOptions = generateTimeOptions();

// function DaysSelector({ selectedDays, setSelectedDays }) {
//   const toggleDay = (day) => {
//     setSelectedDays(prev => 
//       prev.includes(day) 
//         ? prev.filter(d => d !== day)
//         : [...prev, day]
//     );
//   };

//   return (
//     <div className="days-selector">
//       <label>Days Open:</label>
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
//         {daysOfWeek.map(day => (
//           <label key={day} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
//             <input
//               type="checkbox"
//               checked={selectedDays.includes(day)}
//               onChange={() => toggleDay(day)}
//               style={{ marginRight: '5px' }}
//             />
//             {day}
//           </label>
//         ))}
//       </div>
//       {selectedDays.length > 0 && (
//         <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
//           Open {selectedDays.length} day{selectedDays.length === 1 ? '' : 's'} per week
//         </p>
//       )}
//     </div>
//   );
// }

// export default function CreateVenuePage() {
//   // Use your existing AuthContext
//   const { user, userId, token, loading: authLoading, isAuthenticated, getAuthHeaders, logout } = useAuth();

//   const [name, setName] = useState("");
//   const [venueType, setVenueType] = useState("");
//   const [openingTime, setOpeningTime] = useState("");
//   const [closingTime, setClosingTime] = useState("");
//   const [cost, setCost] = useState("");
//   const [address, setAddress] = useState("");
//   const [description, setDescription] = useState("");
//   const [daysOpen, setDaysOpen] = useState([]);
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
  
//   // Add loading and message states
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
  
//   // Business info state
//   const [businessInfo, setBusinessInfo] = useState(null);
//   const [businessLoading, setBusinessLoading] = useState(true);

//   // Fetch business info when component mounts or user changes
//   useEffect(() => {
//     const fetchBusinessInfo = async () => {
//       if (!isAuthenticated || !userId) {
//         setBusinessLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(`http://localhost:5001/api/user/business/${userId}`, {
//           method: 'GET',
//           headers: getAuthHeaders()
//         });

//         if (response.status === 401) {
//           setError('Your session has expired. Please log in again.');
//           logout();
//           return;
//         }

//         if (response.ok) {
//           const businessData = await response.json();
//           setBusinessInfo(businessData);
//         } else {
//           // If user doesn't have a business yet, that's okay
//           console.log('No business found for user');
//           setBusinessInfo(null);
//         }
//       } catch (error) {
//         console.error('Error fetching business info:', error);
//         // Don't set error here as user might not have a business yet
//       } finally {
//         setBusinessLoading(false);
//       }
//     };

//     if (!authLoading) {
//       fetchBusinessInfo();
//     }
//   }, [userId, isAuthenticated, authLoading, getAuthHeaders, logout]);

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       window.location.href = '/login';
//     }
//   }, [authLoading, isAuthenticated]);

//   // Format time for display
//   const formatTimeDisplay = (time24) => {
//     if (!time24) return '';
//     const [hours, minutes] = time24.split(':');
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
//     return `${displayHour}:${minutes} ${ampm}`;
//   };

//   const handleCreateVenue = async () => {
//     // Reset messages
//     setError(null);
//     setSuccess(null);

//     // Check authentication
//     if (!isAuthenticated) {
//       setError('You must be logged in to create a venue.');
//       window.location.href = '/login';
//       return;
//     }

//     // Check if user has a business (if required by your business logic)
//     if (!businessInfo && user?.userType === 'business') {
//       setError('You must have a business registered to create venues. Please complete your business registration first.');
//       return;
//     }

//     // Validation
//     if (!name.trim()) {
//       setError("Venue name is required");
//       return;
//     }
//     if (!venueType) {
//       setError("Venue type is required");
//       return;
//     }
//     if (!address.trim()) {
//       setError("Address is required");
//       return;
//     }

//     // Validate cost
//     if (cost && (isNaN(parseFloat(cost)) || parseFloat(cost) < 0)) {
//       setError("Cost must be a valid positive number");
//       return;
//     }

//     // Validate times
//     if (openingTime && closingTime && openingTime >= closingTime) {
//       setError("Closing time must be after opening time");
//       return;
//     }

//     // Validate coordinates if provided
//     if (latitude && (isNaN(parseFloat(latitude)) || parseFloat(latitude) < -90 || parseFloat(latitude) > 90)) {
//       setError("Latitude must be a number between -90 and 90");
//       return;
//     }

//     if (longitude && (isNaN(parseFloat(longitude)) || parseFloat(longitude) < -180 || parseFloat(longitude) > 180)) {
//       setError("Longitude must be a number between -180 and 180");
//       return;
//     }

//     const venueData = {
//       name: name.trim(),
//       venue_type: venueType,
//       opening_time: openingTime || null,
//       closing_time: closingTime || null,
//       cost: cost ? parseFloat(cost) : null,
//       address: address.trim(),
//       description: description.trim() || null,
//       days_open: daysOpen,
//       // Include user and business information
//       user_id: userId,
//       business_id: businessInfo?.id || businessInfo?.business_id || null
//     };

//     try {
//       setLoading(true);
//       console.log("Creating venue:", venueData);

//       const response = await fetch('http://localhost:5001/api/venues/create', {
//         method: 'POST',
//         headers: getAuthHeaders(),
//         body: JSON.stringify(venueData)
//       });

//       // Handle authentication errors
//       if (response.status === 401) {
//         setError('Your session has expired. Please log in again.');
//         logout();
//         return;
//       }

//       const result = await response.json();

//       if (response.ok) {
//         console.log('Venue created successfully:', result);
        
//         setSuccess({
//           title: 'Venue Created Successfully! 🎉',
//           message: `"${name}" has been added to the database. Venue ID: ${result.venue.venue_id}`,
//           details: `Type: ${venueType} • Address: ${address} • Cost: ${cost ? `JMD $${cost}` : 'Free'} • Days: ${daysOpen.length} days/week${businessInfo?.name ? ` • Business: ${businessInfo.name}` : ''}`
//         });

//         // Reset form after successful creation
//         setName("");
//         setVenueType("");
//         setOpeningTime("");
//         setClosingTime("");
//         setCost("");
//         setAddress("");
//         setDescription("");
//         setDaysOpen([]);
        

//         // Optional: redirect after delay
//         setTimeout(() => {
//           // window.location.href = '/venues'; // Adjust to your venue list page
//         }, 3000);

//       } else {
//         throw new Error(result.error || result.message || 'Failed to create venue');
//       }

//     } catch (error) {
//       console.error('Error creating venue:', error);
      
//       if (error.message.includes('401') || error.message.includes('unauthorized')) {
//         setError('Your session has expired. Please log in again.');
//         logout();
//       } else if (error.message.includes('Invalid business ID')) {
//         setError('Invalid Business ID. Please check that your business is properly registered.');
//       } else if (error.message.includes('Network') || error.message.includes('fetch')) {
//         setError('Network error. Please check your connection and try again.');
//       } else {
//         setError(`Failed to create venue: ${error.message}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Show loading while auth is initializing
//   if (authLoading || businessLoading) {
//     return (
//       <div className="event-container">
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           minHeight: '400px',
//           flexDirection: 'column'
//         }}>
//           <div style={{
//             width: '40px',
//             height: '40px',
//             border: '4px solid #e5e7eb',
//             borderTop: '4px solid #3b82f6',
//             borderRadius: '50%',
//             animation: 'spin 1s linear infinite',
//             marginBottom: '1rem'
//           }}></div>
//           <p>{authLoading ? 'Loading session...' : 'Loading business info...'}</p>
//         </div>
//       </div>
//     );
//   }

//   // Show message if not authenticated
//   if (!isAuthenticated) {
//     return (
//       <div className="event-container">
//         <div style={{
//           backgroundColor: '#f8d7da',
//           border: '1px solid #f5c6cb',
//           borderRadius: '8px',
//           padding: '2rem',
//           margin: '2rem',
//           textAlign: 'center',
//           color: '#721c24'
//         }}>
//           <h3>Authentication Required</h3>
//           <p>You must be logged in to create a venue.</p>
//           <button 
//             onClick={() => window.location.href = '/login'}
//             style={{
//               backgroundColor: '#dc3545',
//               color: 'white',
//               border: 'none',
//               padding: '0.5rem 1rem',
//               borderRadius: '4px',
//               cursor: 'pointer'
//             }}
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="event-container">
//       <div className="event-form">
//         {/* User Info Display */}
       

//         {/* Business Warning for Business Users */}
//         {user?.userType === 'business' && !businessInfo && (
//           <div style={{
//             backgroundColor: '#fff3cd',
//             border: '1px solid #ffeaa7',
//             borderRadius: '8px',
//             padding: '15px',
//             margin: '0 0 20px 0',
//             color: '#856404'
//           }}>
//             <strong>Notice:</strong> You're logged in as a business user but no business information was found. 
//             You may need to complete your business registration before creating venues.
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div style={{
//             backgroundColor: '#f8d7da',
//             border: '1px solid #f5c6cb',
//             borderRadius: '8px',
//             padding: '15px',
//             margin: '20px 0',
//             color: '#721c24'
//           }}>
//             <strong>Error:</strong> {error}
//           </div>
//         )}

//         {/* Success Message */}
//         {success && (
//           <div style={{
//             backgroundColor: '#d4edda',
//             border: '1px solid #c3e6cb',
//             borderRadius: '8px',
//             padding: '20px',
//             margin: '20px 0',
//             color: '#155724'
//           }}>
//             <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
//               {success.title}
//             </h3>
//             <p style={{ margin: '0 0 5px 0' }}>{success.message}</p>
//             <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>{success.details}</p>
//           </div>
//         )}

//         <div className="form-group">
//           <label>Venue Name: *</label>
//           <input 
//             type="text" 
//             value={name} 
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Enter venue name"
//             disabled={loading}
//             maxLength="100"
//           />
//         </div>

//         <div className="form-group">
//           <label>Venue Type: *</label>
//           <select 
//             value={venueType} 
//             onChange={(e) => setVenueType(e.target.value)}
//             disabled={loading}
//             style={{
//               width: '100%',
//               padding: '12px',
//               border: '2px solid #e9ecef',
//               borderRadius: '8px',
//               fontSize: '16px',
//               backgroundColor: 'white',
//               cursor: 'pointer'
//             }}
//           >
//             <option value="">-- Please Select a Venue Type --</option>
//             {venueTypes.map(type => (
//               <option key={type} value={type}>{type}</option>
//             ))}
//           </select>
//           <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
//             Choose the category that best describes your venue
//           </small>
//           {venueType && (
//             <p style={{ fontSize: '14px', color: '#28a745', marginTop: '5px' }}>
//               Selected: <strong>{venueType}</strong>
//             </p>
//           )}
//         </div>

//         <div className="form-group">
//           <label>Operating Hours:</label>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
//             <div>
//               <label style={{ fontSize: '14px', fontWeight: 'normal' }}>Opening Time:</label>
//               <select 
//                 value={openingTime} 
//                 onChange={(e) => setOpeningTime(e.target.value)}
//                 disabled={loading}
//               >
//                 <option value="">-- Select Opening Time --</option>
//                 {timeOptions.map(time => (
//                   <option key={time.value} value={time.value}>{time.display}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label style={{ fontSize: '14px', fontWeight: 'normal' }}>Closing Time:</label>
//               <select 
//                 value={closingTime} 
//                 onChange={(e) => setClosingTime(e.target.value)}
//                 disabled={loading}
//               >
//                 <option value="">-- Select Closing Time --</option>
//                 {timeOptions.map(time => (
//                   <option key={time.value} value={time.value}>{time.display}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           {openingTime && closingTime && (
//             <p style={{ fontSize: '14px', color: '#28a745', marginTop: '5px' }}>
//               Hours: {formatTimeDisplay(openingTime)} - {formatTimeDisplay(closingTime)}
//             </p>
//           )}
//         </div>

//         <DaysSelector selectedDays={daysOpen} setSelectedDays={setDaysOpen} />

//         <div className="form-group">
//           <label>Average Cost (JMD):</label>
//           <input 
//             type="number" 
//             value={cost} 
//             onChange={(e) => setCost(e.target.value)}
//             placeholder="Enter cost per person (leave empty if free)"
//             min="0"
//             step="50"
//             disabled={loading}
//           />
//         </div>

//         <h3>Address: *</h3>
//         <JamaicanAddressForm onAddressChange={setAddress} />

//         <div className="form-group">
//           <label>Description:</label>
//           <textarea 
//             rows="4" 
//             value={description} 
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Describe your venue..."
//             disabled={loading}
//           />
//         </div>

//         <div className="action-buttons">
//           <button 
//             className="finish-button" 
//             onClick={handleCreateVenue}
//             disabled={loading || !isAuthenticated}
//           >
//             {loading ? 'Creating Venue...' : 'Create Venue'}
//           </button>
//           <button 
//             className="cancel-button"
//             onClick={() => {
//               // Reset form
//               setName("");
//               setVenueType("");
//               setOpeningTime("");
//               setClosingTime("");
//               setCost("");
//               setAddress("");
//               setDescription("");
//               setDaysOpen([]);
//               setLatitude("");
//               setLongitude("");
//               setError(null);
//               setSuccess(null);
//             }}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>
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
//               borderTop: '4px solid #3b82f6',
//               borderRadius: '50%',
//               animation: 'spin 1s linear infinite',
//               margin: '0 auto 1rem auto'
//             }}></div>
//             <h3>Creating Venue</h3>
//             <p>Saving venue details to database...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// CreateVenuePage.js 
import React, { useState, useEffect } from "react";
import "../css/CreateEventPage.css";
import JamaicanAddressForm from "./JamaicanAddressForm";
import { useAuth } from "../contexts/AuthContext"; // Your existing AuthContext

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

// Venue types 
const venueTypes = [
  'Beach/River',
  'Outdoor Adventure',
  'Indoor Adventure',
  'Museum/Historical Site',
  'Food & Dining (Local)',
  'Food & Dining (Unique)',
  'Club/Bar/Party',
  'Live Music',
  'Festival'
];

// Generate time options (24-hour format for database)
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of ['00', '30']) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute}`;
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const display = `${hour12}:${minute} ${ampm}`;
      times.push({ value: time24, display });
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

function DaysSelector({ selectedDays, setSelectedDays }) {
  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <div className="days-selector">
      <label>Days Open:</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
        {daysOfWeek.map(day => (
          <label key={day} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={selectedDays.includes(day)}
              onChange={() => toggleDay(day)}
              style={{ marginRight: '5px' }}
            />
            {day}
          </label>
        ))}
      </div>
      {selectedDays.length > 0 && (
        <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
          Open {selectedDays.length} day{selectedDays.length === 1 ? '' : 's'} per week
        </p>
      )}
    </div>
  );
}

export default function CreateVenuePage() {
  // Use your existing AuthContext
  const { userId, isAuthenticated, getAuthHeaders, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [venueType, setVenueType] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [cost, setCost] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [daysOpen, setDaysOpen] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [authLoading, isAuthenticated]);

  // Format time for display
  const formatTimeDisplay = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleCreateVenue = async () => {
    setError(null);
    setSuccess(null);

    // Check authentication
    if (!isAuthenticated || !userId) {
      setError('You must be logged in to create a venue.');
      return;
    }

    // Basic validation
    if (!name.trim()) {
      setError("Venue name is required");
      return;
    }
    if (!venueType) {
      setError("Venue type is required");
      return;
    }
    if (!address.trim()) {
      setError("Address is required");
      return;
    }

    // Validate cost
    if (cost && (isNaN(parseFloat(cost)) || parseFloat(cost) < 0)) {
      setError("Cost must be a valid positive number");
      return;
    }

    // Validate times
    if (openingTime && closingTime && openingTime >= closingTime) {
      setError("Closing time must be after opening time");
      return;
    }

    const venueData = {
      name: name.trim(),
      venue_type: venueType,
      opening_time: openingTime || null,
      closing_time: closingTime || null,
      cost: cost ? parseFloat(cost) : null,
      address: address.trim(),
      description: description.trim() || null,
      days_open: daysOpen,
      user_id: userId
    };

    try {
      setLoading(true);
      console.log("Creating venue:", venueData);

      const response = await fetch('http://localhost:5001/api/venues/create', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(venueData)
      });

      if (response.status === 401) {
        setError('Your session has expired. Please log in again.');
        window.location.href = '/login';
        return;
      }

      const result = await response.json();

      if (response.ok) {
        console.log('Venue created successfully:', result);
        
        setSuccess({
          title: 'Venue Created Successfully! 🎉',
          message: `"${name}" has been added to the database.`,
          details: `Type: ${venueType} • Address: ${address} • Cost: ${cost ? `JMD $${cost}` : 'Free'}`
        });

        // Reset form after successful creation
        setName("");
        setVenueType("");
        setOpeningTime("");
        setClosingTime("");
        setCost("");
        setAddress("");
        setDescription("");
        setDaysOpen([]);

      } else {
        throw new Error(result.error || result.message || 'Failed to create venue');
      }

    } catch (error) {
      console.error('Error creating venue:', error);
      setError(`Failed to create venue: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="event-container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          flexDirection: 'column'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="event-container">
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          padding: '2rem',
          margin: '2rem',
          textAlign: 'center',
          color: '#721c24'
        }}>
          <h3>Authentication Required</h3>
          <p>You must be logged in to create a venue.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-container">
      <div className="event-form">
        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            padding: '15px',
            margin: '20px 0',
            color: '#721c24'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={{
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#155724'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
              {success.title}
            </h3>
            <p style={{ margin: '0 0 5px 0' }}>{success.message}</p>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>{success.details}</p>
          </div>
        )}

        <div className="form-group">
          <label>Venue Name: *</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter venue name"
            disabled={loading}
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label>Venue Type: *</label>
          <select 
            value={venueType} 
            onChange={(e) => setVenueType(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '16px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="">-- Please Select a Venue Type --</option>
            {venueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
            Choose the category that best describes your venue
          </small>
          {venueType && (
            <p style={{ fontSize: '14px', color: '#28a745', marginTop: '5px' }}>
              Selected: <strong>{venueType}</strong>
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Operating Hours:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 'normal' }}>Opening Time:</label>
              <select 
                value={openingTime} 
                onChange={(e) => setOpeningTime(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Select Opening Time --</option>
                {timeOptions.map(time => (
                  <option key={time.value} value={time.value}>{time.display}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 'normal' }}>Closing Time:</label>
              <select 
                value={closingTime} 
                onChange={(e) => setClosingTime(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Select Closing Time --</option>
                {timeOptions.map(time => (
                  <option key={time.value} value={time.value}>{time.display}</option>
                ))}
              </select>
            </div>
          </div>
          {openingTime && closingTime && (
            <p style={{ fontSize: '14px', color: '#28a745', marginTop: '5px' }}>
              Hours: {formatTimeDisplay(openingTime)} - {formatTimeDisplay(closingTime)}
            </p>
          )}
        </div>

        <DaysSelector selectedDays={daysOpen} setSelectedDays={setDaysOpen} />

        <div className="form-group">
          <label>Average Cost (JMD):</label>
          <input 
            type="number" 
            value={cost} 
            onChange={(e) => setCost(e.target.value)}
            placeholder="Enter cost per person (leave empty if free)"
            min="0"
            step="50"
            disabled={loading}
          />
        </div>

        <h3>Address: *</h3>
        <JamaicanAddressForm onAddressChange={setAddress} />

        <div className="form-group">
          <label>Description:</label>
          <textarea 
            rows="4" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your venue..."
            disabled={loading}
          />
        </div>

        <div className="action-buttons">
          <button 
            className="finish-button" 
            onClick={handleCreateVenue}
            disabled={loading || !isAuthenticated}
          >
            {loading ? 'Creating Venue...' : 'Create Venue'}
          </button>
          <button 
            className="cancel-button"
            onClick={() => {
              // Reset form
              setName("");
              setVenueType("");
              setOpeningTime("");
              setClosingTime("");
              setCost("");
              setAddress("");
              setDescription("");
              setDaysOpen([]);
              setError(null);
              setSuccess(null);
            }}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
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
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem auto'
            }}></div>
            <h3>Creating Venue</h3>
            <p>Saving venue details to database...</p>
          </div>
        </div>
      )}
    </div>
  );
}