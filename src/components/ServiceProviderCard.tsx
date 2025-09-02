import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Heart } from 'lucide-react';

interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  rating: number;
  reviewCount: number;
  location: string;
  imageUrl: string;
  isAvailable: boolean;
  tags?: string[];
}

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onClick: (provider: ServiceProvider) => void;
}

const ServiceProviderCard = ({ provider, onClick }: ServiceProviderCardProps) => {
  return (
    <div 
      onClick={() => onClick(provider)}
      className="bg-card rounded-xl shadow-card p-4 cursor-pointer hover:shadow-lg transition-smooth relative"
    >
      {/* Favorite Button */}
      <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
        <Heart className="w-4 h-4 text-primary" />
      </button>

      {/* Provider Image */}
      <div className="relative mb-3">
        <img 
          src={provider.imageUrl} 
          alt={provider.name}
          className="w-full h-32 object-cover rounded-lg"
        />
        {provider.isAvailable && (
          <div className="absolute bottom-2 left-2">
            <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Provider Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{provider.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{provider.rating}</span>
            <span className="text-sm text-muted-foreground">({provider.reviewCount})</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{provider.service}</p>

        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{provider.location}</span>
        </div>

        {/* Tags */}
        {provider.tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {provider.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2 py-1"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderCard;