const accountRepository = require('./account-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

async function emailIsRegistered(email) {
  const account = await accountRepository.getAccountByEmail(email);

  if (account) {
    return true;
  }

  return false;
}

async function usernameIsRegistered(username) {
  const account = await accountRepository.getAccountByUsername(username);

  if (account) {
    return true;
  }

  return false;
}

async function phoneIsRegistered(phone_number) {
  const account = await accountRepository.getAccountByPhoneNumber(phone_number);

  if (account) {
    return true;
  }

  return false;
}
module.exports = {
  emailIsRegistered,
  usernameIsRegistered,
  phoneIsRegistered,
};
