import React from 'react';
import ItemPeserta from './ItemPeserta';

function DaftarPeserta({ daftarPeserta, totalSemuaPeserta, onToggleHadir, onEdit, onDelete }) {
  const emptyStyle = { textAlign: 'center', padding: '40px 20px', color: '#6b7280' };

  if (totalSemuaPeserta === 0) {
    return <div style={emptyStyle}>Belum ada peserta.</div>;
  }

  if (daftarPeserta.length === 0) {
    return <div style={emptyStyle}>Peserta tidak ditemukan.</div>;
  }

  return (
    <div>
      {daftarPeserta.map((peserta) => (
        <ItemPeserta
          key={peserta.id}
          peserta={peserta}
          onToggleHadir={onToggleHadir}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default DaftarPeserta;