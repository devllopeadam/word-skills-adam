import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wowLogo from '../assets/wow-logo.svg';
import api from '../config';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', formData);
      const { access_token, token_type } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('token_type', token_type);
      
      // Redirect to home page
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
        minHeight: '100vh', 
        width: '100vw', 
        background: '#111', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: window.innerWidth <= 768 ? '16px' : '0'
      }}>
      <div style={{ 
        background: '#181818', 
        borderRadius: 24, 
        padding: window.innerWidth <= 768 ? '32px 20px' : '40px 32px', 
        width: '100%', 
        maxWidth: 430, 
        boxShadow: '0 0 24px #0008', 
        color: '#fff', 
        textAlign: 'center' 
      }}>
        <img src={wowLogo} alt="WOW Logo" style={{ width: 180, marginBottom: 24 }} />
        {error && (
          <div style={{ background: '#ff00001a', color: '#ff6b6b', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-start">
            <label className="form-label" style={{ color: '#fff', fontWeight: 400 }}>Ton adresse email utilisée lors de l'inscription</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control" 
                placeholder="SoniaSalou@gmail.com" 
                required
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '2px solid #6C3BFF',
                  borderRadius: 16,
                  paddingRight: 40,
                  height: 48,
                  fontSize: 16
                }} 
              />
              <span style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6C3BFF',
                fontSize: 22
              }}>
                ✓
              </span>
            </div>
          </div>
          <div className="mb-2 text-start">
            <label className="form-label" style={{ color: '#fff', fontWeight: 400 }}>Ton mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control" 
                placeholder="••••••••" 
                required
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '2px solid #FFF700',
                  borderRadius: 16,
                  paddingRight: 40,
                  height: 48,
                  fontSize: 18
                }} 
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#FFF700',
                  fontSize: 22,
                  cursor: 'pointer'
                }}
              >
                <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 11C2.73 6.61 6.61 3.5 11 3.5c4.39 0 8.27 3.11 10 7.5-1.73 4.39-5.61 7.5-10 7.5-4.39 0-8.27-3.11-10-7.5Z" stroke="#FFF700" strokeWidth="2"/>
                  <circle cx="11" cy="11" r="3" stroke="#FFF700" strokeWidth="2"/>
                </svg>
              </span>
            </div>
          </div>
          <div className="text-end mb-3">
            <a href="#" style={{ color: '#FFF700', fontSize: 14, textDecoration: 'none' }}>Tu as oublié ton mot de passe ?</a>
          </div>
          <div className="mb-3" style={{ textAlign: 'center', fontSize: 15 }}>
            <span style={{ color: '#fff' }}>Tu n'as pas de compte ? </span>
            <a href="#" style={{ color: '#FFF700', textDecoration: 'underline' }} onClick={e => { e.preventDefault(); navigate('/register'); }}>S'inscrire.</a>
          </div>
          <button 
            type="submit" 
            className="btn w-100" 
            disabled={loading}
            style={{ 
              background: '#FFF700', 
              color: '#111', 
              fontWeight: 700, 
              borderRadius: 24, 
              fontSize: 20, 
              height: 48,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
