const express = require('express');

const accountMiddleware = require('../../middlewares/account-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const transactionControllers = require('./transaction-controller');
const transactionValidator = require('./transaction-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/account', route);
};
