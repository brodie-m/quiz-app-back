const router = require("express").Router();
const User = require("../models/User");
const verify = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get('/', (req,res) => {
    res.status(200).send('hello world from auth')
})


//register route
router.post('/register', async (req,res) => {
    //first need to do validation on submitted data
    //we will do this using Joi
    //for now do nothing

    //then check if there is a user in the db
    const emailExists = await User.findOne({
        email: req.body.email,
    });
    if (emailExists) {return res.status(400).json({error: "email already exists"})}

    //now use bcrypt to hash password before saving user
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //use hashed pass to submit new user
    const user = new User({
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword,
        friends: req.body.friends || [],
    })
    try {
        //save new user in db
        await user.save()
        //generate a token - whatever we use to sign is returned on verification
        const token = jwt.sign({...user},
             process.env.TOKEN_SECRET,
             {expiresIn : 10000000},
             );
        //send the token in the response header
        res.header('auth-token',token);
        //finally send back user info and token
        res.status(201).send(user)
    } catch (error) {
        res.status(500).send(error)
    }

})
//login route
router.post('/login', async(req,res) => {
    const user = await User.findOne({
        email: req.body.email,
    });
    //first check if the user actually exists by email
    if (!user) return res.status(400).json({error: "email not found"})
    //then check if the password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).json({error: "invalid password"})
    //then create token and give it back to user
    const token = jwt.sign({...user},
        process.env.TOKEN_SECRET,
        {expiresIn : 10000000},
        );
    res.header('auth-token', token)
    res.status(200).json({token})

})

module.exports = router