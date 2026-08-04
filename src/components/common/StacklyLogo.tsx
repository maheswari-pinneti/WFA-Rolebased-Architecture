import React, { useContext } from 'react';
import { useTheme } from '../../design-system/theme/theme';

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
      className={`inline-flex items-center shrink-0 transition-all duration-300 ${
        isDark
          ? 'drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]'
          : 'drop-shadow-sm'
      } ${className}`}
    >
      {/* Official STACKLY Image Logo tuned for Dark & Light Themes */}
      <img
        src="/assets/images/logo.png"
        alt="Stackly Workforce Analytics"
        style={{ height: size, width: 'auto' }}
        className={`shrink-0 object-contain max-h-10 transition-all duration-300 ${
          isDark
            ? 'brightness-110 contrast-105 filter'
            : 'brightness-95 contrast-110 filter'
        }`}
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    </div>
  );
};
