import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createGame } from '../services/gameService';
import MapComponent from '../components/MapComponent';
import { toast } from 'react-toastify';
import './GameForm.css';

const CreateGame = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState('');

  const initialValues = {
    title: '',
    sport: 'soccer',
    description: '',
    date: new Date(),
    duration: 60,
    skillLevel: 'all',
    maxPlayers: 10
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    sport: Yup.string().required('Sport is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.date().required('Date is required').min(new Date(), 'Date must be in the future'),
    duration: Yup.number().required('Duration is required').positive('Duration must be positive'),
    skillLevel: Yup.string().required('Skill level is required'),
    maxPlayers: Yup.number().required('Max players is required').min(2, 'At least 2 players required')
  });

  const handleMapClick = (location) => {
    setSelectedLocation(location);

    // Get address from coordinates using Geocoding API
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        setAddress('Unknown location');
      }
    });
  };

  const handleSubmit = async (values) => {
    if (!selectedLocation) {
      toast.error('Please select a location on the map');
      return;
    }

    const gameData = {
      ...values,
      location: {
        type: 'Point',
        coordinates: [selectedLocation.lng, selectedLocation.lat],
        address
      }
    };

    const result = await createGame(gameData);

    if (result.success) {
      toast.success('Game created successfully!');
      navigate(`/games/${result.data._id}`);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="create-game-page">
      <div className="form-container">
        <h1>Create a New Game</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="game-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Give your game a name"
                />
                <ErrorMessage name="title" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="sport">Sport</label>
                <Field as="select" id="sport" name="sport">
                  <option value="soccer">Soccer</option>
                  <option value="basketball">Basketball</option>
                  <option value="volleyball">Volleyball</option>
                </Field>
                <ErrorMessage name="sport" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Provide details about your game"
                />
                <ErrorMessage name="description" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="date">Date & Time</label>
                <DatePicker
                  selected={values.date}
                  onChange={date => setFieldValue('date', date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="date-picker"
                />
                <ErrorMessage name="date" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration (minutes)</label>
                <Field
                  type="number"
                  id="duration"
                  name="duration"
                  min="30"
                  step="15"
                />
                <ErrorMessage name="duration" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="skillLevel">Skill Level</label>
                <Field as="select" id="skillLevel" name="skillLevel">
                  <option value="all">All Levels</option>
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
                  min="2"
                />
                <ErrorMessage name="maxPlayers" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label>Location</label>
                <p className="map-instructions">Click on the map to select a location</p>
                <MapComponent
                  height="300px"
                  onClick={handleMapClick}
                  showCurrentLocation={true}
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
                  Create Game
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate('/dashboard')}
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

export default CreateGame; 