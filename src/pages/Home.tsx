import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ServiceProviderCard from '@/components/ServiceProviderCard';
import ServiceProviderProfile from '@/components/ServiceProviderProfile';
import { Search, MapPin, Settings, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Import service provider images
import landscaperImage from '@/assets/landscaper-trevor.jpg';
import electricianImage from '@/assets/electrician-mark.jpg';
import plumberImage from '@/assets/plumber-ryan.jpg';
import petSitterImage from '@/assets/pet-sitter-amanda.jpg';

interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  rating: number;
  reviewCount: number;
  location: string;
  price: string;
  imageUrl: string;
  isAvailable: boolean;
  tags?: string[];
  description: string;
  specialties: string[];
  yearsInBusiness: number;
  languages: string[];
  backgroundChecked: boolean;
  responseTime: string;
}

interface HomeProps {
  onProfileClick: () => void;
  user: SupabaseUser | null;
}

const Home = ({ onProfileClick, user }: HomeProps) => {
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchServiceProviders();
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
    }
  };

  const fetchServiceProviders = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('service_providers')
        .select('*')
        .eq('is_available', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      // Transform the data to match our component interface
      const transformedProviders: ServiceProvider[] = (data || []).map((provider: any) => ({
        id: provider.id,
        name: provider.business_name,
        service: provider.service_category,
        rating: provider.rating || 0,
        reviewCount: provider.review_count || 0,
        location: provider.location_address || '',
        price: `$${provider.hourly_rate || 0}/hour`,
        imageUrl: landscaperImage, // Default image for now
        isAvailable: provider.is_available,
        tags: provider.specialties || [],
        description: provider.description || '',
        specialties: provider.specialties || [],
        yearsInBusiness: provider.years_experience || 0,
        languages: provider.languages || ['English'],
        backgroundChecked: provider.background_checked,
        responseTime: `< ${provider.response_time_minutes || 60} min`
      }));

      setProviders(transformedProviders);
    } catch (error) {
      console.error('Error fetching service providers:', error);
      // Fallback to mock data if there's an error
      setProviders(featuredProviders);
    } finally {
      setLoading(false);
    }
  };

  // Mock data - in real app this would come from API
  const featuredProviders: ServiceProvider[] = [
    {
      id: '1',
      name: 'Trevor T.',
      service: 'Landscaping Service',
      rating: 5,
      reviewCount: 12,
      location: 'Poway, CA',
      price: '$60/hour',
      imageUrl: landscaperImage,
      isAvailable: true,
      tags: ['Lawn Repair', 'Soil Amendment', 'Garden Design'],
      description: "Hello, I'm Trevor! With 7 years of landscaping expertise, I focus on sustainable and beautiful landscape solutions, from native plant gardens to efficient irrigation systems.",
      specialties: ['Lawn Repair', 'Soil Amendment', 'Garden Design'],
      yearsInBusiness: 7,
      languages: ['English'],
      backgroundChecked: true,
      responseTime: '< 30 min'
    },
    {
      id: '2',
      name: 'Mark Y.',
      service: 'Electrician Service',
      rating: 5,
      reviewCount: 35,
      location: 'San Diego, CA',
      price: '$110/hour',
      imageUrl: electricianImage,
      isAvailable: true,
      tags: ['Repairs', 'Inspections', 'Installations'],
      description: "I'm Mark, with 10 years in the field, I specialize in residential and commercial electrical services, focusing on reliability and customer satisfaction.",
      specialties: ['Repairs', 'Inspections', 'Installations'],
      yearsInBusiness: 10,
      languages: ['English', 'Spanish'],
      backgroundChecked: true,
      responseTime: '< 45 min'
    },
    {
      id: '3',
      name: 'Ryan B.',
      service: 'Plumbing Services',
      rating: 4.8,
      reviewCount: 28,
      location: 'Temecula, CA',
      price: '$85/hour',
      imageUrl: plumberImage,
      isAvailable: true,
      tags: ['Emergency Repair', 'Installation', 'Maintenance'],
      description: "Professional plumber with 8+ years experience. Available for emergency repairs, installations, and maintenance work.",
      specialties: ['Emergency Repair', 'Installation', 'Maintenance'],
      yearsInBusiness: 8,
      languages: ['English'],
      backgroundChecked: true,
      responseTime: '< 60 min'
    },
    {
      id: '4',
      name: 'Amanda N.',
      service: 'Dog Sitting Service',
      rating: 4.9,
      reviewCount: 42,
      location: 'El Ranch, CA',
      price: '$25/hour',
      imageUrl: petSitterImage,
      isAvailable: true,
      tags: ['Pet Care', 'Walking', 'Overnight'],
      description: "Loving pet sitter with experience caring for dogs of all sizes. Your furry friend will be in great hands!",
      specialties: ['Pet Care', 'Walking', 'Overnight Care'],
      yearsInBusiness: 3,
      languages: ['English'],
      backgroundChecked: true,
      responseTime: '< 20 min'
    }
  ];

  const serviceCategories = [
    { name: 'House Cleaning', icon: '🏠' },
    { name: 'Landscaping', icon: '🌿' },
    { name: 'Electrical Installations', icon: '⚡' },
    { name: 'Tutoring', icon: '📚' }
  ];

  const handleProviderClick = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
  };

  const handleBackToHome = () => {
    setSelectedProvider(null);
  };

  const handleCheckAvailability = () => {
    // TODO: Implement booking flow
    console.log('Check availability for:', selectedProvider?.name);
  };

  if (selectedProvider) {
    return (
      <ServiceProviderProfile
        provider={selectedProvider}
        onBack={handleBackToHome}
        onCheckAvailability={handleCheckAvailability}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">
              Hello, {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
            </h1>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{userProfile?.address || 'Location not set'}</span>
            </div>
          </div>
          <button 
            onClick={onProfileClick}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
          >
            <User className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Explore!"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-3 rounded-xl border-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Available Now */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Available Now Near You</h2>
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-xl shadow-card p-4 animate-pulse">
                  <div className="h-32 bg-secondary rounded-lg mb-3"></div>
                  <div className="h-4 bg-secondary rounded mb-2"></div>
                  <div className="h-3 bg-secondary rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {providers.map((provider) => (
                <ServiceProviderCard
                  key={provider.id}
                  provider={provider}
                  onClick={handleProviderClick}
                />
              ))}
            </div>
          )}
        </section>

        {/* Featured Services */}
        <section>
          <h2 className="text-lg font-semibold mb-4">SwiftFyx Featured Selections</h2>
          <div className="space-y-3">
            {serviceCategories.map((category, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-card rounded-xl shadow-card cursor-pointer hover:shadow-lg transition-smooth"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">{category.icon}</span>
                </div>
                <span className="font-medium">{category.name}</span>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          <div className="mt-4">
            <button className="w-full py-3 text-center text-muted-foreground bg-secondary rounded-xl hover:bg-secondary/80 transition-smooth">
              Show More
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;