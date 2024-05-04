const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const account = require('./components/account/account-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  account(app);

  return app;
};
