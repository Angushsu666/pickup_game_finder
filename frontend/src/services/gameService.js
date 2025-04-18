import api from './api';

// Create a new game
export const createGame = async (gameData) => {
  try {
    const res = await api.post('/games', gameData);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create game'
    };
  }
};

// Get all games with optional filters
export const getGames = async (filters = {}) => {
  try {
    const res = await api.get('/games', { params: filters });
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch games'
    };
  }
};

// Get game by ID
export const getGameById = async (id) => {
  try {
    const res = await api.get(`/games/${id}`);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch game'
    };
  }
};

// Update game
export const updateGame = async (id, gameData) => {
  try {
    const res = await api.put(`/games/${id}`, gameData);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update game'
    };
  }
};

// Delete game
export const deleteGame = async (id) => {
  try {
    await api.delete(`/games/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete game'
    };
  }
};

// Join game
export const joinGame = async (id) => {
  try {
    const res = await api.post(`/games/${id}/join`);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to join game'
    };
  }
};

// Leave game
export const leaveGame = async (id) => {
  try {
    const res = await api.post(`/games/${id}/leave`);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to leave game'
    };
  }
}; 