// Mock Firebase Yapılandırma Dosyası
// Gerçek Firebase yerine localStorage tabanlı bir çözüm kullanıyoruz

// Veri saklama için localStorage tabanlı veritabanı
type MockDatabase = Record<string, Record<string, any>>;
export let mockDatabase: MockDatabase = {};

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
export const saveToLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('mockFirebase', JSON.stringify(mockDatabase));
      // Veri değişikliğini diğer sekmelere/pencerelere bildirmek için özel bir olay tetikle
      const event = new CustomEvent('firebase-data-changed', { detail: { timestamp: Date.now() } });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('LocalStorage kaydetme hatası:', error);
    }
  }
};

// Diğer sekmelerdeki veri değişikliklerini dinle
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'mockFirebase' && event.newValue) {
      try {
        mockDatabase = JSON.parse(event.newValue);
        // Veri değişikliğini bildirmek için özel bir olay tetikle
        const syncEvent = new CustomEvent('firebase-data-synced', { detail: { timestamp: Date.now() } });
        window.dispatchEvent(syncEvent);
      } catch (error) {
        console.error('LocalStorage senkronizasyon hatası:', error);
      }
    }
  });
}

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

const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    callback(null);
    return () => {};
  },
  signInWithEmailAndPassword: async () => ({ user: null }),
  createUserWithEmailAndPassword: async () => ({ user: null }),
  signOut: async () => {}
};

const firestore = {
  collection: (path: string) => path
};

const storage = {
  ref: (path: string) => ({
    put: async () => ({
      ref: {
        getDownloadURL: async () => `https://mock-storage/${path}`
      }
    })
  })
};

const analytics = null;

// Mock Timestamp sınıfı
export const Timestamp = {
  now: () => ({
    toDate: () => new Date(),
    seconds: Math.floor(Date.now() / 1000),
    nanoseconds: (Date.now() % 1000) * 1000000
  }),
  fromDate: (date: Date) => ({
    toDate: () => date,
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: (date.getTime() % 1000) * 1000000
  }),
  fromMillis: (millis: number) => ({
    toDate: () => new Date(millis),
    seconds: Math.floor(millis / 1000),
    nanoseconds: (millis % 1000) * 1000000
  })
};

// Firebase fonksiyonlarını dışa aktar
export { app, auth, firestore, storage, analytics };

// Mock Firebase fonksiyonları
export const collection = (db: any, path: string) => path;
export const doc = (db: any, path: string, id?: string) => id ? `${path}/${id}` : path;
export const addDoc = async (collectionRef: string, data: any) => {
  const id = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const path = collectionRef;
  if (!mockDatabase[path]) mockDatabase[path] = {};
  mockDatabase[path][id] = { ...data, id };
  saveToLocalStorage();
  return { 
    id, 
    path,
    get: (field: string) => data ? data[field] : undefined,
    add: (data: any) => addDoc(path, data)
  };
};
export const setDoc = async (docRef: string, data: any) => {
  const parts = docRef.split('/');
  const id = parts.pop() || '';
  const path = parts.join('/');
  if (!mockDatabase[path]) mockDatabase[path] = {};
  mockDatabase[path][id] = { ...data, id };
  saveToLocalStorage();
};
export const updateDoc = async (docRef: string, data: any) => {
  const parts = docRef.split('/');
  const id = parts.pop() || '';
  const path = parts.join('/');
  if (mockDatabase[path] && mockDatabase[path][id]) {
    mockDatabase[path][id] = { ...mockDatabase[path][id], ...data };
    saveToLocalStorage();
  }
};
export const deleteDoc = async (docRef: string) => {
  const parts = docRef.split('/');
  const id = parts.pop() || '';
  const path = parts.join('/');
  if (mockDatabase[path] && mockDatabase[path][id]) {
    delete mockDatabase[path][id];
    saveToLocalStorage();
  }
};
export const getDoc = async (docRef: string) => {
  const parts = docRef.split('/');
  const id = parts.pop() || '';
  const path = parts.join('/');
  const data = mockDatabase[path]?.[id];
  return {
    exists: () => !!data,
    data: () => data || null,
    id,
    get: (field: string) => data ? data[field] : undefined
  };
};
export const getDocs = async (queryRef: any) => {
  const path = typeof queryRef === 'string' ? queryRef : queryRef.path;
  const docs = mockDatabase[path] || {};
  
  // Sonuçları oluştur
  const docArray = Object.entries(docs).map(([id, data]) => {
    const docData = typeof data === 'object' ? data : {};
    return {
      id,
      data: () => docData,
      exists: () => true,
      get: (field: string) => {
        if (!docData) return undefined;
        return docData[field];
      }
    };
  });
  
  // Sonuç nesnesini oluştur
  const result: any = {
    empty: docArray.length === 0,
    size: docArray.length,
    docs: docArray,
    forEach: (callback: (doc: any) => void) => docArray.forEach(callback),
    // Sonuç nesnesinin kendisine de get metodu ekleyelim
    get: (field: string) => {
      if (field === 'docs') return docArray;
      if (field === 'empty') return docArray.length === 0;
      if (field === 'size') return docArray.length;
      return undefined;
    },
    // Dizi benzeri erişim için
    map: (callback: (doc: any) => any) => docArray.map(callback)
  };
  
  // Dökümanların kendilerine de get metodu ekleyelim
  result.docs.forEach(doc => {
    if (!doc.get) {
      doc.get = (field: string) => {
        const data = doc.data();
        return data ? data[field] : undefined;
      };
    }
  });
  
  // Dizi gibi davranması için
  Object.defineProperty(result, 'length', {
    get: () => docArray.length
  });
  
  // Dizi metotlarını ekleyelim
  for (let i = 0; i < docArray.length; i++) {
    result[i] = docArray[i];
  }
  
  return result;
};
export const query = (collectionRef: string, ...queryConstraints: any[]) => ({ path: collectionRef, constraints: queryConstraints });
export const where = () => ({});
export const orderBy = () => ({});
export const limit = () => ({});
export const serverTimestamp = () => new Date();
export const onSnapshot = (ref: any, callback: Function) => {
  const path = typeof ref === 'string' ? ref : ref.path;
  // İlk çağrıda mevcut verileri gönder
  setTimeout(() => {
    const docs = mockDatabase[path] || {};
    callback({
      empty: Object.keys(docs).length === 0,
      size: Object.keys(docs).length,
      docs: Object.entries(docs).map(([id, data]) => ({
        id,
        data: () => data,
        exists: () => true
      }))
    });
  }, 0);

  // Veri değişikliklerini dinle
  if (typeof window !== 'undefined') {
    const handler = () => {
      const docs = mockDatabase[path] || {};
      callback({
        empty: Object.keys(docs).length === 0,
        size: Object.keys(docs).length,
        docs: Object.entries(docs).map(([id, data]) => ({
          id,
          data: () => data,
          exists: () => true
        }))
      });
    };

    window.addEventListener('firebase-data-synced', handler);
    window.addEventListener('firebase-data-changed', handler);

    // Temizleme fonksiyonu döndür
    return () => {
      window.removeEventListener('firebase-data-synced', handler);
      window.removeEventListener('firebase-data-changed', handler);
    };
  }
  return () => {};
};

// Yardımcı fonksiyonlar
export const documentId = () => 'documentId';
export const writeBatch = (db: any) => ({ commit: async () => {} });
