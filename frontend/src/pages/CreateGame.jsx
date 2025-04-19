import { useState } from 'react';
import { Map } from '@vis.gl/react-google-maps';

const [selectedLocation, setSelectedLocation] = useState(null);

<Map
    defaultZoom={13}
    defaultCenter={{ lat: 40.015, lng: -105.2705 }} // Example: Boulder, CO
    onClick={(e) => {
        if (e.detail.latLng) {
            setSelectedLocation(e.detail.latLng);
        }
    }}
>
    {/* Additional components */}
</Map>

import { AdvancedMarker } from '@vis.gl/react-google-maps';

{
    selectedLocation && (
        <AdvancedMarker position={selectedLocation} />
    )
}

import { useState } from 'react';
import { InfoWindow } from '@vis.gl/react-google-maps';

const [showDialog, setShowDialog] = useState(false);
const [gameDetails, setGameDetails] = useState({ name: '', time: '' });

{
    selectedLocation && showDialog && (
        <InfoWindow position={selectedLocation} onCloseClick={() => setShowDialog(false)}>
            <div>
                <input
                    type="text"
                    placeholder="Game Name"
                    value={gameDetails.name}
                    onChange={(e) => setGameDetails({ ...gameDetails, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Game Time"
                    value={gameDetails.time}
                    onChange={(e) => setGameDetails({ ...gameDetails, time: e.target.value })}
                />
                <button onClick={handleAddGame}>Add Game</button>
            </div>
        </InfoWindow>
    )
}


{ games.map((game, i) => <GameMarker key={i} game={game} />) }
