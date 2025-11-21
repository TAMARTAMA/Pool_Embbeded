import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaThermometerHalf } from 'react-icons/fa'
import { format, subDays } from 'date-fns'
import { he } from 'date-fns/locale'
import { getTemperatureHistory, getCurrentTemperature } from '../services/temperatureService'

const Temperature = () => {
  const [temperatures, setTemperatures] = useState([])
  const [currentTemp, setCurrentTemp] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [tempHistory, tempCurrent] = await Promise.all([
          getTemperatureHistory(),
          getCurrentTemperature()
        ])

        const sortedTemps = tempHistory.sort((a, b) =>
          new Date(b.measurementTime) - new Date(a.measurementTime)
        )

        setTemperatures(sortedTemps)
        setCurrentTemp(tempCurrent)
      } catch (error) {
        console.error('Failed to fetch temperature data:', error)
        toast.error('שגיאה בטעינת נתוני טמפרטורה')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'd בMMMM yyyy, HH:mm', { locale: he })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>טוען נתוני טמפרטורה...</p>
      </div>
    )
  }

  return (
    <div className="temperature-container">
      <div className="page-header">
        <h1>ניטור טמפרטורת הבריכה</h1>
        <p className="subtitle">טמפרטורה נוכחית והיסטוריית מדידות</p>
      </div>

      <div className="current-temp-card card">
        <div className="current-temp-header">
          <h3>טמפרטורה נוכחית</h3>
          <FaThermometerHalf className="temp-icon" />
        </div>

        {currentTemp && (
          <div className="current-temp-display">
            <div className="temp-value">{currentTemp.temperature}°C</div>
            <div className="temp-time">
              נמדד בתאריך: {formatDate(currentTemp.measurementTime)}
            </div>
          </div>
        )}
      </div>

      <div className="temp-history card">
        <h3>היסטוריית טמפרטורות</h3>

        {temperatures.length === 0 ? (
          <div className="no-data">
            <p>אין נתונים זמינים</p>
          </div>
        ) : (
          <table className="table temp-table">
            <thead>
              <tr>
                <th>תאריך ושעה</th>
                <th>טמפרטורה (°C)</th>
                <th>מזהה מדידה</th>
              </tr>
            </thead>
            <tbody>
              {temperatures.map((temp) => (
                <tr key={temp.measurementId}>
                  <td>{formatDate(temp.measurementTime)}</td>
                  <td>{temp.temperature}°C</td>
                  <td>{temp.measurementId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Temperature
