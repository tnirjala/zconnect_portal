import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Heart,
  Filter,
  Search,
  Loader,
  X
} from 'lucide-react';

const RegisterWorkshop = () => {
  const [workshops, setWorkshops] = useState([]);
  const [userWorkshops, setUserWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeView, setActiveView] = useState('available');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [registering, setRegistering] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [workshopToCancel, setWorkshopToCancel] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;



  useEffect(() => {
    fetchWorkshops();
    fetchUserWorkshops();
    fetchCategories();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/workshops/approved`);
      if (!response.ok) throw new Error('Failed to fetch workshops');
      const data = await response.json();
      setWorkshops(data);
    } catch (err) {
      setError('Failed to load workshops. Please try again.');
      console.error('Error fetching workshops:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserWorkshops = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/workshops/my-workshops`, {
        headers: {
          'user-email': user.email || ''
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user workshops');
      const data = await response.json();
      setUserWorkshops(data);
    } catch (err) {
      console.error('Error fetching user workshops:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleRegister = async (workshopId) => {
    if (!user.name || !user.email) {
      setError('Please ensure your profile has name and email information.');
      return;
    }

    setRegistering(workshopId);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/workshops/${workshopId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Successfully registered for the workshop!');
      fetchWorkshops();
      fetchUserWorkshops();
    } catch (err) {
      setError(err.message);
    } finally {
      setRegistering(null);
    }
  };

  const handleCancelConfirmation = (workshopId) => {
    setWorkshopToCancel(workshopId);
    setShowCancelModal(true);
  };

  const handleCancelRegistration = async () => {
    if (!workshopToCancel) return;

    try {
      const response = await fetch(`${API_BASE_URL}/workshops/${workshopToCancel}/register`, {
        method: 'DELETE',
        headers: {
          'user-email': user.email || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Cancellation failed');
      }

      setSuccess('Registration cancelled successfully!');
      fetchWorkshops();
      fetchUserWorkshops();
    } catch (err) {
      setError(err.message);
    } finally {
      setShowCancelModal(false);
      setWorkshopToCancel(null);
    }
  };

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesCategory = selectedCategory === 'all' || workshop.category_id?.toString() === selectedCategory;
    const matchesSearch = workshop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.category_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isRegistered = (workshopId) => {
    return userWorkshops.some(uw => uw.id === workshopId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const WorkshopCard = ({ workshop, showActions = true }) => {
    const registered = isRegistered(workshop.id);
    const isFull = workshop.registered_count >= workshop.capacity;
    const isPast = new Date(workshop.date) < new Date();

    return (
      <div className="bg-white bg-opacity-95 rounded-lg shadow-md border border-pink-200 overflow-hidden hover:shadow-lg transition-shadow">
        {workshop.image && (
          <div className="h-48 overflow-hidden">
            <img 
              src={workshop.image} 
              alt={workshop.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-pink-800 mb-2">{workshop.title}</h3>
              {workshop.category_name && (
                <span className="inline-block bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full mb-2">
                  {workshop.category_name}
                </span>
              )}
            </div>
            {registered && (
              <CheckCircle className="text-green-500 ml-2" size={24} />
            )}
          </div>

          <p className="text-gray-600 mb-4 line-clamp-3">{workshop.description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center" style={{ color: '#8B3A4A' }}>
              <Calendar size={16} className="mr-2" />
              <span className="text-sm">{formatDate(workshop.date)}</span>
            </div>
            
            <div className="flex items-center" style={{ color: '#8B3A4A' }}>
              <Clock size={16} className="mr-2" />
              <span className="text-sm">{workshop.time}</span>
            </div>
            
            <div className="flex items-center" style={{ color: '#8B3A4A' }}>
              <MapPin size={16} className="mr-2" />
              <span className="text-sm">{workshop.location}</span>
            </div>
            
            <div className="flex items-center" style={{ color: '#8B3A4A' }}>
              <Users size={16} className="mr-2" />
              <span className="text-sm">
                {workshop.registered_count || 0} / {workshop.capacity} registered
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Registration Progress</span>
              <span>{Math.round(((workshop.registered_count || 0) / workshop.capacity) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  isFull ? 'bg-red-500' : 'bg-pink-500'
                }`}
                style={{ 
                  width: `${Math.min(((workshop.registered_count || 0) / workshop.capacity) * 100, 100)}%` 
                }}
              />
            </div>
          </div>

          {showActions && (
            <div className="flex gap-2">
              {registered ? (
                <button
                  onClick={() => handleCancelConfirmation(workshop.id)}
                  disabled={isPast}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isPast 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                  }`}
                >
                  {isPast ? 'Workshop Completed' : 'Cancel Registration'}
                </button>
              ) : (
                <button
                  onClick={() => handleRegister(workshop.id)}
                  disabled={isFull || isPast || registering === workshop.id}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isFull || isPast
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-pink-600 text-white hover:bg-pink-700'
                  }`}
                >
                  {registering === workshop.id ? (
                    <div className="flex items-center justify-center">
                      <Loader className="animate-spin mr-2" size={16} />
                      Registering...
                    </div>
                  ) : isFull ? 'Fully Booked' : isPast ? 'Workshop Ended' : 'Register Now'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-pink-50 rounded-lg">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-pink-600" size={48} />
          <p className="text-pink-700">Loading workshops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white bg-opacity-95 rounded-lg p-6 max-w-md w-full" style={{ border: '1px solid rgba(186, 80, 102, 0.2)' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold" style={{ color: '#8B3A4A' }}>Confirm Cancellation</h3>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6 text-gray-600">Are you sure you want to cancel your registration for this workshop?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelRegistration}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="text-pink-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#8B3A4A' }}>Workshop Registration</h1>
            <p className="text-pink-600">Join our community workshops for youth violence prevention</p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
          <XCircle className="text-red-500 mr-3" size={20} />
          <span className="text-red-700">{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <XCircle size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
          <CheckCircle className="text-green-500 mr-3" size={20} />
          <span className="text-green-700">{success}</span>
          <button 
            onClick={() => setSuccess('')}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* View Toggle */}
      <div className="mb-6 flex space-x-1 bg-pink-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveView('available')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'available'
              ? 'bg-white text-pink-800 shadow-sm'
              : 'text-pink-600 hover:text-pink-800'
          }`}
        >
          Available Workshops ({filteredWorkshops.length})
        </button>
        <button
          onClick={() => setActiveView('registered')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'registered'
              ? 'bg-white text-pink-800 shadow-sm'
              : 'text-pink-600 hover:text-pink-800'
          }`}
        >
          My Registrations ({userWorkshops.length})
        </button>
      </div>

      {/* Filters */}
      {activeView === 'available' && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white bg-opacity-90"
                style={{ color: '#8B3A4A' }}
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white bg-opacity-90"
              style={{ color: '#8B3A4A' }}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id.toString()}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      {activeView === 'available' ? (
        <div>
          {filteredWorkshops.length === 0 ? (
            <div className="text-center py-12 bg-white bg-opacity-95 rounded-lg border border-pink-200">
              <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No workshops found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No workshops are currently available for registration.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map(workshop => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {userWorkshops.length === 0 ? (
            <div className="text-center py-12 bg-white bg-opacity-95 rounded-lg border border-pink-200">
              <Heart className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No registrations yet</h3>
              <p className="text-gray-500 mb-4">You haven't registered for any workshops yet.</p>
              <button
                onClick={() => setActiveView('available')}
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
              >
                Browse Available Workshops
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userWorkshops.map(workshop => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegisterWorkshop;