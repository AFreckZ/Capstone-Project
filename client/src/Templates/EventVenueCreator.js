import React, { useState } from 'react';
import CreateEventPage from './CreateEventPage';
import CreateVenuePage from './CreateVenuePage';
import { useNavigate } from 'react-router-dom';

const EventVenueToggle = () => {
  const [isEvent, setIsEvent] = useState(true);
  const navigate= useNavigate();
  const back= ()=>{
   navigate('/business-profile')
  }
  return (
    <div style={{ padding: '20px' }}>
        {/* Back Button */}
        <button
          onClick={back}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px',
            fontSize: '14px'
          }}
        >
          ← Back 
        </button>
        
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>Add an Event or Venue</h1>
        
        {/* Toggle Switch */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: '#f8f9fa',
          borderRadius: '25px',
          padding: '4px',
          border: '2px solid #e9ecef'
        }}>
          <button
            onClick={() => setIsEvent(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: isEvent ? '#28a745' : 'transparent',
              color: isEvent ? 'white' : '#666',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              minWidth: '120px'
            }}
          >
            📅 Event
          </button>
          <button
            onClick={() => setIsEvent(false)}
            style={{
              padding: '12px 24px',
              backgroundColor: !isEvent ? '#007bff' : 'transparent',
              color: !isEvent ? 'white' : '#666',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              minWidth: '120px'
            }}
          >
            🏢 Venue
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        padding: '30px',
        minHeight: '500px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
      }}>
        {isEvent ? <CreateEventPage /> : <CreateVenuePage />}
      </div>
    </div>
    </div>
  );
};

export default EventVenueToggle;