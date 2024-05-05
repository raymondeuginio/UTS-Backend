# UTS-Backend


NOMOR 3 : 
FITUR ACCOUNT (endpoint /account)

a. Create User Account (POST /account) : 
- Input : username, email, password, password_confirm, phone_number, address, pin sebagai body JSON dengan kriteria yang sudah ditentukan pada validator.
- Cek apakah password dan password_confirm sudah sama atau belum.
- Cek apakah username, email, dan phone_number masih tersedia. Jika memang belum terdaftar untuk akun lain, maka proses berhasil, jika salah satu sudah digunakan, berikan error dan minta untuk menggunakan username/email/phone_ number lain (tergantung mana yang udah terdaftar)
- Melakukan hash password dan pin sebelum dimasukkan kedalam database.
- mengenerate account_number secara otomatis dan unik (12 angka termasuk kode bank 391 didepan), ini permisalan sebagai nomor rekening.
- Jika berhasil, tampilkan username, email, account_number dan otomatis set balance jadi 0.

b. Login (POST /account/login)
- Input: email dan password sebagai body JSON dengan kriteria yang sudah ditentukan di validator
- Melakukan cek terhadap password/email, jika salah satu salah maka akan mengembalikan output “Wrong email or password”. User diberikan kesempatan sebanyak 5x percobaan, jika salah melebihi 5x akan diberi freeze login selama 30 menit.
- Jika berhasil, akan mengembalikan output email, username, account_number, beserta token yang bisa digunakan untuk login.

c. Read User Account (GET /account/:username)
- Username diambil dari parameter (request param)
-Jika berhasil output akan menampilkan informasi username, account_number dan balance.
- User hanya bisa melihat akun mereka sendiri. Jika mereka memasukan username lain, akan muncul output “Anda tidak memiliki akses”. Pengecekan ini dilakukan pada middleware.


d. Update User Account (PUT /account/:username)
- Username diambil dari parameter (request param)
- Input : field (bagian yang mau diupdate, seperti username, password, email, phone_number, address, maupun pin), value (value baru dari field yang akan diupdate), password sebagai body JSON dengan kriteria yang sudah ditentukan pada validator.
- account_number tidak bisa diubah, sehingga ketika user memasukkan account_number sebagai nilai dari ‘field’, akan mengembalikan output “Account Number cannot be changed”
- Setiap mau update harus masukin password dan dilakukan pengecekan, jika password salah akan memunculkan error “Incorect Password”
- Jika berhasil, akan memunculkan output “Update berhasil dilakukan”, serta menampilkan data (username, email, phone_number, address, dan account_number) yang baru setelah diupdate
- User hanya bisa melakukan update akun mereka sendiri. Jika mereka memasukan username lain, akan muncul output “Anda tidak memiliki akses”. Pengecekan ini dilakukan pada middleware.

e. Delete User Account (DELETE /account/:username)
- Username diambil dari parameter (request param)
- Input : password sebagai body JSON dengan kriteria yang sudah ditentukan pada validator.
- Akan dilakukan pengecekan password, jika salah akan memunculkan output “Incorrect Password”
- Jika benar, maka akan melakukan proses delete akun, dimana semua data termasuk balance akan terhapus menjadi 0. Email, username, dan no_telepon jadi bisa digunakan oleh akun lain
- Setelah berhasil, akan memunculkan output “Account deleted successfully”



FITUR TRANSACTION (endpoint /transaction)
FITUR YANG ADA DI ENDPOINT INI HANYA BISA DIAKSES JIKA USER SUDAH LOGIN
a. Transfer (POST /transaction/:username/transfer)
- Input: amount, description, to_account, dan pin sebagai body JSON dengan kriteria yang sudah ditentukan pada validator
- Username diambil dari parameter (request param)
- from_account akan diambil dari username user.
- Melakukan pengecekan pada username dan nomor rekening yang dituju, jika sekiranya tidak ditemukan, kembalikan output “Username not found” atau “Account Number not found”
- Melakukan pengecekan pada pin, jika salah maka akan mengembalikan error “Incorrect Pin”. Jika sudah benar maka lanjutkan proses. 
- Setelah cek pin, melakukan pengecekan terhadap sisa saldo (balance) yang ada, jika tidak balance lebih kecil dari jumlah transfer, akan mengembalikan output “Insufficient balance”. Jika saldo cukup, maka lanjutkan proses.
- Akan mengenerate 2 transaction_id
- Jika transaksi berhasil, maka akan ada 2 transaksi yang tercatat dalam database, yaitu dengan tipe “Transfer Out” yang tersimpan pada list transaksi user, yang mengembalikan output “Transaksi Berhasil” diikuti dengan transaction_id, amount, deskripsi, from_account, to_account, date, dan time. Serta transaksi dengan tipe “Transfer In” yang tersimpan pada list transaksi penerima, yang mengembalikan output yang sama.
- Langsung kurangin balance user.
- User hanya bisa melakukan transfer dari akun mereka sendiri. Jika mereka memasukan username lain, akan muncul output “Anda tidak memiliki akses”. Pengecekan ini dilakukan pada middleware.

b. Deposit (POST /transaction/:username/deposit)
- Input: amount, pin sebagai body JSON dengan kriteria yang sudah ditentukan pada validator.
- Username diambil dari parameter (request param)
- Melakukan pengecekan pada pin, jika salah maka akan mengembalikan error “Incorrect Pin”. Jika sudah benar maka lanjutkan proses. 
- Akan generate transaction_id
- Langsung tambahin/update balance pengguna.
- Jika deposit berhasil, return output “Deposit Berhasil”, diikuti dengan account_number, transaction_id, amount, balance_before, balance_after, date, dan time. 
- User hanya bisa melakukan deposit pada akun mereka sendiri. Jika mereka memasukan username lain, akan muncul output “Anda tidak memiliki akses”. Pengecekan ini dilakukan pada middleware.



c. Withdraw (POST /transaction/withdraw)
- Input: amount, pin sebagai body JSON dengan kriteria yang sudah ditentukan pada validator.
- Username diambil dari parameter (request param)
- Melakukan pengecekan pada pin, jika salah maka akan mengembalikan error “Incorrect Pin”. Jika sudah benar maka lanjutkan proses. 
- Akan cek sisa saldo yang ada, jika mencukupi baru lanjutkan proses. Jika tidak mencukupi akan mengembalikan output “Insufficient balance”
- Akan generate transaction_id
- Langsung kurangin/update balance user
- Jika withdraw berhasil, return output “Withdraw Berhasil”, diikuti dengan account_number, transaction_id, amount, balance_before, balance_after, date, dan time. 
- User hanya bisa melakukan withdraw pada akun mereka sendiri. Jika mereka memasukan username lain, akan muncul output “Anda tidak memiliki akses”. Pengecekan ini dilakukan pada middleware.



d. Read Mutasi Rekening (GET /transaction/:username/history? )
- Username diambil dari parameter (request param)
- page_number, page_size, search, sort untuk pagination diambil dari query (request query)
- Defaultnya adalah user hanya bisa melihat riwayat transaksi milik mereka (jadi default search adalah berdasarkan account_number user). Jika memang user memasukan search=<field:value> makan akan dilakukan search 2x. Default dari sort adalah ascending, default dari page - size akan mengikuti jumlah data yang ada, default page_number adalah 1.
- Asumsi yang dipakai : misal total riwayat transaksi ada 11, tapi saat search type:deposit hanya ditemukan 4 data yang bertipe deposit, maka total data juga akan berubah yakni menjadi 4 data dari yang semula 11 data.
- Akan menampilkan page_number, page_size, count, total_pages, has_previous_page, has_next_page, dan juga semua data riwayat transaksi.
- User hanya bisa mengecek riwayat transaksi pada akun mereka sendiri. Jika mereka memasukan username lain, akan muncul output “Anda tidak memiliki akses”. Pengecekan ini dilakukan pada middleware.

e. Delete Transfer (DELETE /transactions/:username/:transcation_id)
- Input: pin sebagai body JSON dengan kriteria yang sudah ditentukan pada validator
- Username dan transaction_id ambil dari parameter (request parameter)
- Melakukan pengecekan pada pin, jika salah maka akan mengembalikan error “Incorrect Pin”. Jika sudah benar maka lanjutkan proses. 
- Melakukan pengecekan transaction_id. Jika ditemukan, makan  akan menghapus transaksi sesuai dengan transaksi_id yang diterima. Jika tidak ada, akan return “transaksi tidak ditemukan”
- User hanya bisa menghapus riwayat transaksi pada akun mereka sendiri. Jika mereka memasukan username lain, akan muncul output “Anda tidak memiliki akses”. Pengecekan ini dilakukan pada middleware.
