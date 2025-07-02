// lib/guest-service.ts

import { guestService } from './firebase-service';
import { Guest } from './firebase-models';
import { createLog } from './log-service';

// Loglama için kullanılacak kullanıcı arayüzü
interface LogUser {
  uid: string;
  email: string;
}

/**
 * Creates a new guest in Firestore.
 * @param guestData - The data for the new guest.
 * @returns The ID of the newly created guest.
 */
export const createGuest = async (
  guestData: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>,
  user?: LogUser
): Promise<string> => {
  try {
    const newGuestId = await guestService.add(guestData);
    await createLog(
      'info',
      `Yeni misafir oluşturuldu: ${guestData.firstName} ${guestData.lastName}`,
      { guestId: newGuestId, ...guestData },
      user
    );
    return newGuestId;
  } catch (error) {
    console.error('Error creating guest:', error);
    await createLog(
      'error',
      'Misafir oluşturulurken bir hata oluştu.',
      { error: (error as Error).message, guestData },
      user
    );
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
    return await guestService.get(guestId);
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
export const updateGuest = async (
  guestId: string,
  updatedData: Partial<Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>>,
  user?: LogUser
): Promise<void> => {
  try {
    await guestService.update(guestId, updatedData);
    await createLog(
      'info',
      `Misafir bilgileri güncellendi.`,
      { guestId, updatedData },
      user
    );
  } catch (error) {
    console.error('Error updating guest:', error);
    await createLog(
      'error',
      'Misafir güncellenirken bir hata oluştu.',
      { error: (error as Error).message, guestId, updatedData },
      user
    );
    throw new Error('Failed to update guest.');
  }
};

/**
 * Deletes a guest from Firestore.
 * @param guestId - The ID of the guest to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteGuest = async (guestId: string, user?: LogUser): Promise<void> => {
  try {
    const guestToDelete = await getGuest(guestId);
    await guestService.delete(guestId);
    await createLog(
      'info',
      `Misafir silindi: ${guestToDelete ? `${guestToDelete.firstName} ${guestToDelete.lastName}` : `ID'si ${guestId} olan misafir`}`,
      { guestId },
      user
    );
  } catch (error) {
    console.error('Error deleting guest:', error);
    await createLog(
      'error',
      'Misafir silinirken bir hata oluştu.',
      { error: (error as Error).message, guestId },
      user
    );
    throw new Error('Failed to delete guest.');
  }
};

/**
 * Lists all guests from Firestore.
 * @returns An array of guest objects.
 */
export const listGuests = async (): Promise<Guest[]> => {
  try {
    return await guestService.getAll();
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
    // Büyük/küçük harf duyarsız arama için Firestore'da doğrudan bir çözüm yoktur.
    // Bu nedenle, tüm misafirleri alıp istemci tarafında filtreliyoruz.
    // Büyük veri setleri için bu verimsiz olabilir.
    // Daha verimli bir arama için Algolia gibi bir servis entegre etmek veya
    const allGuests = await listGuests();
    if (!searchQuery) {
      return allGuests;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allGuests.filter(guest => {
      const firstNameMatch = guest.firstName.toLowerCase().includes(lowerCaseQuery);
      const lastNameMatch = guest.lastName.toLowerCase().includes(lowerCaseQuery);
      const emailMatch = guest.email ? guest.email.toLowerCase().includes(lowerCaseQuery) : false;
      const phoneMatch = guest.phone ? guest.phone.includes(lowerCaseQuery) : false;
      return firstNameMatch || lastNameMatch || emailMatch || phoneMatch;
    });
  } catch (error) {
    console.error('Error searching guests:', error);
    throw new Error('Failed to search guests.');
  }
};
