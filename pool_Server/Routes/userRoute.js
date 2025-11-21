const router=require('express').Router()
const userController=require('../Controllers/userController')
router.delete('/removeUser:userId', userController.removeUser)
router.post('/register', userController.register)
router.get('/getAll', userController.getAllusers)
router.get('/login', userController.login)
router.get('/getRecent', userController.getLastUserEntry)

module.exports=router
