// Soal 02: Aplikasi Registrasi Peserta React
// Mengimplementasikan Axios GET & POST, useState, useEffect, cleanup AbortController, dan validasi form.

const { useState, useEffect } = React;

const SKENARIO = {
  berhasil: {
    label: "Berhasil",
    url: "/api/users?delay=1000",
    timeout: 5000
  },
  empty: {
    label: "Data kosong",
    url: "/api/users?mode=empty&delay=1000",
    timeout: 5000
  },
  error: {
    label: "Error HTTP",
    url: "/api/users?mode=error&delay=1000",
    timeout: 5000
  },
  timeout: {
    label: "Timeout",
    url: "/api/users?delay=2500",
    timeout: 700
  }
};

function AplikasiRegistrasi() {
  // State untuk GET dan skenario
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scenario, setScenario] = useState("berhasil");
  const [percobaan, setPercobaan] = useState(0);

  // State untuk formulir POST
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [postResult, setPostResult] = useState(null);
  const [postError, setPostError] = useState("");

  // ==========================================
  // 1. GET Peserta dengan useEffect & Axios
  // ==========================================
  useEffect(() => {
    const controller = new AbortController();
    let aktif = true;

    async function ambilData() {
      setLoading(true);
      setError("");
      setUsers([]);

      const config = SKENARIO[scenario];

      try {
        const response = await axios.get(config.url, {
          timeout: config.timeout,
          signal: controller.signal
        });

        // Pastikan hanya request aktif yang memperbarui state
        if (aktif) {
          setUsers(response.data);
        }
      } catch (err) {
        if (!aktif) return;

        // Abaikan jika request dibatalkan oleh pengguna/cleanup
        if (axios.isCancel(err) || err.name === "CanceledError") {
          return;
        }

        // Tangani kegagalan sesuai jenis error
        if (err.code === "ECONNABORTED" || (err.message && err.message.toLowerCase().includes("timeout"))) {
          setError(`Timeout: Batas waktu tunggu (${config.timeout} ms) terlampaui sebelum server merespons.`);
        } else if (err.response) {
          setError(`Gagal: Server merespons HTTP ${err.response.status} (${err.response.data?.message || "Kesalahan server"}).`);
        } else {
          setError(`Gagal memuat: ${err.message}`);
        }
      } finally {
        if (aktif) {
          setLoading(false);
        }
      }
    }

    ambilData();

    // Cleanup: batalkan request jika skenario berubah sebelum response tiba
    return () => {
      aktif = false;
      controller.abort();
    };
  }, [scenario, percobaan]);

  // ==========================================
  // 2. Handler Pengiriman Formulir (POST)
  // ==========================================
  async function handleKirimPendaftaran(event) {
    event.preventDefault(); // Cegah reload halaman

    setFormError("");
    setPostError("");
    setPostResult(null);

    const namaBersih = nama.trim();
    const emailBersih = email.trim();

    // Validasi 1: Tolak nama kosong atau hanya spasi
    if (!namaBersih) {
      setFormError("Nama peserta wajib diisi dan tidak boleh hanya berupa spasi.");
      return;
    }

    // Validasi 2: Format email valid
    const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!polaEmail.test(emailBersih)) {
      setFormError("Format email tidak valid. Masukkan format yang benar, contoh: rina@example.com");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post("/api/users", {
        name: namaBersih,
        email: emailBersih
      }, {
        timeout: 5000,
        headers: { "Content-Type": "application/json" }
      });

      // Tampilkan status HTTP, id, nama, email, simulated, dan pesan konfirmasi
      setPostResult({
        status: response.status,
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        simulated: response.data.simulated,
        message: "Simulasi berhasil, data tidak disimpan."
      });
    } catch (err) {
      if (err.response) {
        setPostError(`Gagal mengirim (HTTP ${err.response.status}): ${err.response.data?.message || "Terjadi kesalahan server"}.`);
      } else {
        setPostError(`Gagal mengirim: ${err.message}`);
      }
    } finally {
      // Pulihkan status kontrol setelah proses pengiriman selesai
      setSubmitting(false);
    }
  }

  return (
    <section className="practice" aria-busy={loading || submitting}>
      <h2>1. Daftar Peserta Praktikum (GET Axios)</h2>

      <label htmlFor="pilihan-skenario">Pilih skenario response</label>
      <select
        id="pilihan-skenario"
        value={scenario}
        onChange={e => setScenario(e.target.value)}
      >
        <option value="berhasil">Berhasil (/api/users?delay=1000 - Timeout 5000ms)</option>
        <option value="empty">Data kosong (/api/users?mode=empty&delay=1000 - Timeout 5000ms)</option>
        <option value="error">Error HTTP (/api/users?mode=error&delay=1000 - Timeout 5000ms)</option>
        <option value="timeout">Timeout (/api/users?delay=2500 - Timeout 700ms)</option>
      </select>

      <div className="actions" style={{ marginBottom: "16px" }}>
        <button
          type="button"
          disabled={loading}
          onClick={() => setPercobaan(n => n + 1)}
        >
          Muat ulang
        </button>
      </div>

      <p
        id="status-get"
        className="result"
        role="status"
        data-state={error ? "error" : (loading ? "loading" : "success")}
      >
        {loading
          ? "Memuat daftar peserta..."
          : error
          ? error
          : users.length
          ? `Berhasil memuat ${users.length} pengguna.`
          : "Data kosong (tidak ada peserta)."}
      </p>

      {!loading && !error && users.length > 0 && (
        <ul className="users">
          {users.map(user => (
            <li key={user.id}>
              <strong>{user.name}</strong> &mdash; <span>{user.email}</span> (ID: {user.id})
            </li>
          ))}
        </ul>
      )}

      <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "24px 0" }} />

      <h2>2. Formulir Registrasi Peserta (POST Axios)</h2>
      <form onSubmit={handleKirimPendaftaran} noValidate>
        <label htmlFor="nama">Nama Peserta</label>
        <input
          type="text"
          id="nama"
          value={nama}
          onChange={e => setNama(e.target.value)}
          placeholder="Contoh: Rina Praktikan"
          disabled={submitting}
        />

        <label htmlFor="email">Email Peserta</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Contoh: rina@example.com"
          disabled={submitting}
        />

        {formError && (
          <p className="result" data-state="error" role="alert" style={{ marginTop: "0", marginBottom: "16px" }}>
            {formError}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Mengirim pendaftaran..." : "Kirim pendaftaran"}
        </button>
      </form>

      {/* Bagian respon POST terpisah dari daftar GET */}
      {postResult && (
        <div className="result" data-state="success" style={{ marginTop: "20px" }}>
          <strong>Hasil Response POST:</strong>
          <p style={{ margin: "6px 0" }}>Status HTTP: <strong>{postResult.status} Created</strong></p>
          <p style={{ margin: "6px 0" }}>Pesan Server: <em>{postResult.message}</em></p>
          <div style={{ marginTop: "10px" }}>
            <div><strong>ID Dihasilkan:</strong> {postResult.id}</div>
            <div><strong>Nama Terkirim:</strong> {postResult.name}</div>
            <div><strong>Email Terkirim:</strong> {postResult.email}</div>
            <div><strong>Simulated:</strong> {postResult.simulated ? "true (Data tidak disimpan ke server)" : "false"}</div>
          </div>
        </div>
      )}

      {postError && (
        <p className="result" data-state="error" role="alert" style={{ marginTop: "20px" }}>
          {postError}
        </p>
      )}
    </section>
  );
}

ReactDOM.createRoot(document.querySelector("#root")).render(<AplikasiRegistrasi />);

