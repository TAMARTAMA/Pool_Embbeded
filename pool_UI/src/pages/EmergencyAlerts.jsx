import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaExclamationTriangle, FaFilter, FaCalendarAlt } from 'react-icons/fa'
import { format, subDays } from 'date-fns'
import { he } from 'date-fns/locale'
import { getEmergencyAlerts, addEmergencyAlert } from '../services/emergencyService'
import { getUsers } from '../services/userService'

const EmergencyAlerts = () => {
  let [alerts, setAlerts] = useState([])
  let [filteredAlerts, setFilteredAlerts] = useState([])
  const [users, setUsers] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedAlertType, setSelectedAlertType] = useState('')
  const [loading, setLoading] = useState(true)
  
  // Get today and 7 days ago formatted for date input
  const today = format(new Date(), 'yyyy-MM-dd')
  const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd')
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [alertsData, usersData] = await Promise.all([
          getEmergencyAlerts(),
          getUsers()
        ])
        
        // Sort alerts by time (newest first)
        const sortedAlerts = alertsData.sort((a, b) => 
          new Date(b.alertTime) - new Date(a.alertTime)
        )
        
        setAlerts(sortedAlerts)
        setFilteredAlerts(sortedAlerts)
        setUsers(usersData)
        
        // Set default date range (last 7 days)
        setStartDate(sevenDaysAgo)
        setEndDate(today)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('שגיאה בטעינת נתונים')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [today, sevenDaysAgo])
  
  useEffect(() => {
    filterAlerts()
  }, [startDate, endDate, selectedAlertType, alerts])
  
  const filterAlerts = () => {
    let filtered = [...alerts]
    
    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      
      filtered = filtered.filter(alert => {
        // const alertDate = new Date(alert.alertTime)
        // return alertDate >= start && alertDate <= end
        return true
      })
    }
    
    // Filter by alert type
    if (selectedAlertType) {
      filtered = filtered.filter(alert => alert.alertType === selectedAlertType)
    }
    
    setFilteredAlerts(filtered)
  }
  
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value)
  }
  
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value)
  }
  
  const handleAlertTypeChange = (e) => {
    setSelectedAlertType(e.target.value)
  }
  
  const resetFilters = () => {
    setStartDate(sevenDaysAgo)
    setEndDate(today)
    setSelectedAlertType('')
  }
  
  const getUserName = (userId) => {
    const user = users.find(u => u.userId === userId)
    return user ? user.fullName : userId
  }
  
  const getAlertTypeText = (type) => {
    switch (type) {
      case 'LOW_PULSE':
        return 'דופק נמוך';
      case 'HIGH_PULSE':
        return 'דופק גבוה';
      case 'LOW_OXYGEN':
        return 'חמצן נמוך';
      case 'SIGNAL_LOST':
        return 'אות אבוד';
      default:
        return type;
    }
  }
  
  const getAlertClass = (type) => {
    switch (type) {
      case 'LOW_PULSE':
        return 'alert-warning';
      case 'HIGH_PULSE':
        return 'alert-error';
      case 'LOW_OXYGEN':
        return 'alert-error';
      case 'SIGNAL_LOST':
        return 'alert-warning';
      default:
        return '';
    }
  }
  
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'd בMMMM yyyy, HH:mm:ss', { locale: he })
  }
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>טוען נתוני התראות...</p>
      </div>
    )
  }
  
  return (
    <div className="emergency-container">
      <div className="page-header">
        <h1>ניהול קריאות חירום</h1>
        <p className="subtitle">צפייה וטיפול בקריאות חירום מהמתרחצים</p>
      </div>
      
      <div className="alerts-filter card">
        <div className="filter-header">
          <h3>סינון התראות</h3>
          <FaFilter />
        </div>
        
        <div className="filter-form">
          <div className="date-range">
            <div className="form-group">
              <label htmlFor="start-date">
                <FaCalendarAlt />
                <span>מתאריך:</span>
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={handleStartDateChange}
                max={endDate || today}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="end-date">
                <FaCalendarAlt />
                <span>עד תאריך:</span>
              </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate}
                max={today}
              />
            </div>
          </div>
          
          <div className="alert-type-filter">
            <div className="form-group">
              <label htmlFor="alert-type">סוג התראה:</label>
              <select
                id="alert-type"
                value={selectedAlertType}
                onChange={handleAlertTypeChange}
                className="form-control"
              >
                <option value="">כל ההתראות</option>
                <option value="LOW_PULSE">דופק נמוך</option>
                <option value="HIGH_PULSE">דופק גבוה</option>
                <option value="LOW_OXYGEN">חמצן נמוך</option>
                <option value="SIGNAL_LOST">אות אבוד</option>
              </select>
            </div>
            
            <button className="reset-button" onClick={resetFilters}>
              איפוס סינון
            </button>
          </div>
        </div>
        
        <div className="filter-stats">
          <p>סה"כ התראות: <strong>{filteredAlerts.length}</strong></p>
        </div>
      </div>
      
      <div className="alerts-list">
        <h3>רשימת התראות</h3>
        
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts card">
            <p>לא נמצאו התראות לפי הסינון הנוכחי</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.alertId} 
              className={`alert-card card ${getAlertClass(alert.alertType)}`}
            >
              <div className="alert-header">
                <div className="alert-icon">
                  <FaExclamationTriangle />
                </div>
                <div className="alert-title">
                  <h4>{getAlertTypeText(alert.alertType)}</h4>
                  <span className="alert-time">{formatDate(alert.alertTime)}</span>
                </div>
              </div>
              
              <div className="alert-details">
                <div className="detail-item">
                  <span className="detail-label">מתרחץ:</span>
                  <span className="detail-value">{getUserName(alert.userId)}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">מזהה משתמש:</span>
                  <span className="detail-value">{alert.userId}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">ערך חיישן:</span>
                  <span className="detail-value">{alert.sensorValue}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default EmergencyAlerts