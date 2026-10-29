import React from 'react';

function FormPeserta({ formData, setFormData, pesanError, isEditing, onSubmit, onBatal }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputStyle = {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    flex: '1 1 200px'
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
      <h3 style={{ marginTop: 0 }}>{isEditing ? 'Ubah Peserta' : 'Tambah Peserta'}</h3>

      {pesanError && (
        <div style={{ padding: '10px', backgroundColor: '#fef2f2', color: '#b91c1c', borderLeft: '4px solid #ef4444', marginBottom: '16px' }}>
          {pesanError}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <input
            type="text"
            name="nama"
            placeholder="Nama Mahasiswa"
            value={formData.nama}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="nim"
            placeholder="NIM (8 digit)"
            value={formData.nim}
            onChange={handleChange}
            style={inputStyle}
          />
          <select name="kelas" value={formData.kelas} onChange={handleChange} style={inputStyle}>
            <option value="Pilih kelas">Pilih kelas</option>
            <option value="TI-2A">TI-2A</option>
            <option value="TI-2B">TI-2B</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ padding: '10px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            {isEditing ? 'Simpan perubahan' : 'Tambah peserta'}
          </button>
          
          {isEditing && (
            <button type="button" onClick={onBatal} style={{ padding: '10px 16px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FormPeserta;