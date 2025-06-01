export type Locale = 'tr' | 'en';

export const defaultLocale: Locale = 'tr';
export const locales: Locale[] = ['tr', 'en'];

export interface Translations {
  navigation: {
    home: string;
    rooms: string;
    gallery: string;
    services: string;
    organization: string;
    contact: string;
    blog: string;
    transportation: string;
  };
  common: {
    readMore: string;
    viewAll: string;
    book: string;
    contact: string;
    details: string;
    back: string;
    language: string;
  };
}

export const tr: Translations = {
  navigation: {
    home: 'Ana Sayfa',
    rooms: 'Odalar',
    gallery: 'Galeri',
    services: 'Hizmetlerimiz',
    organization: 'Organizasyon',
    contact: 'İletişim',
    blog: 'Blog',
    transportation: 'Ulaşım',
  },
  common: {
    readMore: 'Devamını Oku',
    viewAll: 'Tümünü Gör',
    book: 'Rezervasyon Yap',
    contact: 'İletişime Geç',
    details: 'Detaylar',
    back: 'Geri Dön',
    language: 'Dil',
  },
};

export const en: Translations = {
  navigation: {
    home: 'Home',
    rooms: 'Rooms',
    gallery: 'Gallery',
    services: 'Services',
    organization: 'Organization',
    contact: 'Contact',
    blog: 'Blog',
    transportation: 'Transportation',
  },
  common: {
    readMore: 'Read More',
    viewAll: 'View All',
    book: 'Book Now',
    contact: 'Contact Us',
    details: 'Details',
    back: 'Go Back',
    language: 'Language',
  },
};

export async function getTranslations(locale: Locale = defaultLocale): Promise<Translations> {
  return locale === 'en' ? en : tr;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'tr' ? 'en' : 'tr';
}