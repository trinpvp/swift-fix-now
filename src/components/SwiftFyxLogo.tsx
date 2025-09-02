import React from 'react';

interface SwiftFyxLogoProps {
  className?: string;
  showText?: boolean;
}

const SwiftFyxLogo = ({ className = "w-10 h-10", showText = false }: SwiftFyxLogoProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className={`bg-white rounded-xl flex items-center justify-center ${className}`}>
        <span className="text-primary text-xl font-bold">S</span>
      </div>
      {showText && (
        <span className="text-xl font-bold text-white">SwiftFyx</span>
      )}
    </div>
  );
};

export default SwiftFyxLogo;