import React from 'react';
import { useNavigate } from 'react-router-dom';
import wowLogo from '../assets/wow-logo.svg';

export default function Bienvenue() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Side */}
      <div style={{ background: '#6C3BFF', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <img src={wowLogo} alt="WOW Logo" style={{ width: 200, marginBottom: 40 }} />
        <h2 style={{ color: 'black', fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>A VOUS DE RACONTER LE</h2>
        <h1 style={{ color: '#FFF700', fontWeight: 900, textShadow: '2px 2px 0 #000', fontSize: 48, marginBottom: 0 }}>
          “ WOW ” !!
        </h1>
      </div>
      {/* Right Side */}
      <div style={{ background: '#111', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <button className="btn btn-primary" style={{ background: '#6C3BFF', border: 'none', borderRadius: 24, padding: '12px 32px', fontSize: 18 }} onClick={() => navigate('/login')}>
            Se connecter
          </button>
          <button className="btn btn-primary" style={{ background: '#6C3BFF', border: 'none', borderRadius: 24, padding: '12px 32px', fontSize: 18 }} onClick={() => navigate('/register')}>
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
}
