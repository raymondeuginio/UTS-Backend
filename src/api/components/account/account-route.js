const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const accountControllers = require('./account-controller');
const accountValidator = require('./account-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/account', route);
};
