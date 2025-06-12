import React, { createContext, useContext, useState, useEffect } from 'react';

// Helper function to decode JWT
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  const initializeAuth = () => {
    // Check both sessionStorage and localStorage
    let storedToken = sessionStorage.getItem('jwt') || localStorage.getItem('token');
    
    if (storedToken) {
      try {
        const decoded = decodeJWT(storedToken);
        
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUserId(decoded.userId);
          setUser({
            ...decoded,
            userType: decoded.userType || decoded.usertype
          });
        } else {
          // Token expired, clear both storages
          sessionStorage.removeItem('jwt');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        sessionStorage.removeItem('jwt');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  };
 initializeAuth();
}, []);
const login = async (credentials) => {
  try {
    // Use your actual backend URL
    const response = await fetch('http://localhost:5001/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    console.log('Backend login response:', data);
    
    if (data.token) {
      const decoded = decodeJWT(data.token);
      console.log('Decoded JWT:', decoded);
      
      sessionStorage.setItem('jwt', data.token);
      setToken(data.token);
      setUserId(decoded.userId);
      
      const userType = data.user?.usertype || decoded.usertype || decoded.userType;
      console.log('Extracted userType:', userType);
      
      const userInfo = {
        ...decoded,
        ...data.user,
        userType: userType
      };
      
      console.log('Final userInfo:', userInfo);
      setUser(userInfo);
      
      return { success: true, user: userInfo };
    } else {
      throw new Error(data.message || 'No token received');
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};
   const register = async (userData) => {
  try {
    const response = await fetch('http://localhost:5001/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    console.log('Register response status:', response.status);
    
    const data = await response.json();
    console.log('Backend register response:', data);
    
    if (response.ok && data.success) {
      return { success: true, data };
    } else {
      throw new Error(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};


const logout = () => {
  sessionStorage.removeItem('jwt');
  localStorage.removeItem('token');
  localStorage.removeItem('rememberUser');
  setToken(null);
  setUserId(null);
  setUser(null);
};
  // Helper function to get headers with auth token
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const value = {
  user,
  userId,
  userType: user?.userType,
  token,
  loading,
  isAuthenticated: !!token,
  login,
  register,
  logout,
  getAuthHeaders
};
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};