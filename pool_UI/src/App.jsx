import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'

// Components
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import EmergencyAlert from './components/alerts/EmergencyAlert'

// Pages
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import UserForm from './pages/UserForm'
import Entries from './pages/Entries'
import EmergencyAlerts from './pages/EmergencyAlerts'
import Temperature from './pages/Temperature'
import LoginPage from './pages/LoginPage'

// API
import { getEmergencyAlerts } from './services/emergencyService'
import { checkLoginStatus } from './services/authService'

// CSS
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const loggedIn = await checkLoginStatus()
        setIsLoggedIn(loggedIn)
      } catch (error) {
        console.error('Authentication check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    // Only fetch emergencies if logged in
    if (isLoggedIn) {
      const fetchEmergencies = async () => {
        try {
          const data = await getEmergencyAlerts()
          
          // Filter for only active emergencies (created in the last hour)
          const oneHourAgo = new Date()
          oneHourAgo.setHours(oneHourAgo.getHours() - 1)
          
          const activeEmergencies = data.filter(alert => 
            new Date(alert.alertTime) > oneHourAgo
          )
          
          setEmergencies(activeEmergencies)
          
          // Show toast for new emergencies
          if (activeEmergencies.length > 0) {
            toast.error(`${activeEmergencies.length} קריאות חירום פעילות!`, {
              autoClose: false,
              closeOnClick: false
            })
          }
        } catch (error) {
          console.error('Failed to fetch emergency alerts:', error)
        }
      }

      // Initial fetch
      fetchEmergencies()
      
      // Set up interval to check for new emergencies every minute
      const interval = setInterval(fetchEmergencies, 60000)
      
      return () => clearInterval(interval)
    }
  }, [isLoggedIn])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>טוען...</p>
      </div>
    )
  }

  return (
    <div className="app">
      {isLoggedIn ? (
        <>
          <Navbar toggleSidebar={toggleSidebar} />
          <div className="main-container">
            <Sidebar isOpen={sidebarOpen} />
            <main className={`content ${sidebarOpen ? 'sidebar-open' : ''}`}>
              {emergencies.length > 0 && (
                <EmergencyAlert 
                  count={emergencies.length} 
                  latestAlert={emergencies[0]} 
                />
              )}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/add" element={<UserForm />} />
                <Route path="/users/edit/:id" element={<UserForm />} />
                <Route path="/entries" element={<Entries />} />
                <Route path="/emergency" element={<EmergencyAlerts />} />
                <Route path="/temperature" element={<Temperature />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  )
}

export default App