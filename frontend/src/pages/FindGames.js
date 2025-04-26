import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindGames.css';

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

// Cities by state
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

const FindGames = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [cities, setCities] = useState([]);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity('');

    // Update cities based on selected state
    if (state && citiesByState[state]) {
      setCities(citiesByState[state]);
    } else {
      setCities([]);
    }
  };

  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams();

    if (selectedState) {
      params.append('state', selectedState);
    }

    if (selectedCity) {
      params.append('city', selectedCity);
    }

    if (selectedSport) {
      params.append('sport', selectedSport);
    }

    if (selectedDay) {
      params.append('dayOfWeek', selectedDay);
    }

    // Navigate to results page with query parameters
    navigate(`/game-results?${params.toString()}`);
  };

  return (
    <div className="find-games-container">
      <div className="find-games-content">
        <h1>Find Games</h1>
        <p>Search for games in your area</p>

        <div className="search-form">
          <div className="form-group">
            <label htmlFor="state">State</label>
            <select
              id="state"
              value={selectedState}
              onChange={handleStateChange}
            >
              <option value="">Select a state</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState || cities.length === 0}
            >
              <option value="">Select a city</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sport">Sport (Optional)</label>
            <select
              id="sport"
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
            >
              <option value="">Any Sport</option>
              <option value="soccer">Soccer</option>
              <option value="basketball">Basketball</option>
              <option value="volleyball">Volleyball</option>
              <option value="tennis">Tennis</option>
              <option value="baseball">Baseball</option>
              <option value="football">Football</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="day">Day (Optional)</label>
            <select
              id="day"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">Any Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <button
            className="search-button"
            onClick={handleSearch}
            disabled={!selectedState || !selectedCity}
          >
            Search Games
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindGames;