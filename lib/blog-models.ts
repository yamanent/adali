// Firebase Timestamp tipini desteklemek için interface
export interface FirestoreTimestamp {
  toDate: () => Date;
  // Firestore Timestamp'ın diğer özellikleri
  seconds: number;
  nanoseconds: number;
}

export type Timestamp = FirestoreTimestamp | Date | string | number;

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: Timestamp;
  slug: string;
  imageUrl?: string;
  coverImageUrl?: string;
  tags?: string[];
  category?: string;
  readTime?: number;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

// Tarih dönüşümü için gelişmiş yardımcı fonksiyon
export const parseDate = (date: Timestamp): Date => {
  if (!date) return new Date();
  
  // Eğer Date nesnesiyse doğrudan döndür
  if (date instanceof Date) return date;
  
  // Eğer string veya numbersa Date'e çevir
  if (typeof date === 'string' || typeof date === 'number') {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }
  
  // Eğer Firestore Timestamp'ıysa toDate() metodunu kullan
  if (typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
    return date.toDate();
  }
  
  // Diğer durumlar için yeni tarih döndür
  return new Date();
};

// Tarihi okunabilir formata çevirir
// Örnek: 15 Ocak 2024
export const formatDate = (date: Date | string | number): string => {
  const d = parseDate(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return d.toLocaleDateString('tr-TR', options);
};
