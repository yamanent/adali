import {
  collection,
  query,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  Timestamp,
  orderBy,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import { Reservation, Guest, Room } from "./firebase-models";
import { getGuest } from "./guest-service";
import * as roomService from "./room-service";
import { createLog } from './log-service';

// Helper to convert Firestore doc to Reservation
const docToReservation = (doc: any): Reservation => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        // Convert Timestamps to ISO strings for consistency
        checkInDate: data.checkInDate instanceof Timestamp ? data.checkInDate.toDate().toISOString() : data.checkInDate,
        checkOutDate: data.checkOutDate instanceof Timestamp ? data.checkOutDate.toDate().toISOString() : data.checkOutDate,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    } as Reservation;
};

/**
 * Tüm rezervasyonları bir kereliğine getirir.
 */
export async function getAllReservations(): Promise<Reservation[]> {
    const reservationsCol = collection(db, 'reservations');
    const q = query(reservationsCol, orderBy("checkInDate", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToReservation);
}

/**
 * Tüm rezervasyonları gerçek zamanlı olarak dinler.
 * @param onUpdate - Rezervasyonlar güncellendiğinde çağrılacak callback.
 * @param onError - Hata durumunda çağrılacak callback.
 * @returns Dinlemeyi durdurmak için bir unsubscribe fonksiyonu.
 */
export function listenToReservations(
  onUpdate: (reservations: Reservation[]) => void,
  onError: (error: Error) => void
): () => void {
  const reservationsCol = collection(db, 'reservations');
  const q = query(reservationsCol, orderBy("checkInDate", "desc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const reservations = querySnapshot.docs.map(docToReservation);
    onUpdate(reservations);
  }, (error) => {
    console.error("Error listening to reservations: ", error);
    onError(error);
  });

  return unsubscribe;
}


/**
 * Belirli bir rezervasyonu ID ile getirir.
 */
export async function getReservationById(id: string): Promise<Reservation | null> {
    const docRef = doc(db, "reservations", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docToReservation(docSnap);
    } else {
        console.log("No such reservation!");
        return null;
    }
}


/**
 * Yeni bir rezervasyon oluşturur.
 */
export async function createReservation(
  reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>,
  user: { id: string; email: string | null }
): Promise<string> {
    const reservationsCol = collection(db, 'reservations');
    const docRef = await addDoc(reservationsCol, {
        ...reservationData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });

    // Odanın durumunu 'dolu' olarak güncelle
    await roomService.updateRoom(reservationData.roomId, { status: 'Dolu' });

    // Log kaydı oluştur
    await createLog(
        'info',
        `Yeni rezervasyon oluşturuldu (ID: ${docRef.id})`,
        {
            guestId: reservationData.guestId,
            roomId: reservationData.roomId,
            checkIn: reservationData.checkInDate,
            checkOut: reservationData.checkOutDate,
            totalPrice: reservationData.totalPrice,
        },
        { uid: user.id, email: user.email }
    );

    return docRef.id;
}

/**
 * Bir rezervasyonu günceller.
 */
export async function updateReservation(id: string, reservationData: Partial<Omit<Reservation, 'id'>>): Promise<void> {
    const docRef = doc(db, "reservations", id);
    await updateDoc(docRef, {
        ...reservationData,
        updatedAt: Timestamp.now(),
    });
}

/**
 * Bir rezervasyonu siler.
 */
export async function deleteReservation(id: string, user: { id: string; email: string | null }): Promise<void> {
    const reservationToDelete = await getReservationById(id);
    if (!reservationToDelete) {
        throw new Error(`Silinecek rezervasyon bulunamadı: ${id}`);
    }

    const docRef = doc(db, "reservations", id);
    await deleteDoc(docRef);

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
 * Rezervasyon istatistiklerini hesaplar.
 */
export async function getReservationStatistics() {
    const reservationsCol = collection(db, 'reservations');
    const querySnapshot = await getDocs(query(reservationsCol));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allRooms = await roomService.getAllRooms();
    const totalRoomCount = allRooms.length;

    const stats = {
        total: 0,
        active: 0,
        upcoming: 0,
        completed: 0,
        revenue: {
            total: 0,
            paid: 0,
            pending: 0
        },
        occupancyRate: 0
    };

    querySnapshot.forEach((doc) => {
        const r = doc.data() as Reservation;
        stats.total++;
        stats.revenue.total += r.totalPrice || 0;
        if (r.paymentStatus === 'Ödendi') {
            stats.revenue.paid += r.totalPrice || 0;
        } else {
            stats.revenue.pending += r.totalPrice || 0;
        }

        const checkIn = new Date(r.checkInDate);
        const checkOut = new Date(r.checkOutDate);

        if (today >= checkIn && today < checkOut) {
            stats.active++;
        } else if (today < checkIn) {
            stats.upcoming++;
        } else if (today >= checkOut) {
            stats.completed++;
        }
    });

    if (totalRoomCount > 0) {
        stats.occupancyRate = (stats.active / totalRoomCount) * 100;
    }

    return stats;
}
