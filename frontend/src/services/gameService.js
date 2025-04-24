import api from './api';

// Create a new game
export const createGame = async (gameData) => {
  try {
    const response = await api.post('/games', gameData);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error creating game:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create game'
    };
  }
};

// Get all games with optional filters
export const getGames = async (filters = {}) => {
  try {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const queryString = queryParams.toString();
    const url = queryString ? `/games?${queryString}` : '/games';
    
    console.log("Fetching games with URL:", url);
    const response = await api.get(url);
    console.log("Games API response:", response.data);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching games:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch games'
    };
  }
};

// Get a single game by ID
export const getGameById = async (id) => {
  try {
    const response = await api.get(`/games/${id}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching game:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch game'
    };
  }
};

// Update a game
export const updateGame = async (id, gameData) => {
  try {
    const response = await api.put(`/games/${id}`, gameData);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error updating game:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update game'
    };
  }
};

// Delete a game
export const deleteGame = async (id) => {
  try {
    await api.delete(`/games/${id}`);
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting game:', error.response?.data || error.message);
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