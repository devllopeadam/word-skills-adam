import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bofIcon from '../assets/bof.png';
import excellentIcon from '../assets/excellent.png';
import techniqueIcon from '../assets/technique.png';
import wowIcon from '../assets/wow.png';
import api from '../config';

export default function Admin() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('users');
  const [users, setUsers] = useState([]);
  const [anecdotes, setAnecdotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type');
    
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const [usersResponse, anecdotesResponse] = await Promise.all([
        api.get('/users', {
          headers: {
            'Authorization': `${tokenType} ${token}`
          }
        }),
        api.get('/anecdotes', {
          headers: {
            'Authorization': `${tokenType} ${token}`
          }
        })
      ]);
      
      setUsers(usersResponse.data);
      setAnecdotes(anecdotesResponse.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteAnecdote = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette anecdote ?')) {
      return;
    }

    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type');
    
    if (!token) {
      navigate('/login');
      return;
    }

    setDeleteLoading(true);
    try {
      await api.delete(`/anecdotes/${id}`, {
        headers: {
          'Authorization': `${tokenType} ${token}`
        }
      });
      
      // Refresh the data after successful deletion
      await fetchData();
      
    } catch (err) {
      setError('Erreur lors de la suppression de l\'anecdote');
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        navigate('/login');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#111' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '240px', 
        background: '#181818', 
        borderRight: '1px solid #333',
        padding: '24px 0'
      }}>
        <div style={{ 
          padding: '0 24px 24px',
          borderBottom: '1px solid #333',
          marginBottom: '16px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#FFF700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              A
            </div>
            <div style={{ color: '#fff' }}>MOUNIR LAHYANI</div>
          </div>
        </div>

        <nav>
          <button
            onClick={() => setActiveSection('users')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 24px',
              background: activeSection === 'users' ? '#333' : 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              textAlign: 'left'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
            </svg>
            Les Utilisateurs
          </button>

          <button
            onClick={() => setActiveSection('anecdotes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 24px',
              background: activeSection === 'anecdotes' ? '#333' : 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              textAlign: 'left'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z" fill="currentColor"/>
            </svg>
            Les anecdotes
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('token_type');
              navigate('/login');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 24px',
              background: 'transparent',
              border: 'none',
              color: '#ff4444',
              cursor: 'pointer',
              fontSize: '14px',
              textAlign: 'left',
              marginTop: 'auto',
              transition: 'all 0.2s ease',
              ':hover': {
                background: '#ff44441a'
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="#ff4444"/>
            </svg>
            Se déconnecter
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '24px' }}>
        {activeSection === 'users' && (
          <div>
            <h1 style={{ 
              color: '#fff', 
              fontSize: '24px', 
              marginBottom: '24px',
              fontWeight: '500'
            }}>
              Utilisateurs
            </h1>

            {loading ? (
              <div style={{ color: '#666' }}>Chargement...</div>
            ) : error ? (
              <div style={{ color: '#ff6b6b' }}>{error}</div>
            ) : (
              <div style={{ 
                background: '#181818', 
                borderRadius: '12px',
                border: '1px solid #333',
                overflow: 'hidden'
              }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333' }}>
                      <th style={{ 
                        color: '#666', 
                        textAlign: 'left', 
                        padding: '16px', 
                        fontWeight: '500' 
                      }}>Nom</th>
                      <th style={{ 
                        color: '#666', 
                        textAlign: 'left', 
                        padding: '16px', 
                        fontWeight: '500' 
                      }}>Prénom</th>
                      <th style={{ 
                        color: '#666', 
                        textAlign: 'left', 
                        padding: '16px', 
                        fontWeight: '500' 
                      }}>Email</th>
                      <th style={{ 
                        color: '#666', 
                        textAlign: 'center', 
                        padding: '16px', 
                        fontWeight: '500' 
                      }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ color: '#fff', padding: '16px' }}>{user.firstName}</td>
                        <td style={{ color: '#fff', padding: '16px' }}>{user.lastName}</td>
                        <td style={{ color: '#fff', padding: '16px' }}>{user.email}</td>
                        <td style={{ 
                          padding: '16px',
                          textAlign: 'center'
                        }}>
                          <button
                            onClick={() => {/* Handle delete */}}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ff4444',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => {/* Handle edit */}}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#FFF700',
                              cursor: 'pointer',
                              padding: '4px',
                              marginLeft: '8px'
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeSection === 'anecdotes' && (
          <div>
            <h1 style={{ 
              color: '#fff', 
              fontSize: '24px', 
              marginBottom: '24px',
              fontWeight: '500'
            }}>
              Les anecdotes
            </h1>
            
            {loading ? (
              <div style={{ color: '#666' }}>Chargement...</div>
            ) : error ? (
              <div style={{ color: '#ff6b6b' }}>{error}</div>
            ) : (
              <div style={{ 
                background: '#181818', 
                borderRadius: '12px',
                border: '1px solid #333',
                overflow: 'hidden'
              }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333' }}>
                      <th style={{ 
                        color: '#666', 
                        textAlign: 'left', 
                        padding: '16px', 
                        fontWeight: '500' 
                      }}>Titre</th>
                      <th style={{ 
                        color: '#666', 
                        textAlign: 'left', 
                        padding: '16px', 
                        fontWeight: '500' 
                      }}>Auteur</th>
                      <th style={{ 
                        color: '#666', 
                        textAlign: 'left', 
                        padding: '16px', 
                        fontWeight: '500' 
                      }}>Catégorie</th>
                      <th style={{ 
                        color: '#666', 
                        textAlign: 'center', 
                        padding: '16px', 
                        fontWeight: '500' 
                      }}>Votes</th>
                      <th style={{ 
                        color: '#666', 
                        textAlign: 'center', 
                        padding: '16px', 
                        fontWeight: '500' 
                      }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anecdotes.map(anecdote => (
                      <tr key={anecdote.id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ 
                          color: '#fff', 
                          padding: '16px',
                          maxWidth: '300px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {anecdote.title}
                        </td>
                        <td style={{ color: '#fff', padding: '16px' }}>{anecdote.author}</td>
                        <td style={{ color: '#fff', padding: '16px' }}>
                          <span style={{ 
                            background: '#FFF700',
                            color: '#111',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            {anecdote.category}
                          </span>
                        </td>
                        <td style={{ 
                          color: '#fff', 
                          padding: '16px',
                          textAlign: 'center'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            gap: '16px', 
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                            {[
                              { key: 'Bof', icon: bofIcon, count: anecdote.votes?.Bof || 0 },
                              { key: 'Excellent', icon: excellentIcon, count: anecdote.votes?.Excellent || 0 },
                              { key: 'Technique', icon: techniqueIcon, count: anecdote.votes?.Technique || 0 },
                              { key: 'Wow!!', icon: wowIcon, count: anecdote.votes?.['Wow!!'] || 0 }
                            ].map(({ key, icon, count }) => (
                              <div key={key} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px'
                              }}>
                                <img 
                                  src={icon} 
                                  alt={key} 
                                  style={{ 
                                    width: '16px', 
                                    height: '16px', 
                                    objectFit: 'contain' 
                                  }} 
                                />
                                <span style={{ 
                                  color: '#fff', 
                                  fontSize: '12px' 
                                }}>{count}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td style={{ 
                          padding: '16px',
                          textAlign: 'center'
                        }}>
                          <button
                            onClick={() => !deleteLoading && handleDeleteAnecdote(anecdote.id)}
                            disabled={deleteLoading}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ff4444',
                              cursor: deleteLoading ? 'wait' : 'pointer',
                              padding: '4px',
                              opacity: deleteLoading ? 0.5 : 1,
                              transition: 'opacity 0.2s ease'
                            }}
                            title="Supprimer l'anecdote"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => {/* Handle edit */}}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#FFF700',
                              cursor: 'pointer',
                              padding: '4px',
                              marginLeft: '8px'
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
