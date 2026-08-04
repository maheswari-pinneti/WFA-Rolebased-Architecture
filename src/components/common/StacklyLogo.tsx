import React, { useState } from 'react';
import { useTheme } from '../../design-system/theme/theme';
import { Layers } from 'lucide-react';

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
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  let theme = 'dark';
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch {
    theme = 'dark';
  }

  const isDark = theme === 'dark';

  return (
    <div
      className={`inline-flex items-center shrink-0 gap-2 transition-all duration-300 ${className}`}
    >
      {!imgFailed ? (
        <img
          src="/assets/images/logo.png"
          alt="Stackly Workforce Analytics"
          style={{ height: size, width: 'auto' }}
          className={`shrink-0 object-contain transition-all duration-300 ${
            isDark
              ? 'brightness-110 contrast-105 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]'
              : 'brightness-95 contrast-110 filter drop-shadow-sm'
          }`}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="flex items-center gap-2">
          <div
            style={{ width: size, height: size }}
            className="rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0"
          >
            <Layers size={Math.max(16, size * 0.55)} />
          </div>
          {showText && (
            <span className="font-black text-base tracking-tight text-slate-900 dark:text-white font-sans">
              STACKLY
            </span>
          )}
        </div>
      )}
    </div>
  );
};
