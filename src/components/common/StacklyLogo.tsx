import React from 'react';

interface StacklyLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  useImg?: boolean;
}

export const StacklyLogo: React.FC<StacklyLogoProps> = ({
  size = 32,
  showText = true,
  className = '',
  useImg = true,
}) => {
  return (
    <div className={`flex flex-row items-center gap-3 shrink-0 ${className}`}>
      {/* Official STACKLY Image Logo from /assets/images/logo.png */}
      <img
        src="/assets/images/logo.png"
        alt="Stackly Logo"
        style={{ height: size, width: 'auto' }}
        className="shrink-0 object-contain drop-shadow-md"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {showText && (
        <span className="text-xl font-black tracking-widest leading-none font-sans text-white shrink-0">
          STACKLY
        </span>
      )}
    </div>
  );
};
