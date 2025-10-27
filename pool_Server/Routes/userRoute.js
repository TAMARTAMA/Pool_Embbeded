const router=require('express').Router()//יבוא של ראוטר של אקספרס הוא אחראי לנתב לפונקציה המתאימה
const userController=require('../Controllers/userController')
router.delete('/removeUser:userId', userController.removeUser)
router.post('/register', userController.register)
router.get('/getAll', userController.getAllusers)
router.get('/login', userController.login)
router.get('/getRecent', userController.getLastUserEntry)
module.exports=router// ייצוא כדי שנוכל להפעיל מהAPP