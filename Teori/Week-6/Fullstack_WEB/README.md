# 🎵 ONE 'O ONES Official Store - Frontend React (Bab 6 React Dasar)

Repository ini merupakan tugas perkuliahan **Pemrograman Fullstack Web: Bab 6 React Dasar**. Proyek ini merupakan fondasi kerangka awal aplikasi fullstack yang akan terus dikembangkan hingga Pekan 14 (pada Pekan 11 akan dihubungkan ke backend API).

- **Topik Aplikasi:** ONE 'O ONES Official Store (Katalog Merchandise & Diskografi Musik Artis)
- **Entitas Data Utama:** `Produk` / `Merchandise`
- **Framework & Tooling:** React 19 + Vite 8
- **URL Dev:** `http://localhost:5173`
- **GitHub Repository:** [https://github.com/HafizhArqa/FullStack_WEB](https://github.com/HafizhArqa/FullStack_WEB)

---

## 📌 Pemenuhan Instruksi Tugas

| No | Poin Tugas | Implementasi | Status |
|---|---|---|---|
| 1 | **Topik & Entitas Data** | Topik: Toko Merchandise & Musik Artis ONE 'O ONES. Entitas data: **Produk** (`id`, `name`, `category`, `price`, `stock`, `editionBadge`, `description`, `icon`, `themeColor`). | ✅ Selesai |
| 2 | **Install & Setup React** | Proyek React dibuat dengan Vite di subdirektori `one-o-ones-store/`, berjalan mulus di `http://localhost:5173`. Bukti screenshot tersimpan di `DokumentasiSS.md`. | ✅ Selesai |
| 3 | **Hubungkan ke GitHub** | Repository terhubung ke remote `https://github.com/HafizhArqa/FullStack_WEB.git` dengan riwayat commit bertahap (minimal 2 commit). | ✅ Selesai |
| 4 | **Minimal 5 Tampilan / Komponen Terpisah** | Dibangun 6 komponen modular di `src/components/`: `Navbar`, `StatsSummary`, `ProductForm`, `ProductList`, `ProductCard`, dan `Footer`. Menggunakan props yang terdefinisi rapi dan data realistis. | ✅ Selesai |
| 5a | **State Array di App.jsx & Render List (.map)** | State utama `products` (array) disimpan di `App.jsx`, dirender menggunakan `.map()` dengan `key={product.id}` yang unik. | ✅ Selesai |
| 5b | **Form Input (Controlled Component) + Tombol Tambah** | Komponen `ProductForm` menggunakan controlled input (nama, kategori, harga, stok, badge, deskripsi, ikon) dengan validasi dan tombol submit. | ✅ Selesai |
| 5c | **Conditional Rendering (Data Kosong)** | Ditampilkan pesan **"Belum ada data Produk Merchandise"** ketika data kosong, lengkap dengan tombol untuk menguji dan memuat ulang data sampel. | ✅ Selesai |
| 6 | **Commit Akhir** | Commit akhir dengan pesan deskriptif mencakup penambahan komponen, state, dan interaktivitas. | ✅ Selesai |

---

## 📁 Struktur Komponen Aplikasi

```text
one-o-ones-store/src/
├── components/
│   ├── Navbar.jsx          # Header toko, brand 101, badge praktikum, counter katalog
│   ├── StatsSummary.jsx    # Ringkasan analitik (Total produk, stok, rata-rata harga, kategori)
│   ├── ProductForm.jsx     # Form input controlled component dengan validasi & visual icon picker
│   ├── ProductList.jsx     # Container daftar produk, filter kategori, search bar, & conditional rendering
│   ├── ProductCard.jsx     # Kartu produk dengan visual piringan hitam (vinyl) / kaset analog berputar
│   └── Footer.jsx          # Footer informasi tugas kuliah dan hak cipta
├── data/
│   └── initialProducts.js  # Data awal realistis dari diskografi ONE 'O ONES
├── App.jsx                 # Komponen root pengelola state array & business logic
├── App.css                 # Desain tema dark glassmorphism modern dengan CSS murni
├── index.css               # Reset global, variabel CSS, dan typography Google Fonts
└── main.jsx                # Entry point aplikasi React
```

---

## 🚀 Cara Menjalankan Project

1. Buka terminal pada folder proyek:
   ```bash
   cd one-o-ones-store
   ```
2. Pastikan dependensi sudah terinstall:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Buka browser dan akses alamat:
   ```text
   http://localhost:5173
   ```

---

## 📸 Dokumentasi Screenshot
Seluruh bukti tahapan instalasi awal dan hasil pengujian fitur interaktif dapat dilihat pada berkas [DokumentasiSS.md](file:///c:/Users/hafiz/Downloads/Fullstack_WEB/DokumentasiSS.md).
