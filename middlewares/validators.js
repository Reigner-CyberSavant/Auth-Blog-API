// middlewares/validators.js
const joi = require('joi');

exports.signupSchema = joi.object({
    email: joi.string()
    .min(5)
    .max(50)
    .email()
    .required()
    .email({ 
        tlds: {allow: ['com', 'net'] } 
        }),
    password: joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .required()
    .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        }),
});



exports.signinSchema = joi.object({
    email: joi.string()
    .min(5)
    .max(50)
    .email()
    .required()
    .email({ 
        tlds: {allow: ['com', 'net'] } 
        }),
    password: joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .required()
    .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        }),
});


exports.acceptCodeSchema = joi.object({
     email: joi.string()
    .min(5)
    .max(50)
    .email()
    .required()
    .email({ 
        tlds: {allow: ['com', 'net'] } 
        }),
        providedCode: joi.number()
    .required()
});


exports.changePasswordSchema = joi.object({
     oldPassword: joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .required(),
     newPassword: joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .required()
        .messages({
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
            }),
});


exports.acceptForgotPasswordCodeSchema = joi.object({
      email: joi.string()
    .min(5)
    .max(50)
    .email()
    .required()
    .email({ 
        tlds: {allow: ['com', 'net'] } 
        }),
        providedCode: joi.number()
    .required()
});



exports.createPostSchema = joi.object({
      title: joi.string()
    .required(),
      description: joi.string()
      .min(1)
      .max(1000)
    .required()
});