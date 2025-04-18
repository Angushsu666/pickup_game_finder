import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const initialValues = {
    name: user?.name || '',
    bio: user?.bio || '',
    interests: user?.interests || [],
    skillLevel: user?.skillLevel || 'intermediate'
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    bio: Yup.string(),
    interests: Yup.array().min(1, 'Select at least one interest'),
    skillLevel: Yup.string().required('Skill level is required')
  });

  const handleSubmit = async (values) => {
    const result = await updateProfile(values);
    
    if (result.success) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>
        
        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h2>{user?.name}</h2>
                <p className="profile-email">{user?.email}</p>
              </div>
              <button 
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
            
            <div className="profile-details">
              <div className="profile-section">
                <h3>Bio</h3>
                <p>{user?.bio || 'No bio provided'}</p>
              </div>
              
              <div className="profile-section">
                <h3>Interests</h3>
                <div className="interests-list">
                  {user?.interests?.map(interest => (
                    <span key={interest} className="interest-tag">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Skill Level</h3>
                <p className="skill-level">{user?.skillLevel}</p>
              </div>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                  />
                  <ErrorMessage name="name" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <Field
                    as="textarea"
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself"
                  />
                  <ErrorMessage name="bio" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label>Interests</label>
                  <div className="checkbox-group">
                    <label>
                      <Field type="checkbox" name="interests" value="soccer" />
                      Soccer
                    </label>
                    <label>
                      <Field type="checkbox" name="interests" value="basketball" />
                      Basketball
                    </label>
                    <label>
                      <Field type="checkbox" name="interests" value="volleyball" />
                      Volleyball
                    </label>
                  </div>
                  <ErrorMessage name="interests" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="skillLevel">Skill Level</label>
                  <Field as="select" id="skillLevel" name="skillLevel">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Field>
                  <ErrorMessage name="skillLevel" component="div" className="error-message" />
                </div>

                <div className="form-buttons">
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default Profile; 