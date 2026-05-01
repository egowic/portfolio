export type Lang = 'en' | 'tr';

export interface Project {
  id: string;
  title: string;
  tag_en: string;
  tag_tr: string;
  year: string;
  desc_en: string;
  desc_tr: string;
  tech: string[];
  link: string | null;
  order_index: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface ExperienceItem {
  role: { en: string; tr: string };
  company: string;
  period?: string | null;
  start?: string;
  current?: boolean;
  loc: { en: string; tr: string };
}

export interface Translation {
  nav: string[];
  navHrefs: string[];
  heroTag: string;
  heroSub: string;
  heroTyped: string;
  heroBio: string;
  heroBtn: string;
  s1label: string;
  s1title: string;
  s1p1: string;
  s1p2: string;
  s1p3: string;
  expTitle: string;
  skillTitle: string;
  s2label: string;
  s2title: string;
  filterAll: string;
  visitSite: string;
  s3label: string;
  s3title: string;
  s3sub: string;
  footer: string;
  expPresent: string;
}

export interface LangContextType {
  lang: Lang;
  t: Translation;
  setLang: (lang: Lang) => void;
}
