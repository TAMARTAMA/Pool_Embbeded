const Temperature=require('../Models/pool/temperatureMeasurement.model')
const getUsageStats = async (req, res) => {
    try {
      const recentTemps = await Temperature.find().sort({ measurementTime: -1 }).limit(50);
      res.json({ recentTemps });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
const getCurrentWaterTemperature = async (req, res) => {
    try {
      const latest = await Temperature.findOne().sort({ measurementTime: -1 });
       res.json({ currentTemperature: latest.temperature, measurementTime: latest.measurementTime }) // ← הוספתי measurementTime
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


const addTemperatureMeasurement = async (req, res) => {
  try {
    const { measurementId, temperature } = req.body;

    if (!measurementId ||  temperature === undefined)
      return res.status(400).json({ error: "Missing fields" });

    const newMeasurement = new Temperature({
      measurementId,
      temperature,
      measurementTime: new Date()
    });

    await newMeasurement.save();
    res.status(201).json({ message: "Temperature recorded", data: newMeasurement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports={getUsageStats,getCurrentWaterTemperature,addTemperatureMeasurement}