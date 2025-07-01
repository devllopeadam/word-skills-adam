import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import AnecdoteCard from './AnecdoteCard';
import api from '../config';

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("max-wow");
  const [anecdotes, setAnecdotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnecdotes = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.get('/anecdotes', {
        headers: {
          'Authorization': `${tokenType} ${token}`
        }
      });
      setAnecdotes(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des anecdotes');
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAnecdotes();
  }, [fetchAnecdotes]);

  const filteredAnecdotes = React.useMemo(() => {
    if (!anecdotes.length) return [];
    
    switch (selectedFilter) {
      case 'max-wow':
        // Sort by highest wow count
        return [...anecdotes].sort((a, b) => (b.rating?.wow || 0) - (a.rating?.wow || 0));
      case 'wow-or':
        // Get best rated from the last week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return [...anecdotes]
          .filter(anecdote => new Date(anecdote.created_at) >= oneWeekAgo)
          .sort((a, b) => (b.rating?.wow || 0) - (a.rating?.wow || 0));
      case 'technique':
        // Sort by highest technique rating
        return [...anecdotes].sort((a, b) => (b.rating?.technique || 0) - (a.rating?.technique || 0));
      default:
        return anecdotes;
    }
  }, [selectedFilter, anecdotes]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#111', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#FFF700',
        fontSize: '18px'
      }}>
        Chargement des anecdotes...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111' }}>
      <Header selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
      
      {error && (
        <div style={{
          background: '#ff00001a',
          color: '#ff6b6b',
          padding: '12px',
          margin: '16px auto',
          maxWidth: '1200px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: window.innerWidth <= 1024 ? '1fr' : '1fr 300px',
        gap: '24px',
        padding: window.innerWidth <= 768 ? '16px' : '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Main Content */}
        <div>
          {filteredAnecdotes.length === 0 ? (
            <div style={{ 
              color: '#999', 
              textAlign: 'center', 
              padding: '40px 20px',
              fontSize: '16px' 
            }}>
              Aucune anecdote à afficher pour le moment.
            </div>
          ) : (
            <div style={{ marginBottom: '24px' }}>
              {filteredAnecdotes.map(anecdote => (
                <AnecdoteCard 
                  key={anecdote.id}
                  id={anecdote.id}
                  title={anecdote.title}
                  content={anecdote.content}
                  votes={anecdote.votes}
                  category={anecdote.category}
                  created_at={anecdote.created_at}
                  author={anecdote.author}
                  onVoteSuccess={fetchAnecdotes}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Sidebar - Hide on mobile, show as horizontal scroll on tablet */}
        {window.innerWidth > 768 && (
          <div style={window.innerWidth <= 1024 ? {
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            padding: '0 16px',
            marginBottom: '24px',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: '-ms-autohiding-scrollbar'
          } : {}}>
            {/* Purple Card */}
            <div style={{ 
              background: '#6C3BFF',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: window.innerWidth <= 1024 ? '0' : '24px',
              position: 'relative',
              minWidth: window.innerWidth <= 1024 ? '280px' : 'auto',
              flex: window.innerWidth <= 1024 ? '0 0 auto' : '1'
            }}>
              <button style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                color: '#FFF700',
                fontSize: '20px',
                cursor: 'pointer'
              }}>×</button>
              <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '12px' }}>Surprenant</h3>
              <p style={{ color: '#fff', fontSize: '14px', marginBottom: '16px' }}>
                Lorem ipsum dolor sit amet consectetur, in ut ut libero amet hendrerit pharetra mauris rhoncus...
              </p>
              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#fff', fontSize: '12px' }}>👎 167</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#fff', fontSize: '12px' }}>⭐️ 101</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#fff', fontSize: '12px' }}>💡 99</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#fff', fontSize: '12px' }}>🎯 223</span>
                </div>
              </div>
            </div>

            {/* Yellow Card */}
            <div style={{ 
              background: '#FFF700',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: window.innerWidth <= 1024 ? '0' : '24px',
              position: 'relative',
              minWidth: window.innerWidth <= 1024 ? '280px' : 'auto',
              flex: window.innerWidth <= 1024 ? '0 0 auto' : '1'
            }}>
              <button style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                color: '#111',
                fontSize: '20px',
                cursor: 'pointer'
              }}>×</button>
              <h3 style={{ color: '#111', fontSize: '18px', marginBottom: '12px' }}>Une question de timing</h3>
              <p style={{ color: '#111', fontSize: '14px', marginBottom: '16px' }}>
                Lorem ipsum dolor sit amet consectetur, in ut ut libero amet hendrerit pharetra mauris rhoncus...
              </p>
              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid rgba(0,0,0,0.2)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#111', fontSize: '12px' }}>👎 167</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#111', fontSize: '12px' }}>⭐️ 101</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#111', fontSize: '12px' }}>💡 99</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#111', fontSize: '12px' }}>🎯 223</span>
                </div>
              </div>
            </div>

            {/* Dark Card */}
            <div style={{ 
              background: '#181818',
              padding: '20px',
              borderRadius: '12px',
              position: 'relative',
              border: '1px solid #333',
              minWidth: window.innerWidth <= 1024 ? '280px' : 'auto',
              flex: window.innerWidth <= 1024 ? '0 0 auto' : '1'
            }}>
              <button style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                color: '#FFF700',
                fontSize: '20px',
                cursor: 'pointer'
              }}>×</button>
              <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '12px' }}>Viral</h3>
              <p style={{ color: '#999', fontSize: '14px', marginBottom: '16px' }}>
                Lorem ipsum dolor sit amet consectetur, in ut ut libero amet hendrerit pharetra mauris rhoncus...
              </p>
              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #333', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#fff', fontSize: '12px' }}>👎 167</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#fff', fontSize: '12px' }}>⭐️ 101</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#fff', fontSize: '12px' }}>💡 99</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#fff', fontSize: '12px' }}>🎯 223</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
