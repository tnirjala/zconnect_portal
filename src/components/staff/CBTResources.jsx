import React, { useEffect, useState, useRef } from 'react';

const API_BASE = 'http://localhost:5000/api';

const CBTResources = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [resourceType, setResourceType] = useState('video');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [viewMode, setViewMode] = useState(false);
  const [uploadedResources, setUploadedResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const fileInputRef = useRef(null);

  // Load categories on mount from API
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Compress image if uploaded, return base64 compressed data URL
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        resolve(null);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const fetchResources = async () => {
    try {
      const staffId = JSON.parse(localStorage.getItem('user'))?.id || '';
      const res = await fetch(`${API_BASE}/cbt-resources`, {
        headers: { 'staff-id': staffId }
      });
      const data = await res.json();
      setUploadedResources(data);
    } catch (err) {
      console.error('Error fetching uploaded resources:', err);
    }
  };

  // Handle edit button click - populate form fields for editing
  const handleEditClick = (resource) => {
    setEditingResource(resource);
    setNewCategory(resource.title || '');
    setSelectedCategory('');
    setResourceType(resource.type);
    setDescription(resource.description || '');

    if (resource.type === 'link') {
      setLink(resource.file_url || '');
      setFile(null);
      setFilePreview(null);
    } else {
      setLink('');
      setFile(null);
      setFilePreview(`http://localhost:5000${resource.file_url}`);
    }
  };

  // Handle file input change
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      setFilePreview(null);
      return;
    }

    if (resourceType === 'image' && selectedFile.size > 5 * 1024 * 1024) {
      setError('Please select an image smaller than 5MB');
      setFile(null);
      setFilePreview(null);
      return;
    }

    setError('');
    setFile(selectedFile);

    if (resourceType === 'image') {
      const compressed = await compressImage(selectedFile);
      if (compressed) {
        setFilePreview(compressed);
      } else {
        setFilePreview(URL.createObjectURL(selectedFile));
      }
    } else {
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  // Handle form submit - upload or update resource
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setUploading(true);

    if (!selectedCategory && !newCategory.trim()) {
      setError('Please select or create a category.');
      setUploading(false);
      return;
    }

    if (resourceType !== 'link' && !file && !editingResource) {
      setError('Please upload a file for the selected resource type.');
      setUploading(false);
      return;
    }

    if (resourceType === 'link' && !link.trim()) {
      setError('Please provide a valid link.');
      setUploading(false);
      return;
    }

    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.id || '';

      if (editingResource) {
        const payload = {
          id: editingResource.id,
          title: newCategory || selectedCategory,
          type: resourceType,
          description,
          file_url: editingResource.file_url,
        };

        if (resourceType === 'link') {
          payload.file_url = link.trim();
        }

        if (file) {
          const formData = new FormData();
          formData.append('category', newCategory || selectedCategory);
          formData.append('type', resourceType);
          formData.append('description', description);
          formData.append('file', file);

          const uploadRes = await fetch(`${API_BASE}/cbt-resources/upload-file`, {
            method: 'POST',
            headers: {
              'staff-id': userId,
            },
            body: formData,
          });

          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadData.error || 'File upload failed');

          payload.file_url = uploadData.file_url;
        }

        const res = await fetch(`${API_BASE}/cbt-resources/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'staff-id': userId,
          },
          body: JSON.stringify(payload),
        });

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          throw new Error(`Server returned non-JSON response: ${text}`);
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update failed');

        setSuccessMsg('Resource updated successfully!');
        setEditingResource(null);
      } else {
        if (resourceType === 'link') {
          const res = await fetch(`${API_BASE}/cbt-resources/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'staff-id': userId,
            },
            body: JSON.stringify({
              category: newCategory || selectedCategory,
              type: resourceType,
              description,
              link: link.trim(),
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Upload failed');
        } else {
          const formData = new FormData();
          formData.append('category', newCategory || selectedCategory);
          formData.append('type', resourceType);
          formData.append('description', description);
          formData.append('file', file);

          const res = await fetch(`${API_BASE}/cbt-resources/upload-file`, {
            method: 'POST',
            headers: {
              'staff-id': userId,
            },
            body: formData,
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Upload failed');
        }

        setSuccessMsg('Resource uploaded successfully!');
      }

      setFile(null);
      setFilePreview(null);
      setLink('');
      setDescription('');
      setNewCategory('');
      setSelectedCategory('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (viewMode) {
        fetchResources();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      const res = await fetch(`${API_BASE}/cbt-resources/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchResources();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleCancel = () => {
    setEditingResource(null);
    setFile(null);
    setFilePreview(null);
    setLink('');
    setDescription('');
    setNewCategory('');
    setSelectedCategory('');
    setError('');
    setSuccessMsg('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {editingResource ? 'Edit CBT Resource' : 'Upload CBT Resource'}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
            {successMsg}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
                setSelectedCategory('');
              }}
              placeholder="Enter category name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Resource Type</label>
            <select
              value={resourceType}
              onChange={(e) => {
                setResourceType(e.target.value);
                setFile(null);
                setFilePreview(null);
                setLink('');
              }}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
            </select>
          </div>

          {resourceType === 'link' ? (
            <div>
              <label className="block font-medium text-gray-700 mb-2">Resource Link</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={resourceType === 'link'}
              />
            </div>
          ) : (
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Upload {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept={
                  resourceType === 'video'
                    ? 'video/*'
                    : resourceType === 'pdf'
                    ? 'application/pdf'
                    : resourceType === 'image'
                    ? 'image/*'
                    : '*/*'
                }
                onChange={handleFileChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={!editingResource}
              />

              {filePreview && (
                <div className="mt-4">
                  {resourceType === 'image' ? (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="h-48 w-full object-contain rounded-lg border border-gray-200"
                    />
                  ) : resourceType === 'video' ? (
                    <video controls className="w-full max-h-64 rounded-lg border border-gray-200">
                      <source src={filePreview} />
                      Your browser does not support the video tag.
                    </video>
                  ) : resourceType === 'pdf' ? (
                    <embed src={filePreview} type="application/pdf" width="100%" height="400px" className="rounded-lg border border-gray-200" />
                  ) : null}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block font-medium text-gray-700 mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description about the resource"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editingResource ? 'Updating...' : 'Uploading...'}
                </span>
              ) : (
                editingResource ? 'Update Resource' : 'Upload Resource'
              )}
            </button>

            {editingResource && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-4 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            className={`px-6 py-2 rounded-lg transition-all ${
              viewMode 
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
            }`}
            onClick={() => {
              setViewMode(true);
              fetchResources();
            }}
          >
            View Resources
          </button>
        </div>

        {viewMode && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Uploaded Resources</h2>
            {uploadedResources.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No resources uploaded yet.</p>
            ) : (
              <div className="space-y-4">
                {uploadedResources.map((res) => (
                  <div key={res.id} className="p-6 bg-white shadow-sm rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-semibold text-gray-800">Title: {res.title}</p>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        res.status === 'approved' ? 'bg-green-100 text-green-700' :
                        res.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Type: {res.type}</p>

                    {res.type === 'image' && (
                      <img
                        src={`http://localhost:5000${res.file_url}`}
                        alt="Uploaded"
                        className="h-48 object-contain rounded-lg border border-gray-200"
                      />
                    )}

                    {res.type === 'video' && (
                      <video controls className="w-full max-h-64 rounded-lg border border-gray-200">
                        <source src={`http://localhost:5000${res.file_url}`} />
                      </video>
                    )}

                    {res.type === 'pdf' && (
                      <embed
                        src={`http://localhost:5000${res.file_url}`}
                        type="application/pdf"
                        width="100%"
                        height="400px"
                        className="rounded-lg border border-gray-200"
                      />
                    )}

                    {res.type === 'link' && (
                      <a href={res.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                        {res.file_url}
                      </a>
                    )}

                    {res.description && (
                      <p className="mt-4 text-gray-700">{res.description}</p>
                    )}

                    <div className="flex gap-3 mt-6">
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                        onClick={() => handleEditClick(res)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all"
                        onClick={() => handleDelete(res.id)}
                      >
                        Delete
                      </button>
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

export default CBTResources;