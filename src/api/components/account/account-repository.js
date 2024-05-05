const { Account } = require('../../../models');

/**
 * Mendapatkan informasi account berdasarkan email
 * @param {string} email - email untuk mencari informasi account
 * @returns {Promise<Object|null>} - object informasi account jika ditemukan, atau null jika tidak ditemukan
 */
async function getAccountByEmail(email) {
  return Account.findOne({ email });
}

/**
 * Mendapatkan informasi account berdasarkan username
 * @param {string} username - useranme untuk mencari informasi account
 * @returns {Promise<Object|null>} - objek informasi account jika ditemukan, atau null jika tidak ditemukan
 */
async function getAccountByUsername(username) {
  return Account.findOne({ username });
}

/**
 * Mendapatkan informasi account berdasarkan no telepon
 * @param {string} phone_number - no telepon untuk mencari informasi account
 * @returns {Promise<Object|null>} - objek informasi account jika ditemukan, atau null jika tidak ditemukan
 */
async function getAccountByPhoneNumber(phone_number) {
  return Account.findOne({ phone_number });
}

/**
 * Membuat account baru dalam basis data
 * @param {string} username - username untuk account baru
 * @param {string} email - email untuk account baru
 * @param {string} password - password untuk account baru
 * @param {string} phone_number - no telepon untuk account baru
 * @param {string} address - alamat untuk account baru
 * @param {string} pin - pin untuk account baru
 * @param {string} account_number - no rekening untuk account baru
 * @param {number} balance - saldo awal untuk account baru
 * @returns {Promise<Object>} - objek yang mewakili account baru yang dibuat
 */
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
  return Account.create({
    username,
    email,
    password,
    phone_number,
    address,
    pin,
    account_number,
    balance,
  });
}

/**
 * Mendapatkan informasi account berdasarkan username
 * @param {string} username - username untuk mencari informasi account
 * @returns {Promise<Object|null>} - objek informasi account jika ditemukan, atau null jika tidak ditemukan
 */
async function getAccount(username) {
  return await Account.findOne({ username: username });
}

/**
 * Memperbarui informasi account pengguna
 * @param {string} username - username account yang akan diperbarui
 * @param {Object} fieldUpdate - objek yang berisi field yang akan diperbarui beserta nilainya
 * @returns {Promise<Object|null>} - objek informasi account yang telah diperbarui jika berhasil, atau null jika tidak ditemukan
 */
async function updateAccount(username, fieldUpdate) {
  return await Account.findOneAndUpdate({ username }, fieldUpdate, {
    new: true,
  });
}

/**
 * Menghapus account pengguna berdasarkan username
 * @param {string} username - username account yang akan dihapus
 * @returns {Promise<Object|null>} - objek informasi account yang telah dihapus jika berhasil, atau null jika tidak ditemukan
 */
async function deleteUser(username) {
  return await Account.findOneAndDelete({ username });
}

module.exports = {
  getAccountByEmail,
  getAccountByUsername,
  getAccountByPhoneNumber,
  createAccount,
  getAccount,
  updateAccount,
  deleteUser,
};
