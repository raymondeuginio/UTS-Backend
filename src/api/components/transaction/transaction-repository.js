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
  const newAmount = Math.abs(amount);
  Transaction.create({
    account_number,
    transaction_id,
    amount: newAmount,
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

async function itungData(account_number, potongan_search) {
  const count = await Transaction.countDocuments({
    account_number,
    ...potongan_search,
  });

  return count;
}

async function history(
  account_number,
  potongan_search,
  potongan_sort,
  pagenation,
  page_sz
) {
  return Transaction.find({
    account_number,
    ...potongan_search,
  })
    .sort(potongan_sort)
    .skip(pagenation)
    .limit(page_sz);
}

async function getAccountByNumber(account_number) {
  const account = Transaction.findOne({ account_number });
  if (!account) {
    return false;
  }

  return account;
}

async function filterData(account_number) {
  Transaction.filter(Transaction.account_number === account_number);
}

async function itungData1(account_number) {
  const count = await Transaction.countDocuments(account_number);
  return count;
}

async function getTransaction(transaction_id) {
  const transaction = Transaction.findOne({ transaction_id });
  if (!transaction) {
    return false;
  }

  return transaction;
}
async function delete_history(transaction_id) {
  return Transaction.findOneAndDelete({ transaction_id: transaction_id });
}

module.exports = {
  getAccountByUsername,
  checkAccountNumber,
  updateBalanceDepositWithdraw,
  updateBalance,
  itungData,
  history,
  getAccountByNumber,
  filterData,
  itungData1,
  getTransaction,
  delete_history,
};
