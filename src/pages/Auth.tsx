import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SwiftFyxLogo from '@/components/SwiftFyxLogo';
import { ArrowLeft } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: () => void;
  onBack: () => void;
}

const Auth = ({ onAuthSuccess, onBack }: AuthProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication with Supabase
    onAuthSuccess();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen gradient-orange flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button 
          onClick={onBack}
          className="text-white/80 hover:text-white transition-smooth"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <SwiftFyxLogo className="w-12 h-12" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-12">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? 'Create Your Account' : 'Welcome Back!'}
            </h1>
            <p className="text-white/80 text-sm">
              {isSignUp ? 'Join thousands of users' : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                {isSignUp ? 'Username or Email' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={isSignUp ? 'Username or Email' : 'Username or Email'}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white/90 border-0 text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            {/* Phone Field (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white font-medium">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-white/90 border-0 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="bg-white/90 border-0 text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Enter Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="bg-white/90 border-0 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            )}

            {/* Remember Me / Forgot Password */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-primary"
                  />
                  <Label htmlFor="rememberMe" className="text-white text-sm">Remember me</Label>
                </div>
                <button type="button" className="text-white text-sm hover:underline">
                  Forgot Password
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="swiftfyx"
              className="w-full bg-white text-primary hover:bg-white/90 shadow-lg font-bold text-lg py-6"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          {/* Switch Mode */}
          <div className="text-center mt-6">
            <span className="text-white text-sm">
              {isSignUp ? 'Have an account? ' : "Don't Have an account? "}
            </span>
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white text-sm font-semibold hover:underline"
            >
              {isSignUp ? 'Log In Here!' : 'Create a new account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;