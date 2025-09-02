import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';

interface ProfileProps {
  onBack: () => void;
  user: SupabaseUser | null;
  onSignOut: () => void;
}

const Profile = ({ onBack, user, onSignOut }: ProfileProps) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const profileItems = [
    { label: 'Name', value: userProfile?.full_name || user?.email?.split('@')[0] || 'Not set' },
    { label: 'Email', value: user?.email || 'Not set' },
    { label: 'Phone', value: userProfile?.phone || 'Not set' },
    { label: 'Address', value: userProfile?.address || 'Not set' },
    { label: 'Settings' },
    { label: 'Business Account' },
    { label: 'Report' },
    { label: 'Legal' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-secondary rounded-lg transition-smooth"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">Profile</h1>
          <div className="w-9 h-9" />
        </div>
      </div>

      {/* Profile Header */}
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              Hi, {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-muted-foreground">Manage your account</p>
          </div>
        </div>

        {/* Profile Menu */}
        {loading ? (
          <div className="space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 bg-card rounded-lg border border-border animate-pulse">
                <div className="h-4 bg-secondary rounded mb-2"></div>
                <div className="h-3 bg-secondary rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {profileItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-card rounded-lg hover:bg-secondary/50 cursor-pointer transition-smooth border border-border"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  {item.value && (
                    <span className="text-sm text-muted-foreground mt-1">{item.value}</span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}

        {/* Sign Out Button */}
        <div className="mt-6">
          <Button 
            onClick={onSignOut}
            variant="outline" 
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;