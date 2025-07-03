import { Timestamp } from 'firebase/firestore';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: Timestamp;
  slug: string;
  imageUrl?: string; // Ana resim URL'si
  coverImageUrl?: string; // Kapak resmi URL'si
  tags?: string[]; // Etiketler
  category?: string; // Kategori
  readTime?: number; // Dakika cinsinden okuma süresi
  published: boolean;
  seoTitle?: string; // SEO başlığı
  seoDescription?: string; // SEO açıklaması
  seoKeywords?: string; // SEO anahtar kelimeleri
}
