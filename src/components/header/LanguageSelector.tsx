import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { LanguageOption } from './types';

export const LanguageSelector: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageOption>('en');

  const languages: { code: LanguageOption; label: string }[] = [
    { code: 'en', label: 'English (US)' },
    { code: 'hi', label: 'Hindi (हिंदी)' },
    { code: 'es', label: 'Spanish (Español)' },
    { code: 'fr', label: 'French (Français)' },
    { code: 'de', label: 'German (Deutsch)' },
  ];

  const handleSelect = (code: LanguageOption) => {
    setSelectedLang(code);
    setOpen(false);
  };

  return (
    <div className="relative hidden xl:block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-slate-400 hover:text-[var(--text-primary)] transition-colors"
      >
        <Globe size={16} />
        <span className="uppercase">{selectedLang}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-1.5 shadow-2xl z-50 rounded-xl space-y-0.5 text-xs">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code)}
              className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between font-medium ${
                selectedLang === l.code
                  ? 'bg-blue-600/10 text-blue-500 font-bold'
                  : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
              }`}
            >
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
