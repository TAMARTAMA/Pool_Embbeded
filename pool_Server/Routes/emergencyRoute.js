const router=require('express').Router()//יבוא של ראוטר של אקספרס הוא אחראי לנתב לפונקציה המתאימה
const emController=require('../Controllers/emergencyController')
router.get('/getHistory:userId', emController.getEmergencyHistory)
router.get('/getHistory', emController.getEmergencyHistory)
router.post('/add', emController.addEmergencyAlert)
module.exports=router// ייצוא כדי שנוכל להפעיל מהAPP