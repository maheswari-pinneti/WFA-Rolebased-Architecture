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
  useImg = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {useImg ? (
        <img
          src="/assets/images/logo.png"
          alt="Stackly Logo"
          style={{ height: size, width: 'auto' }}
          className="shrink-0 object-contain drop-shadow-sm"
          onError={(e) => {
            // Fallback to SVG ribbon logo if PNG fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        /* Official STACKLY Mint-Teal & Deep Navy Ribbon SVG Icon */
        <svg
          width={size}
          height={size * 1.25}
          viewBox="0 0 100 125"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 drop-shadow-sm"
        >
          <path
            d="M65 8C40 8 12 35 12 65C12 78 18 90 28 98C22 84 25 65 38 52C50 40 68 35 78 22C74 12 68 8 65 8Z"
            fill="url(#mint_teal_grad)"
          />
          <path
            d="M35 117C60 117 88 90 88 60C88 47 82 35 72 27C78 41 75 60 62 73C50 85 32 90 22 103C26 113 32 117 35 117Z"
            fill="url(#deep_navy_grad)"
          />
          <defs>
            <linearGradient id="mint_teal_grad" x1="12" y1="8" x2="78" y2="98" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6EE7B7" />
              <stop offset="0.6" stopColor="#34D399" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="deep_navy_grad" x1="22" y1="27" x2="88" y2="117" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="0.5" stopColor="#1E3A8A" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-xl font-black tracking-widest leading-none font-sans text-[var(--text-primary)]">
            STACKLY
          </span>
          <span className="text-[10px] font-extrabold text-[#34D399] uppercase tracking-widest mt-1">
            Workforce Analytics
          </span>
        </div>
      )}
    </div>
  );
};
