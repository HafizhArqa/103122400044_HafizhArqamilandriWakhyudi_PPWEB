# Petunjuk Penggunaan Modul 07: AJAX dan Konsumsi API

Repositori ini memuat pengerjaan lengkap tugas praktikum Modul 07 yang mencakup dua proyek:
1. **Soal 01 (`soal-01`):** Portal Informasi Praktikum (XMLHttpRequest, Fetch API, Non-blocking DOM).
2. **Soal 02 (`soal-02`):** Aplikasi Registrasi Peserta React (Axios GET/POST, useState, useEffect, Cleanup AbortController, Validasi Form).

---

## Prasyarat Lingkungan
- **Node.js:** Versi 18 atau lebih baru (disarankan versi LTS).
- **Peramban Web:** Google Chrome, Microsoft Edge, atau Mozilla Firefox modern.

---

## Struktur Folder Proyek
```text
Paket_Praktikum_AJAX/
├── latihan-praktikan/
│   ├── soal-01/
│   │   ├── index.html
│   │   ├── app.js
│   │   └── pengumuman.txt
│   ├── soal-02/
│   │   ├── index.html
│   │   └── app.jsx
│   ├── bukti-pengujian/
│   │   ├── soal-01-berhasil.png
│   │   ├── soal-01-error-404.png
│   │   ├── soal-02-berhasil.png
│   │   ├── soal-02-bukti-post.png
│   │   ├── soal-02-data-kosong.png
│   │   ├── soal-02-error-503.png
│   │   ├── soal-02-kondisi-gagal-timeout.png
│   │   └── soal-02-validasi-gagal.png
│   ├── README.md
│   └── LAPORAN_PENGUJIAN.md
├── assets/
│   ├── style.css
│   └── ui.js
├── vendor/
│   ├── axios.min.js
│   ├── react.development.js
│   ├── react-dom.development.js
│   └── babel.min.js
├── server.cjs
├── JALANKAN.bat
└── index.html
```

---

## Cara Menjalankan Aplikasi

1. **Jalankan Server Lokal:**
   - Melalui Windows Explorer: Klik dua kali file `JALANKAN.bat` di dalam folder `Paket_Praktikum_AJAX`.
   - Atau melalui Terminal (PowerShell / Command Prompt):
     ```bash
     cd Paket_Praktikum_AJAX
     node server.cjs
     ```
   - Server akan berjalan pada alamat `http://127.0.0.1:3007`. Biarkan jendela terminal tetap terbuka selama praktikum.

2. **Buka Aplikasi di Browser:**
   - **Peta Materi Utama:** [http://127.0.0.1:3007/](http://127.0.0.1:3007/)
   - **Proyek Soal 01:** [http://127.0.0.1:3007/latihan-praktikan/soal-01/](http://127.0.0.1:3007/latihan-praktikan/soal-01/)
   - **Proyek Soal 02:** [http://127.0.0.1:3007/latihan-praktikan/soal-02/](http://127.0.0.1:3007/latihan-praktikan/soal-02/)

---

## Catatan Teknis
- **Jangan Membuka via `file://`:** Aplikasi AJAX dan skrip Babel JSX memerlukan protokol `http://` dari server lokal.
- **Port Pengganti:** Jika port 3007 sedang digunakan, jalankan dengan environment variable, misalnya di PowerShell:
  ```powershell
  $env:PORT=3008; node server.cjs
  ```
- **Koneksi Internet:** Hanya dibutuhkan saat menguji pilihan direktori eksternal (JSONPlaceholder) pada Soal 01. Seluruh pustaka vendor dan endpoint mock lokal bekerja 100% secara offline.
