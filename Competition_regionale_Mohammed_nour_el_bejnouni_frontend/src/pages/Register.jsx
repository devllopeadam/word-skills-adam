import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wowLogo from '../assets/wow-logo.svg';
import api from '../config';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user'
      });

      const { access_token, token_type } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('token_type', token_type);
      
      // Redirect to home page
      navigate('/home');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          submit: error.response?.data?.message || "Une erreur s'est produite lors de l'inscription"
        });
      }
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
        <img src={wowLogo} alt="WOW Logo" style={{ width: 110, marginBottom: 24 }} />
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label" style={{ color: '#fff', fontWeight: 400 }}>Nom complet</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Adam Jeniah"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: `2px solid ${errors.name ? '#ff4444' : formData.name ? '#6C3BFF' : '#222'}`,
                  borderRadius: 16,
                  paddingRight: 40,
                  height: 48,
                  fontSize: 16
                }} 
              />
              {formData.name && !errors.name && (
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
              )}
            </div>
            {errors.name && <small style={{ color: '#ff4444' }}>{errors.name}</small>}
          </div>
          <div className="mb-3 text-start">
            <label className="form-label" style={{ color: '#fff', fontWeight: 400 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="form-control" 
                placeholder="adam@gmail.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: `2px solid ${errors.email ? '#ff4444' : formData.email ? '#6C3BFF' : '#222'}`,
                  borderRadius: 16,
                  height: 48,
                  fontSize: 16
                }} 
              />
              {formData.email && !errors.email && (
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
              )}
            </div>
            {errors.email && <small style={{ color: '#ff4444' }}>{errors.email}</small>}
          </div>
          <div className="mb-3 text-start">
            <label className="form-label" style={{ color: '#fff', fontWeight: 400 }}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: `2px solid ${errors.password ? '#ff4444' : formData.password ? '#FFF700' : '#222'}`,
                  borderRadius: 16,
                  paddingRight: 40,
                  height: 48,
                  fontSize: 18
                }} 
              />
            </div>
            {errors.password && <small style={{ color: '#ff4444' }}>{errors.password}</small>}
          </div>
          <div className="mb-3 text-start">
            <label className="form-label" style={{ color: '#fff', fontWeight: 400 }}>Confirmer le mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: `2px solid ${errors.confirmPassword ? '#ff4444' : formData.confirmPassword ? '#FFF700' : '#222'}`,
                  borderRadius: 16,
                  paddingRight: 40,
                  height: 48,
                  fontSize: 18
                }} 
              />
              <span style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#FFF700',
                fontSize: 22,
                cursor: 'pointer'
              }}>
                <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 11C2.73 6.61 6.61 3.5 11 3.5c4.39 0 8.27 3.11 10 7.5-1.73 4.39-5.61 7.5-10 7.5-4.39 0-8.27-3.11-10-7.5Z" stroke="#FFF700" strokeWidth="2"/><circle cx="11" cy="11" r="3" stroke="#FFF700" strokeWidth="2"/></svg>
              </span>
            </div>
            {errors.confirmPassword && <small style={{ color: '#ff4444' }}>{errors.confirmPassword}</small>}
          </div>
          <div className="mb-3" style={{ textAlign: 'center', fontSize: 15 }}>
            <span style={{ color: '#fff' }}>Vous avez déjà un compte ? </span>
            <a href="#" style={{ color: '#3B5BFF', textDecoration: 'underline' }} onClick={e => { e.preventDefault(); navigate('/login'); }}>Connexion</a>
          </div>
          <button 
            type="submit" 
            className="btn w-100" 
            style={{ 
              background: '#FFF700', 
              color: '#111', 
              fontWeight: 700, 
              borderRadius: 24, 
              fontSize: 20, 
              height: 48,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
