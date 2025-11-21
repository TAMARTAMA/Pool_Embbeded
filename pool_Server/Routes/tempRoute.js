const router=require('express').Router()
const tController=require('../Controllers/temperatureController')
router.get('/getTemp', tController.getCurrentWaterTemperature)
router.get('/getHistory', tController.getUsageStats)
router.post('/addTemp', tController.addTemperatureMeasurement)

module.exports=router
