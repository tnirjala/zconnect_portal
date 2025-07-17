import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5000/api';

const ViewParticipants = () => {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.id;

  // Fetch all workshops
  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/workshops`, {
        headers: {
          'staff-id': userId
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        setWorkshops(data || []);
      } else {
        setError('Failed to fetch workshops');
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
      setError('Failed to fetch workshops');
    } finally {
      setLoading(false);
    }
  };

  // Fetch participants for a specific workshop
  const fetchParticipants = async (workshopId) => {
    setParticipantsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/workshops/${workshopId}/participants`, {
        headers: {
          'staff-id': userId
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        setParticipants(data);
      } else {
        setError(data.error || 'Failed to fetch participants');
        setParticipants([]);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      setError('Failed to fetch participants');
      setParticipants([]);
    } finally {
      setParticipantsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleWorkshopSelect = (workshop) => {
    setSelectedWorkshop(workshop);
    fetchParticipants(workshop.id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRegistrationDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Workshop Participants</h1>
          <p className="text-gray-600">View participant counts for all workshops</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workshop List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Workshop</h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                </div>
              ) : workshops.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No workshops found</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {workshops.map(workshop => (
                    <div
                      key={workshop.id}
                      onClick={() => handleWorkshopSelect(workshop)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedWorkshop?.id === workshop.id
                          ? 'border-pink-500 bg-pink-50 shadow-md'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900 mb-1">{workshop.title}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(workshop.date)} at {workshop.time}
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {workshop.location}
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Capacity: {workshop.capacity}
                        </div>
                      </div>
                      {workshop.category_name && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                            {workshop.category_name}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Participants Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              {selectedWorkshop ? (
                <>
                  <div className="mb-6 border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {selectedWorkshop.title}
                    </h2>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(selectedWorkshop.date)} at {selectedWorkshop.time}
                        </span>
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {selectedWorkshop.location}
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-pink-600">
                        {participants.length} / {selectedWorkshop.capacity} Participants
                      </div>
                    </div>
                  </div>

                  {participantsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                    </div>
                  ) : participants.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No participants yet</h3>
                      <p className="text-gray-500">This workshop has no registered participants.</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Registered Participants ({participants.length})
                        </h3>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-pink-600 h-2 rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${Math.min((participants.length / selectedWorkshop.capacity) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedWorkshop.capacity - participants.length > 0 
                            ? `${selectedWorkshop.capacity - participants.length} spots remaining`
                            : 'Workshop is fully booked'
                          }
                        </p>
                      </div>

                      <div className="overflow-hidden">
                        <div className="max-h-96 overflow-y-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Registered
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {participants.map((participant, index) => (
                                <tr key={participant.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {index + 1}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-8 w-8">
                                        <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                                          <span className="text-sm font-medium text-pink-600">
                                            {participant.name.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">
                                          {participant.name}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {participant.email}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatRegistrationDate(participant.registered_at)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Select a Workshop</h3>
                  <p className="text-gray-500">Choose a workshop from the list to view its participants.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewParticipants;