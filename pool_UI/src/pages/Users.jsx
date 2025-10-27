import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUserPlus, FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'
import UserCard from '../components/users/UserCard'
import { getUsers, removeUser } from '../services/userService'

const Users = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await getUsers()
        setUsers(data)
        setFilteredUsers(data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        toast.error('שגיאה בטעינת המשתמשים')
      } finally {
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [])
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.rfidTag.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])
  
  const handleDeleteUser = async (userId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      try {
        await removeUser(userId)
        setUsers(users.filter(user => user.userId !== userId))
        toast.success('המשתמש נמחק בהצלחה')
      } catch (error) {
        console.error('Failed to delete user:', error)
        toast.error('שגיאה במחיקת המשתמש')
      }
    }
  }
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>טוען משתמשים...</p>
      </div>
    )
  }
  
  return (
    <div className="users-container">
      <div className="page-header">
        <h1>ניהול משתמשים</h1>
        <p className="subtitle">צפייה, עריכה ומחיקה של משתמשים</p>
      </div>
      
      <div className="actions-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="חיפוש לפי שם, מזהה או תג RFID"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="search-button">
            <FaSearch />
          </button>
        </div>
        
        <Link to="/users/add" className="add-button">
          <FaUserPlus />
          <span>הוסף משתמש</span>
        </Link>
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="no-results">
          <p>לא נמצאו משתמשים התואמים את החיפוש</p>
        </div>
      ) : (
        <div className="users-grid">
          {filteredUsers.map(user => (
            <UserCard 
              key={user.userId} 
              user={user} 
              onDelete={handleDeleteUser} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Users