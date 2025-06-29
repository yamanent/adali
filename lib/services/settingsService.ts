// lib/services/settingsService.ts
import {
  getDocument,
  setDocument,
  COLLECTIONS, // Ana koleksiyonları içeren obje (eğer settings için ayrı bir koleksiyon adı tanımlanmadıysa)
  // serverTimestamp // Eğer settings'de timestamp kullanılacaksa
} from '../firebase-service'; // Ana firebase-service'ten import

// Ayarlar modelini tanımla (app/admin/ayarlar/page.tsx içindeki ile aynı olmalı)
export interface AppSettings {
  hotelName: string;
  address: string;
  phone: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  enableNotifications: boolean;
  darkMode: boolean;
  language: string;
  // Gerekirse buraya daha fazla ayar eklenebilir
  // Örneğin: currency: string;
  // updatedAt?: string; // Firestore'dan okunurken Timestamp'ten çevrilecek
}

const SETTINGS_COLLECTION_NAME = 'app_config'; // Ayarlar için özel bir koleksiyon adı
const MAIN_SETTINGS_DOC_ID = 'main'; // Bu koleksiyondaki tek dokümanın ID'si

/**
 * Uygulama ayarlarını Firestore'dan getirir.
 * @returns Ayarlar objesi veya bulunamazsa null.
 */
export const getSettings = async (): Promise<AppSettings | null> => {
  try {
    // getDocument fonksiyonu zaten processDataFromFirestore kullandığı için
    // Timestamp'ler otomatik olarak ISO string'e çevrilecektir.
    const settings = await getDocument<AppSettings>(SETTINGS_COLLECTION_NAME, MAIN_SETTINGS_DOC_ID);
    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Eğer ayarlar dokümanı hiç oluşturulmadıysa, null dönmesi normaldir.
    // Hata sadece gerçek bir Firestore erişim hatasıysa fırlatılmalı.
    if (error.message.includes("No document to update") || error.code === "not-found") {
        console.warn("Settings document not found, returning null.");
        return null;
    }
    throw new Error("Failed to fetch settings.");
  }
};

/**
 * Uygulama ayarlarını Firestore'a kaydeder veya günceller.
 * @param settingsData Kaydedilecek ayarlar objesi.
 */
export const saveSettings = async (settingsData: AppSettings): Promise<void> => {
  try {
    // setDocument fonksiyonu processDataForFirestore kullandığı için
    // Date objeleri veya tarih stringleri otomatik olarak Timestamp'e çevrilecektir.
    // createdAt ve updatedAt yönetimi için processDataForFirestore'a uygun parametreler geçilebilir,
    // ancak ayarlar için bu genellikle gerekmeyebilir ya da farklı bir mantıkla yönetilebilir.
    // Şimdilik, sadece verilen veriyi kaydediyoruz.
    // Eğer updatedAt gibi bir alan isteniyorsa, settingsData'ya eklenip
    // Firestore'a gönderilmeden önce serverTimestamp() ile set edilebilir.

    // const dataToSave = {
    //   ...settingsData,
    //   updatedAt: serverTimestamp() // Eğer settings modelinde updatedAt varsa
    // };
    // await setDocument<AppSettings>(SETTINGS_COLLECTION_NAME, MAIN_SETTINGS_DOC_ID, dataToSave, true);

    // Şimdilik updatedAt olmadan kaydediyoruz.
    await setDocument<AppSettings>(SETTINGS_COLLECTION_NAME, MAIN_SETTINGS_DOC_ID, settingsData, true); // merge: true
  } catch (error) {
    console.error("Error saving settings:", error);
    throw new Error("Failed to save settings.");
  }
};

// Örnek: Ayarlar için gerçek zamanlı dinleyici (isteğe bağlı)
// import { getCollectionWithRealtimeUpdates } from '../firebase-service';
// export const listenToSettings = (callback: (settings: AppSettings | null) => void): (() => void) => {
//   try {
//     // Tek bir dokümanı dinlemek için onSnapshot'ı doğrudan kullanmak daha uygun olabilir.
//     // getCollectionWithRealtimeUpdates bir koleksiyonu dinler.
//     // Şimdilik bu kısmı dışarıda bırakıyorum, get/save yeterli olacaktır.
//     // Eğer gerekirse, firebase-service.ts'e getDocumentWithRealtimeUpdates eklenebilir.
//     console.warn("listenToSettings is not fully implemented for a single document yet.");
//     return () => {}; // Boş unsubscribe
//   } catch (error) {
//     console.error("Error listening to settings:", error);
//     throw new Error("Failed to listen to settings.");
//   }
// };
