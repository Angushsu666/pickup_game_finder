import api from './api';
import axios from 'axios';

// Get user profile
export const getUserProfile = async () => {
  try {
    const res = await api.get('/users/profile');
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch profile'
    };
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const res = await api.put('/users/profile', profileData);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile'
    };
  }
};

// Get user's games
export const getUserGames = async () => {
  try {
    const res = await api.get('/users/games');
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch user games'
    };
  }
};

// Make sure this function is defined and exported
export const updateProfile = async (userData) => {
  try {
    const response = await axios.put('/api/users/profile', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 