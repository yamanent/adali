// Firebase servislerini firebase-service.ts dosyasından içe aktarıyoruz
import { firestore } from './firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  getDocs,
  Timestamp,
} from './firebase-service';

// Guest modelini firebase-service.ts'den içe aktarıyoruz
import { Guest } from './firebase-service';

const GUESTS_COLLECTION = 'guests';

// Firestore'dan gelen veriyi Guest tipine dönüştürmek için yardımcı fonksiyon
const mapDocumentToGuest = (docSnapshot: any): Guest => {
  const data = docSnapshot.data();
  
  // Tarih alanlarını güvenli bir şekilde dönüştür
  const processTimestamp = (timestamp: any): string => {
    if (!timestamp) return new Date().toISOString();
    
    // Timestamp nesnesiyse ve toDate fonksiyonu varsa
    if (timestamp && typeof timestamp === 'object' && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toISOString();
    }
    
    // Timestamp nesnesiyse ama toDate fonksiyonu yoksa (localStorage'dan gelmiş olabilir)
    if (timestamp && typeof timestamp === 'object' && timestamp.seconds !== undefined) {
      const milliseconds = timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000;
      return new Date(milliseconds).toISOString();
    }
    
    // Zaten string ise
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    
    // Date nesnesi ise
    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    }
    
    return new Date().toISOString();
  };
  
  return {
    id: docSnapshot.id,
    ...data,
    createdAt: processTimestamp(data.createdAt),
    updatedAt: processTimestamp(data.updatedAt),
  } as Guest;
};

/**
 * Creates a new guest in Firestore.
 * @param guestData - The data for the new guest.
 * @returns The ID of the newly created guest.
 */
export const createGuest = async (guestData: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(firestore, GUESTS_COLLECTION), {
      ...guestData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating guest:', error);
    throw new Error('Failed to create guest.');
  }
};

/**
 * Retrieves a specific guest from Firestore by ID.
 * @param guestId - The ID of the guest to retrieve.
 * @returns The guest data or null if not found.
 */
export const getGuest = async (guestId: string): Promise<Guest | null> => {
  try {
    const docRef = doc(firestore, GUESTS_COLLECTION, guestId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return mapDocumentToGuest(docSnap);
    }
    return null;
  } catch (error) {
    console.error('Error getting guest:', error);
    throw new Error('Failed to retrieve guest.');
  }
};

/**
 * Updates an existing guest in Firestore.
 * @param guestId - The ID of the guest to update.
 * @param updatedData - An object containing the fields to update.
 * @returns A promise that resolves when the update is complete.
 */
export const updateGuest = async (guestId: string, updatedData: Partial<Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const guestRef = doc(firestore, GUESTS_COLLECTION, guestId);
    await updateDoc(guestRef, {
      ...updatedData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating guest:', error);
    throw new Error('Failed to update guest.');
  }
};

/**
 * Deletes a guest from Firestore.
 * @param guestId - The ID of the guest to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteGuest = async (guestId: string): Promise<void> => {
  try {
    const guestRef = doc(firestore, GUESTS_COLLECTION, guestId);
    await deleteDoc(guestRef);
  } catch (error) {
    console.error('Error deleting guest:', error);
    // Firestore'da referans bütünlüğü kontrolü olmadığı için,
    // bu misafirin rezervasyonları olup olmadığını kontrol etmek ve
    // silme işlemini engellemek veya kullanıcıyı uyarmak gerekebilir.
    // Şimdilik sadece hata logluyoruz.
    throw new Error('Failed to delete guest.');
  }
};

/**
 * Lists all guests from Firestore.
 * @returns An array of guest objects.
 */
export const listGuests = async (): Promise<Guest[]> => {
  try {
    const q = query(collection(firestore, GUESTS_COLLECTION));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocumentToGuest);
  } catch (error) {
    console.error('Error listing guests:', error);
    throw new Error('Failed to list guests.');
  }
};

// Misafir araması için ek fonksiyon (opsiyonel)
/**
 * Searches for guests based on a query string (e.g., name, email).
 * @param searchQuery - The string to search for.
 * @returns An array of matching guest objects.
 */
export const searchGuests = async (searchQuery: string): Promise<Guest[]> => {
  try {
    // Firestore'da basit bir "içerir" araması yapmak için,
    // genellikle alanları küçük harfe çevirip `startsWith` benzeri bir mantık kullanılır.
    // Daha karmaşık aramalar için Algolia gibi üçüncü parti servisler gerekebilir.
    // Bu örnekte, tüm misafirleri çekip istemci tarafında filtreleme yapacağız.
    // Büyük veri setleri için bu verimsiz olabilir.
    const allGuests = await listGuests();
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allGuests.filter(guest =>
      guest.firstName.toLowerCase().includes(lowerCaseQuery) ||
      guest.lastName.toLowerCase().includes(lowerCaseQuery) ||
      (guest.email && guest.email.toLowerCase().includes(lowerCaseQuery)) ||
      (guest.phone && guest.phone.includes(lowerCaseQuery))
    );
  } catch (error) {
    console.error('Error searching guests:', error);
    throw new Error('Failed to search guests.');
  }
};
