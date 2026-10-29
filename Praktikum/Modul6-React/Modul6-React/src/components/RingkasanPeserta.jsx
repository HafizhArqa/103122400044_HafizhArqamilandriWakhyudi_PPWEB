import React from 'react';

function RingkasanPeserta({ totalPeserta, totalHadir, totalBelumHadir, totalHasil }) {
  const cardStyle = {
    flex: 1,
    padding: '16px',
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    textAlign: 'center'
  };

  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <div style={cardStyle}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#6b7280' }}>Total Peserta</p>
        <h2 style={{ margin: 0, color: '#111827' }}>{totalPeserta}</h2>
      </div>
      <div style={cardStyle}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#6b7280' }}>Hadir</p>
        <h2 style={{ margin: 0, color: '#059669' }}>{totalHadir}</h2>
      </div>
      <div style={cardStyle}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#6b7280' }}>Belum Hadir</p>
        <h2 style={{ margin: 0, color: '#d97706' }}>{totalBelumHadir}</h2>
      </div>
      <div style={cardStyle}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#6b7280' }}>Hasil Ditampilkan</p>
        <h2 style={{ margin: 0, color: '#2563eb' }}>{totalHasil}</h2>
      </div>
    </div>
  );
}

export default RingkasanPeserta;