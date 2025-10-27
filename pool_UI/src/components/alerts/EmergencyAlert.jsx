import { Link } from 'react-router-dom'
import { FaExclamationTriangle } from 'react-icons/fa'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'

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
};

const EmergencyAlert = ({ count, latestAlert }) => {
  if (!latestAlert) return null;
  
  const formattedTime = format(new Date(latestAlert.alertTime), 'HH:mm:ss', { locale: he });
  
  return (
    <div className="emergency-alert">
      <div className="alert-content">
        <div className="alert-icon">
          <FaExclamationTriangle />
        </div>
        <div className="alert-details">
          <h3>קריאת חירום פעילה!</h3>
          <p>משתמש: {latestAlert.userId}</p>
          <p>סוג התראה: {getAlertTypeText(latestAlert.alertType)}</p>
          <p>זמן: {formattedTime}</p>
          {count > 1 && <p>ועוד {count - 1} התראות נוספות</p>}
        </div>
      </div>
      <div className="alert-actions">
        <Link to="/emergency">
          <button>צפה בכל ההתראות</button>
        </Link>
      </div>
    </div>
  );
};

export default EmergencyAlert;