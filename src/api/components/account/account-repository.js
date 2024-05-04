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

async function getAccount(username) {
  return await Account.findOne({ username: username });
}

async function updateAccount(username, fieldUpdate) {
  return await Account.findOneAndUpdate({ username }, fieldUpdate, {
    new: true,
  });
}

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
