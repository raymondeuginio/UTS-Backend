const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const accountControllers = require('./account-controller');
const accountValidator = require('./account-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/account', route);

  route.post(
    '/',
    authenticationMiddleware,
    celebrate(accountValidator.createAccount),
    accountControllers.createAccount
  );

  // route.get('/', authenticationMiddleware, accountControllers.getAccount);
  // route.put(
  //   '/',
  //   authenticationMiddleware,
  //   celebrate(accountValidator.updateAccount),
  //   accountControllers.updateAccount
  // );
  // route.delete('/', authenticationMiddleware, accountControllers.deleteAccount);
};
