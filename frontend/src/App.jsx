import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProviderServices from './components/services/ProviderServices';
import ConsumerServices from './components/services/ConsumerServices';
import ProviderProfile from './components/profile/ProviderProfile';
import UserProfile from './components/profile/UserProfile';
import EditProfile from './components/profile/EditProfile';
import MyBookings from './components/bookings/MyBookings';
import Wallet from './components/wallet/Wallet';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleRegisterSuccess = (userData) => {
    // After registration, show login form
    setShowLogin(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  if (isLoggedIn) {
    return (
      <Router>
        <div className="app-container logged-in">
          <header className="app-header">
            <div className="app-header-content">
              <div className="header-left">
                <Link to="/" className="home-link">
                  {user.userType === 'PROVIDER' ? 'My Services' : 'Browse Services'}
                </Link>
                <Link to="/bookings" className="bookings-link">
                  My Bookings
                </Link>
                <Link to="/wallet" className="wallet-link">
                  My Wallet
                </Link>
              </div>
              <div className="header-right">
                <Link to="/profile" className="profile-link">
                  {user.firstName} {user.lastName}
                </Link>
                <button onClick={handleLogout} className="auth-button">Logout</button>
              </div>
            </div>
          </header>
          
          <main className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={
                  user.userType === 'PROVIDER' ? (
                    <ProviderServices providerId={user.id} />
                  ) : (
                    <ConsumerServices userId={user.id} />
                  )
                } 
              />
              <Route 
                path="/provider/:providerId" 
                element={<ProviderProfile />} 
              />
              <Route 
                path="/profile" 
                element={<UserProfile user={user} />} 
              />
              <Route 
                path="/profile/edit" 
                element={
                  <EditProfile 
                    user={user} 
                    onUpdateSuccess={handleProfileUpdate} 
                  />
                } 
              />
              <Route 
                path="/bookings" 
                element={
                  <MyBookings 
                    userId={user.id}
                    userType={user.userType}
                  />
                } 
              />
              <Route 
                path="/wallet" 
                element={
                  <Wallet 
                    userId={user.id}
                    userType={user.userType}
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    );
  }

  return (
    <div className="app-container">
      <div className="auth-toggle">
        <button
          className={`toggle-button ${showLogin ? 'active' : ''}`}
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>
        <button
          className={`toggle-button ${!showLogin ? 'active' : ''}`}
          onClick={() => setShowLogin(false)}
        >
          Register
        </button>
      </div>

      <main className="main-content">
        {showLogin ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Register onRegisterSuccess={handleRegisterSuccess} />
        )}
      </main>
    </div>
  );
}

export default App;
