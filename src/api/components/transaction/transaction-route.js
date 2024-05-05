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
    accountMiddleware,
    celebrate(transactionValidator.transfer),
    transactionController.transfer
  );

  route.post(
    '/:username/deposit',
    accountMiddleware,
    celebrate(transactionValidator.deposit),
    transactionController.deposit
  );

  route.post(
    '/:username/withdraw',
    accountMiddleware,
    celebrate(transactionValidator.withdraw),
    transactionController.withdraw
  );

  route.get(
    '/:username/history',
    accountMiddleware,
    transactionController.history
  );

  route.delete(
    '/:username/:transaction_id',
    accountMiddleware,
    celebrate(transactionValidator.delete_history),
    transactionController.delete_history
  );
};
