const router = require('express').Router()

//need to add routes for:
//displaying all games info
//displaying specific game info
//creating new game info (push to existing array w/ new data)
//no reason for delete route

//all routes here should make use of verify middleware

router.get('/', (req,res) => {
    res.status(200).send('hello world from games')
})
module.exports = router