import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CBTResourcesAdmin = () => {
  const [resources, setResources] = useState([]);

  const fetchResources = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cbt-resources/all', {
        headers: {
          'admin-email': 'zconnect.admin@gmail.com',
        },
      });
      console.log('Fetched resources:', res.data);
      setResources(res.data);
    } catch (error) {
      console.error('Failed to fetch CBT resources:', error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/cbt-resources/${id}/status`,
        { status },
        {
          headers: {
            'admin-email': 'zconnect.admin@gmail.com',
          },
        }
      );
      fetchResources(); // Refresh resources after update
    } catch (error) {
      console.error('Failed to update resource status:', error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

   return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: '#fdf2f8' }}>
      <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#AF5D73' }}>
        CBT Resources
      </h2>

      {resources.length === 0 ? (
        <p className="text-center text-gray-600">No CBT resources found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white p-4 shadow-md rounded border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-2">{res.title}</h3>
              <p className="text-sm text-gray-700">Type: {res.type}</p>
              <p className="text-sm text-gray-700 mb-2">Status: {res.status}</p>

              {res.type === 'image' && (
                <img
                  src={`http://localhost:5000${res.file_url}`}
                  alt={res.title}
                  className="w-full h-48 object-contain mb-3"
                />
              )}

              {res.type === 'video' && (
                <video controls className="w-full mb-3">
                  <source src={`http://localhost:5000${res.file_url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {res.type === 'pdf' && (
                <a
                  href={`http://localhost:5000${res.file_url}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#AF5D73', textDecoration: 'underline' }}
                  onMouseOver={(e) => e.target.style.color = '#8B4A5A'}
                  onMouseOut={(e) => e.target.style.color = '#AF5D73'}
                >
                  View PDF
                </a>
              )}

              {res.type === 'link' && (
                <a
                  href={res.file_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#AF5D73', textDecoration: 'underline' }}
                  onMouseOver={(e) => e.target.style.color = '#8B4A5A'}
                  onMouseOut={(e) => e.target.style.color = '#AF5D73'}
                >
                  Visit Link
                </a>
              )}

{res.status === 'pending' && (
  <div className="mt-4 flex justify-between">
    <button
      onClick={() => handleUpdateStatus(res.id, 'rejected')}
      style={{
        backgroundColor: '#AF5D73',
        color: 'white',
        padding: '4px 16px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#8B4A5A'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#AF5D73'}
    >
      Reject
    </button>
    <button
      onClick={() => handleUpdateStatus(res.id, 'approved')}
      style={{
        backgroundColor: '#AF5D73',
        color: 'white',
        padding: '4px 16px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#8B4A5A'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#AF5D73'}
    >
      Approve
    </button>
  </div>
)}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CBTResourcesAdmin;
