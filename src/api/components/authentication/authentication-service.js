const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const loginAttempts = new Map();
const getLoginAttempt = new Map();
/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */

async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  if (loginAttempts.has(email)) {
    const { attempts, attemptsTerakhir } = loginAttempts.get(email);
    const now = Date.now();
    const waktu = now - attemptsTerakhir;
    const waktuMenit = Math.floor(waktu / (1000 * 60));

    if (attempts >= 5 && waktuMenit < 30) {
      return {
        attempts: attempts,
        attemptsTerakhir,
        waktuReset: 30 - waktuMenit,
      };
    } else if (waktuMenit >= 30) {
      loginAttempts.delete(email);
    }
  }

  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  if (user && passwordChecked) {
    loginAttempts.delete(email);
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else {
    const attempts = loginAttempts.has(email)
      ? loginAttempts.get(email).attempts + 1
      : 1;
    const attemptsTerakhir = Date.now();
    loginAttempts.set(email, { attempts, attemptsTerakhir });
    return null;
  }
}

/**
 * Get the number of login attempts for a given email.
 * @param {string} email - Email
 * @returns {number} The number of login attempts for the given email.
 */
async function getLoginAttempts(email) {
  const attemptData = loginAttempts.get(email);
  if (attemptData) {
    return attemptData.attempts;
  } else {
    return 0;
  }
}

module.exports = {
  checkLoginCredentials,
  getLoginAttempts,
};
