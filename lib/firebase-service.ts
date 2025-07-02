// Gerçek Firebase servisleri
import {
  Reservation as ReservationModel,
  Room,
  Guest as GuestModel,
  Expense as ExpenseModel
} from './firebase-models';
import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  writeBatch,
  where,
  orderBy,
  limit,
  startAt,
  startAfter,
  endAt,
  endBefore,
  documentId,
  type QuerySnapshot,
  type DocumentSnapshot,
  type FirestoreError,
  type QueryConstraint,
  type WriteBatch
} from 'firebase/firestore';

// Model Arayüzleri
export interface BaseModel {
  id: string;
  createdAt: string; // ISO string olarak tutulacak
  updatedAt: string; // ISO string olarak tutulacak
}

export interface Reservation extends ReservationModel {}
export interface Expense extends ExpenseModel {}
export interface Guest extends GuestModel {
  nationality?: string;
  idNumber?: string;
  notes?: string;
}

// Firestore koleksiyon adları için sabitler
export const COLLECTIONS = {
  RESERVATIONS: 'reservations',
  ROOMS: 'rooms',
  EXPENSES: 'expenses',
  GUESTS: 'guests',
  USERS: 'users',
};

// --- Veri Dönüşüm Yardımcıları ---

const processDataForFirestore = (data: any, isNew: boolean = false): any => {
  const processedData = { ...data };
  const dateFields: string[] = ['checkInDate', 'checkOutDate', 'date', 'birthDate'];

  for (const field in processedData) {
    if (processedData.hasOwnProperty(field)) {
      if (dateFields.includes(field) && processedData[field]) {
        const dateValue = new Date(processedData[field]);
        if (!isNaN(dateValue.getTime())) {
          processedData[field] = Timestamp.fromDate(dateValue);
        }
      }
    }
  }

  if (isNew) {
    processedData.createdAt = serverTimestamp();
  }
  processedData.updatedAt = serverTimestamp();

  for (const key in processedData) {
    if (processedData[key] === undefined) {
      delete processedData[key];
    }
  }

  return processedData;
};

const processDataFromFirestore = <T>(data: any): T => {
  if (!data) return data;
  const processedData = { ...data };

  for (const key in processedData) {
    const value = processedData[key];
    if (value && typeof value.toDate === 'function') {
      processedData[key] = value.toDate().toISOString();
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      processedData[key] = processDataFromFirestore(value);
    }
  }

  return processedData as T;
};

// --- Genel Firestore CRUD Fonksiyonları ---

export const addDocument = async <TData extends object>(
  collectionPath: string,
  data: TData
): Promise<string> => {
  try {
    const docRef = await addDoc(
      collection(db, collectionPath),
      processDataForFirestore(data, true)
    );
    return docRef.id;
  } catch (error) {
    console.error(`FirestoreService: addDocument [${collectionPath}] hata:`, error);
    throw error;
  }
};

export const setDocument = async <TData extends object>(
  collectionPath: string,
  id: string,
  data: TData,
  merge: boolean = true
): Promise<void> => {
  try {
    const docRef = doc(db, collectionPath, id);
    await setDoc(docRef, processDataForFirestore(data, !merge), { merge });
  } catch (error) {
    console.error(`FirestoreService: setDocument [${collectionPath}/${id}] hata:`, error);
    throw error;
  }
};

export const updateDocument = async <TData extends object>(
  collectionPath: string,
  id: string,
  data: Partial<TData>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionPath, id);
    await updateDoc(docRef, processDataForFirestore(data));
  } catch (error) {
    console.error(`FirestoreService: updateDocument [${collectionPath}/${id}] hata:`, error);
    throw error;
  }
};

export const deleteDocument = async (collectionPath: string, id: string): Promise<void> => {
  try {
    const docRef = doc(db, collectionPath, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`FirestoreService: deleteDocument [${collectionPath}/${id}] hata:`, error);
    throw error;
  }
};

export const getDocument = async <TModel>(collectionPath: string, id: string): Promise<TModel | null> => {
  try {
    const docRef = doc(db, collectionPath, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return processDataFromFirestore<TModel>({ id: docSnap.id, ...docSnap.data() } as TModel);
    }
    return null;
  } catch (error) {
    console.error(`FirestoreService: getDocument [${collectionPath}/${id}] hata:`, error);
    throw error;
  }
};

export const getCollection = async <TModel>(
  collectionPath: string,
  queryConstraints: QueryConstraint[] = []
): Promise<TModel[]> => {
  try {
    const collRef = collection(db, collectionPath);
    const q = query(collRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap: DocumentSnapshot) =>
      processDataFromFirestore<TModel>({ id: docSnap.id, ...docSnap.data() } as TModel)
    );
  } catch (error) {
    console.error(`FirestoreService: getCollection [${collectionPath}] hata:`, error);
    throw error;
  }
};

export const getCollectionWithRealtimeUpdates = <TModel>(
  collectionPath: string,
  callback: (data: TModel[]) => void,
  queryConstraints: QueryConstraint[] = []
): (() => void) => {
  const collRef = collection(db, collectionPath);
  const q = query(collRef, ...queryConstraints);
  const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const dataList = querySnapshot.docs.map((docSnap: DocumentSnapshot) =>
      processDataFromFirestore<TModel>({ id: docSnap.id, ...docSnap.data() } as TModel)
    );
    callback(dataList);
  }, (error: FirestoreError) => {
    console.error(`FirestoreService: onSnapshot [${collectionPath}] hata:`, error);
  });
  return unsubscribe;
};

// Firestore fonksiyonlarını yeniden dışa aktararak diğer dosyalarda kullanılabilir hale getirme
export {
  doc,
  query,
  where,
  orderBy,
  limit,
  startAt,
  startAfter,
  endAt,
  endBefore,
  documentId,
  writeBatch,
  Timestamp,
  serverTimestamp,
  type QueryConstraint,
  type WriteBatch
};


// Yeni veri tipi, bir döküman oluşturulurken sistem tarafından atanacak olan
// id, createdAt ve updatedAt alanlarını hariç tutar.
export type NewData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

// Rezervasyonlar için CRUD servisleri
export const reservationService = {
  add: (data: NewData<Reservation>) => addDocument(COLLECTIONS.RESERVATIONS, data),
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
  add: (data: NewData<Expense>) => addDocument(COLLECTIONS.EXPENSES, data),
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
  add: (data: NewData<Guest>) => addDocument(COLLECTIONS.GUESTS, data),
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
