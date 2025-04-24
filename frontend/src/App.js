import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateGame from './pages/CreateGame';
import GameDetails from './pages/GameDetails';
import FindGames from './pages/FindGames';
import GameResults from './pages/GameResults';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import NotFound from './pages/NotFound';

import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-game"
            element={
              <PrivateRoute>
                <CreateGame />
              </PrivateRoute>
            }
          />
          <Route
            path="/games/:id"
            element={
              <PrivateRoute>
                <GameDetails />
              </PrivateRoute>
            }
          />

          <Route path="/find-games" element={<FindGames />} />
          <Route path="/game-results" element={<GameResults />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </main>

      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
