// lib/firebase-models.ts

/**
 * Tüm Firestore belgeleri için temel alanları içeren arayüz.
 */
export interface BaseModel {
  id: string;
  createdAt: any; // Firestore.Timestamp | string
  updatedAt: any; // Firestore.Timestamp | string
}

/**
 * Kullanıcı rollerini tanımlar. Yöneticiden personele kadar farklı yetki seviyeleri.
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
}

/**
 * Firestore'daki 'users' koleksiyonu için kullanıcı veri modeli.
 * Firebase Authentication kullanıcı verileriyle senkronize çalışır.
 */
export interface User extends BaseModel {
  uid: string; // Firebase Auth UID
  email: string;
  name: string; // displayName yerine
  role: UserRole;
  permissions: string[]; // Atanmış izinlerin ID listesi
  photoURL?: string;
  lastLogin?: string; // ISO string
  disabled?: boolean;
}

/**
 * Odaların durumunu belirtir: müsait, dolu veya bakımda.
 */
export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

/**
 * Otel odası veri modeli.
 */
export interface Room extends BaseModel {
  roomNumber: string;
  name?: string; // Oda numarasına ek olarak özel bir isim (örn: 'Göl Manzaralı Suit')
  type: string; // örn: 'Tek Kişilik', 'Çift Kişilik', 'Suit'
  capacity: number;
  price: number; // Gecelik fiyat
  status: RoomStatus;
  amenities?: string[]; // örn: ['wifi', 'tv', 'minibar']
  notes?: string;
}

/**
 * Misafir (konaklayan kişi) veri modeli.
 */
export interface Guest extends BaseModel {
  fullName: string;
  email?: string;
  phone: string;
  nationality?: string;
  idNumber?: string; // TC Kimlik veya Pasaport No
  notes?: string;
}

/**
 * Rezervasyonun mevcut durumunu belirtir.
 */
export enum ReservationStatus {
  PENDING = 'pending',       // Onay bekliyor
  CONFIRMED = 'confirmed',   // Onaylandı
  CHECKED_IN = 'checked-in', // Giriş yaptı
  CHECKED_OUT = 'checked-out',// Çıkış yaptı
  CANCELLED = 'cancelled',   // İptal edildi
}

/**
 * Ödeme durumunu belirtir.
 */
export enum PaymentStatus {
  UNPAID = 'unpaid',   // Ödenmedi
  PARTIAL = 'partial', // Kısmi ödendi
  PAID = 'paid',       // Tamamı ödendi
}

/**
 * Rezervasyonun hangi kanaldan geldiğini belirtir.
 */
export enum BookingSource {
  DIRECT = 'direct', // Doğrudan (telefon, resepsiyon)
  ONLINE = 'online', // Online (web sitesi)
  AGENT = 'agent',   // Acente
}

/**
 * Rezervasyon veri modeli.
 */
export interface Reservation extends BaseModel {
  guestId: string;
  guestName: string; // Kolay erişim için denormalize edilmiş veri
  roomId: string;
  roomNumber: string; // Kolay erişim için denormalize edilmiş veri
  checkInDate: any; // Firestore.Timestamp | string
  checkOutDate: any; // Firestore.Timestamp | string
  adults: number;
  children?: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  status: ReservationStatus;
  source?: BookingSource;
  notes?: string;
  createdBy?: { uid: string; email: string }; // Rezervasyonu oluşturan kullanıcı
}

/**
 * Gider/masraf veri modeli.
 */
export interface Expense extends BaseModel {
  description: string;
  amount: number;
  category: string;
  date: any; // Firestore.Timestamp | string
  receiptUrl?: string;
  notes?: string;
}

/**
 * Sistemdeki önemli olayları kaydetmek için kullanılan log seviyeleri.
 */
export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Log kaydı veri modeli.
 */
export interface Log extends BaseModel {
  level: LogLevel;
  message: string;
  timestamp: any; // Firestore.Timestamp | string
  userEmail?: string;
  context?: Record<string, any>; // Ekstra log bilgisi
}




// Rezervasyon durum değerleri
export type ReservationStatus = 
  'Onaylandı' | 
  'Beklemede' | 
  'İptal Edildi' | 
  'Tamamlandı' | 
  'Giriş Yaptı' | 
  'Çıkış Yaptı' | 
  'Gelmedi';

// Ödeme durum değerleri
export type PaymentStatus = 
  'Bekliyor' | 
  'Ödendi' | 
  'Kısmi Ödeme' | 
  'İptal Edildi' | 
  'İade Edildi';

// Rezervasyon kaynağı
export type BookingSource = 
  'Doğrudan' | 
  'Booking.com' | 
  'Airbnb' | 
  'Telefon' | 
  'E-posta' | 
  'Kapıdan' | 
  'Sosyal Medya' | 
  'Diğer';

// Temel rezervasyon modeli
export interface Reservation {
  id: string;
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children?: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  status: ReservationStatus;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy?: string;
  source?: BookingSource;
}

// Zenginleştirilmiş rezervasyon arayüzü
export interface EnrichedReservation extends Reservation {
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  roomName?: string;
  roomType?: string;
}

export interface GuestModel {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  identityNumber?: string;
  birthDate?: string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Guest extends GuestModel {}

export interface Room {
  id: string;
  name: string;
  roomNumber: string;
  type: string;
  capacity: number;
  price: number;
  status: RoomStatus;
  features?: string[];
  description?: string;
  imageUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  paymentMethod?: string;
  receiptUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Log kaydı modeli
import { Timestamp } from 'firebase/firestore';

// ... (dosyanın geri kalanı)

export interface Log {
  id: string;
  timestamp: Date | string | Timestamp;
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: Record<string, any>;
  userId?: string;
  userEmail?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
