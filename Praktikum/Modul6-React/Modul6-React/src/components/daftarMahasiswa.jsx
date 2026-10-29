import React from 'react'
import CardMahasiswa from './CardMahasiswa';

function daftarMahasiswa() {

    const mahasiswa = [
        {id : 1, nama : "Text", nim : "103122400044"},
        {id : 2, nama : "Text2", nim : "103122400045"},
        {id : 3, nama : "Text3", nim : "103122400046"},
    ];

  return (
    <div>{mahasiswa.map((mhs) => (
      <CardMahasiswa key={mhs.id} nama={mhs.nama} nim={mhs.nim} />
    ))}</div>
  )
}

export default daftarMahasiswa