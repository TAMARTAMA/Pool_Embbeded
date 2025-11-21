import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaPlus, FaFilter, FaCalendarAlt } from 'react-icons/fa'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { getEntries, addEntry } from '../services/entryService'
import { getUsers } from '../services/userService'
import { getCurrentTemperature } from '../services/temperatureService'

const Entries = () => {
  const [entries, setEntries] = useState([])
  const [filteredEntries, setFilteredEntries] = useState([])
  const [users, setUsers] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [rfidTag, setRfidTag] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentTemperature, setCurrentTemperature] = useState(null)
  
  const formatDateForInput = (date) => {
    return format(date, 'yyyy-MM-dd')
  }
  
  const today = formatDateForInput(new Date())
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [entriesData, usersData, tempData] = await Promise.all([
          getEntries(),
          getUsers(),
          getCurrentTemperature()
        ])
        
        const sortedEntries = entriesData.sort((a, b) => 
          new Date(b.entryTime) - new Date(a.entryTime)
        )
        
        setEntries(sortedEntries)
        setFilteredEntries(sortedEntries)
        setUsers(usersData)
        setCurrentTemperature(tempData.temperature)
        setSelectedDate(today)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('שגיאה בטעינת נתונים')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [today])
  
  useEffect(() => {
    if (selectedDate) {
      filterEntries()
    }
  }, [selectedDate, entries])
  
  const filterEntries = () => {
    if (!selectedDate) {
      setFilteredEntries(entries)
      return
    }
    
    const filtered = entries.filter(entry => {
      const entryDate = new Date(entry.entryTime)
      const selected = new Date(selectedDate)
      
      return (
        entryDate.getFullYear() === selected.getFullYear() &&
        entryDate.getMonth() === selected.getMonth() &&
        entryDate.getDate() === selected.getDate()
      )
    })
    
    setFilteredEntries(filtered)
  }
  
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }
  
  const handleAddEntry = async () => {
    if (!rfidTag.trim()) {
      toast.error('יש להזין תג RFID')
      return
    }
    
    try {
      const user = users.find(u => u.rfidTag === rfidTag)
      
      if (!user) {
        toast.error('לא נמצא משתמש עם תג RFID זה')
        return
      }
      
      const entryData = {
        userId: user.userId,
        rfidTag: rfidTag,
        waterTemperature: currentTemperature
      }
      
      const newEntry = await addEntry(entryData)
      
      setEntries([newEntry, ...entries])
      filterEntries()
      
      setRfidTag('')
      
      toast.success('כניסה נרשמה בהצלחה')
    } catch (error) {
      console.error('Failed to add entry:', error)
      toast.error('שגיאה ברישום כניסה')
    }
  }
  
  const getUserName = (userId) => {
    const user = users.find(u => u.userId === userId)
    return user ? user.fullName : userId
  }
  
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'd בMMMM yyyy, HH:mm', { locale: he })
  }
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>טוען נתוני כניסות...</p>
      </div>
    )
  }
  
  return (
    <div className="entries-container">
      <div className="page-header">
        <h1>רישום וניהול כניסות</h1>
        <p className="subtitle">מעקב אחר כניסות מתרחצים לבריכה</p>
      </div>
      
      <div className="add-entry-card card">
        <h3>רישום כניסה חדשה</h3>
        <div className="add-entry-form">
          <div className="form-group">
            <label htmlFor="rfidTag">תג RFID</label>
            <input
              type="text"
              id="rfidTag"
              value={rfidTag}
              onChange={(e) => setRfidTag(e.target.value)}
              className="form-control"
              placeholder="הזן תג RFID"
            />
          </div>
          
          <button className="add-entry-button" onClick={handleAddEntry}>
            <FaPlus />
            <span>רשום כניסה</span>
          </button>
        </div>
        
        {currentTemperature && (
          <div className="current-temperature">
            <p>טמפרטורת המים הנוכחית: <strong>{currentTemperature}°C</strong></p>
          </div>
        )}
      </div>
      
      <div className="entries-filter card">
        <div className="filter-header">
          <h3>סינון כניסות</h3>
          <FaFilter />
        </div>
        
        <div className="date-filter">
          <label htmlFor="date-filter">
            <FaCalendarAlt />
            <span>סינון לפי תאריך:</span>
          </label>
          <input
            type="date"
            id="date-filter"
            value={selectedDate}
            onChange={handleDateChange}
            max={today}
          />
        </div>
        
        <div className="filter-stats">
          <p>סה"כ כניסות ליום זה: <strong>{filteredEntries.length}</strong></p>
        </div>
      </div>
      
      <div className="entries-list card">
        <h3>רשימת כניסות</h3>
        
        {filteredEntries.length === 0 ? (
          <div className="no-entries">
            <p>לא נמצאו כניסות לתאריך זה</p>
          </div>
        ) : (
          <table className="table entries-table">
            <thead>
              <tr>
                <th>שם מתרחץ</th>
                <th>זמן כניסה</th>
                <th>טמפרטורת מים</th>
                <th>מזהה משתמש</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.entryId}>
                  <td>{getUserName(entry.userId)}</td>
                  <td>{formatDate(entry.entryTime)}</td>
                  <td>{entry.waterTemperature}°C</td>
                  <td>{entry.userId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Entries
