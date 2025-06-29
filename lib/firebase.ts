// Mock Firebase Yapılandırma Dosyası
// Firebase paketi yüklenene kadar mock servisler kullanılacak

// Veri saklama için localStorage tabanlı veritabanı
let mockDatabase: Record<string, Record<string, any>> = {};

// Tarayıcı ortamında localStorage'dan verileri yükle
if (typeof window !== 'undefined') {
  try {
    const savedData = localStorage.getItem('mockFirebase');
    if (savedData) {
      mockDatabase = JSON.parse(savedData);
    }
  } catch (error) {
    console.error('LocalStorage veri yükleme hatası:', error);
  }
}

// Veritabanı değişikliklerini localStorage'a kaydetme fonksiyonu
const saveToLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('mockFirebase', JSON.stringify(mockDatabase));
    } catch (error) {
      console.error('LocalStorage kaydetme hatası:', error);
    }
  }
};

// Mock Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-domain.firebaseapp.com",
  projectId: "mock-project",
  storageBucket: "mock-storage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-ABCDEF123"
};

// Mock Firebase servisleri
const app = {
  name: "[DEFAULT]",
  options: { ...firebaseConfig }
};

// Sorgu fonksiyonları
export const where = (field: string, operator: string, value: any) => {
  return { field, operator, value, type: 'where' };
};

export const orderBy = (field: string, direction: string = 'asc') => {
  return { field, direction, type: 'orderBy' };
};

const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Mock auth state değişikliği
    return () => {}; // Unsubscribe fonksiyonu
  },
  signInWithEmailAndPassword: async () => ({ user: null }),
  createUserWithEmailAndPassword: async () => ({ user: null }),
  signOut: async () => {}
};

// Koleksiyon ve doküman yollarını yönetmek için yardımcı fonksiyonlar
const getCollectionData = (path: string) => {
  if (!mockDatabase[path]) {
    mockDatabase[path] = {};
  }
  return mockDatabase[path];
};

const firestore = {
  collection: (path: string) => ({
    doc: (id?: string) => {
      const docId = id || `mock-id-${Date.now()}`;
      const collectionData = getCollectionData(path);
      
      return {
        id: docId,
        get: async () => {
          const docData = collectionData[docId];
          return {
            exists: () => !!docData,
            data: () => docData || null,
            id: docId
          };
        },
        set: async (data: any, options?: any) => {
          if (options?.merge && collectionData[docId]) {
            collectionData[docId] = { ...collectionData[docId], ...data };
          } else {
            collectionData[docId] = { ...data };
          }
          saveToLocalStorage(); // LocalStorage'a kaydet
        },
        update: async (data: any) => {
          if (collectionData[docId]) {
            collectionData[docId] = { ...collectionData[docId], ...data };
            saveToLocalStorage(); // LocalStorage'a kaydet
          }
        },
        delete: async () => {
          delete collectionData[docId];
          saveToLocalStorage(); // LocalStorage'a kaydet
        }
      };
    },
    add: async (data: any) => {
      const docId = `mock-id-${Date.now()}`;
      const collectionData = getCollectionData(path);
      collectionData[docId] = { ...data };
      saveToLocalStorage(); // LocalStorage'a kaydet
      return { id: docId };
    },
    where: () => ({
      get: async () => {
        const collectionData = getCollectionData(path);
        const docs = Object.entries(collectionData).map(([id, data]) => ({
          id,
          data: () => data,
          exists: () => true
        }));
        return {
          docs,
          empty: docs.length === 0
        };
      }
    }),
    orderBy: () => ({
      get: async () => {
        const collectionData = getCollectionData(path);
        const docs = Object.entries(collectionData).map(([id, data]) => ({
          id,
          data: () => data,
          exists: () => true
        }));
        return {
          docs,
          empty: docs.length === 0
        };
      }
    }),
    limit: () => ({
      get: async () => {
        const collectionData = getCollectionData(path);
        const docs = Object.entries(collectionData).map(([id, data]) => ({
          id,
          data: () => data,
          exists: () => true
        }));
        return {
          docs,
          empty: docs.length === 0
        };
      }
    }),
    get: async () => {
      const collectionData = getCollectionData(path);
      const docs = Object.entries(collectionData).map(([id, data]) => ({
        id,
        data: () => data,
        exists: () => true
      }));
      return {
        docs,
        empty: docs.length === 0
      };
    }
  })
};

const storage = {
  ref: (path: string) => ({
    put: async (file: any) => ({
      ref: {
        getDownloadURL: async () => `https://mock-storage/${path}`
      }
    }),
    delete: async () => {}
  })
};

const analytics = null;

export { app, auth, firestore, storage, analytics };
