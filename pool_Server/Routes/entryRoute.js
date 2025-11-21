const router=require('express').Router()
const entryController=require('../Controllers/entryController')
router.get('/addEntry', entryController.enterPoolByTag)
router.get('/getAll', entryController.getPoolEntries)

module.exports=router
