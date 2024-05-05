const accountRepository = require('./account-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { generateToken } = require('../../../utils/session-token');

const loginAttempts = new Map();

/**
 * Memeriksa login valid atau tidak
 * @param {string} email - email user
 * @param {string} password - password user
 * @returns {Object|null} - informasi user jika login valid, atau null jika tidak valid atau terdapat max attempt
 */

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
      username: account.username,
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

/**
 * Mendapatkan jumlah percobaan login untuk satu email
 * @param {string} email - email untuk mendapatkan jumlah percobaan login
 * @returns {number} - jumlah percobaan login untuk alamat email yang diberikan
 */
async function getLoginAttempts(email) {
  const attemptData = loginAttempts.get(email);
  if (attemptData) {
    return attemptData.attempts;
  } else {
    return 0;
  }
}

/**
 * Memeriksa apakah email telah terdaftar atau digunakan pengguna lain
 * @param {string} email - email yang akan diperiksa
 * @returns {boolean} - true jika email telah terdaftar, false jika masih bisa dipakai
 */
async function emailIsRegistered(email) {
  const account = await accountRepository.getAccountByEmail(email);

  if (account) {
    return true;
  }

  return false;
}

/**
 * Memeriksa apakah username telah terdaftar atau digunakan pengguna lain
 * @param {string} username - username yang akan diperiksa
 * @returns {boolean} - true jika username telah terdaftar, false jika masih bisa dipakai
 */
async function usernameIsRegistered(username) {
  const account = await accountRepository.getAccountByUsername(username);

  if (account) {
    return true;
  }

  return false;
}

/**
 * Memeriksa apakah no telepon telah terdaftar atau digunakan pengguna lain
 * @param {string} phone_number - no telepon yang akan diperiksa
 * @returns {boolean} - true jika no telepon telah terdaftar, false jika masih bisa dipakai
 */
async function phoneIsRegistered(phone_number) {
  const account = await accountRepository.getAccountByPhoneNumber(phone_number);

  if (account) {
    return true;
  }

  return false;
}

/**
 * Membuat account baru kedalam database
 * @param {string} username - username untuk account baru
 * @param {string} email - email untuk account baru
 * @param {string} password - password untuk account baru
 * @param {string} phone_number - no telepon untuk account baru
 * @param {string} address - alamat untuk account baru
 * @param {string} account_number - nomor rekening untuk account baru
 * @param {string} pin - pin untuk account baru
 * @param {number} balance - saldo awal untuk account baru
 * @returns {boolean|null} - true jika pembuatan account berhasil, atau null jika terjadi kesalahan
 */
async function createAccount(
  username,
  email,
  password,
  phone_number,
  address,
  account_number,
  pin,
  balance
) {
  const hashedPassword = await hashPassword(password);
  const hashedPin = await hashPassword(pin);

  try {
    await accountRepository.createAccount(
      username,
      email,
      hashedPassword,
      phone_number,
      address,
      hashedPin,
      account_number,
      balance
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Menghasilkan nomor rekening baru dengan format 12 angka (angka depan 391)
 * @returns {string} - Nomor rekening baru yang dihasilkan
 */
function generateAccountNumber() {
  const kodeBank = '391';
  const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  return kodeBank + randomNumber.toString().substring(1);
}

/**
 * Mendapatkan informasi account berdasarkan nama pengguna
 * @param {string} username - Nusername untuk mencari informasi account
 * @returns {Object|null} - informasi account jika ditemukan, atau null jika tidak ditemukan
 */
async function getAccount(username) {
  const usernameLowerCase = username.toLowerCase();
  const account = await accountRepository.getAccount(usernameLowerCase);

  if (!account) {
    return null;
  }

  return {
    username: account.username,
    account_number: account.account_number,
    balance: 'Rp. ' + account.balance,
  };
}

/**
 * Memperbarui informasi account
 * @param {string} username - username akun yang akan diperbarui
 * @param {string} field - field yang akan diperbarui (contoh: 'username', 'email', 'phone_number', 'password')
 * @param {string|number} value - value baru untuk bidang yang akan diperbarui
 * @param {string} password - passwordpengguna untuk verifikasi perubahan
 * @returns {Object} - informasi akun yang diperbarui
 * @throws {Error} - rrror jika nama pengguna tidak ditemukan, kata sandi salah, atau bidang yang tidak dapat diubah mencoba untuk diubah
 */
async function updateAccount(username, field, value, password) {
  const account = await accountRepository.getAccountByUsername(username);
  const accountPassword = account
    ? account.password
    : '<RANDOM_PASSWORD_FILLER>';

  const passwordChecked = await passwordMatched(password, accountPassword);

  if (!account) {
    throw new Error('Account with that username not found');
  }

  if (!passwordChecked) {
    throw new Error('Incorrect password');
  }

  if (field === 'account_number') {
    throw new Error('Account Number cannot be changed');
  }

  if (field === 'username' && (await usernameIsRegistered(value))) {
    throw new Error('Username is already taken. Choose another one');
  }

  if (field === 'email' && (await emailIsRegistered(value))) {
    throw new Error('Email is already taken. Choose another one');
  }

  if (field === 'phone_number' && (await phoneIsRegistered(value))) {
    throw new Error('Phone number is already taken. Choose another one');
  }

  if (field === 'password') {
    const hashedPassword = await hashPassword(value);
    const fieldUpdate = { [field]: hashedPassword };
    const updatedAccount = await accountRepository.updateAccount(
      username,
      fieldUpdate
    );
    return updatedAccount;
  }

  const fieldUpdate = { [field]: value };
  const updatedAccount = await accountRepository.updateAccount(
    username,
    fieldUpdate
  );

  return updatedAccount;
}

/**
 * Menghapus account
 * @param {string} username - username akun yang akan dihapus
 * @param {string} password - password pengguna untuk verifikasi penghapusan akun
 * @throws {Error} - rrror jika nama pengguna tidak ditemukan atau kata sandi salah
 */
async function deleteAccount(username, password) {
  const account = await accountRepository.getAccountByUsername(username);
  const accountPassword = account
    ? account.password
    : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, accountPassword);

  if (!account) {
    throw new Error('Account with that username not found');
  }

  if (!passwordChecked) {
    throw new Error('Incorrect password');
  }

  await accountRepository.deleteUser(username);
}

module.exports = {
  emailIsRegistered,
  usernameIsRegistered,
  phoneIsRegistered,
  createAccount,
  checkLoginCredentials,
  getLoginAttempts,
  generateAccountNumber,
  getAccount,
  updateAccount,
  deleteAccount,
};
