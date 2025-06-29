// Bu dosyadaki modellerin güncel ve kapsamlı versiyonları lib/types.ts içerisindedir.
// Mevcut importların kırılmaması için buradan yeniden dışa aktarılmaktadır.
// Yeni geliştirmelerde doğrudan lib/types.ts içerisindeki tanımlamaları kullanın.

export type {
  Reservation,
  ReservationStatus,
  PaymentStatus,
  BookingSource,
  Room,
  RoomStatus,
  RoomType,
  Expense,
  ExpenseCategory,
  PaymentMethod,
  Guest, // Guest modeli de artık lib/types.ts altında.
  DateRange,
  CalendarFilters,
} from './types';

// Diğer eski model tanımlamaları veya bu dosyada kalması gereken özel bir tanım yoksa,
// bu dosya ileride tamamen kaldırılabilir ve importlar doğrudan lib/types.ts'e yönlendirilebilir.
// Şimdilik, geçiş sürecini kolaylaştırmak için bu şekilde bırakılmıştır.
