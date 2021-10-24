const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors')

//import routes
const helloWorldRoute = require('./routes/helloWorld')
const authRoute = require('./routes/auth')
//.env config
dotenv.config();
//middleware
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: true
}));

//routes
app.use('/', helloWorldRoute);
app.use('/api/auth', authRoute);


module.exports = app;