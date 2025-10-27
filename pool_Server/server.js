const express = require('express')//יבוא
const app = express()//מימוש שרת של מודול אקספרס

const PORT = 5000//פורט להאזנת השרת
const bodyParser = require('body-parser')//ספריה להמרת אובייקטים לגייסון - שימושי לנו לאובייקטים שנשלחים בBODY
app.use(bodyParser.json())//הפונקציה שממירה את האובייקטים לגייסון
const env = require('dotenv')//ספריה לשימוש בקובץ 
env.config()
//מודול שנותן לנו להשתמש בקובץ מערכת למשתני סביבה - dotenv  
// הגישה למשתנים שרשומים שם - process.env.VARIABLE_NAME
//מחזיר אובייקט המייצג את תוכן הקובץ 

const jwt = require('jsonwebtoken')//ספריה ליצירת מחרוזת טוקן להצפנת פרטי משתמש לשימוש ברשת
// let user;
const { users } = require('./users')
const cors = require('cors');
app.use(cors());


// mongo
const mongoose = require('mongoose')//יבוא


// פונקציית החיבור למסד מונגו

mongoose.connect("mongodb+srv://ts0556726468:DzysF629bAEnoQiO@cluster0.vrnguml.mongodb.net/").then(() => {
    console.log("connect to mongo");
}).catch((e) => {
    console.log(e.message);
})


const userRoute=require('./Routes/userRoute')//יבוא של הראוטר
app.use('/user',userRoute)//טעינה שלו

const emRoute=require('./Routes/emergencyRoute')//יבוא של הראוטר
app.use('/emergency',emRoute)//טעינה שלו

const entryRoute=require('./Routes/entryRoute')//יבוא של הראוטר
app.use('/entry',entryRoute)//טעינה שלו

const tempRoute=require('./Routes/tempRoute')//יבוא של הראוטר
app.use('/temperature',tempRoute)//טעינה שלו

app.listen(process.env.PORT , '0.0.0.0', () => {
    console.log(`listening on port ${process.env.PORT || 3000}`);
});
