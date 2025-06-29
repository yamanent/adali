// types.ts
// Bu dosya, uygulama genelinde kullanılacak olan TypeScript arayüzlerini (interface) ve
// enum tanımlamalarını içerir. Özellikle Firestore veritabanı şemasına karşılık gelen
// veri modelleri burada tanımlanmıştır.

// Genel Notlar:
// - ID Alanları: Tüm ana modellerde 'id' alanı, Firestore doküman ID'sini temsil eder.
// - Tarih Alanları: Modellerde string olarak tanımlanan tarih alanları (örn: checkInDate, createdAt),
//   Firestore'a yazılırken Timestamp objesine, okunurken ISO 8601 string formatına
//   `lib/firebase-service.ts` içindeki yardımcı fonksiyonlar aracılığıyla dönüştürülür.
//   Bu, hem okunabilirlik hem de Firestore'un sorgulama yetenekleri için önemlidir.

export enum ReservationStatus {
  CONFIRMED = "CONFIRMED", // Rezervasyon onaylandı
  PENDING = "PENDING",     // Rezervasyon beklemede, henüz onaylanmadı
  CHECKED_IN = "CHECKED_IN", // Giriş Yaptı
  CHECKED_OUT = "CHECKED_OUT", // Çıkış Yaptı
  CANCELLED = "CANCELLED",   // İptal Edildi
  NO_SHOW = "NO_SHOW"        // Gelmedi
}

export enum PaymentStatus {
  PAID = "PAID",         // Ödendi
  PARTIAL = "PARTIAL",     // Kısmi Ödeme
  UNPAID = "UNPAID",       // Ödenmedi
  REFUNDED = "REFUNDED"    // İade Edildi
}

export enum BookingSource {
  DIRECT = "DIRECT",           // Doğrudan (Website, Telefon vb.)
  BOOKING_COM = "BOOKING.COM",
  AIRBNB = "AIRBNB",
  EXPEDIA = "EXPEDIA",
  PHONE = "PHONE",
  EMAIL = "EMAIL",
  WALK_IN = "WALK_IN",         // Kapıdan Giriş
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  OTHER = "OTHER"              // Diğer
}

export interface Reservation {
  id: string; // Firestore document ID
  guestName: string;
  phoneNumber: string;
  email?: string;
  checkInDate: string; // ISO string (örn: "2024-07-28") veya Timestamp
  checkOutDate: string; // ISO string veya Timestamp
  roomId: string; // Referans verilen Oda ID'si
  roomNumber?: string; // Rezervasyon anındaki oda numarası (denormalizasyon)
  roomType?: string; // Rezervasyon anındaki oda tipi (denormalizasyon)
  guestCount: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  status: ReservationStatus;
  source: BookingSource;
  notes?: string;
  createdAt: string; // ISO string veya Timestamp
  updatedAt: string; // ISO string veya Timestamp
  userId?: string; // Rezervasyonu oluşturan kullanıcı ID'si (opsiyonel)
}

export enum RoomStatus {
  AVAILABLE = "AVAILABLE", // Boş, Kullanılabilir
  OCCUPIED = "OCCUPIED",   // Dolu
  CLEANING = "CLEANING",   // Temizlikte
  MAINTENANCE = "MAINTENANCE", // Bakımda
  OUT_OF_ORDER = "OUT_OF_ORDER" // Hizmet Dışı
}

export enum RoomType {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
  TWIN = "TWIN",
  SUITE = "SUITE",
  FAMILY = "FAMILY",
  DELUXE = "DELUXE",
  STANDARD = "STANDARD",
  OTHER = "OTHER"
}

export interface Room {
  id: string; // Firestore document ID
  roomNumber: string; // Oda Numarası (örn: "101", "A2")
  name?: string; // Odaya özel bir isim (örn: "Deniz Manzaralı Suit")
  type: RoomType; // Oda Tipi (enum)
  capacity: number; // Kişi kapasitesi
  floor?: number; // Kat numarası
  price: number; // Gecelik baz fiyat
  status: RoomStatus; // Odanın mevcut durumu (enum)
  amenities?: string[]; // Olanaklar (örn: ["wifi", "tv", "minibar"])
  description?: string;
  images?: string[]; // Oda görsellerinin URL'leri
  createdAt: string; // ISO string veya Timestamp
  updatedAt: string; // ISO string veya Timestamp
}

export enum ExpenseCategory {
  STAFF = "STAFF", // Personel
  UTILITIES = "UTILITIES", // Faturalar (Elektrik, Su, Doğalgaz, İnternet)
  SUPPLIES = "SUPPLIES", // Malzemeler (Temizlik, Gıda vb.)
  MAINTENANCE = "MAINTENANCE", // Bakım & Onarım
  MARKETING = "MARKETING", // Pazarlama
  ADMINISTRATIVE = "ADMINISTRATIVE", // İdari Giderler
  TAXES = "TAXES", // Vergiler
  OTHER = "OTHER" // Diğer
}

export enum PaymentMethod {
  CASH = "CASH", // Nakit
  CREDIT_CARD = "CREDIT_CARD", // Kredi Kartı
  BANK_TRANSFER = "BANK_TRANSFER", // Banka Transferi
  OTHER = "OTHER" // Diğer
}

export interface Expense {
  id: string; // Firestore document ID
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // Giderin yapıldığı tarih (ISO string veya Timestamp)
  description?: string;
  paymentMethod: PaymentMethod;
  receiptNumber?: string;
  vendor?: string; // Tedarikçi veya hizmet alınan yer
  userId?: string; // Gideri ekleyen kullanıcı ID'si (opsiyonel)
  createdAt: string; // ISO string veya Timestamp
  updatedAt: string; // ISO string veya Timestamp
}

// Takvim görünümü için tarih aralığı
export interface DateRange {
  startDate: string; // ISO string veya Timestamp
  endDate: string; // ISO string veya Timestamp
}

// Takvim filtre seçenekleri
export interface CalendarFilters {
  showOnlyAvailable: boolean;
  showOnlyConfirmed: boolean;
  dateRange: DateRange;
  roomTypes: RoomType[];
}

// Misafir (Guest) Modeli
export interface Guest {
  id: string; // Firestore document ID
  fullName: string;
  email?: string;
  phoneNumber: string;
  identityNumber?: string; // TC Kimlik No, Pasaport No vb.
  nationality?: string;
  birthDate?: string; // ISO string (örn: "1990-01-15")
  address?: string; // Adres bilgisi
  preferences?: string[]; // Misafir tercihleri (örn: "sigara içilmeyen oda", "yüksek kat")
  notes?: string; // Misafir hakkında ek notlar
  createdAt: string; // ISO string veya Timestamp
  updatedAt: string; // ISO string veya Timestamp
  // totalSpent?: number; // Misafirin toplam harcaması (hesaplanabilir)
  // reservationHistory?: string[]; // Misafirin geçmiş rezervasyon ID'leri (referans)
}
