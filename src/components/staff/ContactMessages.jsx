import React, { useState, useEffect } from 'react';
import { Mail, User, Calendar, MessageSquare } from 'lucide-react';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/contact');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setError('Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        fontSize: '1.1rem',
        color: '#6b7280'
      }}>
        Loading messages...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        fontSize: '1.1rem',
        color: '#dc2626'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        marginBottom: '2rem' 
      }}>
        <Mail className="w-6 h-6" style={{ color: '#BA5066' }} />
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '700', 
          color: '#1f2937',
          margin: 0
        }}>
          Contact Messages
        </h1>
      </div>

      {messages.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#6b7280',
          fontSize: '1.1rem'
        }}>
          No contact messages yet.
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'
        }}>
          {messages.map((message) => (
            <div key={message.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User className="w-4 h-4" style={{ color: '#BA5066' }} />
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>
                    {message.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar className="w-4 h-4" style={{ color: '#6b7280' }} />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {formatDate(message.created_at)}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <Mail className="w-4 h-4" style={{ color: '#6b7280' }} />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {message.email}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.75rem'
                }}>
                  <MessageSquare className="w-4 h-4" style={{ color: '#BA5066' }} />
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>
                    Message:
                  </span>
                </div>
                <div style={{
                  backgroundColor: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  color: '#374151',
                  whiteSpace: 'pre-wrap'
                }}>
                  {message.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages; 