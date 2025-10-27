// import { useState, useEffect } from 'react'
// import { toast } from 'react-toastify'
// import { FaThermometerHalf, FaPlus, FaCalendarAlt } from 'react-icons/fa'
// import { format, subDays } from 'date-fns'
// import { he } from 'date-fns/locale'
// import { getTemperatureHistory, getCurrentTemperature, addTemperature } from '../services/temperatureService'
// import { Line } from 'react-chartjs-2'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js'

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// )

// const Temperature = () => {
//   const [temperatures, setTemperatures] = useState([])
//   const [filteredTemperatures, setFilteredTemperatures] = useState([])
//   const [currentTemp, setCurrentTemp] = useState(null)
//   const [newTemp, setNewTemp] = useState('')
//   const [startDate, setStartDate] = useState('')
//   const [endDate, setEndDate] = useState('')
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: []
//   })
//   const [loading, setLoading] = useState(true)
  
//   // Get today and 7 days ago formatted for date input
//   const today = format(new Date(), 'yyyy-MM-dd')
//   const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd')
  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const [tempHistory, tempCurrent] = await Promise.all([
//           getTemperatureHistory(),
//           getCurrentTemperature()
//         ])
        
//         // Sort temperatures by time (newest first)
//         // const sortedTemps = tempHistory.sort((a, b) => 
//         //   new Date(b.measurementTime) - new Date(a.measurementTime)
//         // )
        
//         setTemperatures(sortedTemps)
//         setCurrentTemp(tempCurrent)
        
//         // Set default date range (last 7 days)
//         setStartDate(sevenDaysAgo)
//         setEndDate(today)
//       } catch (error) {
//         console.error('Failed to fetch temperature data:', error)
//         toast.error('שגיאה בטעינת נתוני טמפרטורה')
//       } finally {
//         setLoading(false)
//       }
//     }
    
//     fetchData()
//   }, [today, sevenDaysAgo])
  
//   useEffect(() => {
//     filterTemperatures()
//   }, [startDate, endDate, temperatures])
  
//   useEffect(() => {
//     if (filteredTemperatures.length > 0) {
//       prepareChartData()
//     }
//   }, [filteredTemperatures])
  
//   const filterTemperatures = () => {
//     if (!startDate || !endDate) {
//       setFilteredTemperatures(temperatures)
//       return
//     }
    
//     const start = new Date(startDate)
//     start.setHours(0, 0, 0, 0)
    
//     const end = new Date(endDate)
//     end.setHours(23, 59, 59, 999)
    
//     const filtered = temperatures.filter(temp => {
//       const tempDate = new Date(temp.measurementTime)
//       return tempDate >= start && tempDate <= end
//     })
    
//     setFilteredTemperatures(filtered)
//   }
  
//   const prepareChartData = () => {
//     // Clone and reverse to get chronological order
//     const chronologicalTemps = [...filteredTemperatures].reverse()
    
//     const labels = chronologicalTemps.map(temp => {
//       const date = new Date(temp.measurementTime)
//       return format(date, 'dd/MM HH:mm', { locale: he })
//     })
    
//     const tempValues = chronologicalTemps.map(temp => temp.temperature)
    
//     setChartData({
//       labels,
//       datasets: [
//         {
//           label: 'טמפרטורת המים (°C)',
//           data: tempValues,
//           borderColor: '#0077b6',
//           backgroundColor: 'rgba(0, 119, 182, 0.2)',
//           tension: 0.4,
//           pointRadius: 3,
//           pointHoverRadius: 5
//         }
//       ]
//     })
//   }
  
//   const handleStartDateChange = (e) => {
//     setStartDate(e.target.value)
//   }
  
//   const handleEndDateChange = (e) => {
//     setEndDate(e.target.value)
//   }
  
//   const handleNewTempChange = (e) => {
//     setNewTemp(e.target.value)
//   }
  
//   const handleAddTemperature = async () => {
//     const tempValue = parseFloat(newTemp)
    
//     if (isNaN(tempValue) || tempValue < 0 || tempValue > 50) {
//       toast.error('יש להזין טמפרטורה תקינה בין 0-50 מעלות צלזיוס')
//       return
//     }
    
//     try {
//       const tempData = {
//         temperature: tempValue,
//         measurementTime: new Date()
//       }
      
//       const newTempRecord = await addTemperature(tempData)
      
//       // Update state
//       setTemperatures([newTempRecord, ...temperatures])
//       setCurrentTemp({ ...newTempRecord })
      
//       // Reset form
//       setNewTemp('')
      
//       // Reapply filters
//       filterTemperatures()
      
//       toast.success('טמפרטורה נרשמה בהצלחה')
//     } catch (error) {
//       console.error('Failed to add temperature:', error)
//       toast.error('שגיאה ברישום טמפרטורה')
//     }
//   }
  
//   const formatDate = (dateString) => {
//     return format(new Date(dateString), 'd בMMMM yyyy, HH:mm', { locale: he })
//   }
  
//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>טוען נתוני טמפרטורה...</p>
//       </div>
//     )
//   }
  
//   return (
//     <div className="temperature-container">
//       <div className="page-header">
//         <h1>ניטור טמפרטורת הבריכה</h1>
//         <p className="subtitle">מעקב והוספת מדידות טמפרטורה</p>
//       </div>
      
//       <div className="current-temp-card card">
//         <div className="current-temp-header">
//           <h3>טמפרטורה נוכחית</h3>
//           <FaThermometerHalf className="temp-icon" />
//         </div>
        
//         {currentTemp && (
//           <div className="current-temp-display">
//             <div className="temp-value">{currentTemp.temperature}°C</div>
//             <div className="temp-time">
//               נמדד בתאריך: {formatDate(currentTemp.measurementTime)}
//             </div>
//           </div>
//         )}
//       </div>
      
//       <div className="add-temp-card card">
//         <h3>הוספת מדידת טמפרטורה חדשה</h3>
//         <div className="add-temp-form">
//           <div className="form-group">
//             <label htmlFor="new-temp">טמפרטורה (°C)</label>
//             <input
//               type="number"
//               id="new-temp"
//               value={newTemp}
//               onChange={handleNewTempChange}
//               className="form-control"
//               placeholder="הזן טמפרטורה"
//               min="0"
//               max="50"
//               step="0.1"
//             />
//           </div>
          
//           <button className="add-temp-button" onClick={handleAddTemperature}>
//             <FaPlus />
//             <span>הוסף מדידה</span>
//           </button>
//         </div>
//       </div>
      
//       <div className="temp-filter card">
//         <div className="filter-header">
//           <h3>סינון היסטוריית טמפרטורות</h3>
//         </div>
        
//         <div className="date-range">
//           <div className="form-group">
//             <label htmlFor="temp-start-date">
//               <FaCalendarAlt />
//               <span>מתאריך:</span>
//             </label>
//             <input
//               type="date"
//               id="temp-start-date"
//               value={startDate}
//               onChange={handleStartDateChange}
//               max={endDate || today}
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="temp-end-date">
//               <FaCalendarAlt />
//               <span>עד תאריך:</span>
//             </label>
//             <input
//               type="date"
//               id="temp-end-date"
//               value={endDate}
//               onChange={handleEndDateChange}
//               min={startDate}
//               max={today}
//             />
//           </div>
//         </div>
//       </div>
      
//       <div className="temp-chart card">
//         <h3>גרף טמפרטורות</h3>
        
//         {filteredTemperatures.length === 0 ? (
//           <div className="no-data">
//             <p>אין נתונים זמינים לתקופה זו</p>
//           </div>
//         ) : (
//           <Line data={chartData} options={{
//             responsive: true,
//             plugins: {
//               legend: {
//                 position: 'top',
//                 align: 'end',
//                 labels: {
//                   boxWidth: 15,
//                   usePointStyle: true,
//                   pointStyle: 'circle'
//                 }
//               },
//               tooltip: {
//                 mode: 'index',
//                 intersect: false,
//               }
//             },
//             scales: {
//               y: {
//                 min: Math.min(...chartData.datasets[0].data) - 2,
//                 max: Math.max(...chartData.datasets[0].data) + 2,
//                 ticks: {
//                   stepSize: 1
//                 }
//               }
//             }
//           }} />
//         )}
//       </div>
      
//       <div className="temp-history card">
//         <h3>היסטוריית טמפרטורות</h3>
        
//         {filteredTemperatures.length === 0 ? (
//           <div className="no-data">
//             <p>אין נתונים זמינים לתקופה זו</p>
//           </div>
//         ) : (
//           <table className="table temp-table">
//             <thead>
//               <tr>
//                 <th>תאריך ושעה</th>
//                 <th>טמפרטורה (°C)</th>
//                 <th>מזהה מדידה</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTemperatures.map((temp) => (
//                 <tr key={temp.measurementId}>
//                   <td>{formatDate(temp.measurementTime)}</td>
//                   <td>{temp.temperature}°C</td>
//                   <td>{temp.measurementId}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Temperature
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
