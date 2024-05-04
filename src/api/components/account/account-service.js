const accountRepository = require('./account-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { generateToken } = require('../../../utils/session-token');
const loginAttempts = new Map();

async function checkLoginCredentials(email, password) {
  const account = await accountRepository.getAccountByEmail(email);

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

  const accountPassword = account
    ? account.password
    : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, accountPassword);

  if (account && passwordChecked) {
    loginAttempts.delete(email);
    return {
      email: account.email,
      name: account.name,
      account_number: account.account_number,
      token: generateToken(account.email, account.account_number),
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

async function getLoginAttempts(email) {
  const attemptData = loginAttempts.get(email);
  if (attemptData) {
    return attemptData.attempts;
  } else {
    return 0;
  }
}

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

async function createAccount(
  username,
  email,
  password,
  phone_number,
  address,
  pin,
  account_number,
  balance
) {
  const hashedPassword = await hashPassword(password);

  try {
    await accountRepository.createAccount(
      username,
      email,
      hashedPassword,
      phone_number,
      address,
      pin,
      account_number,
      balance
    );
  } catch (err) {
    return null;
  }

  return true;
}

function generateAccountNumber() {
  const kodeBank = '391';
  const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  return kodeBank + randomNumber.toString().substring(1);
}

module.exports = {
  emailIsRegistered,
  usernameIsRegistered,
  phoneIsRegistered,
  createAccount,
  checkLoginCredentials,
  getLoginAttempts,
  generateAccountNumber,
};
