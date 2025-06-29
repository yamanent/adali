import { Reservation } from './models';

// LocalStorage'da rezervasyonları saklamak için anahtar
const RESERVATIONS_KEY = 'hotel_reservations';

// Tüm rezervasyonları getir
export const getAllReservations = (): Reservation[] => {
  if (typeof window === 'undefined') return [];
  
  const reservationsJson = localStorage.getItem(RESERVATIONS_KEY);
  if (!reservationsJson) return [];
  
  try {
    return JSON.parse(reservationsJson);
  } catch (error) {
    console.error('Rezervasyonlar yüklenirken hata oluştu:', error);
    return [];
  }
};

// Yeni rezervasyon ekle
export const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Reservation => {
  const reservations = getAllReservations();
  
  const newReservation: Reservation = {
    ...reservation,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const updatedReservations = [...reservations, newReservation];
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updatedReservations));
  
  return newReservation;
};

// Rezervasyon güncelle
export const updateReservation = (id: string, updatedData: Partial<Reservation>): Reservation | null => {
  const reservations = getAllReservations();
  
  const reservationIndex = reservations.findIndex(res => res.id === id);
  if (reservationIndex === -1) return null;
  
  const updatedReservation = {
    ...reservations[reservationIndex],
    ...updatedData,
    updatedAt: new Date().toISOString()
  };
  
  reservations[reservationIndex] = updatedReservation;
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
  
  return updatedReservation;
};

// Rezervasyon sil
export const deleteReservation = (id: string): boolean => {
  const reservations = getAllReservations();
  
  const filteredReservations = reservations.filter(res => res.id !== id);
  
  if (filteredReservations.length === reservations.length) {
    return false; // Rezervasyon bulunamadı
  }
  
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(filteredReservations));
  return true;
};

// Belirli bir rezervasyonu getir
export const getReservationById = (id: string): Reservation | null => {
  const reservations = getAllReservations();
  return reservations.find(res => res.id === id) || null;
};

// Tarih aralığına göre rezervasyonları filtrele
export const filterReservationsByDateRange = (startDate: string, endDate: string): Reservation[] => {
  const reservations = getAllReservations();
  return reservations.filter(res => {
    return res.checkInDate >= startDate && res.checkOutDate <= endDate;
  });
};

// Kanala göre rezervasyonları filtrele
export const filterReservationsByChannel = (channel: Reservation['reservationChannel']): Reservation[] => {
  const reservations = getAllReservations();
  return reservations.filter(res => res.reservationChannel === channel);
};

// Ödeme durumuna göre rezervasyonları filtrele
export const filterReservationsByPaymentStatus = (status: Reservation['paymentStatus']): Reservation[] => {
  const reservations = getAllReservations();
  return reservations.filter(res => res.paymentStatus === status);
};
