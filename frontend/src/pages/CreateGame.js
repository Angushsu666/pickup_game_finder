import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createGame } from '../services/gameService';
import { toast } from 'react-toastify';
import './GameForm.css';

// US States data
const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
  'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// Cities by state (simplified - you would want a more complete dataset)
const citiesByState = {
  'Alabama': ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville'],
  'Alaska': ['Anchorage', 'Juneau', 'Fairbanks', 'Sitka'],
  'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale'],
  'Arkansas': ['Little Rock', 'Fayetteville', 'Fort Smith', 'Springdale'],
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
  'Colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Boulder'],
  'Connecticut': ['Bridgeport', 'New Haven', 'Stamford', 'Hartford'],
  'Delaware': ['Wilmington', 'Dover', 'Newark', 'Middletown'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
  'Georgia': ['Atlanta', 'Savannah', 'Augusta', 'Columbus'],
  'Hawaii': ['Honolulu', 'Hilo', 'Kailua', 'Kapolei'],
  'Idaho': ['Boise', 'Idaho Falls', 'Nampa', 'Twin Falls'],
  'Illinois': ['Chicago', 'Springfield', 'Peoria', 'Rockford'],
  'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend'],
  'Iowa': ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City'],
  'Kansas': ['Wichita', 'Topeka', 'Overland Park', 'Lawrence'],
  'Kentucky': ['Louisville', 'Lexington', 'Bowling Green', 'Frankfort'],
  'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette'],
  'Maine': ['Portland', 'Bangor', 'Augusta', 'Lewiston'],
  'Maryland': ['Baltimore', 'Annapolis', 'Frederick', 'Rockville'],
  'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Cambridge'],
  'Michigan': ['Detroit', 'Grand Rapids', 'Ann Arbor', 'Lansing'],
  'Minnesota': ['Minneapolis', 'Saint Paul', 'Duluth', 'Rochester'],
  'Mississippi': ['Jackson', 'Gulfport', 'Biloxi', 'Hattiesburg'],
  'Missouri': ['Kansas City', 'St. Louis', 'Springfield', 'Columbia'],
  'Montana': ['Billings', 'Missoula', 'Great Falls', 'Bozeman'],
  'Nebraska': ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island'],
  'Nevada': ['Las Vegas', 'Reno', 'Henderson', 'Carson City'],
  'New Hampshire': ['Manchester', 'Nashua', 'Concord', 'Dover'],
  'New Jersey': ['Newark', 'Jersey City', 'Paterson', 'Trenton'],
  'New Mexico': ['Albuquerque', 'Santa Fe', 'Las Cruces', 'Roswell'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse'],
  'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham'],
  'North Dakota': ['Fargo', 'Bismarck', 'Grand Forks', 'Minot'],
  'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo'],
  'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow'],
  'Oregon': ['Portland', 'Salem', 'Eugene', 'Gresham'],
  'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie'],
  'Rhode Island': ['Providence', 'Warwick', 'Cranston', 'Pawtucket'],
  'South Carolina': ['Columbia', 'Charleston', 'Greenville', 'Spartanburg'],
  'South Dakota': ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings'],
  'Tennessee': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga'],
  'Texas': ['Houston', 'Austin', 'Dallas', 'San Antonio'],
  'Utah': ['Salt Lake City', 'Provo', 'Ogden', 'St. George'],
  'Vermont': ['Burlington', 'South Burlington', 'Rutland', 'Montpelier'],
  'Virginia': ['Virginia Beach', 'Richmond', 'Norfolk', 'Alexandria'],
  'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Olympia'],
  'West Virginia': ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg'],
  'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha'],
  'Wyoming': ['Cheyenne', 'Casper', 'Laramie', 'Gillette']
};


const CreateGame = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);

  const initialValues = {
    title: '',
    sport: 'soccer',
    description: '',
    dayOfWeek: 'Saturday',
    time: '18:00',
    duration: 60,
    skillLevel: 'all',
    maxPlayers: 10,
    location: {
      locationDetails: '',
      city: '',
      state: ''
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    sport: Yup.string().required('Sport is required'),
    description: Yup.string().required('Description is required'),
    dayOfWeek: Yup.string().required('Day of week is required'),
    time: Yup.string().required('Time is required'),
    duration: Yup.number().required('Duration is required').positive('Duration must be positive'),
    skillLevel: Yup.string().required('Skill level is required'),
    maxPlayers: Yup.number().required('Max players is required').min(2, 'At least 2 players required'),
    location: Yup.object({
      locationDetails: Yup.string().required('Location details are required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required')
    })
  });

  const handleStateChange = (e, setFieldValue) => {
    const state = e.target.value;
    setSelectedState(state);
    setFieldValue('location.state', state);
    setFieldValue('location.city', '');

    // Update cities based on selected state
    if (state && citiesByState[state]) {
      setCities(citiesByState[state]);
    } else {
      setCities([]);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const gameData = {
        ...values,
        location: {
          ...values.location,
          type: 'Point',
          coordinates: [0, 0] // Placeholder coordinates since we're not using maps
        }
      };

      const result = await createGame(gameData);

      if (result.success) {
        toast.success('Game created successfully!');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Failed to create game');
      }
    } catch (error) {
      toast.error('An error occurred while creating the game');
      console.error(error);
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
                <label htmlFor="title">Group Name</label>
                <Field type="text" id="title" name="title" />
                <ErrorMessage name="title" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="sport">Sport</label>
                <Field as="select" id="sport" name="sport">
                  <option value="soccer">Soccer</option>
                  <option value="basketball">Basketball</option>
                  <option value="volleyball">Volleyball</option>
                  <option value="tennis">Tennis</option>
                  <option value="baseball">Baseball</option>
                  <option value="football">Football</option>
                </Field>
                <ErrorMessage name="sport" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <Field as="textarea" id="description" name="description" rows="4" />
                <ErrorMessage name="description" component="div" className="error-message" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dayOfWeek">Day of Week</label>
                  <Field as="select" id="dayOfWeek" name="dayOfWeek">
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </Field>
                  <ErrorMessage name="dayOfWeek" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Time</label>
                  <Field type="time" id="time" name="time" />
                  <ErrorMessage name="time" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration (minutes)</label>
                  <Field type="number" id="duration" name="duration" min="30" step="15" />
                  <ErrorMessage name="duration" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="maxPlayers">Maximum Players</label>
                  <Field type="number" id="maxPlayers" name="maxPlayers" min="2" />
                  <ErrorMessage name="maxPlayers" component="div" className="error-message" />
                </div>
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
                <label htmlFor="location.state">State</label>
                <Field
                  as="select"
                  id="location.state"
                  name="location.state"
                  onChange={(e) => handleStateChange(e, setFieldValue)}
                >
                  <option value="">Select a state</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </Field>
                <ErrorMessage name="location.state" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="location.city">City</label>
                <Field as="select" id="location.city" name="location.city" disabled={!selectedState}>
                  <option value="">Select a city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </Field>
                <ErrorMessage name="location.city" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="location.locationDetails">Location Details</label>
                <Field type="text" id="location.locationDetails" name="location.locationDetails" placeholder="Park name, street address, or specific location" />
                <ErrorMessage name="location.locationDetails" component="div" className="error-message" />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">Create Game</button>
                <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard')}>
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