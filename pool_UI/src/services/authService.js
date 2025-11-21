import axios from 'axios'

const API_URL = 'http://localhost:5000'

export const login = async (rfidTag) => {
  try {
    const response = await axios.get(`${API_URL}/user/login?tag=${rfidTag}`)
    
    if (response.status === 200) {
      // Store authentication info in localStorage
      localStorage.setItem('user', JSON.stringify(response.data))
      localStorage.setItem('isLoggedIn', 'true')
      return true
    }
    
    return false
  } catch (error) {
    console.error('Login error:', error)
    return false
  }
}


export const logout = async () => {
  try {
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    return true
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

export const checkLoginStatus = async () => {
  try {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    return isLoggedIn
  } catch (error) {
    console.error('Check login status error:', error)
    return false
  }
}

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}
