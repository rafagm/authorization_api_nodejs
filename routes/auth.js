const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('./validation');



router.post('/register', async (req, res) => {
    
    
    //LETS Validate the data before we make a user 
    try {
        await registerValidation(req.body);
    } catch (error) {
        return res.status(400).send(error.details[0].message);
    }
    
    const newUser =  new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    const emailExists = await User.findOne({email: newUser.email});
    if (emailExists) return res.status(400).send("The Email already exists");


    try {
        const savedUser = await newUser.save();
        res.send(savedUser);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', (req, res) => {
    res.send('login');
})

module.exports = router;