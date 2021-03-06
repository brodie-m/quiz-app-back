const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors')

//import routes

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
//.env config
dotenv.config();
//middleware
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: true
}));

//routes

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);


module.exports = app;