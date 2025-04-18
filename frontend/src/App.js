import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateGame from './pages/CreateGame';
import GameDetails from './pages/GameDetails';
import EditGame from './pages/EditGame';
import FindGames from './pages/FindGames';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/games/create" element={<PrivateRoute><CreateGame /></PrivateRoute>} />
          <Route path="/games/:id" element={<PrivateRoute><GameDetails /></PrivateRoute>} />
          <Route path="/games/:id/edit" element={<PrivateRoute><EditGame /></PrivateRoute>} />
          <Route path="/games" element={<PrivateRoute><FindGames /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 