const router = require("express").Router();
const Room = require("../models/Room");
const verify = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get('/', async (req,res) => {
    res.status(200).send('hello world from games')
})
router.get('/show', async (req,res) => {
    const results = await Room.find();
    res.status(201).json(results)

})

module.exports = router