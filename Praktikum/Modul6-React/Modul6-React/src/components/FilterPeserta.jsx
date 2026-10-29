import React from 'react';

function FilterPeserta({ kataKunci, setKataKunci, filterKelas, setFilterKelas }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="Cari berdasarkan nama atau NIM..."
        value={kataKunci}
        onChange={(e) => setKataKunci(e.target.value)}
        style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', flex: '2 1 300px' }}
      />
      <select
        value={filterKelas}
        onChange={(e) => setFilterKelas(e.target.value)}
        style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', flex: '1 1 150px' }}
      >
        <option value="Semua kelas">Semua kelas</option>
        <option value="TI-2A">TI-2A</option>
        <option value="TI-2B">TI-2B</option>
      </select>
    </div>
  );
}

export default FilterPeserta;