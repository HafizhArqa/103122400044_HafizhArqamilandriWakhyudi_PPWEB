import React from 'react';

function ItemPeserta({ peserta, onToggleHadir, onEdit, onDelete }) {
  return (
    <div 
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px', marginBottom: '12px', borderRadius: '8px',
        backgroundColor: peserta.hadir ? '#ecfdf5' : '#fff',
        border: `1px solid ${peserta.hadir ? '#a7f3d0' : '#e5e7eb'}`,
        flexWrap: 'wrap', gap: '12px'
      }}
    >
      <div>
        <h4 style={{ margin: '0 0 6px', fontSize: '16px' }}>{peserta.nama}</h4>
        <p style={{ margin: '0 0 6px', fontSize: '14px', color: '#4b5563' }}>
          NIM: {peserta.nim} | Kelas: {peserta.kelas}
        </p>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: peserta.hadir ? '#065f46' : '#92400e' }}>
          Status: {peserta.hadir ? 'Hadir' : 'Belum hadir'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => onToggleHadir(peserta.id)} style={{ padding: '6px 12px', cursor: 'pointer' }}>
          {peserta.hadir ? 'Batalkan hadir' : 'Tandai hadir'}
        </button>
        <button onClick={() => onEdit(peserta)} style={{ padding: '6px 12px', cursor: 'pointer' }}>
          Edit
        </button>
        <button onClick={() => onDelete(peserta.id)} style={{ padding: '6px 12px', backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', cursor: 'pointer' }}>
          Hapus
        </button>
      </div>
    </div>
  );
}

export default ItemPeserta;