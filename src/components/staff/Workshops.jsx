import React, { useEffect, useState } from 'react';

const API_BASE = `${process.env.REACT_APP_API_URL}/api`;

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    category_id: '',
    image: ''
  });

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.id;

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/workshops`, {
        headers: {
          'staff-id': userId
        }
      });
      const data = await res.json();
      setWorkshops(data || []);
    } catch (error) {
      console.error('Error fetching workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchWorkshops();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Please select an image smaller than 5MB');
        return;
      }
      const compressed = await compressImage(file);
      setFormData(prev => ({ ...prev, image: compressed }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const required = ['title', 'description', 'date', 'time', 'location', 'capacity', 'category_id'];
    for (let field of required) {
      if (!formData[field]) {
        setError(`Please fill the ${field}`);
        return;
      }
    }

    const body = {
      ...formData,
      capacity: parseInt(formData.capacity),
    };

    const url = editingId ? `${API_BASE}/workshops/${editingId}` : `${API_BASE}/workshops`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'staff-id': userId
        },
        body: JSON.stringify(body)
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(editingId ? 'Workshop updated!' : 'Workshop created!');
        resetForm();
        fetchWorkshops();
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      capacity: '',
      category_id: '',
      image: ''
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  const handleEdit = (workshop) => {
    setFormData({
      title: workshop.title,
      description: workshop.description,
      date: workshop.date.split('T')[0],
      time: workshop.time,
      location: workshop.location,
      capacity: workshop.capacity,
      category_id: workshop.category_id,
      image: workshop.image || ''
    });
    setEditingId(workshop.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return;
    try {
      const res = await fetch(`${API_BASE}/workshops/${id}`, {
        method: 'DELETE',
        headers: {
          'staff-id': userId
        }
      });

      if (res.ok) {
        setSuccess('Deleted successfully');
        fetchWorkshops();
      } else {
        const result = await res.json();
        setError(result.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Workshop Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Workshop
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingId ? 'Edit Workshop' : 'New Workshop'}
              </h2>
              <button 
                onClick={resetForm} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                <p>{success}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="Workshop title" 
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Detailed description of the workshop" 
                  rows="4"
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Time</label>
                  <input 
                    type="time" 
                    name="time" 
                    value={formData.time} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  placeholder="Workshop venue" 
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Capacity</label>
                <input 
                  type="number" 
                  name="capacity" 
                  value={formData.capacity} 
                  onChange={handleInputChange} 
                  placeholder="Maximum attendees" 
                  min="1"
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                <select 
                  name="category_id" 
                  value={formData.category_id} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400" 
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Workshop Image</label>
                <div className="mt-1 flex items-center">
                  <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <span className="ml-3 text-sm text-gray-500">Max 5MB</span>
                </div>
                {formData.image && (
                  <div className="mt-4">
                    <img src={formData.image} alt="Preview" className="h-48 w-full object-contain rounded-lg border border-gray-200" />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  onClick={handleSubmit}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  {editingId ? 'Update Workshop' : 'Create Workshop'}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Workshops</h2>
            {workshops.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow border border-gray-200 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No workshops found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new workshop.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Create Workshop
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workshops.map(ws => (
                  <div key={ws.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                    {ws.image && (
                      <div className="h-48 overflow-hidden">
                        <img src={ws.image} alt={ws.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{ws.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ws.status === 'approved' ? 'bg-green-100 text-green-800' :
                          ws.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ws.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ws.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-700 mb-4">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(ws.date).toLocaleDateString()} at {ws.time}
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {ws.location}
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Capacity: {ws.capacity} attendees
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => handleEdit(ws)} 
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(ws.id)} 
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workshops;