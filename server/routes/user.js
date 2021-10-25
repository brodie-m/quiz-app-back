const router = require('express').Router()
const User = require('../models/User')
const verify = require('../middleware/auth')
//need to add routes for:
//displaying current user profile - should only be accessible if users are friends
//this will work for current user if we check for friends || id = current id from token
//showing stats
//showing games

//need to add routes for:
//displaying all games info
//displaying specific game info
//creating new game info (push to existing array w/ new data)
//no reason for delete route

//all routes here should make use of verify middleware

//all routes here should make use of verify middleware

//need to add routes for:
//updating existing stats when game ends

//all routes here should make use of verify middleware

router.get('/', (req,res) => {
    res.status(200).send('hello world from user')
})

//get all info about a user
router.get('/show', verify, async (req,res) => {
    const user = await User.findOne({"_id": req.user._doc._id})
    res.status(201).json(user)
})
//get all info about user by name
router.get('/show/:name', verify, async (req,res) => {
    
    //first find self
    const self = await User.findOne({"_id": req.user._doc._id})

    //want to check if the users are friends at some point
    //if friends, display everything
    
    const foundUser = await User.findOne({"name": req.params.name})
     if (self.friends.includes(req.params.name) && foundUser.friends.includes(self.name)) {
        res.status(201).json({user: foundUser, message: 'you are friends'})
        
     }
     if (!self.friends.includes(req.params.name) || !foundUser.friends.includes(self.name))
     {
         res.status(201).json({name: foundUser.name, message: 'friend request pending'})
         
     }
     
     //if not, display minimal info and add friend button
    //  res.status(201).json(foundUser.name)
    
})
module.exports = router