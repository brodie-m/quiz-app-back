const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors')

//import routes
const helloWorldRoute = require('./routes/helloWorld')
const authRoute = require('./routes/auth')
const gamesRoute = require('./routes/games')
const statsRoute = require('./routes/stats')
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
app.use('/', helloWorldRoute);
app.use('/api/auth', authRoute);
app.use('/api/games', gamesRoute);
app.use('/api/stats', statsRoute);
app.use('/api/user', userRoute);


module.exports = app;