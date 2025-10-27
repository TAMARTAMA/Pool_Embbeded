const router=require('express').Router()//יבוא של ראוטר של אקספרס הוא אחראי לנתב לפונקציה המתאימה
const entryController=require('../Controllers/entryController')
router.get('/addEntry', entryController.enterPoolByTag)
router.get('/getAll', entryController.getPoolEntries)

module.exports=router// ייצוא כדי שנוכל להפעיל מהAPP