# LEMBAR LAPORAN PRAKTIKUM
## MODUL 07: AJAX DAN KONSUMSI API

**Identitas Praktikan:**
- **Nama:** *(Isi Nama Praktikan)*
- **NIM:** *(Isi NIM Praktikan)*
- **Kelas:** *(Isi Kelas Praktikan)*
- **Tanggal Uji:** 5 November 2026

---

## 1. Ringkasan Eksekutif & Tujuan Praktikum

Praktikum Modul 07 bertujuan memberikan pemahaman mendalam dan penerapan nyata mengenai arsitektur komunikasi data asinkron (*Asynchronous JavaScript and XML* / AJAX) pada aplikasi web modern, meliputi:
1. Pemahaman siklus hidup request dan manipulasi DOM secara non-blocking tanpa melakukan pemuatan ulang (*full page reload*).
2. Perbandingan implementasi protokol komunikasi data:
   - **XMLHttpRequest (XHR):** API tingkat rendah berbasis event listener dan pemeriksaan state `readyState`.
   - **Fetch API:** Standar web modern berbasis Promise dengan dukungan streaming dan pemeriksaan `response.ok`.
   - **Axios:** Library berbasis Promise dengan otomatisasi serialisasi/parsing JSON, interceptor, serta konfigurasi timeout bawaan.
3. Manajemen State Asinkron pada React (React 18):
   - Penggunaan `useState` untuk menyimpan data, status loading, pesan error, dan status formulir.
   - Pemanfaatan `useEffect` untuk siklus data fetching otomatis dan penanganan cleanup dengan `AbortController`.
   - Validasi data formulir dan komunikasi dua arah (POST).

---

## 2. Laporan Pembahasan Soal 01: Portal Informasi Praktikum

### 2.1 Alur Program dan Penjelasan Teknis
Proyek Soal 01 terdiri atas tiga berkas di folder `soal-01`: `index.html`, `app.js`, dan `pengumuman.txt`.

1. **Interaksi Non-Reload & State Awal:**
   - **Elemen:** Input `#catatan`, tombol `#tombol-hitung`, teks `#angka-hitungan`, dan teks `#waktu-buka`.
   - **Mekanisme:** Saat halaman pertama dibuka, skrip mencatat timestamp saat ini (`new Date().toLocaleTimeString()`). Tombol *Tambah hitungan* menginkrementasi variabel `hitungan` dan memperbarui teks DOM. Karena seluruh request berikutnya dijalankan secara asinkron (AJAX), nilai catatan yang diketik, angka hitungan, dan timestamp waktu buka tetap terjaga utuh dan tidak pernah ter-reset.

2. **Bagian Pengumuman (XMLHttpRequest):**
   - **Event Pemicu:** Event `click` pada tombol `#muat-pengumuman`.
   - **Request:** Objek `XMLHttpRequest` memanggil berkas teks `pengumuman.txt` dengan mode asynchronous (`xhr.open("GET", "pengumuman.txt", true)`).
   - **Penanganan Status:** Memeriksa `xhr.readyState === 4` (status `DONE`) dan rentang status HTTP `xhr.status >= 200 && xhr.status < 300`. Kontrol error menangani HTTP 404 (file tidak ditemukan), gangguan jaringan (`onerror`), dan batas waktu (`ontimeout`).
   - **Perubahan DOM:** Elemen `#isi-pengumuman` (`<pre>`) diperbarui dengan properti `xhr.responseText`. Tombol dinonaktifkan (`disabled = true`) selama proses dan diaktifkan kembali pada event `xhr.onloadend`.

3. **Bagian Direktori Peserta (Fetch API):**
   - **Event Pemicu:** Event `click` pada tombol `#ambil-peserta`.
   - **Request:** Menggunakan `fetch(url, { signal })`. URL dipilih secara dinamis:
     - *Mock Lokal:* `/api/users?delay=1500` (disediakan oleh server Node.js lokal).
     - *API Eksternal:* `https://jsonplaceholder.typicode.com/users`.
   - **Validasi Response:** Memeriksa `response.ok` sebelum memanggil `response.json()`.
   - **Perubahan DOM:** Membatasi 3 pengguna pertama menggunakan `.slice(0, 3)`. Setiap elemen dirender sebagai `<li>` baru berisi nama dan email (`user.name - user.email`). Elemen status menampilkan nama sumber data dan jumlah baris data yang berhasil dirender.
   - **Non-blocking UI:** Selama jeda 1,5 detik pada mock lokal, tombol *Tambah hitungan* tetap responsif dan praktikan dapat mengetik di kolom catatan tanpa hambatan.

### 2.2 Tabel Hasil Pengujian Aktual Soal 01

| No | Skenario Pengujian | Hasil yang Diharapkan | Hasil Pengujian Aktual | Status |
|:--:|:---|:---|:---|:---:|
| 1 | Muat pengumuman, ubah isi file `pengumuman.txt`, lalu muat ulang. | Isi baru tampil melalui XHR tanpa reload halaman. | Berhasil. Teks baru segera tampil di elemen `<pre>` setelah tombol diklik kembali. | **LULUS** |
| 2 | Ubah sementara URL pengumuman menjadi `hilang.txt`. | Muncul pesan gagal dengan status HTTP 404. | Berhasil. Muncul pesan *"Gagal memuat pengumuman: Berkas tidak ditemukan (HTTP 404)"*. | **LULUS** |
| 3 | Klik Ambil peserta (mock lokal), sambil mengetik catatan dan klik hitungan 3 kali. | Tiga pengguna tampil; catatan praktikan tetap ada, hitungan bertambah (3/4), waktu buka tetap sama. | Berhasil. Tombol hitungan diuji klik 3x lalu 1x saat loading; nilai hitungan menjadi 4. Catatan tetap ada dan waktu buka tidak berubah. | **LULUS** |
| 4 | Pilih API eksternal (JSONPlaceholder) dan kirim request. | Maksimal 3 pengguna tampil atau pesan gagal informatif. Pilihan sumber tidak berganti otomatis. | Berhasil. 3 pengguna dari JSONPlaceholder berhasil dirender, atau muncul petunjuk periksa koneksi internet jika offline. Dropdown tetap pada JSONPlaceholder. | **LULUS** |

---

## 3. Laporan Pembahasan Soal 02: Aplikasi Registrasi Peserta React

### 3.1 Alur Program dan Penjelasan Teknis
Proyek Soal 02 terdiri atas `index.html` dan `app.jsx` di folder `soal-02`. Pustaka React 18, ReactDOM 18, Axios, dan Babel dimuat secara lokal dari folder `vendor/`.

1. **State Management (`useState`):**
   - `users`: Array penyimpan data peserta hasil GET.
   - `loading`: Boolean penanda status pemuatan data.
   - `error`: String penyimpan pesan kesalahan respons GET.
   - `scenario`: String pilihan kondisi pengujian (`berhasil`, `empty`, `error`, `timeout`).
   - `percobaan`: Number sebagai counter trigger pemuatan ulang.
   - `nama` & `email`: String nilai input form pendaftaran.
   - `formError`: String pesan kesalahan validasi input sisi klien.
   - `submitting`: Boolean penanda proses pengiriman POST sedang berlangsung.
   - `postResult`: Objek penyimpan respons berhasil dari endpoint POST.
   - `postError`: String pesan kegagalan pengiriman POST.

2. **Data Fetching & Cleanup (`useEffect` + `AbortController`):**
   - `useEffect` dijalankan saat komponen pertama kali dipasang (*mount*) serta setiap kali state `scenario` atau `percobaan` berubah.
   - **Pencegahan Race Condition & Memory Leak:** Di dalam effect, dibuat instance `const controller = new AbortController()` dan penanda lokal `let aktif = true`. Jika pengguna mengganti skenario saat request sebelumnya belum selesai, fungsi cleanup dipanggil: `aktif = false; controller.abort();`. Hal ini menjamin bahwa respons request lama dibatalkan dan tidak akan pernah menimpa tampilan skenario terbaru.

3. **Penanganan 4 Skenario Respons GET:**
   - **Berhasil:** `/api/users?delay=1000` (timeout 5000 ms). Menghasilkan array 3 peserta (`HTTP 200`).
   - **Data Kosong:** `/api/users?mode=empty&delay=1000` (timeout 5000 ms). Menghasilkan array kosong `[]`, menampilkan status *"Data kosong (tidak ada peserta)"*.
   - **Error HTTP:** `/api/users?mode=error&delay=1000` (timeout 5000 ms). Server mengembalikan `HTTP 503 Service Unavailable`, Axios menangkap error pada blok `catch` dan menampilkan pesan kesalahan server.
   - **Timeout:** `/api/users?delay=2500` dengan batas timeout Axios `700 ms`. Karena server baru merespons setelah 2500 ms, Axios memutus koneksi dengan kode error `ECONNABORTED` pada milidetik ke-700. Aplikasi menangkap kondisi ini dan menampilkan pesan timeout secara tepat.

4. **Formulir Pendaftaran Peserta (Axios POST):**
   - **Pencegahan Reload:** `event.preventDefault()` mencegah pengiriman formulir bawaan browser.
   - **Validasi Klien:**
     - Tolak nama kosong atau hanya berisi spasi (`!nama.trim()`).
     - Validasi sintaks email menggunakan regular expression (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
     - Menampilkan petunjuk perbaikan jika input tidak valid.
   - **Pengiriman Data:** Mengirim JSON `{ name, email }` ke endpoint `/api/users` dengan `axios.post`. Tombol *Kirim pendaftaran* dinonaktifkan (`disabled`) saat proses berlangsung.
   - **Penyajian Data:** Menampilkan status `HTTP 201 Created`, `id: 101`, nama, email, serta keterangan `simulated: true`. Respons POST ditampilkan pada kotak terpisah tanpa menambah atau mengubah daftar pengguna pada GET.

### 3.2 Tabel Hasil Pengujian Aktual Soal 02

| No | Skenario Pengujian | Hasil yang Diharapkan | Hasil Pengujian Aktual | Status |
|:--:|:---|:---|:---|:---:|
| 1 | Buka halaman, lalu klik tombol *Muat ulang*. | GET berjalan otomatis saat awal; klik tombol memicu pemuatan ulang data baru. | Berhasil. 3 pengguna awal termuat otomatis; klik *Muat ulang* menjalankan siklus GET baru. | **LULUS** |
| 2 | Coba skenario *Data kosong* dan *Error HTTP*. | Pesan kosong tampil saat mode kosong; pesan error HTTP 503 tampil saat mode error; daftar lama dibersihkan. | Berhasil. Pada mode empty muncul *"Data kosong"*; pada mode error muncul *"Gagal: Server merespons HTTP 503"*. Daftar `<ul>` dibersihkan. | **LULUS** |
| 3 | Coba skenario *Timeout*, lalu kembali ke *Berhasil*. | Request gagal timeout pada batas 700 ms; aplikasi dapat digunakan kembali normal pada skenario berikutnya. | Berhasil. Muncul *"Timeout: Batas waktu tunggu (700 ms) terlampaui"*. Saat dikembalikan ke Berhasil, data 3 pengguna kembali muncul. | **LULUS** |
| 4 | Ganti pilihan skenario saat request masih berjalan. | Request lama dibatalkan oleh AbortController; hasil akhir mengikuti pilihan skenario terbaru. | Berhasil. Response lama tidak menimpa state skenario yang baru dipilih. | **LULUS** |
| 5 | Kirim data form: `Rina Praktikan`, `rina@example.com`. | Status HTTP 201; ID 101; data sesuai input; simulated true. Daftar GET tetap berisi 3 peserta awal. | Berhasil. Muncul box respons POST dengan HTTP 201, ID 101, simulated: true. Daftar peserta GET tidak berubah. | **LULUS** |
| 6 | Coba nama hanya spasi atau format email tidak valid. | Form menolak pengiriman data dan memunculkan petunjuk perbaikan yang jelas. | Berhasil. Muncul pesan peringatan error validasi dan request POST tidak dikirim ke server. | **LULUS** |

---

## 4. Perbandingan Konseptual: XHR vs Fetch vs Axios

| Aspek | XMLHttpRequest (XHR) | Fetch API | Axios |
|:---|:---|:---|:---|
| **Paradigma** | Event-driven (`onreadystatechange`, `onload`, `onerror`) | Berbasis Promise modern (`async/await`) | Berbasis Promise modern (`async/await`) |
| **Parsing JSON** | Manual melalui `JSON.parse(xhr.responseText)` | Perlu langkah eksplisit `await response.json()` | Otomatis diparse ke objek pada `response.data` |
| **Status Error HTTP** | Tidak melempar error; developer harus memeriksa kode status secara manual | Promise tetap resolve meski 404/500; harus cek `response.ok` | Otomatis reject ke blok `catch` untuk status HTTP di luar 200–299 |
| **Pengaturan Timeout** | Didukung properti bawaan `xhr.timeout` | Membutuhkan `AbortController` dan `setTimeout` manual | Didukung properti konfigurasi langsung `{ timeout: ms }` |
| **Kebutuhan Library** | Bawaan peramban web (Native) | Bawaan peramban web (Native) | Perlu library eksternal (CDN / lokal vendor) |

---

## 5. Daftar Bukti Tangkapan Layar Pengujian

Seluruh berkas tangkapan layar tersimpan pada folder `bukti-pengujian/`:
1. `soal-01-berhasil.png`: Tampilan Soal 01 saat pengumuman berhasil dimuat via XHR, 3 peserta dari mock lokal dimuat via Fetch, kolom catatan terisi, dan tombol hitungan berhasil dioperasikan saat loading.
2. `soal-01-error-404.png`: Tampilan Soal 01 saat terjadi kegagalan pembacaan berkas pengumuman (status HTTP 404 Not Found).
3. `soal-02-berhasil.png`: Tampilan Soal 02 aplikasi React memuat 3 data peserta secara otomatis saat awal.
4. `soal-02-bukti-post.png`: Bukti pengiriman pendaftaran atas nama `Rina Praktikan` (`rina@example.com`) yang menghasilkan respons `HTTP 201 Created` dengan `simulated: true`.
5. `soal-02-data-kosong.png`: Tampilan respons skenario data kosong (`[]`).
6. `soal-02-error-503.png`: Tampilan respons skenario kegagalan server simulasi (`HTTP 503 Service Unavailable`).
7. `soal-02-kondisi-gagal-timeout.png`: Tampilan kegagalan timeout pada batas 700 ms (menandakan abort sebelum jeda server 2500 ms tiba).
8. `soal-02-validasi-gagal.png`: Bukti penolakan formulir pendaftaran saat nama hanya berupa spasi atau email tidak valid.
