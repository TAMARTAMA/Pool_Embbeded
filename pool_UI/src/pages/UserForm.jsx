import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser, FaSave, FaArrowRight } from 'react-icons/fa'
import { getUser, createUser, updateUser } from '../services/userService'

const UserForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id
  
  const [formData, setFormData] = useState({
    userId: '',
    rfidTag: '',
    fullName: '',
    age: '',
    height: '',
    emergencyPhone: ''
  })
  
  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  
  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          setLoading(true)
          const userData = await getUser(id)
          
          if (!userData) {
            toast.error('משתמש לא נמצא')
            navigate('/users')
            return
          }
          
          setFormData({
            userId: userData.userId,
            rfidTag: userData.rfidTag,
            fullName: userData.fullName,
            age: userData.age,
            height: userData.height,
            emergencyPhone: userData.emergencyPhone
          })
        } catch (error) {
          console.error('Failed to fetch user:', error)
          toast.error('שגיאה בטעינת נתוני המשתמש')
          navigate('/users')
        } finally {
          setLoading(false)
        }
      }
      
      fetchUser()
    }
  }, [id, isEditMode, navigate])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('יש להזין שם מלא')
      return false
    }
    
    if (!formData.rfidTag.trim()) {
      toast.error('יש להזין תג RFID')
      return false
    }
    
    if (!formData.userId.trim()) {
      toast.error('יש להזין מזהה משתמש')
      return false
    }
    
    const age = parseInt(formData.age, 10)
    if (isNaN(age) || age < 3 || age > 120) {
      toast.error('גיל חייב להיות בין 3 ל-120')
      return false
    }
    
    const height = parseInt(formData.height, 10)
    if (isNaN(height) || height < 90 || height > 250) {
      toast.error('גובה חייב להיות בין 90 ל-250 ס"מ')
      return false
    }
    
    if (!formData.emergencyPhone.trim() || !/^[0-9-+\s()]+$/.test(formData.emergencyPhone)) {
      toast.error('יש להזין מספר טלפון חירום תקין')
      return false
    }
    
    return true
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      setSubmitting(true)
      
      const userData = {
        ...formData,
        age: parseInt(formData.age, 10),
        height: parseInt(formData.height, 10)
      }
      
      if (isEditMode) {
        await updateUser(id, userData)
        toast.success('המשתמש עודכן בהצלחה')
      } else {
        await createUser(userData)
        toast.success('המשתמש נוצר בהצלחה')
      }
      
      navigate('/users')
    } catch (error) {
      console.error('Failed to save user:', error)
      toast.error(isEditMode ? 'שגיאה בעדכון המשתמש' : 'שגיאה ביצירת המשתמש')
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleCancel = () => {
    navigate('/users')
  }
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>טוען נתוני משתמש...</p>
      </div>
    )
  }
  
  return (
    <div className="user-form-container">
      <div className="page-header">
        <h1>{isEditMode ? 'עריכת משתמש' : 'הוספת משתמש חדש'}</h1>
        <p className="subtitle">
          {isEditMode ? 'עדכון פרטי משתמש קיים' : 'יצירת משתמש חדש במערכת'}
        </p>
      </div>
      
      <div className="form-card card">
        <div className="form-header">
          <div className="form-icon">
            <FaUser />
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="userId">מזהה משתמש</label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="form-control"
                required
                disabled={isEditMode}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="rfidTag">תג RFID</label>
              <input
                type="text"
                id="rfidTag"
                name="rfidTag"
                value={formData.rfidTag}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="fullName">שם מלא</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">גיל</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="form-control"
                min="3"
                max="120"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="height">גובה (ס"מ)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="form-control"
                min="90"
                max="250"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="emergencyPhone">טלפון לשעת חירום</label>
            <input
              type="tel"
              id="emergencyPhone"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              className="form-control"
              required
              pattern="[0-9-+\s()]+"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={submitting}>
              <FaSave />
              <span>{isEditMode ? 'עדכן משתמש' : 'צור משתמש'}</span>
            </button>
            
            <button type="button" className="cancel-button" onClick={handleCancel}>
              <FaArrowRight />
              <span>ביטול</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm