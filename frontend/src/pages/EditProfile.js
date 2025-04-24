import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/userService';
import { toast } from 'react-toastify';
import './EditProfile.css';

const EditProfile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: {
      city: '',
      state: ''
    },
    interests: [],
    skillLevel: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: {
          city: user.location?.city || '',
          state: user.location?.state || ''
        },
        interests: user.interests || [],
        skillLevel: user.skillLevel || 'beginner'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        interests: [...formData.interests, value]
      });
    } else {
      setFormData({
        ...formData,
        interests: formData.interests.filter(interest => interest !== value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        await refreshUser();
        toast.success('Profile updated successfully');
        navigate('/profile');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <h1>Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />
            <small>Email cannot be changed</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location.city">City</label>
              <input
                type="text"
                id="location.city"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location.state">State</label>
              <input
                type="text"
                id="location.state"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Interests</label>
            <div className="interests-checkboxes">
              {['soccer', 'basketball', 'volleyball', 'tennis', 'baseball', 'football'].map(sport => (
                <div key={sport} className="interest-checkbox">
                  <input
                    type="checkbox"
                    id={`interest-${sport}`}
                    value={sport}
                    checked={formData.interests.includes(sport)}
                    onChange={handleInterestChange}
                  />
                  <label htmlFor={`interest-${sport}`}>{sport.charAt(0).toUpperCase() + sport.slice(1)}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="skillLevel">Skill Level</label>
            <select
              id="skillLevel"
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/profile')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile; 