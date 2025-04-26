import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Important for accessibility

const GameDetailsModal = ({ isOpen, onRequestClose, game }) => {
    if (!game) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Game Details"
            className="game-modal"
            overlayClassName="game-modal-overlay"
        >
            <div className="modal-content">
                <h2>{game.title}</h2>
                <p><strong>Sport:</strong> {game.sport}</p>
                <p><strong>Location:</strong> {game.location.city}, {game.location.state}</p>
                <p><strong>Day:</strong> {game.dayOfWeek}</p>
                <p><strong>Time:</strong> {game.time}</p>
                <p><strong>Players:</strong> {game.participants.length} / {game.maxPlayers}</p>
                <button onClick={onRequestClose} className="close-btn">Close</button>
            </div>
        </Modal>
    );
};

export default GameDetailsModal;
