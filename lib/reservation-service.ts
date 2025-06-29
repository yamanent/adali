// Rezervasyon servis fonksiyonları

import { firestore } from "./firebase"; // Assuming firestore is correctly initialized in firebase.ts
import { collection, query, where, orderBy, getDocs, Timestamp, addDoc, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { Reservation, Room } from "./firebase-models"; // Guest model is not directly used here anymore for embedding
import { getById, getAll, getFiltered, create, update, remove } from "./firebase-service";
import { getGuest } from "./guest-service"; // Import guest service to fetch guest details

// Koleksiyon adları
const RESERVATIONS_COLLECTION = "reservations";
const ROOMS_COLLECTION = "rooms";
const GUESTS_COLLECTION = "guests";

/**
 * Tüm rezervasyonları getirir
 */
export async function getAllReservations(): Promise<Reservation[]> {
  return await getAll<Reservation>(RESERVATIONS_COLLECTION);
}

/**
 * Belirli bir tarih aralığındaki rezervasyonları getirir
 */
export async function getReservationsByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
  const startDateStr = startDate.toISOString();
  const endDateStr = endDate.toISOString();
  
  return await getFiltered<Reservation>(RESERVATIONS_COLLECTION, [
    where("checkInDate", "<=", endDateStr),
    where("checkOutDate", ">=", startDateStr),
    orderBy("checkInDate")
  ]);
}

/**
 * Belirli bir odanın rezervasyonlarını getirir
 */
export async function getReservationsByRoom(roomId: string): Promise<Reservation[]> {
  return await getFiltered<Reservation>(RESERVATIONS_COLLECTION, [
    where("roomId", "==", roomId),
    orderBy("checkInDate")
  ]);
}

/**
 * Belirli bir misafirin rezervasyonlarını getirir
 */
export async function getReservationsByGuest(guestId: string): Promise<Reservation[]> {
  return await getFiltered<Reservation>(RESERVATIONS_COLLECTION, [
    where("guestId", "==", guestId),
    orderBy("checkInDate", "desc")
  ]);
}

/**
 * Belirli bir duruma sahip rezervasyonları getirir
 */
export async function getReservationsByStatus(status: Reservation['status']): Promise<Reservation[]> {
  return await getFiltered<Reservation>(RESERVATIONS_COLLECTION, [
    where("status", "==", status),
    orderBy("checkInDate")
  ]);
}

/**
 * Yeni bir rezervasyon oluşturur
 */
export async function createReservation(reservationData: Omit<Reservation, 'id'>): Promise<string> {
  return await create<Reservation>(RESERVATIONS_COLLECTION, reservationData);
}

/**
 * Bir rezervasyonu günceller
 */
export async function updateReservation(id: string, reservationData: Partial<Reservation>): Promise<void> {
  await update<Reservation>(RESERVATIONS_COLLECTION, id, reservationData);
}

/**
 * Bir rezervasyonu siler
 */
export async function deleteReservation(id: string): Promise<void> {
  await remove(RESERVATIONS_COLLECTION, id);
}

/**
 * Bir rezervasyonun durumunu günceller
 */
export async function updateReservationStatus(id: string, status: Reservation['status']): Promise<void> {
  await update<Reservation>(RESERVATIONS_COLLECTION, id, { status });
}

/**
 * Retrieves a specific reservation by its ID, along with the guest details.
 */
export async function getReservationWithGuestDetails(reservationId: string): Promise<{ reservation: Reservation; guest: Guest | null } | null> {
  try {
    const reservation = await getById<Reservation>(RESERVATIONS_COLLECTION, reservationId);
    if (!reservation) {
      return null;
    }

    let guest = null;
    if (reservation.guestId) {
      guest = await getGuest(reservation.guestId);
    }

    return { reservation, guest };
  } catch (error) {
    console.error("Error fetching reservation with guest details:", error);
    throw new Error("Failed to retrieve reservation with guest details.");
  }
}


/**
 * Bir rezervasyonun ödeme durumunu günceller
 */
export async function updatePaymentStatus(id: string, paymentStatus: Reservation['paymentStatus']): Promise<void> {
  await update<Reservation>(RESERVATIONS_COLLECTION, id, { paymentStatus });
}

/**
 * Rezervasyon taşıma (sürükle-bırak) işlemi
 */
export async function moveReservation(id: string, newRoomId: string, newCheckInDate: Date, newCheckOutDate: Date): Promise<void> {
  await update<Reservation>(RESERVATIONS_COLLECTION, id, {
    roomId: newRoomId,
    checkInDate: newCheckInDate.toISOString(),
    checkOutDate: newCheckOutDate.toISOString(),
    updatedAt: new Date().toISOString()
  });
}

/**
 * Rezervasyon istatistiklerini hesaplar
 */
export async function getReservationStatistics() {
  const reservations = await getAllReservations();
  
  // Bugünün tarihi
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();
  
  // İstatistikler
  const stats = {
    total: reservations.length,
    active: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    revenue: {
      total: 0,
      paid: 0,
      pending: 0
    },
    occupancyRate: 0
  };
  
  // İstatistikleri hesapla
  reservations.forEach(reservation => {
    // Toplam gelir
    stats.revenue.total += reservation.totalPrice;
    
    // Ödeme durumuna göre
    if (reservation.paymentStatus === 'paid') {
      stats.revenue.paid += reservation.totalPrice;
    } else {
      stats.revenue.pending += reservation.totalPrice;
    }
    
    // Rezervasyon durumuna göre
    if (reservation.status === 'completed') {
      stats.completed++;
    } else if (reservation.status === 'cancelled') {
      stats.cancelled++;
    } else if (reservation.status === 'confirmed') {
      const checkInDate = new Date(reservation.checkInDate);
      const checkOutDate = new Date(reservation.checkOutDate);
      
      if (checkInDate <= today && checkOutDate >= today) {
        // Aktif rezervasyon (şu anda konaklama devam ediyor)
        stats.active++;
      } else if (checkInDate > today) {
        // Gelecek rezervasyon
        stats.upcoming++;
      }
    }
  });
  
  // Doluluk oranını hesapla (aktif odalar / toplam odalar)
  const rooms = await getAll<Room>(ROOMS_COLLECTION);
  if (rooms.length > 0) {
    const activeReservations = await getFiltered<Reservation>(RESERVATIONS_COLLECTION, [
      where("checkInDate", "<=", todayStr),
      where("checkOutDate", ">=", todayStr),
      where("status", "==", "confirmed")
    ]);
    
    stats.occupancyRate = (activeReservations.length / rooms.length) * 100;
  }
  
  return stats;
}
