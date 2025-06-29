import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  WriteBatch,
  writeBatch,
  documentId,
  limit,
  startAt,
  startAfter,
  endAt,
  endBefore,
} from 'firebase/firestore';
import { firestore } from './firebase'; // Temel Firebase yapılandırması (app, auth, firestore instance'ları)
import type {
  // Firestore'da kullanılacak ana veri modelleri lib/types.ts dosyasından import edilir.
  Reservation,
  Room,
  Expense,
  Guest,
  // User // types/auth.ts içindeki User kullanılacaksa buraya import edilebilir.
} from './types'; // Güncel modellerimiz

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
        } else if (processedData[field] instanceof Date) {
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
  const processedData = { ...data } as any;

  for (const key in processedData) {
    if (processedData.hasOwnProperty(key)) {
      if (processedData[key] instanceof Timestamp) {
        processedData[key] = processedData[key].toDate().toISOString();
      }
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
    await setDoc(doc(firestore, collectionPath, id), processDataForFirestore(data, !merge), { merge });
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
    await updateDoc(doc(firestore, collectionPath, id), processDataForFirestore(data));
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
    await deleteDoc(doc(firestore, collectionPath, id));
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
    const docRef = doc(firestore, collectionPath, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // Doküman verisine ID'sini ekleyerek döndürür.
      return processDataFromFirestore<TModel>({ id: docSnap.id, ...docSnap.data() } as TModel);
    }
    console.log(`FirestoreService: Document ${id} not found in ${collectionPath}`);
    return null;
  } catch (error) {
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
  queryConstraints: QueryConstraint[] = [] // Varsayılan olarak boş dizi, tüm koleksiyonu getirir.
): Promise<TModel[]> => {
  try {
    const q = query(collection(firestore, collectionPath), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap =>
      processDataFromFirestore<TModel>({ id: docSnap.id, ...docSnap.data() } as TModel)
    );
  } catch (error) {
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
export const getCollectionWithRealtimeUpdates = <TModel>(
  collectionPath: string,
  callback: (data: TModel[]) => void,
  queryConstraints: QueryConstraint[] = []
): (() => void) => {
  const q = query(collection(firestore, collectionPath), ...queryConstraints);
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const dataList = querySnapshot.docs.map(docSnap =>
        processDataFromFirestore<TModel>({ id: docSnap.id, ...docSnap.data() } as TModel)
      );
      callback(dataList); // Güncel veriyi callback ile dışarıya bildir.
    },
    (error) => {
      console.error(`FirestoreService: Realtime listener [${collectionPath}] hata:`, error);
      // Önemli: Hata durumunda da callback'i uygun bir şekilde yönetmek (örn: boş liste, hata objesi)
      // uygulamanın çökmesini engelleyebilir ve kullanıcıya bilgi verilebilir.
      // callback([]);
    }
  );
  return unsubscribe; // Component unmount olduğunda veya dinleme sonlandırılmak istendiğinde çağrılır.
};

// --- Modele Özgü Servis Wrapper'ları ---
// Bu wrapper'lar, genel CRUD fonksiyonlarını belirli modeller için daha kolay kullanılabilir hale getirir.
// Koleksiyon adlarını ve varsayılan sıralama gibi detayları soyutlarlar.
// `NewData<TModel>` tipi, yeni doküman eklerken `id`, `createdAt`, `updatedAt` alanlarının
// dışarıdan verilmemesini sağlar, çünkü bunlar servis tarafından yönetilir.

type NewData<TModel> = Omit<TModel, 'id' | 'createdAt' | 'updatedAt'>;

// Rezervasyonlar için CRUD servisleri
export const reservationService = {
  add: (data: NewData<Reservation>) => addDocument<NewData<Reservation>>(COLLECTIONS.RESERVATIONS, data),
  set: (id: string, data: Reservation, merge: boolean = true) => setDocument<Reservation>(COLLECTIONS.RESERVATIONS, id, data, merge),
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
  add: (data: NewData<Expense>) => addDocument<NewData<Expense>>(COLLECTIONS.EXPENSES, data),
  set: (id: string, data: Expense, merge: boolean = true) => setDocument<Expense>(COLLECTIONS.EXPENSES, id, data, merge),
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
export {
  where, orderBy, limit,
  startAt, startAfter, endAt, endBefore,
  documentId, Timestamp, serverTimestamp,
  writeBatch
};
export type { QueryConstraint, WriteBatch };

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
