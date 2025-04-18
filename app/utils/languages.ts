import languagesData from '../data/languages.json';

export interface Language {
  name: string;
  nativeName: string;
  countryCode: string;
  direction: string;
  prompt: string;
}

export type LanguageCode = keyof typeof languagesData;

export const languages = languagesData;

export function getLanguageByCode(code: LanguageCode): Language {
  return languages[code];
}

export function getLanguageByCountryCode(countryCode: string): { code: LanguageCode; language: Language } | undefined {
  const entry = Object.entries(languages).find(([_, lang]) => lang.countryCode === countryCode);
  if (!entry) return undefined;
  return { code: entry[0] as LanguageCode, language: entry[1] };
} 