import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 40.015,
    lng: -105.2705
};

const TestMap = () => {
    const [marker, setMarker] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'YOUR_API_KEY_HERE' // Replace with your actual API key
    });

    const handleMapClick = (e) => {
        const location = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        };
        console.log("Clicked:", location);
        setMarker(location);
    };

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onClick={handleMapClick}
        >
            {marker && <Marker position={marker} />}
        </GoogleMap>
    ) : <div>Loading...</div>;
};

export default TestMap;
