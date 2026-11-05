// Soal 01: Portal Informasi Praktikum
// Menggabungkan XHR, Fetch, event handling, serta pembuktian sifat asynchronous tanpa reload.

// ==========================================
// 1. Catatan, Hitungan, dan Waktu Buka Awal
// ==========================================
const inputCatatan = document.querySelector("#catatan");
const tombolHitung = document.querySelector("#tombol-hitung");
const teksAngka = document.querySelector("#angka-hitungan");
const teksWaktuBuka = document.querySelector("#waktu-buka");

let hitungan = 0;

// Catat waktu pertama kali halaman dibuka oleh browser
const waktuSekarang = new Date().toLocaleTimeString("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});
teksWaktuBuka.textContent = waktuSekarang;

// Event klik penambah hitungan (tetap dapat diklik saat request AJAX berlangsung)
tombolHitung.addEventListener("click", () => {
  hitungan += 1;
  teksAngka.textContent = hitungan;
});

// ==========================================
// 2. Bagian Pengumuman (XMLHttpRequest)
// ==========================================
const tombolPengumuman = document.querySelector("#muat-pengumuman");
const statusPengumuman = document.querySelector("#status-pengumuman");
const isiPengumuman = document.querySelector("#isi-pengumuman");

tombolPengumuman.addEventListener("click", () => {
  // Nonaktifkan tombol yang sedang berjalan dan tampilkan status loading
  tombolPengumuman.disabled = true;
  statusPengumuman.dataset.state = "loading";
  statusPengumuman.textContent = "Memuat pengumuman via XMLHttpRequest...";

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    // 1. Periksa readyState (4 = DONE / operasi selesai)
    if (xhr.readyState !== 4) return;

    // 2. Periksa status kode HTTP
    if (xhr.status >= 200 && xhr.status < 300) {
      statusPengumuman.dataset.state = "success";
      statusPengumuman.textContent = `Pengumuman berhasil dimuat (HTTP ${xhr.status}).`;
      isiPengumuman.textContent = xhr.responseText;
    } else if (xhr.status === 404) {
      statusPengumuman.dataset.state = "error";
      statusPengumuman.textContent = "Gagal memuat pengumuman: Berkas tidak ditemukan (HTTP 404).";
      isiPengumuman.textContent = "Berkas pengumuman tidak ditemukan.";
    } else if (xhr.status !== 0) {
      statusPengumuman.dataset.state = "error";
      statusPengumuman.textContent = `Gagal memuat pengumuman: HTTP ${xhr.status}`;
      isiPengumuman.textContent = `Terjadi kesalahan respons server (HTTP ${xhr.status}).`;
    }
  };

  xhr.onerror = () => {
    statusPengumuman.dataset.state = "error";
    statusPengumuman.textContent = "Gagal memuat pengumuman: Terjadi gangguan jaringan atau koneksi terputus.";
    isiPengumuman.textContent = "Tidak dapat terhubung ke server.";
  };

  xhr.ontimeout = () => {
    statusPengumuman.dataset.state = "error";
    statusPengumuman.textContent = "Gagal memuat pengumuman: Batas waktu tunggu habis (timeout).";
    isiPengumuman.textContent = "Waktu tunggu habis.";
  };

  xhr.onloadend = () => {
    // Aktifkan kembali tombol request setelah proses selesai
    tombolPengumuman.disabled = false;
  };

  // Buka koneksi asinkron (true) ke pengumuman.txt
  xhr.open("GET", "pengumuman.txt", true);
  xhr.timeout = 5000;
  xhr.send();
});

// ==========================================
// 3. Bagian Direktori Peserta (Fetch API)
// ==========================================
const tombolPeserta = document.querySelector("#ambil-peserta");
const pilihanSumber = document.querySelector("#pilihan-sumber");
const statusPeserta = document.querySelector("#status-peserta");
const daftarPeserta = document.querySelector("#daftar-peserta");

tombolPeserta.addEventListener("click", async () => {
  const sumber = pilihanSumber.value;
  const isLokal = sumber === "lokal";
  const namaSumber = isLokal ? "Mock lokal" : "JSONPlaceholder";
  const url = isLokal ? "/api/users?delay=1500" : "https://jsonplaceholder.typicode.com/users";

  // Nonaktifkan tombol saat request berlangsung; tombol Tambah hitungan tetap aktif
  tombolPeserta.disabled = true;
  statusPeserta.dataset.state = "loading";
  statusPeserta.textContent = `Memuat data peserta dari ${namaSumber}...`;
  daftarPeserta.replaceChildren();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, { signal: controller.signal });

    // Periksa response.ok sebelum membaca JSON
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const users = await response.json();

    // Batasi maksimal 3 pengguna pertama
    const dataDitampilkan = users.slice(0, 3);

    for (const user of dataDitampilkan) {
      const item = document.createElement("li");
      item.textContent = `${user.name} - ${user.email}`;
      daftarPeserta.append(item);
    }

    statusPeserta.dataset.state = "success";
    statusPeserta.textContent = `Sumber: ${namaSumber} | Menampilkan ${dataDitampilkan.length} data peserta dari total ${users.length} pengguna.`;
  } catch (error) {
    statusPeserta.dataset.state = "error";
    if (error.name === "AbortError") {
      statusPeserta.textContent = `Gagal: Waktu tunggu habis saat menghubungi ${namaSumber}.`;
    } else if (!isLokal) {
      statusPeserta.textContent = `Gagal memuat dari API eksternal (${error.message}). Periksa koneksi internet Anda atau pilih sumber Mock lokal secara manual.`;
    } else {
      statusPeserta.textContent = `Gagal memuat dari mock lokal (${error.message}). Pastikan server lokal masih berjalan.`;
    }
  } finally {
    clearTimeout(timer);
    tombolPeserta.disabled = false;
  }
});

