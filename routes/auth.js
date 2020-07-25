const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('./validation');
const bcrypt = require('bcryptjs');
const jwt =  require('jsonwebtoken');





router.post('/register', async (req, res) => {
    //Validate the data before we create a user 
    try {
        await registerValidation(req.body);
    } catch (error) {
        return res.status(400).send(error.details[0].message);
    }
    
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    const newUser =  new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });


    const userWithExistingEmail = await User.findOne({ email: newUser.email });
    if (userWithExistingEmail) return res.status(409).send("The email already exists");

    
    try {
        const savedUser = await newUser.save();
        res.send({userId: savedUser._id});
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/login', async (req, res) => {
    //Validate login data
    try {
        await loginValidation(req.body);
    } catch (error) {
        return res.status(400).send(error.details[0].message);
    }

    const vagueResponseMessage = "The email or password is wrong";
    const vagueReponse = { error: vagueResponseMessage };

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(vagueReponse);

    const passwordsMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordsMatch) return res.status(400).send(vagueReponse);

    //Create and assing token
    const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET, {expiresIn: 15});
    res.header('Auth-Token', token).send({token});
});

module.exports = router;