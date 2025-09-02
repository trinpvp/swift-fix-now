import React, { useState } from 'react';
import Auth from './Auth';
import Home from './Home';
import Profile from './Profile';

type AppState = 'auth' | 'home' | 'profile';

const SwiftFyxApp = () => {
  const [currentState, setCurrentState] = useState<AppState>('auth');

  const handleAuthSuccess = () => {
    setCurrentState('home');
  };

  const handleProfileClick = () => {
    setCurrentState('profile');
  };

  const handleBackToHome = () => {
    setCurrentState('home');
  };

  const handleBackToAuth = () => {
    setCurrentState('auth');
  };

  switch (currentState) {
    case 'auth':
      return <Auth onAuthSuccess={handleAuthSuccess} onBack={handleBackToAuth} />;
    case 'home':
      return <Home onProfileClick={handleProfileClick} />;
    case 'profile':
      return <Profile onBack={handleBackToHome} />;
    default:
      return <Auth onAuthSuccess={handleAuthSuccess} onBack={handleBackToAuth} />;
  }
};

export default SwiftFyxApp;