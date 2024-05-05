const transactionService = require('./transaction-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle transfer money request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
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

/**
 * Handle deposit money request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
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

/**
 * Handle withdraw money request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
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

/**
 * Handle see transaction history request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function history(request, response, next) {
  try {
    const { page_number, page_size, search, sort } = request.query;
    const username = request.params.username;

    let page_num = parseInt(page_number) || 1;
    if (page_num <= 0) {
      page_num = 1;
    }

    page_sz = parseInt(page_size);

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

/**
 * Handle delete transaction history request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function delete_history(request, response, next) {
  try {
    const { username, transaction_id } = request.params;
    const pin = request.body.pin;

    const success = await transactionService.delete_history(
      username,
      transaction_id,
      pin
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete transaction history'
      );
    }

    response.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  transfer,
  deposit,
  withdraw,
  history,
  delete_history,
};
