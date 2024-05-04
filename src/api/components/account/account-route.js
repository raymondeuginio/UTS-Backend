const express = require('express');

const accountMiddleware = require('../../middlewares/account-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const accountControllers = require('./account-controller');
const accountValidator = require('./account-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/account', route);

  route.post(
    '/login',
    celebrate(accountValidator.login),
    accountControllers.login
  );

  route.post(
    '/',
    celebrate(accountValidator.createAccount),
    accountControllers.createAccount
  );

  route.get('/:username', accountMiddleware, accountControllers.getAccount);

  route.put(
    '/:username',
    accountMiddleware,
    celebrate(accountValidator.updateAccount),
    accountControllers.updateAccount
  );

  route.delete(
    '/:username',
    accountMiddleware,
    celebrate(accountValidator.deleteAccount),
    accountControllers.deleteAccount
  );
};
