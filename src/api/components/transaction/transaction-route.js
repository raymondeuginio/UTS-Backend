const express = require('express');

const accountMiddleware = require('../../middlewares/account-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const transactionController = require('./transaction-controller');
const transactionValidator = require('./transaction-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/transaction', route);

  route.post(
    '/:username/transfer',
    celebrate(transactionValidator.transfer),
    transactionController.transfer
  );

  route.post(
    '/:username/deposit',
    celebrate(transactionValidator.deposit),
    transactionController.deposit
  );
};
