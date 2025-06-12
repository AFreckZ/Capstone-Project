import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebug = () => {
  const authData = useAuth();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#f0f0f0', 
      padding: '10px', 
      border: '1px solid #ccc',
      fontSize: '12px',
      zIndex: 1000
    }}>
      <h4>Auth Debug</h4>
      <p>Authenticated: {String(authData.isAuthenticated)}</p>
      <p>Loading: {String(authData.loading)}</p>
      <p>Has Token: {String(!!authData.token)}</p>
      <p>Has User: {String(!!authData.user)}</p>
      <p>User ID: {authData.userId || 'None'}</p>
      <p>User Type: {authData.userType || 'None'}</p>
      
      <details>
        <summary>Session Storage</summary>
        <pre style={{fontSize: '10px'}}>
          {sessionStorage.getItem('jwt') || 'No JWT found'}
        </pre>
      </details>
    </div>
  );
};

export default AuthDebug;