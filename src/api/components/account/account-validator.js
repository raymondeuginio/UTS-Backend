const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  login: {
    body: {
      email: joi.string().email().required().label('Email'),
      password: joi.string().required().label('Password'),
    },
  },

  createAccount: {
    body: {
      username: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('Password'),
      password_confirm: joi.string().required().label('Password Confirmation'),
      phone_number: joi
        .string()
        .regex(/^[0-9]{10,15}$/)
        .required()
        .label('Phone Number'),
      address: joi.string().required().label('Address'),
      pin: joi
        .string()
        .regex(/^[0-9]{6}$/)
        .required()
        .label('PIN'),
    },
  },
};
