import axios from 'axios'

const API_URL = 'http://localhost:5000'

// Get all users
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/getAll`)
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Get single user by ID
export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error)
    throw error
  }
}

// Create new user
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, userData)
    return response.data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/user/${userId}`, userData)
    return response.data
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error)
    throw error
  }
}

// Remove user
export const removeUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/user/removeUser?userId=${userId}`)
    return response.data
  } catch (error) {
    console.error(`Error removing user ${userId}:`, error)
    throw error
  }
}