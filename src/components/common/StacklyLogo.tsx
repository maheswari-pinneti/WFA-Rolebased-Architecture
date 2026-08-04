import React from 'react';

interface StacklyLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  useImg?: boolean;
}

export const StacklyLogo: React.FC<StacklyLogoProps> = ({
  size = 32,
  className = '',
}) => {
  return (
    <div className={`flex items-center shrink-0 ${className}`}>
      {/* Official STACKLY Image Logo from /assets/images/logo.png */}
      <img
        src="/assets/images/logo.png"
        alt="Stackly Workforce Analytics"
        style={{ height: size, width: 'auto' }}
        className="shrink-0 object-contain max-h-9"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    </div>
  );
};
