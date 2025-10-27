const Emergency=require('../Models/pool/emergencyAlert.model')
const { v4: uuidv4 } = require('uuid');
  const getEmergencyHistory = async (req, res) => {
    try {

      const history = await Emergency.find().sort({ alertTime: -1 });
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getEmergencyHistoryById = async (req, res) => {
    try {
      const u=req.params.userId;
      const history = await Emergency.find({userId:u});
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const addEmergencyAlert = async (req, res) => {
    try {
      const { alertId, userId, alertType, sensorValue } = req.body;
  
      if ( !userId || !alertType || sensorValue === undefined)
        return res.status(400).json({ error: "Missing fields" });

      const newAlert = new Emergency({
         alertId: uuidv4(),
        userId,
        alertType,
        sensorValue,
        alertTime: new Date()
      });
  
      await newAlert.save();
      res.status(201).json({ message: "Emergency alert recorded", data: newAlert });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
module.exports={getEmergencyHistory,addEmergencyAlert}