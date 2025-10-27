import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBars, FaUserCircle, FaSignOutAlt, FaBell, FaSwimmer } from 'react-icons/fa'
import { getEmergencyAlerts } from '../../services/emergencyService'
import { getCurrentTemperature } from '../../services/temperatureService'
import { logout } from '../../services/authService'
import './Navbar.css'

const Navbar = ({ toggleSidebar }) => {
  const [emergencyCount, setEmergencyCount] = useState(0)
  const [temperature, setTemperature] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmergencyCount = async () => {
      try {
        const alerts = await getEmergencyAlerts()
        
        // Count alerts from the last hour
        const oneHourAgo = new Date()
        oneHourAgo.setHours(oneHourAgo.getHours() - 1)
        
        const activeEmergencies = alerts.filter(alert => 
          new Date(alert.alertTime) > oneHourAgo
        )
        
        setEmergencyCount(activeEmergencies.length)
      } catch (error) {
        console.error('Failed to fetch emergency count:', error)
      }
    }

    const fetchTemperature = async () => {
      try {
        const data = await getCurrentTemperature()
        setTemperature(data.currentTemperature)
      } catch (error) {
        console.error('Failed to fetch temperature:', error)
      }
    }

    fetchEmergencyCount()
    fetchTemperature()

    // Set up intervals for periodic updates
    const emergencyInterval = setInterval(fetchEmergencyCount, 60000) // every minute
    const temperatureInterval = setInterval(fetchTemperature, 300000) // every 5 minutes

    return () => {
      clearInterval(emergencyInterval)
      clearInterval(temperatureInterval)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  return (
    <nav className="navbar">
      <div className="navbar-start">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <Link to="/" className="navbar-brand">
          <FaSwimmer className="logo-icon" />
          <span>מערכת ניהול בריכה</span>
        </Link>
      </div>
      
      <div className="navbar-center">
        {temperature !== null && (
          <div className="temperature-display">
            <span>טמפרטורת המים:</span>
            <span className="temperature-value">{temperature}°C</span>
          </div>
        )}
      </div>
      
      <div className="navbar-end">
        {emergencyCount > 0 && (
          <Link to="/emergency\" className="emergency-notification">
            <FaBell />
            <span className="emergency-count">{emergencyCount}</span>
          </Link>
        )}
        
        <div className="user-dropdown">
          <button className="user-button" onClick={toggleUserMenu}>
            <FaUserCircle />
          </button>
          
          {showUserMenu && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>התנתק</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar