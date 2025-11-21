const router=require('express').Router()
const emController=require('../Controllers/emergencyController')
router.get('/getHistory:userId', emController.getEmergencyHistory)
router.get('/getHistory', emController.getEmergencyHistory)
router.post('/add', emController.addEmergencyAlert)

module.exports=router
