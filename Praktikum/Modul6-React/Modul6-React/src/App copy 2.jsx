import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import CardMahasiswa from './components/CardMahasiswa';
import Counter from './components/Counter';
import daftarMahasiswa from './components/daftarMahasiswa'

function App() {

  return (
    <>
    <CardMahasiswa nama="test" nim="103122400044"/>
    <br />
    <Counter/>
    <daftarMahasiswa/>
    </>

    
  );
}

export default App
