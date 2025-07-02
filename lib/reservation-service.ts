// Rezervasyon servis fonksiyonları

import {
  reservationService,
  roomService,
  where,
  orderBy,
  Timestamp,
  type QueryConstraint
} from "./firebase-service";
import type { Reservation, Room, Guest } from "./firebase-models";
import { getGuest } from "./guest-service"; // Misafir detayları için bu hala gerekli
import { createLog } from './log-service';

/**
 * Tüm rezervasyonları getirir.
 */
/**
 * Tüm rezervasyonları gerçek zamanlı olarak dinler.
 * @param onUpdate - Rezervasyonlar güncellendiğinde çağrılacak callback.
 * @param onError - Hata durumunda çağrılacak callback.
 * @returns Dinlemeyi durdurmak için bir unsubscribe fonksiyonu.
 */
export function getAllReservations(
  onUpdate: (reservations: Reservation[]) => void,
  onError: (error: Error) => void
): () => void {
  // FirebaseService'in listen metodunu kullanarak gerçek zamanlı dinleyici oluşturuyoruz.
  // Bu metodun, koleksiyondaki değişiklikleri dinleyip, veriyi onUpdate callback'ine, 
  // hataları ise onError callback'ine ilettiğini varsayıyoruz.
  return reservationService.listen(
    (data) => onUpdate(data as Reservation[]),
    onError
  );
}

/**
 * Belirli bir tarih aralığındaki çakışan rezervasyonları getirir.
 */
export async function getReservationsByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
  // Firestore'da iki farklı alan üzerinde aralık (<, >) sorgusu yapılamaz.
  // Bu yüzden önce başlangıç tarihine göre filtreleyip, sonra sonuçları kod içinde daraltıyoruz.
  const queryConstraints: QueryConstraint[] = [
    where("checkInDate", "<=", Timestamp.fromDate(endDate)),
    orderBy("checkInDate")
  ];
  const reservations = await reservationService.getAll(queryConstraints);

  // İstemci tarafında, checkOutDate'i startDate'den büyük veya eşit olanları filtrele.
  return reservations.filter(r => new Date(r.checkOutDate) >= startDate);
}

/**
 * Belirli bir odanın rezervasyonlarını getirir.
 */
export async function getReservationsByRoom(roomId: string): Promise<Reservation[]> {
  return await reservationService.getAll([
    where("roomId", "==", roomId),
    orderBy("checkInDate")
  ]);
}

/**
 * Belirli bir misafirin rezervasyonlarını getirir.
 */
export async function getReservationsByGuest(guestId: string): Promise<Reservation[]> {
  return await reservationService.getAll([
    where("guestId", "==", guestId),
    orderBy("checkInDate", "desc")
  ]);
}

/**
 * Belirli bir duruma sahip rezervasyonları getirir.
 */
export async function getReservationsByStatus(status: Reservation['status']): Promise<Reservation[]> {
  return await reservationService.getAll([
    where("status", "==", status),
    orderBy("checkInDate")
  ]);
}

/**
 * Yeni bir rezervasyon oluşturur.
 */
export async function createReservation(
  reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>,
  user: { id: string; email: string | null }
): Promise<string> {
  const newReservationId = await reservationService.add(reservationData);

  // Odanın durumunu 'dolu' olarak güncelle
  await roomService.update(reservationData.roomId, { status: 'Dolu' });

  // Log kaydı oluştur
  await createLog(
    'info',
    `Yeni rezervasyon oluşturuldu (ID: ${newReservationId})`,
    {
      guestId: reservationData.guestId,
      roomId: reservationData.roomId,
      checkIn: reservationData.checkInDate,
      checkOut: reservationData.checkOutDate,
      totalPrice: reservationData.totalPrice,
    },
    { uid: user.id, email: user.email }
  );

  return newReservationId;
}

/**
 * Bir rezervasyonu günceller.
 */
export async function updateReservation(id: string, reservationData: Partial<Reservation>): Promise<void> {
  await reservationService.update(id, reservationData);
}

/**
 * Bir rezervasyonu siler.
 */
export async function deleteReservation(id: string, user: { id: string; email: string | null }): Promise<void> {
  // Silmeden önce rezervasyon bilgilerini alarak loglama için sakla
  const reservationToDelete = await reservationService.get(id);
  if (!reservationToDelete) {
    console.error(`Silinecek rezervasyon bulunamadı: ${id}`);
    // İsteğe bağlı olarak burada bir hata fırlatılabilir
    // throw new Error('Reservation not found');
    return; // Rezervasyon yoksa işlemi sonlandır
  }

  await reservationService.delete(id);

  // Log kaydı oluştur
  await createLog(
    'warn',
    `Rezervasyon silindi (ID: ${id})`,
    {
      guestId: reservationToDelete.guestId,
      roomId: reservationToDelete.roomId,
      checkIn: reservationToDelete.checkInDate,
      checkOut: reservationToDelete.checkOutDate,
    },
    { uid: user.id, email: user.email }
  );
}

/**
 * Bir rezervasyonun durumunu günceller.
 */
export async function updateReservationStatus(id: string, status: Reservation['status']): Promise<void> {
  await reservationService.update(id, { status });
}

/**
 * Belirli bir rezervasyonu misafir detaylarıyla birlikte getirir.
 */
export async function getReservationWithGuestDetails(reservationId: string): Promise<{ reservation: Reservation; guest: Guest | null } | null> {
  try {
    const reservation = await reservationService.get(reservationId);
    if (!reservation) {
      return null;
    }

    let guest: Guest | null = null;
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
 * Bir rezervasyonun ödeme durumunu günceller.
 */
export async function updatePaymentStatus(id: string, paymentStatus: Reservation['paymentStatus']): Promise<void> {
  await reservationService.update(id, { paymentStatus });
}

/**
 * Rezervasyon taşıma (sürükle-bırak) işlemi.
 */
export async function moveReservation(id: string, newRoomId: string, newCheckInDate: Date, newCheckOutDate: Date): Promise<void> {
  await reservationService.update(id, {
    roomId: newRoomId,
    checkInDate: newCheckInDate.toISOString(),
    checkOutDate: newCheckOutDate.toISOString(),
  });
}

/**
 * Rezervasyon istatistiklerini hesaplar.
 */
export async function getReservationStatistics() {
  const reservations = await getAllReservations();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = {
    total: reservations.length,
    active: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    revenue: { total: 0, paid: 0, pending: 0 },
    occupancyRate: 0
  };

  reservations.forEach(r => {
    stats.revenue.total += r.totalPrice;
    if (r.paymentStatus === 'Ödendi') {
      stats.revenue.paid += r.totalPrice;
    } else if (r.paymentStatus === 'Bekliyor' || r.paymentStatus === 'Kısmi Ödeme') {
      stats.revenue.pending += r.totalPrice;
    }

    if (r.status === 'Tamamlandı' || r.status === 'Çıkış Yaptı') stats.completed++;
    else if (r.status === 'İptal Edildi') stats.cancelled++;
    else if (r.status === 'Onaylandı' || r.status === 'Giriş Yaptı') {
      const checkIn = new Date(r.checkInDate);
      const checkOut = new Date(r.checkOutDate);
      if (checkIn <= today && checkOut > today) stats.active++;
      else if (checkIn > today) stats.upcoming++;
    }
  });

  const rooms = await roomService.getAll();
  if (rooms.length > 0) {
    // Aktif rezervasyonları (şu anda otelde olanlar) kullanarak doluluk oranını hesapla
    stats.occupancyRate = (stats.active / rooms.length) * 100;
  }

  return stats;
}
