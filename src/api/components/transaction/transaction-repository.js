const { Account } = require('../../../models');
const { Transaction } = require('../../../models');

async function getAccountByUsername(username) {
  const account = Account.findOne({ username });
  if (!account) {
    return false;
  }

  return account;
}

async function checkAccountNumber(account_number) {
  return await Account.findOne({ account_number: account_number });
}

async function updateBalanceDepositWithdraw(
  account_number,
  transaction_id,
  amount,
  type,
  date,
  time
) {
  Transaction.create({
    account_number,
    transaction_id,
    amount,
    type,
    date,
    time,
  });

  return await Account.findOneAndUpdate(
    { account_number: account_number },
    { $inc: { balance: amount } },
    { new: true }
  );
}

async function updateBalance(
  account_number,
  transaction_id,
  type,
  amount,
  date,
  time
) {
  Transaction.create({
    account_number,
    transaction_id,
    amount,
    type,
    date,
    time,
  });

  return await Account.findOneAndUpdate(
    { account_number: account_number },
    { $inc: { balance: amount } },
    { new: true }
  );
}
module.exports = {
  getAccountByUsername,
  checkAccountNumber,
  updateBalanceDepositWithdraw,
  updateBalance,
};
