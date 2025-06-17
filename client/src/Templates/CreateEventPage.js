// // CreateEventPage.js
// import React, { useState } from "react";
// import axios from 'axios';
// import "../css/CreateEventPage.css";
// import JamaicanAddressForm from "./JamaicanAddressForm";


// export default function CreateEventPage() {
//   const [name, setName] = useState("");
//   const [eventType, setEventType] = useState("");
//   const [address, setAddress] = useState("");
//   const [description, setDescription] = useState("");
//   const [duration, setDuration] = useState("");
//   const [cost, setCost] = useState("");
//   const [menuImage, setMenuImage] = useState(null);
//   const [flyerImage, setFlyerImage] = useState(null);
//   const [itineraryFile, setItineraryFile] = useState(null);

//   const [selectedDate, setSelectedDate] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [dateSchedule, setDateSchedule] = useState([]);


//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleAddDateSchedule = () => {
//     if (selectedDate && startTime && endTime) {
//       setDateSchedule([...dateSchedule, { date: selectedDate, startTime, endTime }]);
//       setSelectedDate("");
//       setStartTime("");
//       setEndTime("");
//     }
//   };

//   const removeScheduleItem = (index) => {
//     setDateSchedule(dateSchedule.filter((_, i) => i !== index));
//   };


//   const handleCreateEvent = () => {
//     const eventData = {
//       name,
//       eventType,
//       address,
//       description,
//       duration,
//       cost,
//       dateSchedule,
//     };

//     console.log("Event Created:", eventData);
//     alert(`Event Created:\n${JSON.stringify(eventData, null, 2)}`);
//   };

//   //uploading flyer, menu etc
//   const uploadFile = async (file, type) => {
//     if (!file) return null;
    
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('type', type);
    
//     try {
//       const response = await axios.post('/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return response.data.filePath;
//     } catch (error) {
//       console.error(`Error uploading ${type}:`, error);
//       throw new Error(`Failed to upload ${type}`);
//     }
//   };


//   return (
//     <div className="event-container">
//       {/* <header className="trip-header">
//         <div className="header-content">
//           <div className="logo">Yaad Quest</div>
//           <nav className="nav-links">
//             <a href="#">Home</a>
//             <a href="#">Explore</a>
//             <a href="#">Activities</a>
//             <a href="#">About Us</a>
//             <a href="#">Contact</a>
//           </nav>
//           <div className="avatar"></div>
//         </div>
//       </header> */}

//       {/* <div className="trip-banner">
//         <button className="back-button">⟵ Back</button>
//         <div className="banner-content">
//           <h1>Create Event</h1>
//           <p>Enter the details for your events</p>
//         </div>
//       </div> */}
      
//       <div className="event-form">
//         <div className="form-group">
//           <label>Event Name:</label>
//           <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
//         </div>

//         <div className="form-group">
//           <label>Event Type:</label>
//           <select
//             value={eventType}
//             onChange={(e) => setEventType(e.target.value)}
//           >
//             <option value="">Select an event type</option>
//             <option value="Concert">Concert</option>
//             <option value="Festival">Festival</option>
//             <option value="Food Fair">Food Fair</option>
//             <option value="Cultural Show">Cultural Show</option>
//             <option value="Tour">Tour</option>
//             <option value="Beach Party">Beach Party</option>
//             <option value="Community Market">Community Market</option>
//             <option value="Wellness Retreat">Wellness Retreat</option>
//             <option value="Nightlife">Nightlife</option>
//             <option value="Other">Other</option>
//           </select>

//           {["Food Fair", "Restaurant"].includes(eventType) && (
//             <div className="form-group">
//               <label>Upload Menu (Image):</label>
//               <input type="file" accept="image/*" onChange={(e) => setMenuImage(e.target.files[0])} />
//             </div>
//           )}

//           {["Concert", "Festival", "Nightlife"].includes(eventType) && (
//             <div className="form-group">
//               <label>Upload Flyer or Line-up (Image):</label>
//               <input type="file" accept="image/*" onChange={(e) => setFlyerImage(e.target.files[0])} />
//             </div>
//           )}

//           {["Tour", "Wellness Retreat"].includes(eventType) && (
//             <div className="form-group">
//               <label>Upload Itinerary (PDF or DOCX):</label>
//               <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setItineraryFile(e.target.files[0])} />
//             </div>
//           )}

//           {eventType === "Other" && (
//             <input
//               type="text"
//               placeholder="Enter custom event type"
//               onChange={(e) => setEventType(e.target.value)}
//             />
//           )}
//         </div>

//         <JamaicanAddressForm onAddressChange={setAddress} />

//         <div className="form-group">
//           <label>Description:</label>
//           <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
//         </div>

//         <div className="form-group">
//           <label>Average Cost (JMD):</label>
//           <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
//         </div>


//         {/* Excursion Date Schedule */}
//         <div className="form-group excursion-section">
//   <label>Event Date and Time:</label>
//   <div className="excursion-inputs">
//     <input
//       type="date"
//       value={selectedDate}
//       onChange={(e) => setSelectedDate(e.target.value)}
//     />
//     <input
//       type="time"
//       value={startTime}
//       onChange={(e) => setStartTime(e.target.value)}
//     />
//     <input
//       type="time"
//       value={endTime}
//       onChange={(e) => setEndTime(e.target.value)}
//     />
//     <button onClick={handleAddDateSchedule}>Add</button>
//   </div>

//   <ul className="excursion-list">
//     {dateSchedule.map((item, index) => (
//       <li key={index}>
//         {item.date} – {item.startTime} to {item.endTime}
//       </li>
//     ))}
//   </ul>
// </div>


//         <div className="action-buttons">
//           <button className="finish-button" onClick={handleCreateEvent}>Create Event</button>
//           <button className="cancel-button">Cancel</button>
//         </div>
//       </div>

//       {/* <footer className="trip-footer">
//         <div className="footer-content">
//           <div className="footer-section">
//             <div className="footer-logo">Yaad Quest</div>
//           </div>
//           <div className="footer-section">
//             <h3>Company</h3>
//             <p>About Us</p>
//             <h3>Contact</h3>
//             <p>Email</p>
//           </div>
//           <div className="footer-section">
//             <h3>Further</h3>
//             <p>Events</p>
//             <p>Experiences</p>
//             <div className="footer-icons">
//               <div className="icon pink"></div>
//               <div className="store-badge">Google Play</div>
//               <div className="store-badge">App Store</div>
//             </div>
//           </div>
//         </div>
//       </footer> */}
//     </div>
//   );
// }

// CreateEventPage.js - Updated with session management
import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../css/CreateEventPage.css";
import JamaicanAddressForm from "./JamaicanAddressForm";
import { useAuth } from "../contexts/AuthContext"; // Your existing AuthContext

export default function CreateEventPage() {
  // Use your existing AuthContext
  const { userId, isAuthenticated, getAuthHeaders, loading: authLoading } = useAuth();

  // Form state
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [menuImage, setMenuImage] = useState(null);
  const [flyerImage, setFlyerImage] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dateSchedule, setDateSchedule] = useState([]);

  // Multi-day event fields
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  // File upload paths
  const [uploadedFiles, setUploadedFiles] = useState({});

  // Event types that match your database enum
  const eventTypes = [
    { value: "Concert", label: "Concert" },
    { value: "Party", label: "Party/Beach Party" },
    { value: "Festival", label: "Festival" },
    { value: "Sport", label: "Sport" },
    { value: "Art/Talent Showcasing", label: "Art/Talent Showcasing" }
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [authLoading, isAuthenticated]);

  const handleAddDateSchedule = () => {
    if (isMultiDay) {
      // Multi-day event validation
      if (!startDate || !endDate || !startTime || !endTime) {
        setError("Please fill in start date, end date, start time, and end time for multi-day event");
        return;
      }

      // Validate that end date is after start date
      if (new Date(endDate) <= new Date(startDate)) {
        setError("End date must be after start date");
        return;
      }

      // Validate that end time is after start time (for the same day comparison)
      if (startTime >= endTime) {
        setError("End time must be after start time");
        return;
      }

      // Calculate duration
      const start = new Date(startDate);
      const end = new Date(endDate);
      const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      const newSchedule = {
        isMultiDay: true,
        startDate,
        endDate,
        startTime,
        endTime,
        displayText: `${startDate} to ${endDate} (${durationDays} days) – Daily ${formatTime(startTime)} to ${formatTime(endTime)}`
      };

      setDateSchedule([...dateSchedule, newSchedule]);
      
      // Reset multi-day fields
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setEndTime("");
      setError("");
    } else {
      // Single day event validation (existing logic)
      if (!selectedDate || !startTime || !endTime) {
        setError("Please fill in date, start time, and end time");
        return;
      }

      // Validate that end time is after start time
      if (startTime >= endTime) {
        setError("End time must be after start time");
        return;
      }

      // Check if this date/time combination already exists
      const exists = dateSchedule.some(item => 
        !item.isMultiDay && 
        item.date === selectedDate && 
        ((startTime >= item.startTime && startTime < item.endTime) ||
         (endTime > item.startTime && endTime <= item.endTime))
      );

      if (exists) {
        setError("This time slot overlaps with an existing schedule");
        return;
      }

      const newSchedule = {
        isMultiDay: false,
        date: selectedDate,
        startTime,
        endTime,
        displayText: `${selectedDate} – ${formatTime(startTime)} to ${formatTime(endTime)}`
      };

      setDateSchedule([...dateSchedule, newSchedule]);
      
      // Reset single day fields
      setSelectedDate("");
      setStartTime("");
      setEndTime("");
      setError("");
    }
  };

  const removeScheduleItem = (index) => {
    setDateSchedule(dateSchedule.filter((_, i) => i !== index));
  };

  // Format time for display
  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Upload files to server (with error handling)
 const uploadFiles = async () => {
  if (!menuImage && !flyerImage) {
    console.log("No files to upload");
    return {};
  }

  try {
    const formData = new FormData();
    
    console.log("Preparing files for upload:");
    if (menuImage) {
      formData.append('menuImage', menuImage);
      console.log("- Menu image:", menuImage.name, menuImage.size, "bytes");
    }
    if (flyerImage) {
      formData.append('flyerImage', flyerImage);
      console.log("- Flyer image:", flyerImage.name, flyerImage.size, "bytes");
    }

    console.log("Making upload request to: http://localhost:5001/api/events/upload");
    
    const response = await axios.post('http://localhost:5001/api/events/upload', formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log("Upload response:", response.data);
    console.log("Files uploaded successfully:", response.data.files);
    return response.data.files || {};
    
  } catch (error) {
    console.error('File upload failed, but continuing with event creation');
    return {};
  }
};
  const handleCreateEvent = async () => {
    setError("");
    setSuccess(null);

    // Check authentication
    if (!isAuthenticated || !userId) {
      setError('You must be logged in to create an event.');
      return;
    }

    // Basic validation
    if (!name.trim()) {
      setError("Event name is required");
      return;
    }
    if (!eventType) {
      setError("Event type is required");
      return;
    }
    if (!address.trim()) {
      setError("Venue location is required");
      return;
    }
    if (dateSchedule.length === 0) {
      setError("At least one date and time schedule is required");
      return;
    }

    // Validate cost
    if (cost && (isNaN(parseFloat(cost)) || parseFloat(cost) < 0)) {
      setError("Cost must be a valid positive number");
      return;
    }

    try {
      setIsLoading(true);

      // Try to upload files first (if any) - but don't fail if upload fails
      console.log("Attempting file upload...");
      const uploadedFilePaths = await uploadFiles();
      console.log("File upload result:", uploadedFilePaths);

      // Prepare event data (with optional file uploads)
      const eventData = {
        name: name.trim(),
        eventType: eventType,
        address: address.trim(), // This becomes venue_location
        description: description.trim() || null,
        cost: cost ? parseFloat(cost) : null,
        dateSchedule: dateSchedule, // Array of schedule objects
        user_id: userId,
        // Include file paths if upload was successful
        menu_image_path: uploadedFilePaths.menu_image_path || null,
        flyer_image_path: uploadedFilePaths.flyer_image_path || null
      
      };

      console.log("Creating event(s):", eventData);

      const response = await axios.post('http://localhost:5001/api/events/create', eventData, {
        headers: getAuthHeaders()
      });

      if (response.data) {
        console.log('Event(s) created successfully:', response.data);
        
        setSuccess({
          title: 'Event(s) Created Successfully! ',
          message: `${response.data.total_events} event(s) created for "${name}"`,
          details: `Type: ${eventType} • Location: ${address} • Cost: ${cost ? `JMD ${cost}` : 'Free'} • Total Events: ${dateSchedule.length}${
            dateSchedule.some(s => s.isMultiDay) ? ' (includes multi-day events)' : ''
          }`
        });

        // Reset form after successful creation
        setName("");
        setEventType("");
        setAddress("");
        setDescription("");
        setCost("");
        setMenuImage(null);
        setFlyerImage(null);
        setDateSchedule([]);
        setUploadedFiles({});
        setIsMultiDay(false);
        setStartDate("");
        setEndDate("");
        setSelectedDate("");
        setStartTime("");
        setEndTime("");
      }

    } catch (error) {
      console.error('Error creating event:', error);
      
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        window.location.href = '/login';
      } else if (error.response?.data?.error) {
        setError(`Failed to create event: ${error.response.data.error}`);
      } else {
        setError(`Failed to create event: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
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
          <p>You must be logged in to create an event.</p>
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
        {/* File Upload Notice */}
        <div style={{
          backgroundColor: '#e3f2fd',
          border: '1px solid #90caf9',
          borderRadius: '8px',
          padding: '15px',
          margin: '0 0 20px 0',
          color: '#1565c0'
        }}>
          <strong>📎 File Uploads:</strong> File uploads are optional. If upload fails, your event will still be created successfully without attachments.
        </div>

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
          <label>Event Name: *</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter event name"
            disabled={isLoading}
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label>Event Type: *</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            disabled={isLoading}
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
            <option value="">Select an event type</option>
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          
          {/* Conditional file uploads based on event type */}
            {["Party", "Festival"].includes(eventType) && (
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Upload Menu (Image): <em>(Optional)</em></label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setMenuImage(e.target.files[0])}
                  disabled={isLoading}
                />
                {menuImage && (
                  <p style={{ fontSize: '14px', color: '#28a745', marginTop: '5px' }}>
                    📎 Selected: {menuImage.name}
                  </p>
                )}
                <small style={{ color: '#666', fontStyle: 'italic' }}>
                  Event will be created even if file upload fails
                </small>
              </div>
            )}

            {["Concert", "Festival", "Party"].includes(eventType) && (
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Upload Flyer or Line-up (Image): <em>(Optional)</em></label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFlyerImage(e.target.files[0])}
                  disabled={isLoading}
                />
                {flyerImage && (
                  <p style={{ fontSize: '14px', color: '#28a745', marginTop: '5px' }}>
                    📎 Selected: {flyerImage.name}
                  </p>
                )}
                <small style={{ color: '#666', fontStyle: 'italic' }}>
                  Event will be created even if file upload fails
                </small>
              </div>
            )}
          {["Sport", "Art/Talent Showcasing"].includes(eventType) && (
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Upload Program/Schedule (PDF or DOCX): <em>(Optional)</em></label>
             <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFlyerImage(e.target.files[0])}
                  disabled={isLoading}
                />
                {flyerImage && (
                  <p style={{ fontSize: '14px', color: '#28a745', marginTop: '5px' }}>
                    📎 Selected: {flyerImage.name}
                  </p>
                )}
              <small style={{ color: '#666', fontStyle: 'italic' }}>
                Event will be created even if file upload fails
              </small>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Venue Location: *</label>
          <JamaicanAddressForm onAddressChange={setAddress} />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea 
            rows="4" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your event..."
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Average Cost (JMD):</label>
          <input 
            type="number" 
            value={cost} 
            onChange={(e) => setCost(e.target.value)}
            placeholder="Enter cost per person (leave empty if free)"
            min="0"
            step="50"
            disabled={isLoading}
          />
        </div>

        {/* Event Date Schedule */}
        <div className="form-group excursion-section">
          <label>Event Schedule: *</label>
          
          {/* Toggle between single day and multi-day */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              <input
                type="radio"
                name="eventDuration"
                checked={!isMultiDay}
                onChange={() => {
                  setIsMultiDay(false);
                  // Clear multi-day fields when switching
                  setStartDate("");
                  setEndDate("");
                }}
                style={{ marginRight: '0.5rem' }}
              />
              📅 Single Day Event
            </label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              <input
                type="radio"
                name="eventDuration"
                checked={isMultiDay}
                onChange={() => {
                  setIsMultiDay(true);
                  // Clear single day fields when switching
                  setSelectedDate("");
                }}
                style={{ marginRight: '0.5rem' }}
              />
              🗓️ Multi-Day Event
            </label>
          </div>

          {/* Single Day Event Inputs */}
          {!isMultiDay && (
            <div className="excursion-inputs" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr auto',
              gap: '1rem',
              alignItems: 'end',
              marginBottom: '1rem'
            }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 'normal' }}>Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={isLoading}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 'normal' }}>Start Time:</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 'normal' }}>End Time:</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <button 
                type="button"
                onClick={handleAddDateSchedule}
                disabled={isLoading || !selectedDate || !startTime || !endTime}
                style={{
                  padding: '12px 20px',
                  backgroundColor: !selectedDate || !startTime || !endTime ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: !selectedDate || !startTime || !endTime ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Add Day
              </button>
            </div>
          )}

          {/* Multi-Day Event Inputs */}
          {isMultiDay && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#856404' }}>
                🗓️ Multi-Day Event Configuration
              </h4>
              <div className="excursion-inputs" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                gap: '1rem',
                alignItems: 'end'
              }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'normal' }}>Start Date:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={isLoading}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'normal' }}>End Date:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isLoading}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'normal' }}>Daily Start:</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'normal' }}>Daily End:</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <button 
                  type="button"
                  onClick={handleAddDateSchedule}
                  disabled={isLoading || !startDate || !endDate || !startTime || !endTime}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: !startDate || !endDate || !startTime || !endTime ? '#ccc' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: !startDate || !endDate || !startTime || !endTime ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Add Event
                </button>
              </div>
              
              {startDate && endDate && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: '#d4edda',
                  border: '1px solid #c3e6cb',
                  borderRadius: '6px',
                  color: '#155724',
                  fontSize: '14px'
                }}>
                  <strong>Event Duration:</strong> {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                  {startTime && endTime && (
                    <span> • Daily hours: {formatTime(startTime)} - {formatTime(endTime)}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {dateSchedule.length > 0 && (
            <div style={{
              background: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>
                Event Schedule ({dateSchedule.length} event{dateSchedule.length === 1 ? '' : 's'}):
              </h4>
              <ul className="excursion-list" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {dateSchedule.map((item, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'white',
                    border: '1px solid #e9ecef',
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    borderLeft: `4px solid ${item.isMultiDay ? '#28a745' : '#007bff'}`
                  }}>
                    <div>
                      <span style={{ fontWeight: '600', color: item.isMultiDay ? '#28a745' : '#007bff' }}>
                        {item.isMultiDay ? '🗓️ Multi-Day Event' : '📅 Single Day Event'}
                      </span>
                      <div style={{ marginTop: '0.25rem', fontSize: '14px', color: '#666' }}>
                        {item.displayText}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeScheduleItem(index)}
                      disabled={isLoading}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.5rem 1rem',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button 
            className="finish-button" 
            onClick={handleCreateEvent}
            disabled={isLoading || !isAuthenticated || dateSchedule.length === 0}
          >
            {isLoading ? 'Creating Event(s)...' : 
             dateSchedule.length === 0 ? 'Add Schedule First' :
             dateSchedule.length === 1 ? 
               (dateSchedule[0].isMultiDay ? 'Create Multi-Day Event' : 'Create Event') :
               `Create ${dateSchedule.length} Events`
            }
          </button>
          <button 
            className="cancel-button"
            onClick={() => {
              // Reset form
              setName("");
              setEventType("");
              setAddress("");
              setDescription("");
              setCost("");
              setMenuImage(null);
              setFlyerImage(null);
              setDateSchedule([]);
              setSelectedDate("");
              setStartTime("");
              setEndTime("");
              setIsMultiDay(false);
              setStartDate("");
              setEndDate("");
              setError("");
              setSuccess(null);
              setUploadedFiles({});
              
              // Reset file inputs
              const fileInputs = document.querySelectorAll('input[type="file"]');
              fileInputs.forEach(input => input.value = '');
            }}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
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
            <h3>Creating Event{dateSchedule.length > 1 ? 's' : ''}</h3>
            <p>Saving event details to database...</p>
            {dateSchedule.length > 1 && (
              <p>Creating {dateSchedule.length} event records...</p>
            )}
            {dateSchedule.some(s => s.isMultiDay) && (
              <p>✨ Including multi-day events!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}