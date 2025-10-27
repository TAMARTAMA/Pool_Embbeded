import { useState } from 'react'
import { toast } from 'react-toastify'
import { FaSwimmer, FaLock } from 'react-icons/fa'
import { login } from '../services/authService'
import './LoginPage.css'

const LoginPage = ({ onLogin }) => {
  const [rfidTag, setRfidTag] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleChange = (e) => {
    setRfidTag(e.target.value)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!rfidTag.trim()) {
      toast.error('יש להזין תג RFID')
      return
    }
    
    try {
      setLoading(true)
      const success = await login(rfidTag)
      
      if (success) {
        toast.success('התחברת בהצלחה')
        onLogin()
      } else {
        toast.error('תג RFID לא חוקי')
      }
    } catch (error) {
      console.error('Login failed:', error)
      toast.error('שגיאה בהתחברות')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <FaSwimmer />
          </div>
          <h1>מערכת ניהול בריכה</h1>
          <p>התחבר באמצעות תג RFID</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="rfidTag">
              <FaLock />
              <span>תג RFID</span>
            </label>
            <input
              type="text"
              id="rfidTag"
              value={rfidTag}
              onChange={handleChange}
              placeholder="הזן את תג ה-RFID שלך"
              required
              autoFocus
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>
      </div>
      
      <div className="login-footer">
        <p>© {new Date().getFullYear()} מערכת ניהול בריכה. כל הזכויות שמורות.</p>
      </div>
    </div>
  )
}

export default LoginPage