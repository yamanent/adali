// Rezervasyon tipi tanımlamaları
export interface Reservation {
  id: string;
  roomId: string;
  startDate: string;
  endDate: string;
  guestName: string;
  guestCount: number;
  phoneNumber: string;
  email: string;
  status: ReservationStatus;
  notes?: string;
  paymentStatus: PaymentStatus;
  source: BookingSource;
  createdAt: string;
}

export enum ReservationStatus {
  CONFIRMED = "CONFIRMED",
  PENDING = "PENDING",
  CHECKED_IN = "CHECKED_IN",
  CHECKED_OUT = "CHECKED_OUT",
  CANCELLED = "CANCELLED",
  CANCELED = "CANCELED", // Eski kod ile uyumluluk için
  NO_SHOW = "NO_SHOW"
}

export enum PaymentStatus {
  PAID = "PAID",
  PARTIAL = "PARTIAL",
  PARTIALLY_PAID = "PARTIALLY_PAID", // Eski kod ile uyumluluk için
  UNPAID = "UNPAID",
  NOT_PAID = "NOT_PAID", // Alternatif kullanım
  REFUNDED = "REFUNDED"
}

export enum BookingSource {
  DIRECT = "DIRECT",
  BOOKING = "BOOKING.COM",
  BOOKING_COM = "BOOKING", // Eski kod ile uyumluluk için
  AIRBNB = "AIRBNB",
  PHONE = "PHONE",
  EMAIL = "EMAIL",
  WALK_IN = "WALK_IN",
  EXPEDIA = "EXPEDIA", // Eski kod ile uyumluluk için
  OTHER = "OTHER" // Eski kod ile uyumluluk için
}

// Oda tipi tanımlaması
export interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  type: string;
}

// Takvim görünümü için tarih aralığı
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Takvim filtre seçenekleri
export interface CalendarFilters {
  showOnlyAvailable: boolean;
  showOnlyConfirmed: boolean;
  dateRange: DateRange;
  roomTypes: string[];
}
