import React, { useState, useEffect } from 'react';
import { 
  FiRefreshCw, FiCheck, FiX, FiClock, FiFilter, 
  FiAlertCircle, FiInfo, FiCalendar, FiMapPin, 
  FiUsers, FiTag, FiUser, FiSettings, FiDatabase,
  FiImage, FiEye, FiXCircle
} from 'react-icons/fi';


const ManageWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Debug function to test API endpoint
  const testApiEndpoint = async () => {
    try {
      const testUrl = `${API_BASE_URL}/api/workshops`;
      console.log('Testing direct API call to:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Direct API test - Status:', response.status);
      console.log('Direct API test - Content-Type:', response.headers.get('content-type'));
      
      const text = await response.text();
      console.log('Direct API test - Response:', text.substring(0, 500));
      
      setDebugInfo(`Direct API test:
Status: ${response.status}
Content-Type: ${response.headers.get('content-type')}
Response preview: ${text.substring(0, 200)}...`);
      
    } catch (error) {
      console.error('Direct API test failed:', error);
      setDebugInfo(`Direct API test failed: ${error.message}`);
    }
  };

  // Fetch workshops from API
  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Current URL:', window.location.href);
      console.log('Fetching workshops from relative path...');
      
      // Try relative path first
       const response = await fetch(`${API_BASE_URL}/api/workshops`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Relative path - Status:', response.status);
      console.log('Relative path - Content-Type:', response.headers.get('content-type'));
      
      // If relative path fails, try absolute path
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        console.log('Relative path failed, trying absolute path...');
        response = await fetch('http://localhost:5000/api/workshops', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Absolute path - Status:', response.status);
        console.log('Absolute path - Content-Type:', response.headers.get('content-type'));
      }
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse.substring(0, 200));
        setError(`Server returned non-JSON response. 
Content-Type: ${contentType}
Response preview: ${textResponse.substring(0, 200)}
Try the "Test Direct API" button below.`);
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        console.log('Workshops data:', data);
        setWorkshops(Array.isArray(data) ? data : []);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch workshops:', errorText);
        setError(`Failed to fetch workshops: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
      setError(`Network error: ${error.message}. Try the "Test Direct API" button below.`);
    } finally {
      setLoading(false);
    }
  };

  // Update workshop status
  const updateWorkshopStatus = async (workshopId, newStatus) => {
    try {
      setUpdating(workshopId);
      setError('');
      
      console.log('Updating workshop status:', { workshopId, newStatus });
      
      // Try relative path first, then absolute
       const response = await fetch(`${API_BASE_URL}/api/workshops/${workshopId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'admin-email': 'zconnect.admin@gmail.com'
        },
        body: JSON.stringify({ status: newStatus })
      });

      // If relative path fails, try absolute path
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        console.log('Trying absolute path for status update...');
        response = await fetch(`${API_BASE_URL}/api/workshops/${workshopId}/status`,  {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'admin-email': 'zconnect.admin@gmail.com'
          },
          body: JSON.stringify({ status: newStatus })
        });
      }

      console.log('Update response status:', response.status);
      console.log('Update response content-type:', response.headers.get('content-type'));

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse.substring(0, 200));
        alert('Server returned non-JSON response. Check server logs.');
        return;
      }

      if (response.ok) {
        const updatedWorkshop = await response.json();
        console.log('Workshop updated:', updatedWorkshop);
        
        setWorkshops(prev => prev.map(w => 
          w.id === workshopId ? { ...w, status: newStatus } : w
        ));
        alert(`Workshop ${newStatus} successfully!`);
      } else {
        const errorData = await response.json();
        console.error('Failed to update workshop status:', errorData);
        alert(`Failed to update workshop status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating workshop status:', error);
      alert(`Error updating workshop status: ${error.message}`);
    } finally {
      setUpdating(null);
    }
  };

  // Handle image load error
  const handleImageError = (workshopId) => {
    setImageErrors(prev => ({ ...prev, [workshopId]: true }));
  };

  // Image Modal Component
  const ImageModal = ({ src, alt, onClose }) => {
    if (!src) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div className="relative max-w-4xl max-h-full">
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
          >
            <FiXCircle size={32} />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const filteredWorkshops = workshops.filter(workshop => {
    if (filter === 'all') return true;
    return workshop.status === filter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mb-4" style={{ borderColor: '#AF5D73' }}></div>
        <div className="text-lg font-medium text-gray-700">Loading workshops...</div>
        <div className="text-sm text-gray-500 mt-2">
          Current URL: {window.location.href}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 text-xl mr-2" />
            <h3 className="text-lg font-bold text-red-800">Error Loading Workshops</h3>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-red-700 mt-2">
            {error}
          </pre>
        </div>
        
        {debugInfo && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <FiInfo className="text-blue-500 text-xl mr-2" />
              <h3 className="text-lg font-bold text-blue-800">Debug Information</h3>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-blue-700 mt-2">
              {debugInfo}
            </pre>
          </div>
        )}
        
        <div className="flex flex-wrap gap-4 mb-6">
                  <button 
          onClick={testApiEndpoint}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: '#AF5D73',
            color: 'white',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#8B4A5A'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#AF5D73'}
        >
          <FiDatabase className="mr-2" />
          Test Direct API Call
        </button>
        <button 
          onClick={fetchWorkshops}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: '#AF5D73',
            color: 'white',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#8B4A5A'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#AF5D73'}
        >
          <FiRefreshCw className="mr-2" />
          Retry Fetch
        </button>
        </div>
        
        <div className="text-sm space-y-2">
          <div>
            <span className="font-semibold">Current URL:</span> {window.location.href}
          </div>
          <div>
            <span className="font-semibold">Expected API URL:</span> http://localhost:5000/api/workshops
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FiSettings className="mr-3" style={{ color: '#AF5D73' }} />
          Workshop Management
        </h1>
        <button 
          onClick={fetchWorkshops}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: '#AF5D73',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#8B4A5A'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#AF5D73'}
        >
          <FiRefreshCw className="mr-2" />
          Refresh
        </button>
      </div>
      
      <div className="p-4 mb-8 rounded" style={{ backgroundColor: '#fdf2f8', borderLeft: '4px solid #AF5D73' }}>
        <div className="flex items-center">
          <FiInfo className="text-xl mr-2" style={{ color: '#AF5D73' }} />
          <span className="font-medium">
            Loaded {workshops.length} workshops successfully
          </span>
        </div>
      </div>
      
      {/* Filter buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="flex items-center text-sm font-medium text-gray-600">
          <FiFilter className="mr-2" /> Filter:
        </span>
        <button 
          onClick={() => setFilter('all')}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: filter === 'all' ? '#AF5D73' : '#f3f4f6',
            color: filter === 'all' ? 'white' : '#374151'
          }}
          onMouseOver={(e) => {
            if (filter !== 'all') e.target.style.backgroundColor = '#e5e7eb';
          }}
          onMouseOut={(e) => {
            if (filter !== 'all') e.target.style.backgroundColor = '#f3f4f6';
          }}
        >
          All ({workshops.length})
        </button>
        <button 
          onClick={() => setFilter('pending')}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: filter === 'pending' ? '#AF5D73' : '#f3f4f6',
            color: filter === 'pending' ? 'white' : '#374151'
          }}
          onMouseOver={(e) => {
            if (filter !== 'pending') e.target.style.backgroundColor = '#e5e7eb';
          }}
          onMouseOut={(e) => {
            if (filter !== 'pending') e.target.style.backgroundColor = '#f3f4f6';
          }}
        >
          <FiClock className="mr-2" />
          Pending ({workshops.filter(w => w.status === 'pending').length})
        </button>
        <button 
          onClick={() => setFilter('approved')}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: filter === 'approved' ? '#AF5D73' : '#f3f4f6',
            color: filter === 'approved' ? 'white' : '#374151'
          }}
          onMouseOver={(e) => {
            if (filter !== 'approved') e.target.style.backgroundColor = '#e5e7eb';
          }}
          onMouseOut={(e) => {
            if (filter !== 'approved') e.target.style.backgroundColor = '#f3f4f6';
          }}
        >
          <FiCheck className="mr-2" />
          Approved ({workshops.filter(w => w.status === 'approved').length})
        </button>
        <button 
          onClick={() => setFilter('rejected')}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: filter === 'rejected' ? '#AF5D73' : '#f3f4f6',
            color: filter === 'rejected' ? 'white' : '#374151'
          }}
          onMouseOver={(e) => {
            if (filter !== 'rejected') e.target.style.backgroundColor = '#e5e7eb';
          }}
          onMouseOut={(e) => {
            if (filter !== 'rejected') e.target.style.backgroundColor = '#f3f4f6';
          }}
        >
          <FiX className="mr-2" />
          Rejected ({workshops.filter(w => w.status === 'rejected').length})
        </button>
      </div>

      {/* Workshop list */}
      {filteredWorkshops.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FiAlertCircle className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No workshops found</h3>
          <p className="mt-2 text-gray-600">No workshops match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.map((workshop) => (
            <div 
              key={workshop.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {/* Workshop Image */}
              {workshop.image && !imageErrors[workshop.id] ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={() => handleImageError(workshop.id)}
                  />
                  <button
                    onClick={() => setSelectedImage({ src: workshop.image, alt: workshop.title })}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                    title="View full image"
                  >
                    <FiEye size={16} />
                  </button>
                </div>
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FiImage size={48} className="mx-auto mb-2" />
                    <span className="text-sm">
                      {workshop.image ? 'Failed to load image' : 'No image available'}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {workshop.title}
                  </h3>
                  <span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: '#fdf2f8',
                      color: '#AF5D73',
                      border: '1px solid #AF5D73'
                    }}
                  >
                    {workshop.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {workshop.description}
                </p>
                
                <div className="space-y-3 text-sm text-gray-700 mb-6">
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" style={{ color: '#AF5D73' }} />
                    <span>
                      <span className="font-semibold">Date:</span> {workshop.date ? new Date(workshop.date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-2" style={{ color: '#AF5D73' }} />
                    <span>
                      <span className="font-semibold">Time:</span> {workshop.time || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiMapPin className="mr-2" style={{ color: '#AF5D73' }} />
                    <span>
                      <span className="font-semibold">Location:</span> {workshop.location || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="mr-2" style={{ color: '#AF5D73' }} />
                    <span>
                      <span className="font-semibold">Capacity:</span> {workshop.capacity || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiTag className="mr-2" style={{ color: '#AF5D73' }} />
                    <span>
                      <span className="font-semibold">Category:</span> {workshop.category_name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiUser className="mr-2" style={{ color: '#AF5D73' }} />
                    <span>
                      <span className="font-semibold">Staff ID:</span> {workshop.created_by || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {workshop.status !== 'approved' && (
                    <button
                      onClick={() => updateWorkshopStatus(workshop.id, 'approved')}
                      disabled={updating === workshop.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: updating === workshop.id ? 'not-allowed' : 'pointer',
                        backgroundColor: updating === workshop.id ? '#f3f4f6' : '#AF5D73',
                        color: 'white'
                      }}
                      onMouseOver={(e) => {
                        if (updating !== workshop.id) e.target.style.backgroundColor = '#8B4A5A';
                      }}
                      onMouseOut={(e) => {
                        if (updating !== workshop.id) e.target.style.backgroundColor = '#AF5D73';
                      }}
                    >
                      <FiCheck className="mr-2" />
                      {updating === workshop.id ? 'Processing...' : 'Approve'}
                    </button>
                  )}
                  {workshop.status !== 'rejected' && (
                    <button
                      onClick={() => updateWorkshopStatus(workshop.id, 'rejected')}
                      disabled={updating === workshop.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: updating === workshop.id ? 'not-allowed' : 'pointer',
                        backgroundColor: updating === workshop.id ? '#f3f4f6' : '#AF5D73',
                        color: 'white'
                      }}
                      onMouseOver={(e) => {
                        if (updating !== workshop.id) e.target.style.backgroundColor = '#8B4A5A';
                      }}
                      onMouseOut={(e) => {
                        if (updating !== workshop.id) e.target.style.backgroundColor = '#AF5D73';
                      }}
                    >
                      <FiX className="mr-2" />
                      {updating === workshop.id ? 'Processing...' : 'Reject'}
                    </button>
                  )}
                  {workshop.status === 'rejected' && (
                    <button
                      onClick={() => updateWorkshopStatus(workshop.id, 'pending')}
                      disabled={updating === workshop.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: updating === workshop.id ? 'not-allowed' : 'pointer',
                        backgroundColor: updating === workshop.id ? '#f3f4f6' : '#AF5D73',
                        color: 'white'
                      }}
                      onMouseOver={(e) => {
                        if (updating !== workshop.id) e.target.style.backgroundColor = '#8B4A5A';
                      }}
                      onMouseOut={(e) => {
                        if (updating !== workshop.id) e.target.style.backgroundColor = '#AF5D73';
                      }}
                    >
                      <FiClock className="mr-2" />
                      {updating === workshop.id ? 'Processing...' : 'Mark Pending'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default ManageWorkshops;