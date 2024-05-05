const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

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
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      const attempts = await authenticationServices.getLoginAttempts(email);
      if (attempts === 5) {
        throw errorResponder(
          errorTypes.INVALID_CREDENTIALS,
          `Wrong email or password. User ${email} failed login. Attempt: ${attempts}. LIMIT REACHED!`
        );
      }
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

module.exports = {
  login,
};
