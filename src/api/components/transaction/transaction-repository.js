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

async function itungData(account_number, search) {
  const criteria = { account_number: account_number, ...search };

  // Hitung jumlah dokumen yang sesuai dengan kriteria pencarian
  const count = await Transaction.countDocuments(criteria);

  return count;
}

async function history(
  account_number,
  potongan_search_type,
  potongan_sort,
  pagenation,
  page_sz
) {
  return Transaction.find({
    account_number,
    ...potongan_search_type,
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

module.exports = {
  getAccountByUsername,
  checkAccountNumber,
  updateBalanceDepositWithdraw,
  updateBalance,
  itungData,
  history,
  getAccountByNumber,
  filterData,
};
