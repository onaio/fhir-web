import en from './en.json';
import fr from './fr.json';

export interface Translation {
  [key: string]: string;
}

export interface Language {
  [key: string]: Translation;
}

export interface i18nextFormat {
  [key: string]: { translation: Translation };
}

export default {
  English: { translation: en },
  French: { translation: fr },
} as i18nextFormat;
