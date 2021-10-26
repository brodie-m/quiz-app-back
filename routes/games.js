const router = require("express").Router();
const Games = require("../models/User");
const verify = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get('/', async (req,res) => {
    res.status(200).send('hello world from games')
})
router.get('/show', async (req,res) => {
    const results = await Games.find();
    res.send(results)

})

module.exports = router