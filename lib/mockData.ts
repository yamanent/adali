import { Reservation, ReservationStatus, PaymentStatus, BookingSource, Room } from './types';
import { format, addDays, subDays } from 'date-fns';

// Türkçe isimler ve soyadları
const firstNames = [
  'Ahmet', 'Mehmet', 'Ali', 'Ayşe', 'Fatma', 'Zeynep', 'Mustafa', 'Emine', 
  'İbrahim', 'Hatice', 'Hüseyin', 'Elif', 'Hasan', 'Meryem', 'Ömer', 'Zehra',
  'Halil', 'Esra', 'İsmail', 'Merve', 'Yusuf', 'Büşra', 'Ramazan', 'Gülsüm'
];

const lastNames = [
  'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk',
  'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Şen',
  'Koç', 'Kurt', 'Özkan', 'Şimşek', 'Avcı', 'Eroğlu', 'Güneş', 'Korkmaz'
];

// Rastgele telefon numarası oluştur
const generatePhoneNumber = (): string => {
  const prefix = '05';
  const secondDigit = Math.floor(Math.random() * 6) + 3; // 3-8 arası
  const remainingDigits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
  return `${prefix}${secondDigit}${remainingDigits}`;
};

// Rastgele e-posta oluştur
const generateEmail = (firstName: string, lastName: string): string => {
  const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomDomain}`;
};

// Rastgele rezervasyon durumu oluştur
const generateReservationStatus = (): ReservationStatus => {
  const statuses = [
    ReservationStatus.CONFIRMED,
    ReservationStatus.PENDING,
    ReservationStatus.CHECKED_IN,
    ReservationStatus.CHECKED_OUT,
    ReservationStatus.CANCELLED
  ];
  const weights = [0.6, 0.1, 0.15, 0.1, 0.05]; // Ağırlıklar (toplamı 1 olmalı)
  
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return statuses[i];
    }
  }
  
  return ReservationStatus.CONFIRMED;
};

// Rastgele ödeme durumu oluştur
const generatePaymentStatus = (): PaymentStatus => {
  const statuses = [PaymentStatus.PAID, PaymentStatus.PARTIAL, PaymentStatus.UNPAID];
  const weights = [0.7, 0.2, 0.1]; // Ağırlıklar (toplamı 1 olmalı)
  
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return statuses[i];
    }
  }
  
  return PaymentStatus.PAID;
};

// Rastgele rezervasyon kaynağı oluştur
const generateBookingSource = (): BookingSource => {
  const sources = [
    BookingSource.DIRECT,
    BookingSource.BOOKING,
    BookingSource.AIRBNB,
    BookingSource.PHONE,
    BookingSource.EMAIL,
    BookingSource.WALK_IN
  ];
  const weights = [0.2, 0.4, 0.15, 0.1, 0.05, 0.1]; // Ağırlıklar (toplamı 1 olmalı)
  
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return sources[i];
    }
  }
  
  return BookingSource.DIRECT;
};

// Rastgele kalış süresi oluştur (1-7 gün arası)
const generateStayDuration = (): number => {
  return Math.floor(Math.random() * 7) + 1;
};

// Rastgele kişi sayısı oluştur (1-4 kişi arası)
const generateGuestCount = (): number => {
  return Math.floor(Math.random() * 4) + 1;
};

// Rastgele not oluştur
const generateNotes = (): string | undefined => {
  const notes = [
    'Deniz manzaralı oda talep edildi',
    'Erken check-in istendi',
    'Geç check-out istendi',
    'Balayı çifti, özel karşılama hazırlanacak',
    'Alerjisi var, yastıklar değiştirilecek',
    'İlave yatak istendi',
    'Kahvaltı dahil',
    'Bebek yatağı gerekiyor',
    'VIP misafir',
    'Tekerlekli sandalye erişimi gerekiyor'
  ];
  
  // %30 ihtimalle not ekle
  if (Math.random() < 0.3) {
    return notes[Math.floor(Math.random() * notes.length)];
  }
  
  return undefined;
};

// Rastgele rezervasyon oluştur
export const generateRandomReservation = (roomId: string, startDate: Date): Reservation | null => {
  // %60 doluluk oranı
  if (Math.random() > 0.6) {
    return null;
  }
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  
  const stayDuration = generateStayDuration();
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(addDays(startDate, stayDuration), 'yyyy-MM-dd');
  
  return {
    id: `res-${Math.random().toString(36).substr(2, 9)}`,
    roomId,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    guestName: fullName,
    guestCount: generateGuestCount(),
    phoneNumber: generatePhoneNumber(),
    email: generateEmail(firstName, lastName),
    status: generateReservationStatus(),
    notes: generateNotes(),
    paymentStatus: generatePaymentStatus(),
    source: generateBookingSource(),
    createdAt: format(subDays(startDate, Math.floor(Math.random() * 30) + 1), 'yyyy-MM-dd')
  };
};

// Belirli bir oda için rezervasyon verileri oluştur
export function generateReservationsForRoom(room: Room, startDate: Date, daysToShow: number = 30): Reservation[] {
  const reservations: Reservation[] = [];
  
  // Belirtilen gün sayısı kadar döngü
  for (let i = 0; i < daysToShow; i++) {
    const currentDate = addDays(startDate, i);
    const reservation = generateRandomReservation(room.id, currentDate);
    
    if (reservation) {
      // Önceki rezervasyonlarla çakışma kontrolü
      const overlapping = reservations.some(existingRes => {
        const existingStart = new Date(existingRes.startDate);
        const existingEnd = new Date(existingRes.endDate);
        const newStart = new Date(reservation.startDate);
        const newEnd = new Date(reservation.endDate);
        
        return (
          (newStart >= existingStart && newStart < existingEnd) ||
          (newEnd > existingStart && newEnd <= existingEnd) ||
          (newStart <= existingStart && newEnd >= existingEnd)
        );
      });
      
      if (!overlapping) {
        reservations.push(reservation);
      }
    }
  }
  
  return reservations;
}

// Tüm odalar için rezervasyon verileri oluştur
export function generateReservationsForAllRooms(startDate: Date, daysToShow: number = 30): Reservation[][] {
  const result: Reservation[][] = [];
  
  ROOMS.forEach(room => {
    result.push(generateReservationsForRoom(room, startDate, daysToShow));
  });
  
  return result;
}

// Oda bilgileri
export const ROOMS: Room[] = [
  { id: "101", name: "101", floor: 1, capacity: 2, type: "Standart" },
  { id: "102", name: "102", floor: 1, capacity: 2, type: "Standart" },
  { id: "103", name: "103", floor: 1, capacity: 3, type: "Deluxe" },
  { id: "104", name: "104", floor: 1, capacity: 3, type: "Deluxe" },
  { id: "105", name: "105", floor: 1, capacity: 4, type: "Aile" },
  { id: "106", name: "106", floor: 1, capacity: 4, type: "Aile" },
  { id: "201", name: "201", floor: 2, capacity: 2, type: "Standart" },
  { id: "202", name: "202", floor: 2, capacity: 2, type: "Standart" },
  { id: "203", name: "203", floor: 2, capacity: 3, type: "Deluxe" },
  { id: "204", name: "204", floor: 2, capacity: 3, type: "Deluxe" },
  { id: "205", name: "205", floor: 2, capacity: 4, type: "Aile" },
  { id: "206", name: "206", floor: 2, capacity: 4, type: "Süit" },
];
