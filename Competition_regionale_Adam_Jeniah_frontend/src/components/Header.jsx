import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wowLogo from '../assets/wow-logo.svg';
import api from "../api";

export default function Header({ selectedFilter, onFilterChange, onAnecdoteAdded }) {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [anecdoteForm, setAnecdoteForm] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const categories = ['histoire', 'humour', 'vie quotidienne', 'echec', 'succes'];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/anecdotes', anecdoteForm, {
        headers: {
          'Authorization': `${tokenType} ${token}`
        }
      });

      // Reset form and close dialog
      setAnecdoteForm({ title: '', content: '', category: '' });
      setShowDialog(false);
      
      // Trigger refetch of anecdotes in Dashboard
      if (onAnecdoteAdded) {
        onAnecdoteAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la publication');
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        navigate('/login');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnecdoteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <header
        style={{
          background: "#181818",
          borderBottom: "1px solid #333",
          padding: "12px 16px",
          position: "relative"
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: window.innerWidth <= 768 ? "column" : "row",
            gap: window.innerWidth <= 768 ? "16px" : "0",
            justifyContent: "space-between",
            alignItems: window.innerWidth <= 768 ? "stretch" : "center",
          }}
        >
          {/* Logo Section */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: window.innerWidth <= 768 ? "center" : "flex-start", 
            gap: "8px" 
          }}>
            <img src={wowLogo} alt="WOW Logo" style={{ 
              height: window.innerWidth <= 768 ? "40px" : "50px",
              filter: "drop-shadow(0px 0px 8px rgba(255, 247, 0, 0.3))"
            }} />
            {selectedFilter && (
              <div style={{
                background: "#00FFE7",
                color: "#111",
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "15px",
                fontWeight: "600",
                transform: window.innerWidth <= 768 ? 
                  "translateY(-10px)" : 
                  "translateY(-20px) rotate(-20deg)"
              }}>
                {selectedFilter === 'max-wow' ? 'Max de WOW !' :
                 selectedFilter === 'wow-or' ? 'Les WOW d\'or' :
                 'Les plus technique'}
              </div>
            )}
          </div>
          
          {/* Center Section - Filter Pills */}
          <div style={{ 
            display: "flex", 
            gap: "2px",
            background: window.innerWidth <= 768 ? "transparent" : "#222",
            padding: window.innerWidth <= 768 ? "0" : "4px",
            borderRadius: "50px",
            flexWrap: window.innerWidth <= 768 ? "wrap" : "nowrap",
            justifyContent: window.innerWidth <= 768 ? "center" : "flex-start",
            margin: "0 auto"
          }}>
            {[
              { id: 'max-wow', label: 'Max de WOW' },
              { id: 'wow-or', label: "Les WOW d'or" },
              { id: 'technique', label: 'Les plus technique' }
            ].map(filter => (
              <button
                key={filter.id}
                style={{
                  background: selectedFilter === filter.id ? "#FFF700" : "transparent",
                  color: selectedFilter === filter.id ? "#111" : "#FFF700",
                  border: selectedFilter === filter.id ? "none" : "1px solid #FFF700",
                  padding: "10px 24px",
                  borderRadius: "50px",
                  fontSize: window.innerWidth <= 768 ? "13px" : "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  minWidth: window.innerWidth <= 768 ? "auto" : "120px",
                  textAlign: "center"
                }}
                onClick={() => onFilterChange(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            justifyContent: window.innerWidth <= 768 ? "center" : "flex-end"
          }}>
            <button
              onClick={() => setShowDialog(true)}
              style={{
                background: "#111",
                color: "#FFF700",
                border: "1px solid #FFF700",
                padding: window.innerWidth <= 768 ? "6px 12px" : "8px 16px",
                borderRadius: "20px",
                fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                fontWeight: "500",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              Partager une anecdote
            </button>
            <button
              style={{
                width: window.innerWidth <= 768 ? "28px" : "32px",
                height: window.innerWidth <= 768 ? "28px" : "32px",
                borderRadius: "50%",
                background: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                fontWeight: "500",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s ease"
              }}
              onClick={() => navigate('/admin')}
              title="Accéder à l'administration"
            >
              A
            </button>
          </div>
        </div>
      </header>

      {/* Anecdote Dialog - Make it responsive */}
      {showDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: '#181818',
            borderRadius: '12px',
            padding: window.innerWidth <= 768 ? '20px 16px' : '24px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowDialog(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#FFF700',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              ×
            </button>
            
            <h2 style={{ color: '#FFF700', fontSize: '24px', marginBottom: '24px' }}>
              Partager une anecdote
            </h2>
            <p style={{ color: '#999', fontSize: '14px', marginBottom: '24px' }}>
              Partagez-la avec la communauté !
            </p>
            
            {error && (
              <div style={{
                background: '#ff00001a',
                color: '#ff6b6b',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px' }}>
                  Titre de votre anecdote
                </label>
                <input
                  type="text"
                  name="title"
                  value={anecdoteForm.title}
                  onChange={handleChange}
                  placeholder="Surprenant"
                  required
                  maxLength={90}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: '2px solid #FFF700',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                />
                <div style={{ textAlign: 'right', color: '#666', fontSize: '12px', marginTop: '4px' }}>
                  {90 - anecdoteForm.title.length} caractères restants
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px' }}>
                  Raconte-nous ton histoire
                </label>
                <textarea
                  name="content"
                  value={anecdoteForm.content}
                  onChange={handleChange}
                  placeholder="Pour partager votre anecdote efficacement, soyez concis et limitez-vous à 400 caractères. Incluez des détails clés pour rendre votre histoire unique et amusante. Ajoutez de l'humour ou des émotions pour la rendre plus vivante."
                  required
                  maxLength={400}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: '2px solid #6C3BFF',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    minHeight: '120px',
                    resize: 'vertical'
                  }}
                />
                <div style={{ textAlign: 'right', color: '#666', fontSize: '12px', marginTop: '4px' }}>
                  {400 - anecdoteForm.content.length} caractères restants
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px' }}>
                  Catégorie
                </label>
                <select
                  name="category"
                  value={anecdoteForm.category}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: '2px solid #FFF700',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#fff',
                    fontSize: '16px',
                    appearance: 'none'
                  }}
                >
                  <option value="" disabled>Sélectionnez une catégorie</option>
                  {categories.map(category => (
                    <option key={category} value={category} style={{ background: '#181818' }}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  background: '#FFF700',
                  color: '#111',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'Publication...' : 'Soumettre ton anecdote'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
