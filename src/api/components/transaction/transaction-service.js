const transactionRepository = require('./transaction-repository');
const accountRepository = require('../account/account-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function transfer(username, amount, description, to_account, pin) {
  const account = await accountRepository.getAccountByUsername(username);
  const toAccount = await transactionRepository.checkAccountNumber(to_account);
  const fromAccount = account.account_number;

  if (!account) {
    throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Username not found');
  }
  if (!toAccount) {
    throw errorResponder(
      errorTypes.UNPROCESSABLE_ENTITY,
      'Account Number not found'
    );
  }

  const accountPin = account ? account.pin : '<RANDOM_PASSWORD_FILLER>';

  const pinChecked = await passwordMatched(pin, accountPin);

  if (!pinChecked) {
    throw new Error('Incorrect pin');
  }

  if (account.balance < amount) {
    throw new Error('Insufficient balance');
  }
  const transaction_id_out = generateTransactionId();
  const type_out = 'Transfer Out';
  const transaction_id_in = generateTransactionId();
  const type_in = 'Transfer In';
  const currentDate = new Date();
  const date_string = currentDate.toISOString().split('T')[0];

  const hour = String(currentDate.getHours()).padStart(2, '0');
  const minute = String(currentDate.getMinutes()).padStart(2, '0');
  const second = String(currentDate.getMinutes()).padStart(2, '0');
  const time_string = `${hour}:${minute}:${second}`;

  await transactionRepository.updateBalance(
    fromAccount,
    transaction_id_out,
    type_out,
    -amount,
    date_string,
    time_string
  );
  await transactionRepository.updateBalance(
    toAccount.account_number,
    transaction_id_in,
    type_in,
    amount,
    date_string,
    time_string
  );

  return {
    transaction_id: transaction_id_out,
    amount: 'Rp. ' + amount,
    description,
    from_account: fromAccount,
    to_account: toAccount.account_number,
    date: date_string,
    time: time_string,
  };
}

async function deposit(username, amount, pin) {
  const account = await accountRepository.getAccountByUsername(username);

  if (!account) {
    throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Username not found');
  }

  const accountPin = account ? account.pin : '<RANDOM_PASSWORD_FILLER>';

  const pinChecked = await passwordMatched(pin, accountPin);

  if (!pinChecked) {
    throw new Error('Incorrect pin');
  }

  const transaction_id = generateTransactionId();
  const type = 'Deposit';
  const currentDate = new Date();
  const date_string = currentDate.toISOString().split('T')[0];

  const hour = String(currentDate.getHours()).padStart(2, '0');
  const minute = String(currentDate.getMinutes()).padStart(2, '0');
  const second = String(currentDate.getMinutes()).padStart(2, '0');
  const time_string = `${hour}:${minute}:${second}`;

  await transactionRepository.updateBalanceDepositWithdraw(
    account.account_number,
    transaction_id,
    amount,
    type,
    date_string,
    time_string
  );

  return {
    account_number: account.account_number,
    transaction_id: transaction_id,
    amount: 'Rp. ' + amount,
    balance_before: 'Rp. ' + account.balance,
    balance_now: 'Rp. ' + (account.balance + amount),
    date: date_string,
    time: time_string,
  };
}

async function withdraw(username, amount, pin) {
  const account = await accountRepository.getAccountByUsername(username);

  if (!account) {
    throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Username not found');
  }

  const accountPin = account ? account.pin : '<RANDOM_PASSWORD_FILLER>';

  const pinChecked = await passwordMatched(pin, accountPin);

  if (!pinChecked) {
    throw new Error('Incorrect pin');
  }

  if (account.balance < amount) {
    throw new Error('Insufficient balance');
  }

  const transaction_id = generateTransactionId();
  const type = 'Withdraw';
  const currentDate = new Date();
  const date_string = currentDate.toISOString().split('T')[0];

  const hour = String(currentDate.getHours()).padStart(2, '0');
  const minute = String(currentDate.getMinutes()).padStart(2, '0');
  const second = String(currentDate.getMinutes()).padStart(2, '0');
  const time_string = `${hour}:${minute}:${second}`;

  await transactionRepository.updateBalanceDepositWithdraw(
    account.account_number,
    transaction_id,
    -amount,
    type,
    date_string,
    time_string
  );

  return {
    account_number: account.account_number,
    transaction_id: transaction_id,
    amount: 'Rp. ' + amount,
    balance_before: 'Rp. ' + account.balance,
    balance_now: 'Rp. ' + (account.balance - amount),
    date: date_string,
    time: time_string,
  };
}

function generateTransactionId() {
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let transactionId = '';
  for (let i = 0; i < 12; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    transactionId += characters[randomIndex];
  }
  return transactionId;
}

async function itungData(search) {
  return transactionRepository.itungData(search);
}

async function history(username, page_num, page_sz, search, sort) {
  const account = await accountRepository.getAccountByUsername(username);

  if (!account) {
    throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Username not found');
  }

  const account_number = account.account_number;

  let potongan_search = [];

  if (search) {
    const [field_name, search_key] = search.split(':');
    potongan_search[field_name] = { $regex: search_key, $options: 'i' };
  }

  let potongan_sort = {};
  if (sort) {
    const [field_name, sort_order] = sort.split(':');
    if (sort_order === 'asc') {
      potongan_sort[field_name] = 1;
    } else if (sort_order === 'desc') {
      potongan_sort[field_name] = -1;
    } else {
      potongan_sort[field_name] = 1;
    }
  }

  const pagination = (page_num - 1) * page_sz;

  const total_transaction = await transactionRepository.itungData(
    account_number,
    potongan_search
  );

  if (!page_sz) {
    page_sz = total_transaction;
  }

  const transaction = await transactionRepository.history(
    account_number,
    potongan_search,
    potongan_sort,
    pagination,
    page_sz
  );

  let total_page = Math.ceil(total_transaction / page_sz);
  if (total_page === 0) {
    total_page = 1;
  }

  const result = {
    page_number: page_num,
    page_size: page_sz,
    count: total_transaction,
    total_pages: total_page,
    has_previous_page: page_num > 1,
    has_next_page: page_num < total_page,
    data: transaction,
  };

  return result;
}

async function getAccountByUsername(username) {
  return accountRepository.getAccountByUsername(username);
}

async function delete_history(username, transaction_id, pin) {
  const account = await accountRepository.getAccountByUsername(username);
  const transaction =
    await transactionRepository.getTransaction(transaction_id);

  if (!account) {
    throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Username not found');
  }

  if (!transaction) {
    throw errorResponder(
      errorTypes.UNPROCESSABLE_ENTITY,
      'Transaction not found'
    );
  }

  const accountPin = account ? account.pin : '<RANDOM_PASSWORD_FILLER>';

  const pinChecked = await passwordMatched(pin, accountPin);

  if (!pinChecked) {
    throw new Error('Incorrect pin');
  }

  const success = await transactionRepository.delete_history(transaction_id);
  return success;
}
module.exports = {
  transfer,
  deposit,
  withdraw,
  itungData,
  history,
  getAccountByUsername,
  delete_history,
};
