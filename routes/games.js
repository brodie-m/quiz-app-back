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
    const foundGames = await Game.find();
    
    let leaderBoardArray = []
    foundGames.forEach(game => {
        game.participants.forEach(participant => {
            console.log(participant.username, participant.score)
            leaderBoardArray.push({username: participant.username, score: participant.score})
        })
    })
    leaderBoardArray.sort((a,b) => {b.score - a.score})
    const slicedArr = leaderBoardArray.slice(0,20)
    res.status(201).send(slicedArr)
})

router.get('/completedgames/:id', async (req,res) => {
    const foundGame = await Game.find({_id: req.params.id})
    res.status(201).json(foundGame)
})

module.exports = router