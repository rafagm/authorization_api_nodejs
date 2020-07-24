const router = require('express').Router();
const User = require('../model/User');

//Validation
const Joi = require('@hapi/joi');

const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

router.post('/register', async (req, res) => {

    //LETS Validate the data before we make a user 
    try {
        const validation = await schema.validateAsync(req.body);
        res.send(validation);

    } catch (error) {
        return res.status(400).send(error.details[0].message);
    }

    const user =  new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        console.log("inside try\n user: ", user);
        const savedUser = await user.save();
        console.log("savedUser: ", savedUser);
        res.send(savedUser);
        console.log("end of try");
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', (req, res) => {
    res.send('login');
})

module.exports = router;