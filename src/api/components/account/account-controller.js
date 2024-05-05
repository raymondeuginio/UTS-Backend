const accountService = require('./account-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;
  try {
    const loginSuccess = await accountService.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      const attempts = await accountService.getLoginAttempts(email);
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `Wrong email or password. User ${email} failed login. Attempt: ${attempts}`
      );
    }

    if (loginSuccess.attempts >= 5) {
      const waktuReset = loginSuccess.waktuReset;
      throw errorResponder(
        errorTypes.FORBIDDEN,
        `Too many attempts, try again in ${waktuReset} minutes`
      );
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create account request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
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
    if (phoneIsRegistered) {
      throw errorResponder(
        errorTypes.PHONE_ALREADY_TAKEN,
        'Phone number is already registered'
      );
    }

    const account_number = await accountService.generateAccountNumber();
    const balance = 0;
    const success = await accountService.createAccount(
      username,
      email,
      password,
      phone_number,
      address,
      account_number,
      pin,
      balance
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({
      username,
      email,
      phone_number,
      address,
      account_number,
      balance: 'Rp. ' + balance,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get information of account request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getAccount(request, response, next) {
  try {
    const account = await accountService.getAccount(request.params.username);

    if (!account) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Username not found'
      );
    }

    return response.status(200).json(account);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update account request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateAccount(request, response, next) {
  try {
    const { username } = request.params;
    const { field, value, password } = request.body;

    const updatedAccount = await accountService.updateAccount(
      username,
      field,
      value,
      password
    );

    return response.status(200).json({
      message: 'Update berhasil dilakukan',
      username: updatedAccount.username,
      email: updatedAccount.email,
      phone_number: updatedAccount.phone_number,
      address: updatedAccount.address,
      account_number: updatedAccount.account_number,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle delete account request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteAccount(request, response, next) {
  try {
    const { username } = request.params;
    const { password } = request.body;

    const success = await accountService.deleteAccount(username, password);
    if (success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete account'
      );
    }

    response.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createAccount,
  login,
  getAccount,
  updateAccount,
  deleteAccount,
};
