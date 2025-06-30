// Mock Firebase servisleri
// Firebase paketi yüklendiğinde gerçek implementasyonla değiştirilecek

// Firestore'dan import edilecek modeller
import {
  Reservation as ReservationModel,
  Room,
  Guest as GuestModel,
  Expense as ExpenseModel
} from './firebase-models';

// Firebase mock servislerini içe aktarıyoruz
import { firestore, mockDatabase, saveToLocalStorage } from './firebase';

// BaseModel ve Guest tiplerini tanımlıyoruz// Firestore tipi tanımlamaları

export interface BaseModel {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Model tanımlarını genişletelim
export interface Reservation extends ReservationModel {}
export interface Expense extends ExpenseModel {}
export interface Guest extends GuestModel {
  nationality?: string;
  idNumber?: string;
  notes?: string;
}

// Mock tipler ve sınıflar
export type QueryConstraint = any;
export type WriteBatch = any;

// Mock Timestamp sınıfı
export const Timestamp = {
  now: () => ({ toDate: () => new Date() }),
  fromDate: (date: Date) => ({ toDate: () => date })
};

// Mock Firestore fonksiyonları
export const collection = (db: any, path: string) => {
  // db parametresi kullanılmıyor ama Firebase API uyumluluğu için gerekli
  return path;
};
// Firebase API'sine uygun olarak doc fonksiyonu
export const doc = (db: any, path: string, id?: string) => {
  // id parametresi opsiyonel olabilir
  if (!id) {
    // Boş bir ID ile doküman oluştur (rastgele ID)
    const randomId = "mock-" + Date.now();
    return `${path}/${randomId}`;
  }
  return `${path}/${id}`;
};
export const addDoc = async (collectionRef: any, data: any) => collectionRef.add(data);
export const setDoc = async (docRef: any, data: any, options?: any) => {
  if (options) {
    return docRef.set(data, options);
  }
  return docRef.set(data);
};
export const updateDoc = async (docRef: any, data: any) => docRef.update(data);
export const deleteDoc = async (docRef: any) => docRef.delete();
export const getDoc = async (docRef: any) => docRef.get();
export const getDocs = async (query: any) => query.get();
export const query = (collectionRef: any, ...queryConstraints: any[]) => {
  // Sorgu kısıtlamalarını koleksiyon referansına ekle
  return {
    ...collectionRef,
    constraints: queryConstraints,
    get: async () => {
      // Basit bir filtreleme mekanizması
      const result = await collectionRef.get();
      return result;
    }
  };
};
export const onSnapshot = (query: any, callback: (snapshot: any) => void, errorCallback?: (error: any) => void) => {
  // Mock veri değişikliği dinleyicisi
  query.get().then((snapshot: any) => {
    callback(snapshot);
  }).catch((error: any) => {
    if (errorCallback) errorCallback(error);
  });
  
  return () => {}; // Unsubscribe fonksiyonu
};

// Mock sorgu fonksiyonları
export const where = (field?: string, operator?: string, value?: any) => ({});
export const orderBy = (field?: string, direction?: string) => ({});
export const limit = (limit?: number) => ({});
export const startAt = (value?: any) => ({});
export const startAfter = (value?: any) => ({});
export const endAt = (value?: any) => ({});
export const endBefore = (value?: any) => ({});
export const documentId = () => ({});
export const serverTimestamp = () => new Date().toISOString();
export const writeBatch = () => ({});

// Firestore koleksiyon adları için sabitler.
// Bu, koleksiyon adlarında tutarlılık sağlar ve yazım hatalarını önler.
export const COLLECTIONS = {
  RESERVATIONS: 'reservations', // Rezervasyon verileri
  ROOMS: 'rooms',               // Oda bilgileri
  EXPENSES: 'expenses',         // Gider kayıtları
  GUESTS: 'guests',             // Misafir bilgileri
  USERS: 'users',               // Kullanıcı profilleri ve rolleri (Firebase Auth ile senkronize)
};

// --- Veri Dönüşüm Yardımcı Fonksiyonları (Data Processors) ---
// Bu fonksiyonlar, uygulama içi veri formatları ile Firestore'un beklediği/döndürdüğü formatlar
// (özellikle Timestamp yönetimi) arasında köprü görevi görür.

/**
 * Firestore'a yazılacak verilerdeki Date objelerini veya ISO string tarihlerini Timestamp'e dönüştürür.
 * 'createdAt' ve 'updatedAt' alanlarını yönetir.
 * @param data İşlenecek veri objesi.
 * @param isNew Yeni bir doküman mı oluşturuluyor? (createdAt için)
 * @returns Firestore için işlenmiş veri objesi.
 */
const processDataForFirestore = (data: any, isNew: boolean = false): any => {
  const processedData = { ...data };

  // Modellerdeki bilinen tarih alanları (bunlar Timestamp'e çevrilecek)
  // Bu listeyi modellerinize göre genişletin.
  const dateFields: string[] = [
    'checkInDate', 'checkOutDate', // Reservation
    'date',                        // Expense
    'birthDate',                   // Guest
    // 'customDateField' // Diğer modellerden gelebilecek tarih alanları
  ];

  for (const field in processedData) {
    if (processedData.hasOwnProperty(field)) {
      // Belirlenen tarih alanlarını Timestamp'e çevir
      if (dateFields.includes(field) && processedData[field]) {
        if (typeof processedData[field] === 'string') {
          try {
            const dateValue = new Date(processedData[field]);
            if (!isNaN(dateValue.getTime())) {
              processedData[field] = Timestamp.fromDate(dateValue);
            } else {
              console.warn(`processDataForFirestore: Geçersiz tarih string formatı - Alan: ${field}, Değer: ${processedData[field]}`);
            }
          } catch (e) {
            console.warn(`processDataForFirestore: Tarih parse edilirken hata - Alan: ${field}, Değer: ${processedData[field]}`, e);
          }
        } else if (Object.prototype.toString.call(processedData[field]) === '[object Date]') {
          processedData[field] = Timestamp.fromDate(processedData[field]);
        }
        // Eğer zaten Timestamp ise dokunma
      }
    }
  }

  // Otomatik zaman damgaları
  if (isNew) {
    processedData.createdAt = serverTimestamp();
  }
  processedData.updatedAt = serverTimestamp();

  // Firestore'a 'undefined' değerler gönderilmemeli, bu hatalara yol açabilir.
  for (const key in processedData) {
    if (processedData[key] === undefined) {
      delete processedData[key];
    }
  }

  return processedData;
};

/**
 * Firestore'dan okunan verilerdeki Timestamp'leri ISO string'e dönüştürür.
 * @param data Firestore'dan gelen veri.
 * @returns Timestamp'leri ISO string'e dönüştürülmüş veri.
 */
const processDataFromFirestore = <T>(data: any): T => {
  if (!data) return data;
  
  // Tarih alanlarını dönüştür
  const processedData = { ...data };
  
  // Tüm alanları kontrol et
  for (const key in processedData) {
    const value = processedData[key];
    
    // Timestamp nesnesi mi kontrolü
    if (value && typeof value === 'object' && value.toDate && typeof value.toDate === 'function') {
      processedData[key] = value.toDate().toISOString();
    } 
    // localStorage'dan yüklenen tarih nesneleri için özel işlem
    else if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
      // Bu bir timestamp nesnesi ama toDate() fonksiyonu yok (localStorage'dan gelmiş)
      const milliseconds = value.seconds * 1000 + value.nanoseconds / 1000000;
      processedData[key] = new Date(milliseconds).toISOString();
    }
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // İç içe nesneleri işle
      processedData[key] = processDataFromFirestore(value);
    }
  }
  
  return processedData as T;
};

// --- Genel Firestore CRUD Fonksiyonları ---
// Bu fonksiyonlar, herhangi bir koleksiyon için temel Firestore işlemlerini (CRUD) soyutlar.
// Tip güvenliği (generics) ve merkezi hata yönetimi sağlarlar.

/**
 * Bir koleksiyona yeni bir doküman ekler.
 * Otomatik olarak `createdAt` ve `updatedAt` (serverTimestamp) alanlarını yönetir.
 * Tarih alanlarını `Timestamp` formatına dönüştürür.
 * @param collectionPath Hedef koleksiyonun adı (örn: COLLECTIONS.RESERVATIONS).
 * @param data Eklenecek veri (modellerdeki `id` hariç).
 * @returns Eklenen dokümanın Firestore tarafından üretilen ID'si.
 */
export const addDocument = async <TData extends object>(
  collectionPath: string,
  data: TData // Genellikle Omit<Model, 'id' | 'createdAt' | 'updatedAt'> şeklinde kullanılır
): Promise<string> => {
  try {
    // `processDataForFirestore(data, true)`: `true` parametresi yeni doküman olduğunu belirtir,
    // böylece `createdAt` ve `updatedAt` `serverTimestamp` olarak ayarlanır.
    const docRef = await addDoc(collection(firestore, collectionPath), processDataForFirestore(data, true));
    return docRef.id;
  } catch (error) {
    console.error(`FirestoreService: addDocument [${collectionPath}] hata:`, error);
    throw error; // Hatanın yukarıya yayılması için
  }
};

/**
 * Belirli bir ID ile bir doküman oluşturur veya var olanı günceller/birleştirir.
 * `processDataForFirestore` ile tarihleri ve `updatedAt` alanını yönetir.
 * `createdAt` alanı, `merge` false ise ve doküman yeni oluşturuluyorsa `processDataForFirestore` içinde `serverTimestamp` ile yönetilir.
 * @param collectionPath Hedef koleksiyonun adı.
 * @param id Doküman ID'si.
 * @param data Kaydedilecek veri.
 * @param merge Varsayılan true. False ise dokümanı tamamen verilen veriyle değiştirir.
 */
export const setDocument = async <TData extends object>(
  collectionPath: string,
  id: string,
  data: TData,
  merge: boolean = true
): Promise<void> => {
  try {
    // Eğer yeni bir doküman oluşturuluyorsa (merge false ve doküman yoksa gibi durumlar)
    // createdAt'in yönetimi için ek bir kontrol gerekebilir.
    // Şimdilik processDataForFirestore'un ikinci argümanını (isNew) yönetmiyoruz,
    // bu da createdAt'in sadece addDocument ile otomatik ekleneceği anlamına gelir.
    // `!merge` (yani merge false ise) yeni bir doküman oluşturulduğunu varsayarak `isNew=true` gönderir.
    // Bu, `createdAt` alanının `serverTimestamp` ile ayarlanmasını sağlar.
    // Eğer `merge=true` ise, varolan bir doküman güncelleniyor (`isNew=false`), sadece `updatedAt` güncellenir.
    
    // Doküman yolunu oluşturuyoruz
    const docPath = `${collectionPath}/${id}`;
    const processedData = processDataForFirestore(data, !merge);
    
    // setDoc fonksiyonunu çağırıyoruz
    await setDoc(docPath, processedData, { merge });
  } catch (error) {
    console.error(`FirestoreService: setDocument [${collectionPath}/${id}] hata:`, error);
    throw error;
  }
};

/**
 * Varolan bir dokümanı kısmi olarak günceller.
 * Sadece belirtilen alanları günceller, diğerlerini olduğu gibi bırakır.
 * `updatedAt` alanını otomatik olarak `serverTimestamp` ile günceller.
 * @param collectionPath Hedef koleksiyonun adı.
 * @param id Güncellenecek dokümanın ID'si.
 * @param data Güncellenecek veri (modelin kısmi bir objesi).
 */
export const updateDocument = async <TData extends object>(
  collectionPath: string,
  id: string,
  data: Partial<TData> // Partial<Model> tipinde veri alır
): Promise<void> => {
  try {
    // `processDataForFirestore(data)` (isNew=false varsayılan) sadece `updatedAt`'i yönetir.
    const docPath = `${collectionPath}/${id}`;
    await updateDoc(docPath, processDataForFirestore(data));
  } catch (error) {
    console.error(`FirestoreService: updateDocument [${collectionPath}/${id}] hata:`, error);
    throw error;
  }
};

/**
 * Bir dokümanı Firestore'dan siler.
 * @param collectionPath Hedef koleksiyonun adı.
 * @param id Silinecek dokümanın ID'si.
 */
export const deleteDocument = async (collectionPath: string, id: string): Promise<void> => {
  try {
    const docPath = `${collectionPath}/${id}`;
    await deleteDoc(docPath);
  } catch (error) {
    console.error(`FirestoreService: deleteDocument [${collectionPath}/${id}] hata:`, error);
    throw error;
  }
};

/**
 * Belirli bir ID'ye sahip dokümanı Firestore'dan getirir.
 * Tarih alanları `processDataFromFirestore` ile ISO string formatına dönüştürülür.
 * @param collectionPath Hedef koleksiyonun adı.
 * @param id Getirilecek dokümanın ID'si.
 * @returns Doküman verisi (model tipinde, `id` alanı dahil) veya doküman bulunamazsa `null`.
 */
export const getDocument = async <TModel>(collectionPath: string, id: string): Promise<TModel | null> => {
  try {
    const docPath = `${collectionPath}/${id}`;
    const docSnap: any = await getDoc(docPath);
    if (docSnap.exists()) {
      // Doküman verisine ID'sini ekleyerek döndürür.
      return processDataFromFirestore<TModel>({ id: docSnap.id, ...docSnap.data() } as TModel);
    }
    console.log(`FirestoreService: Document ${id} not found in ${collectionPath}`);
    return null;
  } catch (error: any) {
    console.error(`FirestoreService: getDocument [${collectionPath}/${id}] hata:`, error);
    throw error;
  }
};

/**
 * Bir koleksiyondaki dokümanları getirir. Sorgu ve sıralama kriterleri uygulanabilir.
 * Tarih alanları `processDataFromFirestore` ile ISO string formatına dönüştürülür.
 * @param collectionPath Hedef koleksiyonun adı.
 * @param queryConstraints Firestore sorgu kısıtlamaları dizisi (örn: [where(...), orderBy(...)])
 * @returns Dokümanların listesi (model tipinde, her biri `id` alanı içerir).
 */
export const getCollection = async <TModel>(
  collectionPath: string,
  queryConstraints: any[] = [] // Varsayılan olarak boş dizi, tüm koleksiyonu getirir.
): Promise<TModel[]> => {
  try {
    const q = query(collectionPath, ...queryConstraints);
    const querySnapshot: any = await getDocs(q);
    return querySnapshot.docs.map((docSnap: any) =>
      processDataFromFirestore<TModel>({ id: docSnap.id, ...docSnap.data() } as TModel)
    );
  } catch (error: any) {
    console.error(`FirestoreService: getCollection [${collectionPath}] hata:`, error);
    throw error;
  }
};

/**
 * Bir koleksiyonu dinleyerek anlık güncellemeleri alır (realtime).
 * Verilerde herhangi bir değişiklik olduğunda (ekleme, güncelleme, silme) callback fonksiyonunu tetikler.
 * Tarih alanları `processDataFromFirestore` ile ISO string formatına dönüştürülür.
 * @param collectionPath Dinlenecek koleksiyonun adı.
 * @param callback Veri güncellendiğinde çağrılacak fonksiyon. Güncel veri listesini alır.
 * @param queryConstraints Firestore sorgu kısıtlamaları.
 * @returns Firestore listener'ını sonlandırmak için çağrılabilecek bir `unsubscribe` fonksiyonu.
 */
// Temel model tipi tanımı - üstteki export edilmiş tanımı kullanıyoruz

export const getCollectionWithRealtimeUpdates = <TModel>(
  collectionPath: string,
  callback: (data: TModel[]) => void,
  queryConstraints: any[] = []
): (() => void) => {
  const q = query(collectionPath, ...queryConstraints);
  // onSnapshot fonksiyonunu sadece callback ile çağırıyoruz
  // hata durumunu konsola yazdırıyoruz
  const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
    const dataList = querySnapshot.docs.map((docSnap: any) =>
      processDataFromFirestore<TModel>({ id: docSnap.id, ...docSnap.data() } as TModel)
    );
    callback(dataList); // Güncel veriyi callback ile dışarıya bildir.
  });
  // Unsubscribe fonksiyonunu döndürüyoruz
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

// Genel CRUD fonksiyonları

/**
 * Bir koleksiyondaki tüm belgeleri getirir
 * @param collectionPath Koleksiyon yolu
 * @returns Belge listesi
 */
export const getAll = async <TModel extends BaseModel>(collectionPath: string): Promise<TModel[]> => {
  try {
    const q = query(collectionPath);
    const querySnapshot = await getDocs(q);
    
    // Eğer docs dizisi varsa ve her belge get metoduna sahipse, standart yöntemi kullan
    if (querySnapshot.docs && typeof querySnapshot.docs.map === 'function') {
      return querySnapshot.docs.map((doc: any) => {
        const data = doc.data ? doc.data() : doc;
        return processDataFromFirestore<TModel>({ id: doc.id, ...data } as TModel);
      });
    } 
    // Eğer querySnapshot bir dizi ise (mock Firebase durumunda)
    else if (Array.isArray(querySnapshot)) {
      return querySnapshot.map((doc: any) => {
        const data = doc.data ? doc.data() : doc;
        return processDataFromFirestore<TModel>({ id: doc.id, ...data } as TModel);
      });
    }
    // Diğer durumlarda boş dizi döndür
    return [];
  } catch (error) {
    console.error(`FirestoreService: getAll [${collectionPath}] hata:`, error);
    throw error;
  }
};

/**
 * Belirli bir belgeyi ID'ye göre getirir
 * @param collectionPath Koleksiyon yolu
 * @param id Belge ID'si
 * @returns Belge veya null
 */
export const getById = async <TModel extends BaseModel>(collectionPath: string, id: string): Promise<TModel | null> => {
  try {
    const docPath = `${collectionPath}/${id}`;
    const docSnap = await getDoc(docPath);
    if (docSnap.exists()) {
      return processDataFromFirestore<TModel>({ id: docSnap.id, ...docSnap.data() } as TModel);
    }
    return null;
  } catch (error) {
    console.error(`FirestoreService: getById [${collectionPath}/${id}] hata:`, error);
    throw error;
  }
};

/**
 * Filtrelenmiş belgeleri getirir
 * @param collectionPath Koleksiyon yolu
 * @param queryConstraints Sorgu kısıtlamaları
 * @returns Filtrelenmiş belge listesi
 */
export const getFiltered = async <TModel extends BaseModel>(
  collectionPath: string,
  queryConstraints: QueryConstraint[] = []
): Promise<TModel[]> => {
  try {
    const q = query(collectionPath, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    // Eğer docs dizisi varsa ve her belge get metoduna sahipse, standart yöntemi kullan
    if (querySnapshot.docs && typeof querySnapshot.docs.map === 'function') {
      return querySnapshot.docs.map((doc: any) => {
        const data = doc.data ? doc.data() : doc;
        return processDataFromFirestore<TModel>({ id: doc.id, ...data } as TModel);
      });
    } 
    // Eğer querySnapshot bir dizi ise (mock Firebase durumunda)
    else if (Array.isArray(querySnapshot)) {
      return querySnapshot.map((doc: any) => {
        const data = doc.data ? doc.data() : doc;
        return processDataFromFirestore<TModel>({ id: doc.id, ...data } as TModel);
      });
    }
    // Diğer durumlarda boş dizi döndür
    return [];
  } catch (error) {
    console.error(`FirestoreService: getFiltered [${collectionPath}] hata:`, error);
    throw error;
  }
};

/**
 * Yeni bir belge oluşturur
 * @param collectionPath Koleksiyon yolu
 * @param data Belge verisi
 * @returns Oluşturulan belgenin ID'si
 */
export const create = async <TData extends object>(collectionPath: string, data: TData): Promise<string> => {
  try {
    const processedData = processDataForFirestore(data, true);
    const docRef = await addDoc(collection(firestore, collectionPath), {
      ...processedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`FirestoreService: create [${collectionPath}] hata:`, error);
    throw error;
  }
};

/**
 * Bir belgeyi günceller
 * @param collectionPath Koleksiyon yolu
 * @param id Belge ID'si
 * @param data Güncellenecek veri
 * @returns Promise
 */
export const update = async <TData extends object>(collectionPath: string, id: string, data: Partial<TData>): Promise<void> => {
  try {
    const docRef = doc(firestore, collectionPath, id);
    const processedData = processDataForFirestore(data, false);
    await updateDoc(docRef, {
      ...processedData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`FirestoreService: update [${collectionPath}/${id}] hata:`, error);
    throw error;
  }
};

/**
 * Bir belgeyi siler
 * @param collectionPath Koleksiyon yolu
 * @param id Belge ID'si
 * @returns Promise
 */
export const remove = async (collectionPath: string, id: string): Promise<void> => {
  try {
    const docRef = doc(firestore, collectionPath, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`FirestoreService: remove [${collectionPath}/${id}] hata:`, error);
    throw error;
  }
};

// ... (diğer kodlar)
// dışarıdan verilmemesini sağlar, çünkü bunlar servis tarafından yönetilir.

// Yeni veri tipi, id alanını hariç tutar ve createdAt/updatedAt alanlarını opsiyonel yapar
export type NewData<T> = Omit<T, 'id'> & {
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

// Rezervasyonlar için CRUD servisleri
export const reservationService = {
  add: (data: NewData<Reservation>) => {
    // createdAt alanını garanti edelim
    const dataWithDefaults = {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
    return addDocument<NewData<Reservation>>(COLLECTIONS.RESERVATIONS, dataWithDefaults);
  },
  set: (id: string, data: Reservation, merge: boolean = true) => {
    // createdAt alanını garanti edelim
    const dataWithDefaults = {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
    return setDocument<Reservation>(COLLECTIONS.RESERVATIONS, id, dataWithDefaults, merge);
  },
  update: (id: string, data: Partial<Reservation>) => updateDocument<Reservation>(COLLECTIONS.RESERVATIONS, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.RESERVATIONS, id),
  get: (id: string) => getDocument<Reservation>(COLLECTIONS.RESERVATIONS, id),
  getAll: (constraints: QueryConstraint[] = [orderBy("checkInDate", "desc")]) => getCollection<Reservation>(COLLECTIONS.RESERVATIONS, constraints),
  listen: (callback: (data: Reservation[]) => void, constraints: QueryConstraint[] = [orderBy("checkInDate", "desc")]) =>
    getCollectionWithRealtimeUpdates<Reservation>(COLLECTIONS.RESERVATIONS, callback, constraints),
};

// Odalar için CRUD servisleri
export const roomService = {
  add: (data: NewData<Room>) => addDocument<NewData<Room>>(COLLECTIONS.ROOMS, data),
  set: (id: string, data: Room, merge: boolean = true) => setDocument<Room>(COLLECTIONS.ROOMS, id, data, merge),
  update: (id: string, data: Partial<Room>) => updateDocument<Room>(COLLECTIONS.ROOMS, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.ROOMS, id),
  get: (id: string) => getDocument<Room>(COLLECTIONS.ROOMS, id),
  getAll: (constraints: QueryConstraint[] = [orderBy("roomNumber", "asc")]) => getCollection<Room>(COLLECTIONS.ROOMS, constraints),
  listen: (callback: (data: Room[]) => void, constraints: QueryConstraint[] = [orderBy("roomNumber", "asc")]) =>
    getCollectionWithRealtimeUpdates<Room>(COLLECTIONS.ROOMS, callback, constraints),
};

// Giderler için CRUD servisleri
export const expenseService = {
  add: (data: NewData<Expense>) => {
    // createdAt alanını garanti edelim
    const dataWithDefaults = {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
    return addDocument<NewData<Expense>>(COLLECTIONS.EXPENSES, dataWithDefaults);
  },
  set: (id: string, data: Expense, merge: boolean = true) => {
    // createdAt alanını garanti edelim
    const dataWithDefaults = {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
    return setDocument<Expense>(COLLECTIONS.EXPENSES, id, dataWithDefaults, merge);
  },
  update: (id: string, data: Partial<Expense>) => updateDocument<Expense>(COLLECTIONS.EXPENSES, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.EXPENSES, id),
  get: (id: string) => getDocument<Expense>(COLLECTIONS.EXPENSES, id),
  getAll: (constraints: QueryConstraint[] = [orderBy("date", "desc")]) => getCollection<Expense>(COLLECTIONS.EXPENSES, constraints),
  listen: (callback: (data: Expense[]) => void, constraints: QueryConstraint[] = [orderBy("date", "desc")]) =>
    getCollectionWithRealtimeUpdates<Expense>(COLLECTIONS.EXPENSES, callback, constraints),
};

// Misafirler için CRUD servisleri
export const guestService = {
  add: (data: NewData<Guest>) => addDocument<NewData<Guest>>(COLLECTIONS.GUESTS, data),
  set: (id: string, data: Guest, merge: boolean = true) => setDocument<Guest>(COLLECTIONS.GUESTS, id, data, merge),
  update: (id: string, data: Partial<Guest>) => updateDocument<Guest>(COLLECTIONS.GUESTS, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.GUESTS, id),
  get: (id: string) => getDocument<Guest>(COLLECTIONS.GUESTS, id),
  getAll: (constraints: QueryConstraint[] = [orderBy("fullName", "asc")]) => getCollection<Guest>(COLLECTIONS.GUESTS, constraints),
  listen: (callback: (data: Guest[]) => void, constraints: QueryConstraint[] = [orderBy("fullName", "asc")]) =>
    getCollectionWithRealtimeUpdates<Guest>(COLLECTIONS.GUESTS, callback, constraints),
};

// Firebase'den sorgu oluşturmak için kullanılan yardımcı fonksiyonları (query constraints)
// ve Timestamp/serverTimestamp gibi önemli araçları dışa aktarır.
// Bu, uygulamanın diğer bölümlerinde Firestore sorgularını kolayca oluşturmayı sağlar.
// Not: Bu fonksiyonlar zaten yukarıda export edildiği için burada tekrar export etmeye gerek yok

/*
// Örnek Kullanımlar:
// import { reservationService, where, orderBy, Timestamp } from '@/lib/firebase-service';
// import { addBusinessDays, formatISO } from 'date-fns'; // Örnek tarih kütüphanesi

// async function exampleReservationUsage() {
//   // Yeni rezervasyon ekleme
//   const newReservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'> = {
//     guestName: "John Doe",
//     phoneNumber: "555-1234",
//     email: "john.doe@example.com",
//     checkInDate: formatISO(new Date()), // Bugünün tarihi ISO string olarak
//     checkOutDate: formatISO(addBusinessDays(new Date(), 3)), // Bugünden 3 iş günü sonrası
//     roomId: "room101",
//     roomNumber: "101",
//     roomType: "DELUXE",
//     guestCount: 2,
//     totalPrice: 300,
//     paymentStatus: PaymentStatus.UNPAID,
//     status: ReservationStatus.CONFIRMED,
//     source: BookingSource.DIRECT,
//     notes: "Göl manzaralı oda tercihi.",
//   };
//   const reservationId = await reservationService.add(newReservationData);
//   console.log("Yeni rezervasyon eklendi, ID:", reservationId);

//   // Rezervasyonu getirme
//   const reservation = await reservationService.get(reservationId);
//   console.log("Getirilen rezervasyon:", reservation);

//   // Rezervasyonu güncelleme
//   if (reservation) {
//     await reservationService.update(reservationId, { notes: "Göl manzaralı oda tercihi. Yüksek kat.", paymentStatus: PaymentStatus.PAID });
//     console.log("Rezervasyon güncellendi.");
//   }

//   // Tüm rezervasyonları listeleme (anlık güncellemelerle)
//   const unsubscribe = reservationService.listen((reservations) => {
//     console.log("Anlık rezervasyonlar:", reservations);
//   });
//   // Dinlemeyi durdurmak için: unsubscribe();

//   // Belirli bir tarihten sonraki rezervasyonları getirme
//   const futureReservations = await reservationService.getAll([
//     where("checkInDate", ">=", Timestamp.fromDate(new Date())), // Timestamp objesi ile sorgu
//     orderBy("checkInDate", "asc")
//   ]);
//   console.log("Gelecek rezervasyonlar:", futureReservations);
// }
*/

// Not: localStorage'dan veri taşıma işlemi bu servisler oluşturulduktan sonra,
// admin panelindeki ilgili sayfalarda veya ayrı bir script ile yapılacaktır.
// Bu servisler, Firestore ile doğrudan çalışmak için temel yapıları sağlar.
