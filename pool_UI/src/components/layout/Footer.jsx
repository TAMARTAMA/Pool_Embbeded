import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="container">
        <p>© {currentYear} מערכת ניהול בריכה. כל הזכויות שמורות.</p>
      </div>
    </footer>
  )
}

export default Footer