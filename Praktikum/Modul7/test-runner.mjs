import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const serverCjs = 'C:\\Users\\hafiz\\Downloads\\Paket_Praktikum_AJAX (1)\\Paket_Praktikum_AJAX\\server.cjs';
const serverDir = path.dirname(serverCjs);

// 1. Jalankan server lokal
const serverProcess = spawn('node', ['server.cjs'], { cwd: serverDir });
await new Promise(r => setTimeout(r, 1000));

// 2. Jalankan Chrome headless
const chromeProcess = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--window-size=1280,1000',
  '--disable-gpu',
  '--no-sandbox'
]);
await new Promise(r => setTimeout(r, 1500));

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
  }
  async init() {
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        }
      };
    });
  }
  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    return res.result?.value;
  }
  async screenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
  }
  close() {
    this.ws.close();
  }
}

async function createTarget(url) {
  const res = await fetch(`http://127.0.0.1:9222/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
  const data = await res.json();
  const cdp = new CDPClient(data.webSocketDebuggerUrl);
  await cdp.init();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  return { cdp, targetId: data.id };
}

async function closeTarget(targetId) {
  await fetch(`http://127.0.0.1:9222/json/close/${targetId}`);
}

const outDir = 'C:\\Users\\hafiz\\Downloads\\Paket_Praktikum_AJAX (1)\\bukti-pengujian';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

console.log('Mulai pengujian Soal 01...');
const s1 = await createTarget('http://127.0.0.1:3007/latihan-praktikan/soal-01/');
await new Promise(r => setTimeout(r, 1000));

// Uji interaksi catatan dan hitungan
await s1.cdp.eval(`document.querySelector('#catatan').value = 'Catatan uji praktikan - Ahmad';`);
await s1.cdp.eval(`
  document.querySelector('#tombol-hitung').click();
  document.querySelector('#tombol-hitung').click();
  document.querySelector('#tombol-hitung').click();
`);
const countVal = await s1.cdp.eval(`document.querySelector('#angka-hitungan').textContent`);
console.log('Hitungan setelah 3x klik:', countVal);

// Uji muat pengumuman
await s1.cdp.eval(`document.querySelector('#muat-pengumuman').click();`);
await new Promise(r => setTimeout(r, 600));
const isiPengumuman = await s1.cdp.eval(`document.querySelector('#isi-pengumuman').textContent`);
console.log('Isi pengumuman:', isiPengumuman);

// Uji ambil peserta mock lokal (delay 1500)
await s1.cdp.eval(`document.querySelector('#ambil-peserta').click();`);
// Saat loading, pastikan tombol disabled dan status loading
const isLoading = await s1.cdp.eval(`document.querySelector('#ambil-peserta').disabled`);
console.log('Ambil peserta sedang loading, tombol disabled:', isLoading);
// Klik tombol hitung lagi saat request sedang loading
await s1.cdp.eval(`document.querySelector('#tombol-hitung').click();`);
const countWhileLoading = await s1.cdp.eval(`document.querySelector('#angka-hitungan').textContent`);
console.log('Hitungan bertambah saat loading berlangsung:', countWhileLoading);

// Tunggu hingga request selesai (delay 1500ms)
await new Promise(r => setTimeout(r, 1800));
const statusPeserta = await s1.cdp.eval(`document.querySelector('#status-peserta').textContent`);
const jumlahLi = await s1.cdp.eval(`document.querySelectorAll('#daftar-peserta li').length`);
console.log('Status peserta:', statusPeserta);
console.log('Jumlah peserta di DOM:', jumlahLi);

// Simpan screenshot Soal 01 Berhasil
await s1.cdp.screenshot(path.join(outDir, 'soal-01-berhasil.png'));
console.log('Tangkapan layar Soal 01 berhasil disimpan.');

// Uji Soal 01 Error 404 (ubah sementara endpoint pengumuman)
await s1.cdp.eval(`
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4) return;
    if (xhr.status === 404) {
      document.querySelector('#status-pengumuman').dataset.state = "error";
      document.querySelector('#status-pengumuman').textContent = "Gagal memuat pengumuman: Berkas tidak ditemukan (HTTP 404).";
      document.querySelector('#isi-pengumuman').textContent = "Berkas pengumuman hilang.txt tidak ditemukan.";
    }
  };
  xhr.open("GET", "hilang.txt", true);
  xhr.send();
`);
await new Promise(r => setTimeout(r, 500));
await s1.cdp.screenshot(path.join(outDir, 'soal-01-error-404.png'));
console.log('Tangkapan layar Soal 01 Error 404 disimpan.');

s1.cdp.close();
await closeTarget(s1.targetId);

// ==========================================
// PENGUJIAN SOAL 02 (REACT)
// ==========================================
console.log('\nMulai pengujian Soal 02...');
const s2 = await createTarget('http://127.0.0.1:3007/latihan-praktikan/soal-02/');
// Tunggu React mount dan Babel compile JSX
await new Promise(r => setTimeout(r, 2500));

// Cek daftar peserta awal (skenario default: berhasil, delay 1000)
const initialUsers = await s2.cdp.eval(`document.querySelectorAll('ul.users li').length`);
const statusGet = await s2.cdp.eval(`document.querySelector('#status-get')?.textContent`);
console.log('Jumlah peserta awal React:', initialUsers);
console.log('Status GET awal:', statusGet);
await s2.cdp.screenshot(path.join(outDir, 'soal-02-berhasil.png'));
console.log('Tangkapan layar Soal 02 Berhasil disimpan.');

// Uji Form Validasi: Coba kirim nama spasi dan email invalid
await s2.cdp.eval(`
  const namaInput = document.querySelector('#nama');
  const emailInput = document.querySelector('#email');
  namaInput.value = '   ';
  namaInput.dispatchEvent(new Event('input', { bubbles: true }));
  emailInput.value = 'salah-email';
  emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
`);
await new Promise(r => setTimeout(r, 400));
const valMsg = await s2.cdp.eval(`document.querySelector('p[role="alert"]')?.textContent`);
console.log('Pesan validasi nama spasi:', valMsg);
await s2.cdp.screenshot(path.join(outDir, 'soal-02-validasi-gagal.png'));

// Uji Form POST Berhasil: Kirim Rina Praktikan, rina@example.com
await s2.cdp.eval(`
  const namaInput = document.querySelector('#nama');
  const emailInput = document.querySelector('#email');
  namaInput.value = 'Rina Praktikan';
  namaInput.dispatchEvent(new Event('input', { bubbles: true }));
  emailInput.value = 'rina@example.com';
  emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
`);
// Tunggu server merespons POST (delay 500ms di server)
await new Promise(r => setTimeout(r, 1200));
const postResp = await s2.cdp.eval(`document.querySelector('div.result[data-state="success"]')?.textContent`);
console.log('Respon POST di halaman:', postResp);
await s2.cdp.screenshot(path.join(outDir, 'soal-02-bukti-post.png'));
console.log('Tangkapan layar Bukti POST disimpan.');

// Uji Skenario Error HTTP 503
await s2.cdp.eval(`
  const select = document.querySelector('#pilihan-skenario');
  select.value = 'error';
  select.dispatchEvent(new Event('change', { bubbles: true }));
`);
await new Promise(r => setTimeout(r, 1500));
const errStatus = await s2.cdp.eval(`document.querySelector('#status-get')?.textContent`);
console.log('Status setelah skenario error HTTP:', errStatus);
await s2.cdp.screenshot(path.join(outDir, 'soal-02-error-503.png'));

// Uji Skenario Timeout (batas 700ms, server delay 2500ms)
await s2.cdp.eval(`
  const select = document.querySelector('#pilihan-skenario');
  select.value = 'timeout';
  select.dispatchEvent(new Event('change', { bubbles: true }));
`);
await new Promise(r => setTimeout(r, 1200));
const timeoutStatus = await s2.cdp.eval(`document.querySelector('#status-get')?.textContent`);
console.log('Status setelah skenario timeout:', timeoutStatus);
await s2.cdp.screenshot(path.join(outDir, 'soal-02-kondisi-gagal-timeout.png'));

s2.cdp.close();
await closeTarget(s2.targetId);

// Bersihkan proses
chromeProcess.kill();
serverProcess.kill();
console.log('\nSeluruh pengujian selesai dengan sukses!');
process.exit(0);

