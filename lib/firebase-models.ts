// Firebase veri modelleri

import { User, UserRole } from "@/types/auth";

// Firestore'da kullanılacak kullanıcı modeli
export interface FirestoreUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string; // ISO tarih formatı
  lastLogin: string; // ISO tarih formatı
  isActive?: boolean;
}

// Rezervasyon modeli
export interface Reservation {
  id: string;
  guestId: string;
  roomId: string;
  checkInDate: string; // ISO tarih formatı
  checkOutDate: string; // ISO tarih formatı
  adults: number;
  children: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalPrice: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // Kullanıcı ID'si
}

// Oda modeli
export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  isAvailable: boolean;
  amenities: string[];
  images: string[];
  description: string;
}

// Misafir modeli
export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  idNumber?: string;
  nationality?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Ödeme modeli
export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  method: 'cash' | 'credit_card' | 'bank_transfer' | 'other';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  notes?: string;
  createdBy: string;
}

// Gider modeli
export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: 'cash' | 'credit_card' | 'bank_transfer' | 'other';
  receipt?: string; // Makbuz/fatura için dosya yolu
  createdBy: string;
  createdAt: string;
}
