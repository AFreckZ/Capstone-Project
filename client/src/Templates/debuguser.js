import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugUser = () => {
  const { user, userId, userType, token, isAuthenticated } = useAuth();

  return (
    <div style={{ 
      border: '1px solid #ccc', 
      padding: '20px', 
      margin: '20px',
      backgroundColor: '#f9f9f9' 
    }}>
      <h3>Debug User Information</h3>
      <p><strong>Is Authenticated:</strong> {String(isAuthenticated)}</p>
      <p><strong>User ID:</strong> {userId}</p>
      <p><strong>User Type:</strong> {userType}</p>
      <p><strong>Has Token:</strong> {!!token}</p>
      
      <details>
        <summary>Full User Object (click to expand)</summary>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </details>
      
      <details>
        <summary>Session Storage JWT (click to expand)</summary>
        <pre>{sessionStorage.getItem('jwt')}</pre>
      </details>
    </div>
  );
};

export default DebugUser;