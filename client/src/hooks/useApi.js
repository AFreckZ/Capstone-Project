import { useAuth } from '../contexts/AuthContext';

export const useApi = () => {
  const { getAuthHeaders, userId, logout } = useAuth();

  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers
        }
      });

      if (response.status === 401) {
        // Token expired or invalid
        logout();
        throw new Error('Session expired');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      return response;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  // Helper method for adding events with automatic userId inclusion
  const addEvent = async (eventData) => {
    const response = await apiCall('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        ...eventData,
        userId // Automatically include user ID
      })
    });
    return response.json();
  };

  // Helper for getting user-specific data
  const getUserData = async () => {
    const response = await apiCall(`/api/users/${userId}`);
    return response.json();
  };

  return { apiCall, addEvent, getUserData, userId };
};