import React, { useState, useEffect } from 'react';

const CreateSession = () => {
  const [sessions, setSessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category_id: ''
  });

  // Participants state keyed by session id
  const [participantsBySession, setParticipantsBySession] = useState({});
  const [participantsLoading, setParticipantsLoading] = useState({});
  const [participantsError, setParticipantsError] = useState({});

  // Track which session's participants are open (for toggling)
  const [openParticipantsSessionId, setOpenParticipantsSessionId] = useState(null);

  // Get logged-in user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const userId = userData.id;

  // Common auth header
  const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  // Fetch sessions from backend
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/sessions?created_by=' + userId, { headers: authHeader });
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      setSessions(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error fetching sessions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories', { headers: authHeader });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchCategories();
  }, []);

  // Fetch participants for a given session
  const fetchParticipants = async (sessionId) => {
    try {
      setParticipantsLoading(prev => ({ ...prev, [sessionId]: true }));
      setParticipantsError(prev => ({ ...prev, [sessionId]: '' }));

      const res = await fetch(`http://localhost:5000/api/sessions/${sessionId}/participants`, { headers: authHeader });
      if (!res.ok) throw new Error('Failed to fetch participants');
      const data = await res.json();

      setParticipantsBySession(prev => ({ ...prev, [sessionId]: data }));
    } catch (err) {
      setParticipantsError(prev => ({ ...prev, [sessionId]: err.message || 'Error fetching participants' }));
      setParticipantsBySession(prev => ({ ...prev, [sessionId]: [] }));
    } finally {
      setParticipantsLoading(prev => ({ ...prev, [sessionId]: false }));
    }
  };

  // Toggle participants panel for a session
  const toggleParticipants = (sessionId) => {
    if (openParticipantsSessionId === sessionId) {
      setOpenParticipantsSessionId(null); // close if open
    } else {
      setOpenParticipantsSessionId(sessionId);
      fetchParticipants(sessionId);
    }
  };

  // Cancel a participant registration
  const cancelParticipant = async (sessionId, email) => {
    if (!window.confirm(`Cancel registration for ${email}?`)) return;

    try {
      setParticipantsLoading(prev => ({ ...prev, [sessionId]: true }));
      setParticipantsError(prev => ({ ...prev, [sessionId]: '' }));

      const res = await fetch(
        `http://localhost:5000/api/sessions/${sessionId}/participants/${encodeURIComponent(email)}`,
        { method: 'DELETE', headers: authHeader }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to cancel registration');

      // Remove participant from local state
      setParticipantsBySession(prev => ({
        ...prev,
        [sessionId]: prev[sessionId].filter(p => p.email !== email)
      }));

      setSuccess(`Registration for ${email} cancelled successfully.`);
    } catch (err) {
      setParticipantsError(prev => ({ ...prev, [sessionId]: err.message || 'Failed to cancel registration' }));
    } finally {
      setParticipantsLoading(prev => ({ ...prev, [sessionId]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim() || !formData.date || !formData.time || !formData.location.trim()) {
      setError('Please fill all required fields: Title, Date, Time, Location');
      return;
    }

    if (!userId) {
      setError('User not logged in properly. Please login again.');
      return;
    }

    try {
      const url = editingSession
        ? `http://localhost:5000/api/sessions/${editingSession.id}`
        : 'http://localhost:5000/api/sessions';

      const method = editingSession ? 'PUT' : 'POST';

      const bodyData = { ...formData };
      if (!editingSession) {
        bodyData.created_by = userId;
      }

      bodyData.category_id = bodyData.category_id ? parseInt(bodyData.category_id) : null;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Operation failed');
      } else {
        setSuccess(editingSession ? 'Session updated successfully!' : 'Session created successfully!');
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          category_id: ''
        });
        setEditingSession(null);
        fetchSessions();
      }
    } catch {
      setError('Network error occurred');
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      title: session.title || '',
      description: session.description || '',
      date: session.date ? new Date(session.date).toISOString().slice(0, 10) : '',
      time: session.time || '',
      location: session.location || '',
      category_id: session.category_id || ''
    });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/sessions/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Delete failed');
      } else {
        setSuccess('Session deleted successfully!');
        // If participants panel open for this session, close it
        if (openParticipantsSessionId === id) {
          setOpenParticipantsSessionId(null);
          setParticipantsBySession(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
          });
        }
        fetchSessions();
      }
    } catch {
      setError('Network error occurred');
    }
  };

  const handleCancel = () => {
    setEditingSession(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category_id: ''
    });
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center p-5">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse"></div>
            <p className="text-gray-700 text-lg font-medium">Loading sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200">
      <div className="max-w-6xl mx-auto p-5">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent mb-2">
            Counseling Sessions
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mx-auto"></div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-red-500 rounded-full mr-3"></div>
              {error}
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full mr-3"></div>
              {success}
            </div>
          </div>
        )}

        {/* Session form */}
        <form onSubmit={handleSubmit} className="mb-8 space-y-6 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-pink-200/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full p-3 border border-pink-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
                placeholder="Session Title"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full p-3 border border-pink-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              >
                <option value="">-- Select Category (optional) --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-pink-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              rows="4"
              placeholder="Session Description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full p-3 border border-pink-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">Time *</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                placeholder="e.g., 10:00 AM - 11:00 AM"
                className="w-full p-3 border border-pink-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full p-3 border border-pink-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
                placeholder="Location"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold"
            >
              {editingSession ? 'Update Session' : 'Create Session'}
            </button>

            {editingSession && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gradient-to-r from-pink-300 to-rose-300 text-gray-700 px-8 py-3 rounded-xl hover:from-pink-400 hover:to-rose-400 hover:text-white transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Sessions list */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200/30 p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Existing Sessions</h2>

          {sessions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"></div>
              </div>
              <p className="text-gray-600 text-lg">No sessions found.</p>
            </div>
          )}

          <div className="space-y-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-pink-200/30 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                  <div className="flex-1 max-w-3xl">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{session.title}</h3>
                    <p className="text-gray-600 mb-3">{session.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                        <strong>Date:</strong> {new Date(session.date).toLocaleDateString()}
                      </p>
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                        <strong>Time:</strong> {session.time}
                      </p>
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                        <strong>Location:</strong> {session.location}
                      </p>
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                        <strong>Category:</strong> {session.category_title || 'None'}
                      </p>
                    </div>
                    
                    <div className="mt-3 flex items-center space-x-4">
                      <p className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-pink-300 rounded-full mr-2"></span>
                        <strong>Created by:</strong> {session.created_by_name || 'Unknown'}
                      </p>
                      <p className="flex items-center text-sm">
                        <strong>Status:</strong>
                        <span
                          className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            session.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : session.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : session.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {session.status || 'N/A'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                    <button
                      onClick={() => handleEdit(session)}
                      className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-rose-500 transform hover:scale-105 transition-all duration-200 shadow-md font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(session.id)}
                      className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2 rounded-lg hover:from-pink-700 hover:to-rose-700 transform hover:scale-105 transition-all duration-200 shadow-md font-medium"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => toggleParticipants(session.id)}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-200 shadow-md font-medium"
                    >
                      {openParticipantsSessionId === session.id ? 'Hide' : 'View'} Participants
                    </button>
                  </div>
                </div>

                {/* Participants list */}
                {openParticipantsSessionId === session.id && (
                  <div className="mt-6 bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-200">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800">Participants</h4>

                    {participantsLoading[session.id] && (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse mr-3"></div>
                        <p className="text-gray-600">Loading participants...</p>
                      </div>
                    )}

                    {participantsError[session.id] && (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {participantsError[session.id]}
                      </div>
                    )}

                    {!participantsLoading[session.id] &&
                      (!participantsBySession[session.id] || participantsBySession[session.id].length === 0) && (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"></div>
                          </div>
                          <p className="text-gray-600">No participants registered.</p>
                        </div>
                      )}

                    {participantsBySession[session.id] && participantsBySession[session.id].length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-md">
                          <thead>
                            <tr className="bg-gradient-to-r from-pink-200 to-rose-200">
                              <th className="border-b border-pink-300 p-4 text-left font-semibold text-gray-700">Name</th>
                              <th className="border-b border-pink-300 p-4 text-left font-semibold text-gray-700">Email</th>
                              <th className="border-b border-pink-300 p-4 text-left font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {participantsBySession[session.id].map((p, index) => (
                              <tr key={p.id} className={index % 2 === 0 ? 'bg-white' : 'bg-pink-50/50'}>
                                <td className="border-b border-pink-100 p-4 text-gray-700">{p.name}</td>
                                <td className="border-b border-pink-100 p-4 text-gray-700">{p.email}</td>
                                <td className="border-b border-pink-100 p-4">
                                  <button
                                    onClick={() => cancelParticipant(session.id, p.email)}
                                    className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-3 py-1 rounded-lg hover:from-pink-700 hover:to-rose-700 transform hover:scale-105 transition-all duration-200 shadow-md text-sm font-medium"
                                  >
                                    Cancel Registration
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSession;