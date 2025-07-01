import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bofIcon from '../assets/bof.png';
import excellentIcon from '../assets/excellent.png';
import techniqueIcon from '../assets/technique.png';
import wowIcon from '../assets/wow.png';
import api from '../config';

export default function AnecdoteCard({ id, title, content, votes = {}, category, created_at = new Date().toISOString(), author, onVoteSuccess }) {
  const navigate = useNavigate();
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState(null);
  
  const voteCounts = {
    bof: votes?.Bof || 0,
    excellent: votes?.Excellent || 0,
    technique: votes?.Technique || 0,
    wow: votes?.['Wow!!'] || 0
  };

  const handleVote = async (type) => {
    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type');

    if (!token) {
      navigate('/login');
      return;s
    }

    setIsVoting(true);
    setVoteError(null);

    try {
      await api.post(`/anecdotes/${id}/vote`, {
        type: type === 'bof' ? 'Bof' :
              type === 'excellent' ? 'Excellent' :
              type === 'technique' ? 'Technique' :
              'Wow!!'
      }, {
        headers: {
          'Authorization': `${tokenType} ${token}`
        }
      });

      if (onVoteSuccess) {
        onVoteSuccess();
      }
    } catch (err) {
      setVoteError('Erreur lors du vote');
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        navigate('/login');
      }
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date inconnue';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';

      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  return (
    <div style={{
      background: '#181818',
      borderRadius: '12px',
      padding: window.innerWidth <= 768 ? '16px' : '20px',
      marginBottom: '16px',
      border: '1px solid #333'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '16px', 
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            color: '#fff', 
            fontSize: window.innerWidth <= 768 ? '16px' : '18px', 
            fontWeight: '500',
            marginBottom: '4px'
          }}>{title}</h3>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <span style={{ 
              color: '#666', 
              fontSize: '12px' 
            }}>
              {formatDate(created_at)}
            </span>
            <span style={{ 
              color: '#FFF700', 
              fontSize: '12px' 
            }}>
              par {author}
            </span>
            <span style={{ 
              background: '#FFF700',
              color: '#111',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              {category}
            </span>
          </div>
        </div>
        <button style={{
          background: 'transparent',
          border: 'none',
          color: '#FFF700',
          cursor: 'pointer',
          fontSize: '20px',
          padding: '0',
          marginTop: '-5px',
          flexShrink: 0
        }}>
          ×
        </button>
      </div>
      <p style={{ 
        color: '#999', 
        fontSize: window.innerWidth <= 768 ? '13px' : '14px', 
        lineHeight: '1.5', 
        marginBottom: '20px'
      }}>
        {content}
      </p>
      <div style={{
        display: 'flex',
        gap: window.innerWidth <= 768 ? '12px' : '20px',
        borderTop: '1px solid #333',
        paddingTop: '16px',
        flexWrap: window.innerWidth <= 480 ? 'wrap' : 'nowrap',
        justifyContent: window.innerWidth <= 480 ? 'space-around' : 'flex-start'
      }}>
        {[
          { key: 'bof', icon: bofIcon, count: voteCounts.bof },
          { key: 'excellent', icon: excellentIcon, count: voteCounts.excellent },
          { key: 'technique', icon: techniqueIcon, count: voteCounts.technique },
          { key: 'wow', icon: wowIcon, count: voteCounts.wow }
        ].map(({ key, icon, count }) => (
          <div key={key} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            flex: window.innerWidth <= 480 ? '0 0 auto' : '0'
          }}>
            <button 
              onClick={() => !isVoting && handleVote(key)}
              disabled={isVoting}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: isVoting ? 'wait' : 'pointer',
                padding: '4px',
                display: 'flex',
                opacity: isVoting ? 0.5 : 1,
                transition: 'opacity 0.2s ease'
              }}
            >
              <img 
                src={icon} 
                alt={key} 
                style={{ 
                  width: window.innerWidth <= 768 ? '16px' : '20px', 
                  height: window.innerWidth <= 768 ? '16px' : '20px', 
                  objectFit: 'contain' 
                }} 
              />
            </button>
            <span style={{ 
              color: '#fff', 
              fontSize: window.innerWidth <= 768 ? '12px' : '14px' 
            }}>{count}</span>
          </div>
        ))}
        {voteError && (
          <div style={{
            color: '#ff6b6b',
            fontSize: '12px',
            marginLeft: 'auto'
          }}>
            {voteError}
          </div>
        )}
      </div>
    </div>
  );
}
