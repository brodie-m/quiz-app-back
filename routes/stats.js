const router = require('express').Router()


//need to add routes for:
//updating existing stats when game ends

//all routes here should make use of verify middleware

router.get('/', (req,res) => {
    res.status(200).send('hello world from stats')
})
module.exports = router