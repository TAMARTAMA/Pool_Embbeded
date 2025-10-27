import { useState, useEffect } from 'react'
import { FaUserPlus, FaExclamationCircle, FaThermometerHalf, FaSwimmer } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { getUsers } from '../services/userService'
import { getEntries } from '../services/entryService'
import { getCurrentTemperature, getTemperatureHistory } from '../services/temperatureService'
import { getEmergencyAlerts } from '../services/emergencyService'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    currentUsers: 0,
    temperature: 0,
    emergencies: 0
  })
  
  const [temperatureData, setTemperatureData] = useState({
    labels: [],
    datasets: []
  })
  
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch all required data
        const [users, entries, tempCurrent, tempHistory, emergencies] = await Promise.all([
          getUsers(),
          getEntries(),
          getCurrentTemperature(),
          getTemperatureHistory(),
          getEmergencyAlerts()
        ])
        
        // Get today's date for filtering
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // Calculate current users (entries for today)
        const todayEntries = entries.filter(entry => {
          const entryDate = new Date(entry.entryTime)
          entryDate.setHours(0, 0, 0, 0)
          return entryDate.getTime() === today.getTime()
        })
        
        // Filter emergencies from last 24 hours
        const recentEmergencies = emergencies.filter(alert => {
          const alertTime = new Date(alert.alertTime)
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          return alertTime > yesterday
        })
        
        // Update stats
        setStats({
          totalUsers: users.length,
          currentUsers: todayEntries.length,
          temperature: tempCurrent.temperature,
          emergencies: recentEmergencies.length
        })
        
        // Prepare temperature chart data
        const labels = tempHistory.map(temp => {
          const date = new Date(temp.measurementTime)
          return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
        })
        
        const tempValues = tempHistory.map(temp => temp.temperature)
        
        setTemperatureData({
          labels,
          datasets: [
            {
              label: 'טמפרטורת המים (°C)',
              data: tempValues,
              borderColor: '#ffd166',
              backgroundColor: 'rgba(255, 209, 102, 0.5)',
              tension: 0.4
            }
          ]
        })
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000)
    
    return () => clearInterval(interval)
  }, [])
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>טוען נתונים...</p>
      </div>
    )
  }
  
  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>לוח בקרה</h1>
        <p className="subtitle">ברוך הבא למערכת ניהול הבריכה</p>
      </div>
      
      <div className="stats-container">
        <div className="stat-card users">
          <h3>סה"כ משתמשים</h3>
          <div className="value">{stats.totalUsers}</div>
          <p className="description">משתמשים רשומים במערכת</p>
          <Link to="/users" className="stat-link">צפייה בכל המשתמשים</Link>
        </div>
        
        <div className="stat-card entries">
          <h3>כניסות היום</h3>
          <div className="value">{stats.currentUsers}</div>
          <p className="description">מתרחצים נכנסו היום</p>
          <Link to="/entries" className="stat-link">צפייה בכל הכניסות</Link>
        </div>
        
        <div className="stat-card temperature">
          <h3>טמפרטורת המים</h3>
          <div className="value">{stats.temperature}°C</div>
          <p className="description">טמפרטורה נוכחית</p>
          <Link to="/temperature" className="stat-link">צפייה בהיסטוריית טמפרטורות</Link>
        </div>
        
        <div className="stat-card emergency">
          <h3>התראות חירום</h3>
          <div className="value">{stats.emergencies}</div>
          <p className="description">ב-24 השעות האחרונות</p>
          <Link to="/emergency" className="stat-link">צפייה בכל ההתראות</Link>
        </div>
      </div>
      
      <div className="chart-container">
        <h3>היסטוריית טמפרטורות</h3>
        <Line data={temperatureData} options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              align: 'end',
              labels: {
                boxWidth: 15,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            }
          },
          scales: {
            y: {
              min: 20,
              max: 40,
              ticks: {
                stepSize: 2
              }
            }
          }
        }} />
      </div>
      
      <div className="dashboard-actions">
        <Link to="/users/add" className="action-card">
          <div className="action-icon">
            <FaUserPlus />
          </div>
          <div className="action-content">
            <h3>הוסף משתמש חדש</h3>
            <p>רישום משתמש חדש למערכת</p>
          </div>
        </Link>
        
        <Link to="/entries" className="action-card">
          <div className="action-icon">
            <FaSwimmer />
          </div>
          <div className="action-content">
            <h3>רישום כניסה</h3>
            <p>הוספת כניסה חדשה לבריכה</p>
          </div>
        </Link>
        
        <Link to="/emergency" className="action-card">
          <div className="action-icon">
            <FaExclamationCircle />
          </div>
          <div className="action-content">
            <h3>קריאות חירום</h3>
            <p>צפייה וטיפול בקריאות חירום</p>
          </div>
        </Link>
        
        <Link to="/temperature" className="action-card">
          <div className="action-icon">
            <FaThermometerHalf />
          </div>
          <div className="action-content">
            <h3>ניהול טמפרטורה</h3>
            <p>הוספת מדידת טמפרטורה חדשה</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard