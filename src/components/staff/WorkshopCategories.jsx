import React, { useState, useEffect } from 'react';

const WorkshopCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  // Get logged-in user data
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const userId = userData.id;
  const userName = userData.name || 'Unknown User';
  const API_BASE_URL = process.env.REACT_APP_API_URL;

const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setCategories(data);
    } else {
      setError('Failed to fetch categories');
    }
  } catch (err) {
    setError('Network error occurred');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!userId) {
      setError('User not logged in properly. Please login again.');
      return;
    }

    try {
    const url = editingCategory
      ? `${API_BASE_URL}/api/categories/${editingCategory.id}`
      : `${API_BASE_URL}/api/categories`;

      const method = editingCategory ? 'PUT' : 'POST';

      // For creating new categories, add the logged-in user's ID
      const bodyData = { ...formData };
      if (!editingCategory) {
        bodyData.created_by = userId;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        setFormData({ title: '', description: '' });
        setEditingCategory(null);
        fetchCategories();
      } else {
        setError(data.error || 'Operation failed');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      title: category.title,
      description: category.description || ''
    });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Category deleted successfully!');
        fetchCategories();
      } else {
        setError(data.error || 'Delete failed');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setFormData({ title: '', description: '' });
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-10 text-gray-700 text-lg">
            Loading categories...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Workshop Categories
          </h1>
          <p className="text-lg text-gray-600 opacity-80">
            Manage workshop categories for better organization
          </p>
        </div>

        {/* Form */}
        <div className="bg-white backdrop-blur-sm p-8 rounded-2xl shadow-xl mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingCategory ? 'Edit Category' : 'Create New Category'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Enter category title"
                required
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-vertical"
                rows="4"
                placeholder="Enter category description"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>

              {editingCategory && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {category.title}
              </h3>

              {category.description && (
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {category.description}
                </p>
              )}

              <div className="text-sm text-gray-500 mb-4">
                <p>Created by: {category.created_by_name || 'Unknown'}</p>
                <p>Date: {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'Unknown'}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(category.id)}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No categories found. Create your first category above!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopCategories;