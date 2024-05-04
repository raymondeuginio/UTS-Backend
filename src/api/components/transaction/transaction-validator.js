const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');

module.exports = {
  transfer: {
    body: {
      amount: joi.number().required(),
      description: joi.string(),
      to_account: joi.string().length(12).pattern(/^\d+$/).required(),
      pin: joi.string().length(6).pattern(/^\d+$/).required(),
    },
  },

  deposit: {
    body: {
      amount: joi.number().required(),
      pin: joi.string().length(6).pattern(/^\d+$/).required(),
    },
  },
};
