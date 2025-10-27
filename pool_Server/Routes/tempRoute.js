const router=require('express').Router()//יבוא של ראוטר של אקספרס הוא אחראי לנתב לפונקציה המתאימה
const tController=require('../Controllers/temperatureController')
router.get('/getTemp', tController.getCurrentWaterTemperature)
router.get('/getHistory', tController.getUsageStats)
router.post('/addTemp', tController.addTemperatureMeasurement)
module.exports=router// ייצוא כדי שנוכל להפעיל מהAPP