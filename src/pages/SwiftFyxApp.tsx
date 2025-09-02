import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import Home from './Home';
import Profile from './Profile';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type AppState = 'auth' | 'home' | 'profile';

const SwiftFyxApp = () => {
  const [currentState, setCurrentState] = useState<AppState>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setCurrentState('home');
        } else {
          setCurrentState('auth');
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setCurrentState('home');
      } else {
        setCurrentState('auth');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    setCurrentState('home');
  };

  const handleProfileClick = () => {
    setCurrentState('profile');
  };

  const handleBackToHome = () => {
    setCurrentState('home');
  };

  const handleBackToAuth = async () => {
    await supabase.auth.signOut();
    setCurrentState('auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  switch (currentState) {
    case 'auth':
      return <Auth onAuthSuccess={handleAuthSuccess} onBack={handleBackToAuth} />;
    case 'home':
      return <Home onProfileClick={handleProfileClick} user={user} />;
    case 'profile':
      return <Profile onBack={handleBackToHome} user={user} onSignOut={handleBackToAuth} />;
    default:
      return <Auth onAuthSuccess={handleAuthSuccess} onBack={handleBackToAuth} />;
  }
};

export default SwiftFyxApp;