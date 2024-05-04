const transactionService = require('./transaction-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function transfer(request, response, next) {
  try {
    const { amount, description, to_account, pin } = request.body;
    const username = request.params.username;

    const transaction_result = await transactionService.transfer(
      username,
      amount,
      description,
      to_account,
      pin
    );

    response.status(200).json({
      message: 'Transaction Successful',
      transaction_result,
    });
  } catch (error) {
    next(error);
  }
}

async function deposit(request, response, next) {
  try {
    const { amount, pin } = request.body;
    const username = request.params.username;

    const transaction_result = await transactionService.deposit(
      username,
      amount,
      pin
    );

    response.status(200).json({
      message: 'Deposit Berhasil',
      transaction_result,
    });
  } catch (error) {
    next(error);
  }
}

async function withdraw(request, response, next) {
  try {
    const { amount, pin } = request.body;
    const username = request.params.username;

    const transaction_result = await transactionService.withdraw(
      username,
      amount,
      pin
    );

    response.status(200).json({
      message: 'Withdraw Berhasil',
      transaction_result,
    });
  } catch (error) {
    next(error);
  }
}

async function history(request, response, next) {
  try {
    const { page_number, page_size, search, sort } = request.query;
    const username = request.params.username;

    const account = await transactionService.getAccountByUsername(username);

    let page_num = parseInt(page_number) || 1;
    if (page_num <= 0) {
      page_num = 1;
    }

    const default_page_size = await transactionService.itungData(
      account.account_number,
      search
    );
    let page_sz = parseInt(page_size) || default_page_size;
    if (page_sz <= 0) {
      page_sz = default_page_size;
    }

    const results = await transactionService.history(
      username,
      page_num,
      page_sz,
      search,
      sort
    );

    return response.status(200).json(results);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  transfer,
  deposit,
  withdraw,
  history,
};
