const { Account } = require('../../../models');

async function getAccountByEmail(email) {
  return Account.findOne({ email });
}

async function getAccountByUsername(username) {
  return Account.findOne({ username });
}

async function getAccountByPhoneNumber(phone_number) {
  return Account.findOne({ phone_number });
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

module.exports = {
  getAccountByEmail,
  getAccountByUsername,
  getAccountByPhoneNumber,
  createAccount,
};
