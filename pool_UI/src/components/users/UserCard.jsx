import { FaUser, FaEdit, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './UserCard.css'

const UserCard = ({ user, onDelete }) => {
  const { userId, fullName, age, height, emergencyPhone, rfidTag, registrationDate } = user
  
  const formattedDate = new Date(registrationDate).toLocaleDateString('he-IL')
  
  return (
    <div className="user-card card">
      <div className="user-header">
        <div className="user-avatar">
          <FaUser />
        </div>
        <h3>{fullName}</h3>
        <p className="user-id">מזהה: {userId}</p>
      </div>
      
      <div className="user-details">
        <div className="detail-item">
          <span className="detail-label">גיל:</span>
          <span className="detail-value">{age}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">גובה:</span>
          <span className="detail-value">{height} ס"מ</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">טלפון חירום:</span>
          <span className="detail-value">{emergencyPhone}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">תג RFID:</span>
          <span className="detail-value">{rfidTag}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">תאריך רישום:</span>
          <span className="detail-value">{formattedDate}</span>
        </div>
      </div>
      
      <div className="user-actions">
        <Link to={`/users/edit/${userId}`} className="edit-button">
          <FaEdit />
          <span>ערוך</span>
        </Link>
        <button className="delete-button" onClick={() => onDelete(userId)}>
          <FaTrash />
          <span>מחק</span>
        </button>
      </div>
    </div>
  )
}

export default UserCard