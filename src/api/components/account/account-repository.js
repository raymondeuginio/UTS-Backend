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

module.exports = {
  getAccountByEmail,
  getAccountByUsername,
  getAccountByPhoneNumber,
};
