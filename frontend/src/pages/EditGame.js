import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import MapComponent from '../components/MapComponent';
import './EditGame.css';

const EditGame = ({ id }) => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState('');

  const handleMapClick = (lat, lng) => {
    setSelectedLocation({ lat, lng });
  };

  const handleAddressChange = (value) => {
    setAddress(value);
  };

  const handleSubmit = (values) => {
    // Handle form submission
  };

  return (
    <div className="edit-game-page">
      <div className="page-header">
        <h1>Edit Game</h1>
      </div>

      <div className="form-container">
        <Formik
          initialValues={{
            title: '',
            sport: '',
            skillLevel: '',
            maxPlayers: 0,
            status: 'scheduled',
            location: { lat: 0, lng: 0 }
          }}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <Field type="text" id="title" name="title" />
                <ErrorMessage name="title" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="sport">Sport</label>
                <Field as="select" id="sport" name="sport">
                  <option value="">Select a sport</option>
                  <option value="soccer">Soccer</option>
                  <option value="basketball">Basketball</option>
                  <option value="volleyball">Volleyball</option>
                </Field>
                <ErrorMessage name="sport" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="skillLevel">Skill Level</label>
                <Field as="select" id="skillLevel" name="skillLevel">
                  <option value="">Select a skill level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Field>
                <ErrorMessage name="skillLevel" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="maxPlayers">Maximum Players</label>
                <Field
                  type="number"
                  id="maxPlayers"
                  name="maxPlayers"
                  min={values.participants.length}
                />
                <ErrorMessage name="maxPlayers" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <Field as="select" id="status" name="status">
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Field>
                <ErrorMessage name="status" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label>Location</label>
                <p className="map-instructions">Click on the map to change location</p>
                <MapComponent
                  height="300px"
                  center={selectedLocation}
                  onClick={handleMapClick}
                  markers={selectedLocation ? [
                    {
                      id: 'selected',
                      lat: selectedLocation.lat,
                      lng: selectedLocation.lng,
                      title: 'Selected Location'
                    }
                  ] : []}
                />
                {selectedLocation && (
                  <div className="selected-location">
                    <p><strong>Selected Address:</strong> {address}</p>
                  </div>
                )}
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  Update Game
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => navigate(`/games/${id}`)}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditGame; 