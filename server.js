const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors')

//import routes
const helloWorldRoute = require('./routes/helloWorld')
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


module.exports = app;