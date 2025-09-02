import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ArrowLeft, Clock, Shield, Languages } from 'lucide-react';

interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  rating: number;
  reviewCount: number;
  location: string;
  price: string;
  imageUrl: string;
  description: string;
  specialties: string[];
  yearsInBusiness: number;
  languages: string[];
  backgroundChecked: boolean;
  responseTime: string;
}

interface ServiceProviderProfileProps {
  provider: ServiceProvider;
  onBack: () => void;
  onCheckAvailability: () => void;
}

const ServiceProviderProfile = ({ provider, onBack, onCheckAvailability }: ServiceProviderProfileProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-secondary rounded-lg transition-smooth"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg capitalize">{provider.service}</h1>
          <div className="w-9 h-9" />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Image Carousel */}
        <div className="relative">
          <img 
            src={provider.imageUrl} 
            alt={provider.name}
            className="w-full h-64 object-cover rounded-xl"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>

        {/* Provider Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{provider.name}</h2>
            <div className="text-right">
              <div className="text-lg font-bold">{provider.price}</div>
              <div className="text-sm text-muted-foreground">Estimated Price</div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= provider.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="font-medium">({provider.reviewCount})</span>
          </div>

          {/* Location */}
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{provider.location}</span>
          </div>
        </div>

        {/* Specialties */}
        <div>
          <h3 className="font-semibold mb-3">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {provider.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold mb-3">About This Expert</h3>
          <p className="text-muted-foreground leading-relaxed">
            {provider.description}
          </p>
        </div>

        {/* Overview */}
        <div>
          <h3 className="font-semibold mb-3">Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
              <span>{provider.yearsInBusiness} years in business</span>
            </div>
            <div className="flex items-center text-sm">
              <Shield className="w-4 h-4 mr-3 text-muted-foreground" />
              <span>35 hires on SwiftFyx</span>
            </div>
            <div className="flex items-center text-sm">
              <Shield className="w-4 h-4 mr-3 text-muted-foreground" />
              <span>{provider.backgroundChecked ? 'Background Checked' : 'Verification Pending'}</span>
            </div>
            <div className="flex items-center text-sm">
              <Languages className="w-4 h-4 mr-3 text-muted-foreground" />
              <span>Languages Spoken: {provider.languages.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Check Availability Button */}
        <div className="pt-4">
          <Button 
            onClick={onCheckAvailability}
            variant="swiftfyx"
            className="w-full py-6 text-lg font-bold"
          >
            Check Availability
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderProfile;