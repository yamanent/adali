// Firebase servislerini firebase-service.ts dosyasından içe aktarıyoruz
import {
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  Guest,
  COLLECTIONS,
} from './firebase-service';

const GUESTS_COLLECTION = COLLECTIONS.GUESTS;

/**
 * Creates a new guest in Firestore.
 * @param guestData - The data for the new guest.
 * @returns The ID of the newly created guest.
 */
export const createGuest = (guestData: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    return addDocument(GUESTS_COLLECTION, guestData);
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
export const getGuest = (guestId: string): Promise<Guest | null> => {
  try {
    return getDocument<Guest>(GUESTS_COLLECTION, guestId);
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
export const updateGuest = (guestId: string, updatedData: Partial<Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    return updateDocument(GUESTS_COLLECTION, guestId, updatedData);
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
export const deleteGuest = (guestId: string): Promise<void> => {
  try {
    return deleteDocument(GUESTS_COLLECTION, guestId);
  } catch (error) {
    console.error('Error deleting guest:', error);
    throw new Error('Failed to delete guest.');
  }
};

/**
 * Lists all guests from Firestore.
 * @returns An array of guest objects.
 */
export const listGuests = (): Promise<Guest[]> => {
  try {
    return getCollection<Guest>(GUESTS_COLLECTION);
  } catch (error) {
    console.error('Error listing guests:', error);
    throw new Error('Failed to list guests.');
  }
};

/**
 * Searches for guests based on a query string (e.g., name, email).
 * @param searchQuery - The string to search for.
 * @returns An array of matching guest objects.
 */
export const searchGuests = async (searchQuery: string): Promise<Guest[]> => {
  try {
    // Büyük veri setleri için bu verimsiz olabilir.
    // Daha verimli bir arama için Firestore'un kendi sorgu yeteneklerini
    // (where, orderBy, limit) kullanmak veya Algolia gibi bir servis entegre etmek gerekir.
    const allGuests = await listGuests();
    if (!searchQuery) {
      return allGuests;
    }
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
