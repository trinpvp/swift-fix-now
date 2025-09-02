import React from 'react';
import { ArrowLeft, ChevronRight, User } from 'lucide-react';

interface ProfileProps {
  onBack: () => void;
}

const Profile = ({ onBack }: ProfileProps) => {
  const profileItems = [
    { label: 'Name', value: 'Robbie Johnson' },
    { label: 'Email', value: 'robbie@example.com' },
    { label: 'Password', value: '••••••••' },
    { label: 'Payment', value: '•••• 1234' },
    { label: 'Settings' },
    { label: 'Business Account' },
    { label: 'Report' },
    { label: 'Settings' },
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
            <h2 className="text-xl font-semibold">Hi, Robbie</h2>
            <p className="text-muted-foreground">Manage your account</p>
          </div>
        </div>

        {/* Profile Menu */}
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
      </div>
    </div>
  );
};

export default Profile;