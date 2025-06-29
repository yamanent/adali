// lib/services/userService.ts
import {
  getCollection,
  updateDocument,
  getDocument,
  getCollectionWithRealtimeUpdates,
  COLLECTIONS,
  QueryConstraint,
  where, // where'i import etmeyi unutma
  orderBy // orderBy'ı import etmeyi unutma
} from '../firebase-service'; // Ana firebase-service'ten import
import { FirestoreUser } from '../firebase-models'; // Kullanıcı modelini import et
import { UserRole } from '@/types/auth'; // UserRole enum'ını import et

// Firestore'daki 'users' koleksiyonu için özel bir servis
// Not: firebase-service.ts içinde zaten userService adında bir export olabilir.
// Eğer öyleyse, bu servisi oraya entegre etmek veya farklı bir isim kullanmak gerekebilir.
// Şimdilik, ayrı bir userService.ts oluşturduğumuzu varsayıyoruz.
// Eğer firebase-service.ts içinde userService varsa, bu fonksiyonları oraya ekleyeceğiz.

/**
 * Tüm kullanıcıları getirir.
 * @param constraints İsteğe bağlı sorgu kısıtlamaları
 * @returns Kullanıcıların listesi.
 */
export const getAllUsers = async (constraints: QueryConstraint[] = [orderBy("displayName", "asc")]): Promise<FirestoreUser[]> => {
  try {
    return await getCollection<FirestoreUser>(COLLECTIONS.USERS, constraints);
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Failed to fetch users.");
  }
};

/**
 * Belirli bir kullanıcının rolünü günceller.
 * @param userId Güncellenecek kullanıcının ID'si.
 * @param newRole Atanacak yeni rol.
 */
export const updateUserRole = async (userId: string, newRole: UserRole): Promise<void> => {
  try {
    // Sadece 'role' alanını güncelle
    await updateDocument<Partial<FirestoreUser>>(COLLECTIONS.USERS, userId, { role: newRole });
  } catch (error) {
    console.error(`Error updating role for user ${userId}:`, error);
    throw new Error("Failed to update user role.");
  }
};

/**
 * Kullanıcıları gerçek zamanlı olarak dinler.
 * @param callback Veri güncellendiğinde çağrılacak fonksiyon.
 * @param constraints İsteğe bağlı sorgu kısıtlamaları.
 * @returns Dinleyiciyi sonlandırmak için unsubscribe fonksiyonu.
 */
export const listenToUsers = (
  callback: (users: FirestoreUser[]) => void,
  constraints: QueryConstraint[] = [orderBy("displayName", "asc")]
): (() => void) => {
  try {
    return getCollectionWithRealtimeUpdates<FirestoreUser>(COLLECTIONS.USERS, callback, constraints);
  } catch (error) {
    console.error("Error listening to users:", error);
    throw new Error("Failed to listen to users.");
    // Hata durumunda boş bir unsubscribe fonksiyonu döndürerek uygulamanın çökmesini engelleyebiliriz.
    // return () => {};
  }
};

/**
 * Belirli bir kullanıcıyı ID ile getirir.
 * @param userId Getirilecek kullanıcının ID'si.
 * @returns Kullanıcı verisi veya null.
 */
export const getUserById = async (userId: string): Promise<FirestoreUser | null> => {
    try {
        return await getDocument<FirestoreUser>(COLLECTIONS.USERS, userId);
    } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        throw new Error("Failed to fetch user.");
    }
};


// userService objesi olarak export etmek yerine, fonksiyonları doğrudan export ediyoruz.
// Eğer firebase-service.ts içindeki yapıya uymak istenirse:
/*
export const userService = {
  getAll: getAllUsers,
  updateRole: updateUserRole,
  listen: listenToUsers,
  getById: getUserById,
  // Gerekirse diğer CRUD operasyonları (add, set, delete) buraya eklenebilir.
  // Ancak genellikle kullanıcılar Firebase Auth üzerinden oluşturulur ve Firestore'a
  // senkronize edilir (örneğin bir Cloud Function ile veya istemci tarafında Auth state değişikliğinde).
  // Bu yüzden direkt Firestore'a kullanıcı ekleme/silme burada olmayabilir.
};
*/
