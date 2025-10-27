import axios from 'axios'

const API_URL = 'http://localhost:5000'

// Get temperature history
export const getTemperatureHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/temperature/getHistory`)
    return response.data.recentTemps
  } catch (error) {
    console.error('Error fetching temperature history:', error)
    throw error
  }
}

// Get current temperature
export const getCurrentTemperature = async () => {
  try {
    const response = await axios.get(`${API_URL}/temperature/getTemp`)
     return {
      temperature: response.data.currentTemperature,
      measurementTime: response.data.measurementTime
    }
  } catch (error) {
    console.error('Error fetching current temperature:', error)
    throw error
  }
}

// Add new temperature measurement
export const addTemperature = async (tempData) => {
  try {
    const response = await axios.post(`${API_URL}/temperature/addTemp`, tempData)
    return response.data
  } catch (error) {
    console.error('Error adding temperature measurement:', error)
    throw error
  }
}