const accountService = require('./account-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { create } = require('lodash');

async function createAccount(request, response, next) {
  try {
    const {
      username,
      email,
      password,
      password_confirm,
      phone_number,
      address,
      pin,
    } = request.body;

    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }
    const usernameIsRegistered =
      await accountService.usernameIsRegistered(username);
    if (usernameIsRegistered) {
      throw errorResponder(
        errorTypes.USERNAME_ALREADY_TAKEN,
        'Username is already registered'
      );
    }

    const emailIsRegistered = await accountService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const phoneIsRegistered =
      await accountService.phoneIsRegistered(phone_number);
    if (phoneIsRegisteredIsRegistered) {
      throw errorResponder(
        errorTypes.PHONE_ALREADY_TAKEN,
        'Phone number is already registered'
      );
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createAccount,
};
