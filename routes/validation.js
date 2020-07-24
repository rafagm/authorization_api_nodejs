//Validation
const Joi = require('@hapi/joi');

//Register Validation
const  registerValidation = async (user) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return  schema.validateAsync(user);
};

//Login Validation
const  loginValidation = async (user) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return  schema.validateAsync(user);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;