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

module.exports = {
  transfer,
  deposit,
};
