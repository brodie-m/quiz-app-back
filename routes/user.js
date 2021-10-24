const router = require('express').Router()

//need to add routes for:
//displaying current user profile - should only be accessible if users are friends
//this will work for current user if we check for friends || id = current id from token
//showing stats
//showing games

//all routes here should make use of verify middleware

router.get('/', (req,res) => {
    res.status(200).send('hello world from user')
})
module.exports = router