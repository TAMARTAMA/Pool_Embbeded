import axios from 'axios'

const API_URL = 'http://localhost:5000'

// Get all emergency alerts
export const getEmergencyAlerts = async () => {
  try {
    const response = await axios.get(`${API_URL}/emergency/getHistory`)
    return response.data
  } catch (error) {
    console.error('Error fetching emergency alerts:', error)
    throw error
  }
}

// Get emergency history for a specific user
export const getUserEmergencyHistory = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/emergency/getHistory/${userId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching emergency history for user ${userId}:`, error)
    throw error
  }
}

// Add new emergency alert
export const addEmergencyAlert = async (alertData) => {
  try {
    const response = await axios.post(`${API_URL}/emergency/add`, alertData)
    return response.data
  } catch (error) {
    console.error('Error adding emergency alert:', error)
    throw error
  }
}