import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { TRANSLATIONS } from '../data';
import type { Lang, LangContextType } from '../types';

export const LangCtx = createContext<LangContextType>({
  lang: 'en',
  t: TRANSLATIONS.en,
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    () => (localStorage.getItem('portfolio-lang') as Lang) || 'en'
  );

  const setLang = (l: Lang): void => {
    setLangState(l);
    localStorage.setItem('portfolio-lang', l);
  };

  return (
    <LangCtx.Provider value={{ lang, t: TRANSLATIONS[lang], setLang }}>
      {children}
    </LangCtx.Provider>
  );
}

export const useLang = (): LangContextType => useContext(LangCtx);
