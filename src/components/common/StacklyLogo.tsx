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
          // If image fails, fallback to dual ribbon SVG
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {showText && (
        <div className="flex flex-row items-center gap-2 text-left shrink-0">
          <span className="text-xl font-black tracking-widest leading-none font-sans text-white">
            STACKLY
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
            WFA
          </span>
        </div>
      )}
    </div>
  );
};
