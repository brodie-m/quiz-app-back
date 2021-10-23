const router = require("express").Router();
const User = require("../models/User");
const verify = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    })
    try {
        //save new user in db
        await user.save()
        //generate a token - whatever we use to sign is returned on verification
        const token = jwt.sign({_id: user._id, name:user.name, email: user.email},
             process.env.TOKEN_SECRET,
             {expiresIn : 10000000},
             );
        //send the token in the response header
        res.header('auth-token',token);
        //finally send back user info and token
        res.status(201).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token,

        })
    } catch (error) {
        res.status(500).send(error)
    }

})

module.exports = router