const User=require('../Models/pool/userPool.model')
const Entry=require('../Models/pool/entryPool.model')
// רישום משתמש
const register = async (req, res) => {
    const newUserData = req.body;

    try {
        const userExist = await User.findOne( newUserData );
        if (userExist) return res.status(400).send('User already registered.');
        const newUser = new User(newUserData);
        await newUser.save();
        res.status(200).json({ message: 'User registered successfully', user: newUser });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

const removeUser = async (req, res) => {
    try {
      await User.findOneAndDelete({ userId: req.params.userId });
      res.json({ message: "User removed" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
const getAllusers = async (req, res) => {
    // const { newUser } = req.body;
    try {
        const users= await User.find( );

        res.status(200).json({ message: 'User registered successfully', data: users });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};
// התחברות משתמש
const login = async (req, res) => {
    const  tag = req.query.tag;
    try {
        const user = await User.findOne({ rfidTag: tag });
        if (!user) return res.status(404).send('User not found');

        // השוואת סיסמאות
      
        res.status(200).json({ message: 'Login successful',name:user.fullName });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};
const getLastUserEntry = async (req, res) => {
  try {
    // מציאת הכניסה האחרונה לפי תאריך
    const lastEntry = await Entry.findOne().sort({ entryTime: -1 });

    if (!lastEntry) {
      return res.status(404).json({ message: 'No entries found' });
    }

    // שליפת פרטי המשתמש לפי userId
    const user = await User.findOne({ userId: lastEntry.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Last user entry found',
      user: {
        fullName: user.fullName,
        userId: user.userId,
        rfidTag: user.rfidTag,
        age: user.age,
        height: user.height,
        emergencyPhone: user.emergencyPhone,
        entryTime: lastEntry.entryTime,
        waterTemperature: lastEntry.waterTemperature
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports={register,login,removeUser,getAllusers,getLastUserEntry}