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
  CANCELLED = "CANCELLED"
}

export enum PaymentStatus {
  PAID = "PAID",
  PARTIAL = "PARTIAL",
  UNPAID = "UNPAID"
}

export enum BookingSource {
  DIRECT = "DIRECT",
  BOOKING = "BOOKING.COM",
  AIRBNB = "AIRBNB",
  PHONE = "PHONE",
  EMAIL = "EMAIL",
  WALK_IN = "WALK_IN"
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
