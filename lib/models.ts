// Rezervasyon modeli
export interface Reservation {
  id: string;
  guestName: string;
  phone: string;
  email?: string;
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string;
  roomType: string;
  guestCount: number;
  totalPrice: number;
  paymentStatus: 'Ödendi' | 'Kısmi' | 'Bekliyor';
  reservationChannel: 'Booking.com' | 'Airbnb' | 'Website' | 'Telefon' | 'WhatsApp' | 'Sosyal Medya' | 'Walk-in' | 'Diğer';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Oda modeli
export interface Room {
  id: string;
  number: string;
  type: string;
  capacity: number;
  price: number;
  status: 'Boş' | 'Dolu' | 'Temizlik' | 'Bakım';
}

// Gider modeli
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'Personel' | 'Elektrik' | 'Su' | 'Doğalgaz' | 'İnternet' | 'Temizlik' | 'Bakım' | 'Gıda' | 'Diğer';
  date: string;
  description?: string;
  paymentMethod: 'Nakit' | 'Kredi Kartı' | 'Banka Transferi' | 'Diğer';
  receiptNumber?: string;
  createdAt: string;
  updatedAt: string;
}
