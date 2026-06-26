'use client';

interface LanguageToggleProps {
  language: 'javascript' | 'typescript';
  onChange: (lang: 'javascript' | 'typescript') => void;
}

export function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-bg-subtle rounded-full p-1 w-fit">
      {(['typescript', 'javascript'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={`px-4 py-1.5 rounded-full text-sm font-body font-semibold transition-all duration-150 ${
            language === lang
              ? 'bg-brand text-white shadow-brand'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {lang === 'typescript' ? 'TypeScript' : 'JavaScript'}
        </button>
      ))}
    </div>
  );
}
