// Firebase modellerinin tanımları
// Bu dosya, mock Firebase servisleri için gerekli model tanımlarını içerir
// ve types.ts dosyasındaki tanımlarla uyumlu çalışacak şekilde düzenlenmiştir

import { RoomStatus } from "./room-service";

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
