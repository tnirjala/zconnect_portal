import React, { useEffect, useState } from 'react';

const EditProfile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    dob: '',
    bio: '',
    profilePicture: null
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.profile?.phone || '',
        gender: user.profile?.gender || '',
        dob: user.profile?.dob ? user.profile.dob.split('T')[0] : '',
        bio: user.profile?.bio || '',
        profilePicture: null
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('gender', formData.gender);
      data.append('dob', formData.dob);
      data.append('bio', formData.bio);
      if (formData.profilePicture) {
        data.append('profilePicture', formData.profilePicture);
      }

      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'PUT',
        headers: {
          'user-id': user.id.toString()
        },
        body: data
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setUser(result.user);
        setSuccess('Profile updated successfully!');
      } else {
        setError(result.error || 'Update failed');
      }
    } catch (err) {
      console.error('Update failed:', err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-md border" 
         style={{ 
           backgroundColor: 'rgba(255, 255, 255, 0.95)',
           borderColor: 'rgba(186, 80, 102, 0.2)'
         }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: '#8B3A4A' }}>Edit Profile</h2>

      {success && (
        <p className="mb-2 p-3 rounded-md" 
           style={{ 
             color: '#047857', 
             backgroundColor: 'rgba(16, 185, 129, 0.1)',
             border: '1px solid rgba(16, 185, 129, 0.2)'
           }}>
          {success}
        </p>
      )}
      {error && (
        <p className="mb-2 p-3 rounded-md" 
           style={{ 
             color: '#dc2626', 
             backgroundColor: 'rgba(239, 68, 68, 0.1)',
             border: '1px solid rgba(239, 68, 68, 0.2)'
           }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#8B3A4A' }}>
            Name
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md p-3 transition-colors"
            style={{ 
              border: '1px solid rgba(186, 80, 102, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#8B3A4A'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#BA5066';
              e.target.style.outline = '0 0 0 3px rgba(186, 80, 102, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(186, 80, 102, 0.3)';
              e.target.style.outline = 'none';
            }}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#8B3A4A' }}>
            Phone
          </label>
          <input
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md p-3 transition-colors"
            style={{ 
              border: '1px solid rgba(186, 80, 102, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#8B3A4A'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#BA5066';
              e.target.style.outline = '0 0 0 3px rgba(186, 80, 102, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(186, 80, 102, 0.3)';
              e.target.style.outline = 'none';
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#8B3A4A' }}>
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md p-3 transition-colors"
            style={{ 
              border: '1px solid rgba(186, 80, 102, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#8B3A4A'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#BA5066';
              e.target.style.outline = '0 0 0 3px rgba(186, 80, 102, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(186, 80, 102, 0.3)';
              e.target.style.outline = 'none';
            }}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#8B3A4A' }}>
            Date of Birth
          </label>
          <input
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md p-3 transition-colors"
            style={{ 
              border: '1px solid rgba(186, 80, 102, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#8B3A4A'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#BA5066';
              e.target.style.outline = '0 0 0 3px rgba(186, 80, 102, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(186, 80, 102, 0.3)';
              e.target.style.outline = 'none';
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#8B3A4A' }}>
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md p-3 transition-colors resize-vertical"
            style={{ 
              border: '1px solid rgba(186, 80, 102, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#8B3A4A',
              minHeight: '80px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#BA5066';
              e.target.style.outline = '0 0 0 3px rgba(186, 80, 102, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(186, 80, 102, 0.3)';
              e.target.style.outline = 'none';
            }}
            rows="3"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#8B3A4A' }}>
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full p-3 rounded-md transition-colors"
            style={{ 
              border: '1px solid rgba(186, 80, 102, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#8B3A4A'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#BA5066';
              e.target.style.outline = '0 0 0 3px rgba(186, 80, 102, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(186, 80, 102, 0.3)';
              e.target.style.outline = 'none';
            }}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-md font-medium text-white transition-colors"
            style={{ 
              backgroundColor: loading ? 'rgba(186, 80, 102, 0.6)' : '#BA5066',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#8B3A4A';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#BA5066';
              }
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;