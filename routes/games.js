const router = require("express").Router();
const Room = require("../models/Room");
const verify = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Game = require("../models/Game");

router.get('/', async (req,res) => {
    res.status(200).send('hello world from games')
})
router.get('/show', async (req,res) => {
    const emptyRooms = await Room.find({participants: {$size : 0}})
        emptyRooms.forEach(room => {
            console.log('pruning room', room)
            room.delete()
        })
    const results = await Room.find();
    res.status(201).json(results)

})
router.get('/show/:name', async (req,res) => {
    const result = await Room.findOne({name: req.params.name})
    res.status(201).json(result)
})
router.get('/completedgames', async (req,res) => {

})

router.get('/completedgames/:id', async (req,res) => {
    const foundGame = await Game.find({_id: req.params.id})
    res.status(201).json(foundGame)
})

module.exports = router