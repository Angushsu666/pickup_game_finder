import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const GameDetailsModal = ({ isOpen, onRequestClose, game }) => {
    const [isClosing, setIsClosing] = useState(false);

    if (!game) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onRequestClose();
        }, 300);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Game Details"
            className={`game-modal ${isClosing ? 'closing' : ''}`}
            overlayClassName="game-modal-overlay"
            closeTimeoutMS={300}
        >
            <div className="modal-content">
                <h2>{game.title}</h2>
                <p><strong>Sport:</strong> {game.sport}</p>
                <p><strong>Location:</strong> {game.location.city}, {game.location.state}</p>
                <p><strong>Day:</strong> {game.dayOfWeek}</p>
                <p><strong>Time:</strong> {game.time}</p>
                <p><strong>Players:</strong> {game.participants.length} / {game.maxPlayers}</p>
                <button onClick={handleClose} className="close-btn">Close</button>
            </div>
        </Modal>
    );
};

export default GameDetailsModal;
