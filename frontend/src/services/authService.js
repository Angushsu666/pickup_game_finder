import api from './api';

// Register user
export const register = async (userData) => {
  try {
    const res = await api.post('/auth/register', userData);
    
    // Store token in localStorage
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed'
    };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const res = await api.post('/auth/login', credentials);
    
    // Store token in localStorage
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed'
    };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  return { success: true };
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const res = await api.get('/auth/me');
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch user data'
    };
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const res = await api.put('/auth/profile', userData);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile'
    };
  }
}; 