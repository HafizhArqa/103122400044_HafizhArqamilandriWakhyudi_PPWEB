import React, { useState } from 'react';
import RingkasanPeserta from './components/RingkasanPeserta';
import FormPeserta from './components/FormPeserta';
import FilterPeserta from './components/FilterPeserta';
import DaftarPeserta from './components/DaftarPeserta';


const DATA_AWAL = [
  { id: 'm-1', nama: 'Ani', nim: '10121001', kelas: 'TI-2A', hadir: true },
  { id: 'm-2', nama: 'Budi', nim: '10121002', kelas: 'TI-2B', hadir: false },
  { id: 'm-3', nama: 'Citra', nim: '10121003', kelas: 'TI-2A', hadir: false }
];

function App() {
  const [pesertaList, setPesertaList] = useState(DATA_AWAL);
  const [formData, setFormData] = useState({ nama: '', nim: '', kelas: 'Pilih kelas' });
  const [editingId, setEditingId] = useState(null);
  const [pesanError, setPesanError] = useState('');
  
  const [kataKunci, setKataKunci] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua kelas');

  const resetForm = () => {
    setFormData({ nama: '', nim: '', kelas: 'Pilih kelas' });
    setEditingId(null);
    setPesanError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const namaTrim = formData.nama.trim();
    const nimTrim = formData.nim.trim();
    const kelasSelect = formData.kelas;

    if (namaTrim.length < 3) {
      setPesanError('Nama wajib diisi dan memiliki sedikitnya 3 karakter.');
      return;
    }

    if (!/^\d{8}$/.test(nimTrim)) {
      setPesanError('NIM wajib terdiri atas tepat 8 digit angka.');
      return;
    }

    if (kelasSelect === 'Pilih kelas') {
      setPesanError('Pilih kelas yang valid.');
      return;
    }

    const isNimDuplikat = pesertaList.some(p => p.nim === nimTrim && p.id !== editingId);
    if (isNimDuplikat) {
      setPesanError('NIM sudah digunakan oleh peserta lain.');
      return;
    }

    if (editingId) {
      setPesertaList(prev =>
        prev.map(p => (p.id === editingId ? { ...p, nama: namaTrim, nim: nimTrim, kelas: kelasSelect } : p))
      );
    } else {
      setPesertaList(prev => [
        ...prev,
        { id: `m-${Date.now()}`, nama: namaTrim, nim: nimTrim, kelas: kelasSelect, hadir: false }
      ]);
    }
    resetForm();
  };

  const handleEdit = (peserta) => {
    setEditingId(peserta.id);
    setFormData({ nama: peserta.nama, nim: peserta.nim, kelas: peserta.kelas });
    setPesanError('');
  };

  const handleDelete = (id) => {
    setPesertaList(prev => prev.filter(p => p.id !== id));
    if (editingId === id) resetForm();
  };

  const handleToggleHadir = (id) => {
    setPesertaList(prev =>
      prev.map(p => (p.id === id ? { ...p, hadir: !p.hadir } : p))
    );
  };

  const query = kataKunci.trim().toLowerCase();
  
  const filteredPeserta = pesertaList.filter(p => {
    const matchKataKunci = query === '' || p.nama.toLowerCase().includes(query) || p.nim.toLowerCase().includes(query);
    const matchKelas = filterKelas === 'Semua kelas' || p.kelas === filterKelas;
    return matchKataKunci && matchKelas;
  });

  const totalPeserta = pesertaList.length;
  const totalHadir = pesertaList.filter(p => p.hadir).length;
  
  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Manajemen Peserta Praktikum</h1>

      <RingkasanPeserta
        totalPeserta={totalPeserta}
        totalHadir={totalHadir}
        totalBelumHadir={totalPeserta - totalHadir} 
        totalHasil={filteredPeserta.length}
      />

      <FormPeserta
        formData={formData}
        setFormData={setFormData}
        pesanError={pesanError}
        isEditing={Boolean(editingId)}
        onSubmit={handleSubmit}
        onBatal={resetForm}
      />

      <FilterPeserta
        kataKunci={kataKunci}
        setKataKunci={setKataKunci}
        filterKelas={filterKelas}
        setFilterKelas={setFilterKelas}
      />

      <DaftarPeserta
        daftarPeserta={filteredPeserta}
        totalSemuaPeserta={totalPeserta}
        onToggleHadir={handleToggleHadir}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;