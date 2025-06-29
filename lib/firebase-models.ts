// Firebase modellerinin tanımları
// Bu dosya, mock Firebase servisleri için gerekli model tanımlarını içerir
// ve types.ts dosyasındaki tanımlarla uyumlu çalışacak şekilde düzenlenmiştir

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
  createdAt?: string;
  updatedAt?: string;
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

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  identityNumber?: string;
  birthDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Room {
  id: string;
  name: string;
  roomNumber: string;
  type: string;
  capacity: number;
  price: number;
  status: 'Boş' | 'Müsait' | 'Dolu' | 'Bakımda' | 'Temizleniyor';
  features?: string[];
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
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
  createdAt?: string;
  updatedAt?: string;
}
