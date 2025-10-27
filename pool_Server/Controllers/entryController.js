
const Entry=require('../Models/pool/entryPool.model')
const User=require('../Models/pool/userPool.model')
const Temperature=require('../Models/pool/temperatureMeasurement.model')
const getPoolEntries = async (req, res) => {
    try {
      const entries = await Entry.find();//populate('userId');
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
const enterPoolByTag = async (req, res) => {
    try {
      const  tag  = req.query.tag;
      console.log("Received tag:", tag);
      if (!tag) return res.status(400).json({ error: "Missing userId" });
  
      // בדיקה אם המשתמש קיים
      const user = await User.findOne({ rfidTag:tag });
      // console.log("Received tag:", user);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      // קבלת טמפרטורת מים אחרונה
      const lastTemp = await Temperature.findOne().sort({ measurementTime: -1 });
  
      if (!lastTemp) return res.status(500).json({ error: "No water temperature data available" });
      // console.log("Received tag:", lastTemp);
      const newEntry = new Entry({
        entryId: `ENTRY_${Date.now()}`,
        userId: user.userId,
        entryTime: new Date(),
        waterTemperature: lastTemp.temperature
      });
  
      await newEntry.save();
      res.status(201).json({ message: "User entry recorded", data: newEntry ,lastTemp:lastTemp});
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports={getPoolEntries,enterPoolByTag}