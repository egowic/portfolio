import { createContext, useContext, useState } from 'react';
import { TRANSLATIONS } from '../data';

export const LangCtx = createContext({ lang: 'en', t: TRANSLATIONS.en, setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('portfolio-lang') || 'en');

  const setLang = (l) => {
    setLangState(l);
    localStorage.setItem('portfolio-lang', l);
  };

  return (
    <LangCtx.Provider value={{ lang, t: TRANSLATIONS[lang], setLang }}>
      {children}
    </LangCtx.Provider>
  );
}

export const useLang = () => useContext(LangCtx);
