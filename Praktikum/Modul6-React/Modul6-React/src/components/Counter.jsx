import React from 'react';
import { useState } from 'react'

function Counter() {
  const [jumlah, setJumlah] = useState(0);

    return (
    <div>
     <p>Jumlah di klik: {jumlah}</p>
     <button onClick={() => setJumlah(jumlah + 1 )}>Tambah</button>
    </div>
  );
}

export default Counter