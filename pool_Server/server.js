const express = require('express')
const app = express()

const PORT = 5000
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const env = require('dotenv')

const jwt = require('jsonwebtoken')
const { users } = require('./users')
const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://ts0556726468:DzysF629bAEnoQiO@cluster0.vrnguml.mongodb.net/").then(() => {
    console.log("connect to mongo");
}).catch((e) => {
    console.log(e.message);
})


const userRoute=require('./Routes/userRoute')
app.use('/user',userRoute)

const emRoute=require('./Routes/emergencyRoute')
app.use('/emergency',emRoute)

const entryRoute=require('./Routes/entryRoute')
app.use('/entry',entryRoute)

const tempRoute=require('./Routes/tempRoute')
app.use('/temperature',tempRoute)
app.listen(process.env.PORT , '0.0.0.0', () => {
    console.log(`listening on port ${process.env.PORT || 3000}`);
});

