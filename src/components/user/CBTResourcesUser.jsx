import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CBTResourcesUser = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cbt-resources/approved`);
      setResources(res.data);
    } catch (error) {
      console.error('Failed to fetch approved CBT resources:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 className="text-2xl font-bold mb-6" 
         style={{ 
           textAlign: 'center', 
           color: '#8B3A4A', 
           marginBottom: '30px' 
         }}>
        CBT Resources
      </h2>

      {resources.length === 0 ? (
        <p style={{ 
          textAlign: 'center', 
          color: '#BA5066',
          fontSize: '16px',
          padding: '40px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '8px',
          border: '1px solid rgba(186, 80, 102, 0.2)'
        }}>
          No CBT resources available.
        </p>
      ) : (
        <div className="resource-cards" 
             style={{ 
               display: 'flex', 
               flexWrap: 'wrap', 
               gap: '20px', 
               justifyContent: 'center' 
             }}>
          {resources.map((res) => (
            <div key={res.id} 
                 className="card" 
                 style={{
                   border: '1px solid rgba(186, 80, 102, 0.2)',
                   borderRadius: '8px',
                   padding: '15px',
                   width: '300px',
                   boxShadow: '0 4px 10px rgba(186, 80, 102, 0.15)',
                   backgroundColor: 'rgba(255, 255, 255, 0.95)',
                   transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-2px)';
                   e.currentTarget.style.boxShadow = '0 6px 15px rgba(186, 80, 102, 0.25)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = '0 4px 10px rgba(186, 80, 102, 0.15)';
                 }}>
              
              <h3 style={{ 
                color: '#8B3A4A', 
                marginBottom: '10px',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {res.title}
              </h3>
              
              <p style={{ 
                marginBottom: '12px', 
                color: '#BA5066',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Type: {res.type}
              </p>

              {res.type === 'image' && (
                <img
                  src={`http://localhost:5000${res.file_url}`}
                  alt={res.title}
                  style={{ 
                    width: '100%', 
                    borderRadius: '6px',
                    border: '1px solid rgba(186, 80, 102, 0.1)'
                  }}
                />
              )}

              {res.type === 'video' && (
                <video 
                  controls 
                  style={{ 
                    width: '100%', 
                    borderRadius: '6px',
                    border: '1px solid rgba(186, 80, 102, 0.1)'
                  }}>
                  <source src={`http://localhost:5000${res.file_url}`} type="video/mp4" />
                </video>
              )}

              {res.type === 'pdf' && (
                <a href={`http://localhost:5000${res.file_url}`} 
                   target="_blank" 
                   rel="noreferrer" 
                   style={{ 
                     color: '#BA5066',
                     textDecoration: 'underline',
                     fontWeight: '500',
                     transition: 'color 0.2s ease'
                   }}
                   onMouseEnter={(e) => e.target.style.color = '#8B3A4A'}
                   onMouseLeave={(e) => e.target.style.color = '#BA5066'}>
                  View PDF
                </a>
              )}

              {res.type === 'link' && (
                <a href={res.file_url} 
                   target="_blank" 
                   rel="noreferrer" 
                   style={{ 
                     color: '#BA5066',
                     textDecoration: 'underline',
                     fontWeight: '500',
                     transition: 'color 0.2s ease'
                   }}
                   onMouseEnter={(e) => e.target.style.color = '#8B3A4A'}
                   onMouseLeave={(e) => e.target.style.color = '#BA5066'}>
                  Open Link
                </a>
              )}

              {res.description && (
                <p style={{ 
                  marginTop: '12px', 
                  color: '#BA5066',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(186, 80, 102, 0.1)'
                }}>
                  {res.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CBTResourcesUser;