const GameMarker = ({ game }) => (
    <AdvancedMarker position={game.location}>
        <InfoWindow position={game.location}>
            <div>
                <h3>{game.name}</h3>
                <p>{game.time}</p>
            </div>
        </InfoWindow>
    </AdvancedMarker>
);
