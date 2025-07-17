import React, { useEffect, useState } from 'react';

const ManageSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all counseling sessions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/sessions');
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Update status handler
  const updateSessionStatus = async (sessionId, newStatus) => {
    try {
      setError('');
      const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header here if needed
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to update status');
        return;
      }

      // Update state locally after success
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === sessionId ? { ...session, status: newStatus } : session
        )
      );
    } catch {
      setError('Network error');
    }
  };

  if (loading) {
    return <div className="p-5">Loading sessions...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#AF5D73' }}>Admin - Counseling Sessions</h1>

      {sessions.length === 0 && <p>No sessions found.</p>}

      <div className="space-y-6">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-4 border rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-center"
          >
            <div className="mb-3 sm:mb-0 max-w-xl">
              <h2 className="text-xl font-semibold">{session.title}</h2>
              <p className="mb-2">{session.description}</p>
              <p>
                <strong>Date:</strong> {new Date(session.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {session.time}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                                  <span
                    style={{
                      color: '#AF5D73',
                      fontWeight: 'bold'
                    }}
                  >
                    {session.status}
                  </span>
              </p>
            </div>

            <div className="flex space-x-3">
              {/* Show both Approve & Reject if pending */}
              {session.status === 'pending' && (
                <>
                  <button
                    onClick={() => updateSessionStatus(session.id, 'approved')}
                    style={{
                      backgroundColor: '#AF5D73',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#8B4A5A'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#AF5D73'}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateSessionStatus(session.id, 'rejected')}
                    style={{
                      backgroundColor: '#AF5D73',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#8B4A5A'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#AF5D73'}
                  >
                    Reject
                  </button>
                </>
              )}

              {/* Show only Reject if approved */}
              {session.status === 'approved' && (
                <button
                  onClick={() => updateSessionStatus(session.id, 'rejected')}
                  style={{
                    backgroundColor: '#AF5D73',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#8B4A5A'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#AF5D73'}
                >
                  Reject
                </button>
              )}

              {/* Show only Approve if rejected */}
              {session.status === 'rejected' && (
                <button
                  onClick={() => updateSessionStatus(session.id, 'approved')}
                  style={{
                    backgroundColor: '#AF5D73',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#8B4A5A'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#AF5D73'}
                >
                  Approve
                </button>
              )}

              {/* No buttons for other statuses */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSessions;
