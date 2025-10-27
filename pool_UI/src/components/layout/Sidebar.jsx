import { useLocation, Link } from 'react-router-dom'
import { FaHome, FaUsers, FaSwimmer, FaExclamationTriangle, FaThermometerHalf } from 'react-icons/fa'
import './Sidebar.css'

const Sidebar = ({ isOpen }) => {
  const location = useLocation()
  
  const links = [
    { path: '/', name: 'דף הבית', icon: <FaHome /> },
    { path: '/users', name: 'משתמשים', icon: <FaUsers /> },
    { path: '/entries', name: 'כניסות', icon: <FaSwimmer /> },
    { path: '/emergency', name: 'קריאות חירום', icon: <FaExclamationTriangle /> },
    { path: '/temperature', name: 'טמפרטורה', icon: <FaThermometerHalf /> }
  ]
  
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>תפריט ראשי</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {links.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={location.pathname === link.path ? 'active' : ''}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar