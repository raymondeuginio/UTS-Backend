const { Account } = require('../../../models');
const { Transaction } = require('../../../models');

/**
 * Mendapatkan informasi account berdasarkan username
 * @param {string} username - username untuk mencari informasi account
 * @returns {Promise<Object|boolean>} - Objek informasi account jika ditemukan, atau false jika tidak ditemukan
 */

async function getAccountByUsername(username) {
  const account = Account.findOne({ username });
  if (!account) {
    return false;
  }

  return account;
}

/**
 * Memeriksa keberadaan no rek dalam database
 * @param {string} account_number - no rek yang akan diperiksa
 * @returns {Promise<Object|null>} - objek informasi account jika no rek ditemukan, atau null jika tidak ditemukan
 */
async function checkAccountNumber(account_number) {
  return await Account.findOne({ account_number: account_number });
}

/**
 * Memperbarui saldo account dan mencatat transaksi deposit atau withdraw
 * @param {string} account_number - no rekening yang akan diperbarui saldonya
 * @param {string} transaction_id - transaction_id yang dicatat
 * @param {number} amount - jumlah uang yang akan ditambahkan atau dikurangkan dari saldo
 * @param {string} type - jenis transaksi ('Deposit' atau 'Withdraw')
 * @param {string} date - tanggal transaksi
 * @param {string} time - waktu transaksi
 * @returns {Promise<Object|null>} - objek informasi account yang telah diperbarui jika berhasil, atau null jika tidak ditemukan
 */
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

/**
 * Memperbarui saldo account dan mencatat transaksi
 * @param {string} account_number - no rekening yang akan diperbarui saldonya
 * @param {string} transaction_id - transaction_id yang dicatat
 * @param {string} type - jenis transaksi
 * @param {number} amount - jumlah uang yang akan ditambahkan atau dikurangkan dari saldo
 * @param {string} date - yanggal transaksi
 * @param {string} time - waktu transaksi
 * @returns {Promise<Object|null>} - objek informasi account yang telah diperbarui jika berhasil, atau null jika tidak ditemukan
 */
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

/**
 * Menghitung jumlah data transaksi berdasarkan no rekening account dan kriteria search
 * @param {string} account_number - no rekening account untuk mencari transaksi
 * @param {Object} potongan_search - kriteria search dalam bentuk objek
 * @returns {Promise<number>} - jumlah data transaksi yang sesuai dengan kriteria search
 */
async function itungData(account_number, potongan_search) {
  const count = await Transaction.countDocuments({
    account_number,
    ...potongan_search,
  });

  return count;
}

/**
 * Mengambil riwayat transaksi berdasarkan no rekening akun dengan opsi search, sort, dan pagenation
 * @param {string} account_number - no rekening akun untuk mencari riwayat transaksi
 * @param {Object} potongan_search - kriteria search dalam bentuk objek
 * @param {Object} potongan_sort - kriteria sort dalam bentuk objek
 * @param {number} pagenation - jumlah data yang akan dilewati (offset) untuk pagenation
 * @param {number} page_sz - jumlah data yang akan ditampilkan per halaman
 * @returns {Promise<Array>} - array yang berisi riwayat transaksi sesuai dengan kriteria search, sort, dan pagenation
 */
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

/**
 * Mendapatkan informasi transaksi berdasarkan no rekening account
 * @param {string} account_number - no rekening account untuk mencari informasi transaksi
 * @returns {Promise<Object|boolean>} - objek informasi transaksi jika ditemukan, atau false jika tidak ditemukan
 */
async function getAccountByNumber(account_number) {
  const account = Transaction.findOne({ account_number });
  if (!account) {
    return false;
  }

  return account;
}

/**
 * Menghitung jumlah data transaksi berdasarkan no rekening account
 * @param {string} account_number - no rekening account untuk mencari transaksi
 * @returns {Promise<number>} - jumlah data transaksi yang sesuai dengan no rekening account
 */
async function itungData1(account_number) {
  const count = await Transaction.countDocuments(account_number);
  return count;
}

/**
 * Mendapatkan informasi transaksi berdasarkan transaction_id
 * @param {string} transaction_id - transaction_id untuk mencari informasi transaksi
 * @returns {Promise<Object|boolean>} - objek informasi transaksi jika ditemukan, atau false jika tidak ditemukan
 */
async function getTransaction(transaction_id) {
  const transaction = Transaction.findOne({ transaction_id });
  if (!transaction) {
    return false;
  }

  return transaction;
}

/**
 * Menghapus riwayat transaksi berdasarkan transaction_id
 * @param {string} transaction_id - transaction_id yang akan dihapus
 * @returns {Promise<Object|null>} - objek informasi transaksi yang dihapus jika berhasil, atau null jika tidak ditemukan
 */
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
  itungData1,
  getTransaction,
  delete_history,
};
