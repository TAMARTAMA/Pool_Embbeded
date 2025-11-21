import axios from 'axios'

const API_URL = 'http://localhost:5000'

export const getEntries = async () => {
  try {
    const response = await axios.get(`${API_URL}/entry/getAll`)
    return response.data
  } catch (error) {
    console.error('Error fetching entries:', error)
    throw error
  }
}

export const addEntry = async (entryData) => {
  try {
    const response = await axios.get(`${API_URL}/entry/addEntry?tag=${entryData.rfidTag}`)
    return response.data
  } catch (error) {
    console.error('Error adding entry:', error)
    throw error
  }
}

export const getTodayEntries = async () => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const response = await axios.get(`${API_URL}/entry/getAll`)
    const entries = response.data
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.entryTime)
      entryDate.setHours(0, 0, 0, 0)
      return entryDate.getTime() === today.getTime()
    })
  } catch (error) {
    console.error('Error fetching today entries:', error)
    throw error
  }
}
