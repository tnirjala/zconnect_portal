import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  Calendar,
  MapPin,
  Clock,
  Mail,
  User,
  X,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw,
  BookOpen,
  List
} from 'lucide-react';

const WorkshopParticipants = () => {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [participantToCancel, setParticipantToCancel] = useState(null);
  const [error, setError] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState('');

  // Simple auth check
  useEffect(() => {
    const isAuthenticated = true; // For demo purposes
    if (!isAuthenticated) {
      setError('Authentication required. Please log in as admin.');
    }
  }, []);

  // Detect API base URL
  useEffect(() => {
    const currentOrigin = window.location.origin;
    const possibleUrls = [
      `${currentOrigin}/api`,
      'http://localhost:3001/api',
      'http://localhost:5000/api',
      'http://localhost:8000/api'
    ];
    
    setApiBaseUrl(possibleUrls[0]);
    fetchWorkshops();
  }, []);

  const makeApiRequest = async (endpoint, options = {}) => {
    const possibleBaseUrls = [
      apiBaseUrl,
      '/api',
      'http://localhost:3001/api',
      'http://localhost:5000/api',
      'http://localhost:8000/api'
    ];

    let lastError = null;

    for (const baseUrl of possibleBaseUrls) {
      try {
        const url = `${baseUrl}${endpoint}`;
        console.log(`Trying API endpoint: ${url}`);
        
        const defaultHeaders = {
          'Content-Type': 'application/json',
          'admin-email': 'zconnect.admin@gmail.com',
          ...options.headers
        };

        const response = await fetch(url, {
          method: 'GET',
          ...options,
          headers: defaultHeaders,
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error(`Server returned HTML instead of JSON. Check if API server is running on ${baseUrl}`);
        }

        if (response.ok) {
          console.log(`Success with API endpoint: ${url}`);
          return response;
        } else {
          lastError = `HTTP ${response.status}: ${response.statusText}`;
        }
      } catch (err) {
        console.log(`Failed with ${baseUrl}${endpoint}:`, err.message);
        lastError = err.message;
      }
    }

    throw new Error(lastError || 'Failed to connect to API server');
  };

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await makeApiRequest('/workshops');
      const data = await response.json();
      console.log('Workshops data:', data);
      
      const workshopsWithCounts = await Promise.all(
        data.map(async (workshop) => {
          try {
            const participantsResponse = await makeApiRequest(`/workshops/${workshop.id}/participants`);
            
            if (participantsResponse.ok) {
              const participants = await participantsResponse.json();
              return { ...workshop, registered_count: participants.length };
            }
            return { ...workshop, registered_count: 0 };
          } catch (err) {
            console.error(`Error fetching participants for workshop ${workshop.id}:`, err);
            return { ...workshop, registered_count: 0 };
          }
        })
      );

      setWorkshops(workshopsWithCounts);
    } catch (error) {
      console.error('Error fetching workshops:', error);
      let errorMessage = error.message;
      
      if (errorMessage.includes('HTML instead of JSON')) {
        errorMessage = 'API server is not running or not configured correctly. Please ensure your backend server is started.';
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to API server. Please check if your backend is running on the correct port.';
      }
      
      setError(`Failed to load workshops: ${errorMessage}`);
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async (workshopId) => {
    try {
      setLoading(true);
      setError('');

      const response = await makeApiRequest(`/workshops/${workshopId}/participants`);
      const data = await response.json();
      console.log('Participants data:', data);
      setParticipants(data);
    } catch (error) {
      console.error('Error fetching participants:', error);
      setError(`Failed to load participants: ${error.message}`);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkshopSelect = (workshop) => {
    setSelectedWorkshop(workshop);
    fetchParticipants(workshop.id);
    setSearchTerm('');
  };

  const handleCancelRegistration = async (participant) => {
    try {
      setLoading(true);
      setError('');

      const response = await makeApiRequest(`/workshops/${selectedWorkshop.id}/register`, {
        method: 'DELETE',
        headers: {
          'user-email': participant.email,
        },
      });

      if (response.ok) {
        setParticipants(participants.filter(p => p.id !== participant.id));
        setShowCancelModal(false);
        setParticipantToCancel(null);
        
        setSelectedWorkshop(prev => ({
          ...prev,
          registered_count: (prev.registered_count || 0) - 1
        }));
        
        fetchWorkshops();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error cancelling registration:', error);
      setError(`Failed to cancel registration: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exportParticipants = () => {
    if (!selectedWorkshop || filteredParticipants.length === 0) return;

    const csvContent = [
      ['Name', 'Email', 'Registration Date'],
      ...filteredParticipants.map(p => [
        p.name,
        p.email,
        new Date(p.registered_at).toLocaleDateString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedWorkshop.title.replace(/[^a-zA-Z0-9]/g, '_')}_participants.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (workshop.description && workshop.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || workshop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    return 'bg-pink-100 text-pink-800';
  };

  if (loading && !selectedWorkshop && workshops.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fdf2f8' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#AF5D73' }}></div>
          <p className="text-gray-600">Loading workshops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf2f8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#fdf2f8' }}>
                <BookOpen className="w-6 h-6" style={{ color: '#AF5D73' }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                  <span>Manage Workshop Participants</span>
                </h1>
                <p className="flex items-center" style={{ color: '#AF5D73' }}>
                  <List className="w-4 h-4 mr-1" />
                  View and manage participant registrations for all workshops
                </p>
              </div>
            </div>
            <button
              onClick={fetchWorkshops}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                backgroundColor: '#AF5D73',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
              onMouseOver={(e) => {
                if (!loading) e.target.style.backgroundColor = '#8B4A5A';
              }}
              onMouseOut={(e) => {
                if (!loading) e.target.style.backgroundColor = '#AF5D73';
              }}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 mb-2">{error}</p>
                <div className="text-sm text-red-600">
                  <p className="font-medium mb-1">Troubleshooting steps:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ensure your backend API server is running</li>
                    <li>Check if the server is accessible on the expected port</li>
                    <li>Verify CORS is properly configured in your backend</li>
                    <li>Check the browser's Network tab for detailed error information</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {!selectedWorkshop ? (
          /* Workshop Selection View */
          <div>
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search workshops..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    style={{ outline: 'none', borderColor: '#AF5D73' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={(e) => e.target.style.borderColor = '#AF5D73'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg"
                    style={{ outline: 'none', borderColor: '#AF5D73' }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    onFocus={(e) => e.target.style.borderColor = '#AF5D73'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Workshops Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map(workshop => (
                <div
                  key={workshop.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  style={{ border: '1px solid #fdf2f8' }}
                  onMouseOver={(e) => e.target.style.borderColor = '#AF5D73'}
                  onMouseOut={(e) => e.target.style.borderColor = '#fdf2f8'}
                  onClick={() => handleWorkshopSelect(workshop)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {workshop.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workshop.status)}`}>
                        {workshop.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {workshop.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" style={{ color: '#AF5D73' }} />
                        {new Date(workshop.date).toLocaleDateString()} at {workshop.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" style={{ color: '#AF5D73' }} />
                        {workshop.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" style={{ color: '#AF5D73' }} />
                        {workshop.registered_count || 0} / {workshop.capacity} registered
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredWorkshops.length === 0 && !loading && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No workshops found</h3>
                <p className="text-gray-500">
                  {workshops.length === 0 
                    ? 'No workshops have been created yet.' 
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Participants Management View */
          <div>
            {/* Back button and workshop header */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setSelectedWorkshop(null);
                  setParticipants([]);
                  setSearchTerm('');
                  setError('');
                }}
                className="mb-4 font-medium flex items-center"
                style={{ color: '#AF5D73' }}
                onMouseOver={(e) => e.target.style.color = '#8B4A5A'}
                onMouseOut={(e) => e.target.style.color = '#AF5D73'}
              >
                ← Back to workshops
              </button>
              
              <div className="bg-white rounded-lg shadow-sm p-6" style={{ border: '1px solid #fdf2f8' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" style={{ color: '#AF5D73' }} />
                      {selectedWorkshop.title}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" style={{ color: '#AF5D73' }} />
                        {new Date(selectedWorkshop.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" style={{ color: '#AF5D73' }} />
                        {selectedWorkshop.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" style={{ color: '#AF5D73' }} />
                        {selectedWorkshop.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" style={{ color: '#AF5D73' }} />
                        {participants.length} / {selectedWorkshop.capacity}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={exportParticipants}
                    disabled={filteredParticipants.length === 0}
                    style={{
                      marginTop: '16px',
                      backgroundColor: '#AF5D73',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: filteredParticipants.length === 0 ? 'not-allowed' : 'pointer',
                      opacity: filteredParticipants.length === 0 ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseOver={(e) => {
                      if (filteredParticipants.length > 0) e.target.style.backgroundColor = '#8B4A5A';
                    }}
                    onMouseOut={(e) => {
                      if (filteredParticipants.length > 0) e.target.style.backgroundColor = '#AF5D73';
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Search participants */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ border: '1px solid #fdf2f8' }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search participants by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  style={{ outline: 'none', borderColor: '#AF5D73' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#AF5D73'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            {/* Participants table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid #fdf2f8' }}>
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#AF5D73' }}></div>
                  <p className="text-gray-600">Loading participants...</p>
                </div>
              ) : filteredParticipants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead style={{ backgroundColor: '#fdf2f8' }}>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#AF5D73' }}>
                          Participant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#AF5D73' }}>
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#AF5D73' }}>
                          Registration Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#AF5D73' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredParticipants.map(participant => (
                        <tr key={participant.id} style={{ backgroundColor: 'white' }}
                            onMouseOver={(e) => e.target.parentElement.style.backgroundColor = '#fdf2f8'}
                            onMouseOut={(e) => e.target.parentElement.style.backgroundColor = 'white'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fdf2f8' }}>
                                  <User className="h-5 w-5" style={{ color: '#AF5D73' }} />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {participant.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2" style={{ color: '#AF5D73' }} />
                              {participant.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(participant.registered_at).toLocaleDateString()} at{' '}
                            {new Date(participant.registered_at).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setParticipantToCancel(participant);
                                setShowCancelModal(true);
                              }}
                              style={{ color: '#AF5D73' }}
                              onMouseOver={(e) => e.target.style.color = '#8B4A5A'}
                              onMouseOut={(e) => e.target.style.color = '#AF5D73'}
                            >
                              Cancel Registration
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No participants found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search criteria.' : 'No one has registered for this workshop yet.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cancel Registration Modal */}
        {showCancelModal && participantToCancel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">
                  Cancel Registration
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel the registration for{' '}
                <strong>{participantToCancel.name}</strong> ({participantToCancel.email})?
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setParticipantToCancel(null);
                  }}
                  disabled={loading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Keep Registration
                </button>
                <button
                  onClick={() => handleCancelRegistration(participantToCancel)}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#AF5D73',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!loading) e.target.style.backgroundColor = '#8B4A5A';
                  }}
                  onMouseOut={(e) => {
                    if (!loading) e.target.style.backgroundColor = '#AF5D73';
                  }}
                >
                  {loading ? 'Cancelling...' : 'Cancel Registration'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopParticipants;