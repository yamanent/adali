// lib/firebase-service.ts
import { db } from './firebase/firebase-config';
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
  type WriteBatch,
} from 'firebase/firestore';

// Modelleri merkezi dosyadan içe aktar
import type {
  User,
  Room,
  Guest,
  Reservation,
  Expense,
  Log,
} from './firebase-models';

// Firestore koleksiyon adları için sabitler
export const COLLECTIONS = {
  RESERVATIONS: 'reservations',
  ROOMS: 'rooms',
  EXPENSES: 'expenses',
  GUESTS: 'guests',
  USERS: 'users',
  LOGS: 'logs',
};

// --- Veri Dönüşüm Yardımcıları ---

const processDataForFirestore = (data: any, isNew: boolean = false): any => {
  const processedData = { ...data };
  const dateFields: string[] = ['checkInDate', 'checkOutDate', 'date', 'birthDate'];

  for (const field in processedData) {
    if (Object.prototype.hasOwnProperty.call(processedData, field)) {
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

  // Firestore'a gönderilmeden önce 'id' alanını ve tanımsız değerleri kaldır
  delete processedData.id;
  for (const key in processedData) {
    if (processedData[key] === undefined) {
      delete processedData[key];
    }
  }

  return processedData;
};

const processDataFromFirestore = <T>(doc: DocumentSnapshot): T => {
  const data = doc.data();
  if (!data) return data as T; // Veya bir hata fırlat

  const processedData: any = { id: doc.id, ...data };

  for (const key in processedData) {
    const value = processedData[key];
    if (value instanceof Timestamp) {
      processedData[key] = value.toDate().toISOString();
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

export const getDocument = async <TModel>(
  collectionPath: string,
  id: string
): Promise<TModel | null> => {
  try {
    const docRef = doc(db, collectionPath, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? processDataFromFirestore<TModel>(docSnap) : null;
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
    return querySnapshot.docs.map(processDataFromFirestore<TModel>);
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
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot: QuerySnapshot) => {
      const dataList = querySnapshot.docs.map(processDataFromFirestore<TModel>);
      callback(dataList);
    },
    (error: FirestoreError) => {
      console.error(`FirestoreService: onSnapshot [${collectionPath}] hata:`, error);
    }
  );
  return unsubscribe;
};

// Firestore yardımcılarını yeniden dışa aktar
export {
  doc, query, where, orderBy, limit, startAt, startAfter, endAt, endBefore, documentId, writeBatch, Timestamp, serverTimestamp,
  type QueryConstraint, type WriteBatch
};

// Yeni veri tipi, bir döküman oluşturulurken sistem tarafından atanacak olan
// id, createdAt ve updatedAt alanlarını hariç tutar.
export type NewData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

// --- Servis Tanımları ---

export const reservationService = {
  add: (data: NewData<Reservation>) => addDocument(COLLECTIONS.RESERVATIONS, data),
  set: (id: string, data: Reservation) => setDocument(COLLECTIONS.RESERVATIONS, id, data),
  update: (id: string, data: Partial<Reservation>) => updateDocument(COLLECTIONS.RESERVATIONS, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.RESERVATIONS, id),
  get: (id: string) => getDocument<Reservation>(COLLECTIONS.RESERVATIONS, id),
  getAll: (constraints: QueryConstraint[] = [orderBy('checkInDate', 'desc')]) => getCollection<Reservation>(COLLECTIONS.RESERVATIONS, constraints),
  listen: (callback: (data: Reservation[]) => void, constraints: QueryConstraint[] = [orderBy('checkInDate', 'desc')]) =>
    getCollectionWithRealtimeUpdates<Reservation>(COLLECTIONS.RESERVATIONS, callback, constraints),
};

export const roomService = {
  add: (data: NewData<Room>) => addDocument(COLLECTIONS.ROOMS, data),
  set: (id: string, data: Room) => setDocument(COLLECTIONS.ROOMS, id, data),
  update: (id: string, data: Partial<Room>) => updateDocument(COLLECTIONS.ROOMS, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.ROOMS, id),
  get: (id: string) => getDocument<Room>(COLLECTIONS.ROOMS, id),
  getAll: (constraints: QueryConstraint[] = [orderBy('roomNumber', 'asc')]) => getCollection<Room>(COLLECTIONS.ROOMS, constraints),
  listen: (callback: (data: Room[]) => void, constraints: QueryConstraint[] = [orderBy('roomNumber', 'asc')]) =>
    getCollectionWithRealtimeUpdates<Room>(COLLECTIONS.ROOMS, callback, constraints),
};

export const expenseService = {
  add: (data: NewData<Expense>) => addDocument(COLLECTIONS.EXPENSES, data),
  set: (id: string, data: Expense) => setDocument(COLLECTIONS.EXPENSES, id, data),
  update: (id: string, data: Partial<Expense>) => updateDocument(COLLECTIONS.EXPENSES, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.EXPENSES, id),
  get: (id: string) => getDocument<Expense>(COLLECTIONS.EXPENSES, id),
  getAll: (constraints: QueryConstraint[] = [orderBy('date', 'desc')]) => getCollection<Expense>(COLLECTIONS.EXPENSES, constraints),
  listen: (callback: (data: Expense[]) => void, constraints: QueryConstraint[] = [orderBy('date', 'desc')]) =>
    getCollectionWithRealtimeUpdates<Expense>(COLLECTIONS.EXPENSES, callback, constraints),
};

export const guestService = {
  add: (data: NewData<Guest>) => addDocument(COLLECTIONS.GUESTS, data),
  set: (id: string, data: Guest) => setDocument(COLLECTIONS.GUESTS, id, data),
  update: (id: string, data: Partial<Guest>) => updateDocument(COLLECTIONS.GUESTS, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.GUESTS, id),
  get: (id: string) => getDocument<Guest>(COLLECTIONS.GUESTS, id),
  getAll: (constraints: QueryConstraint[] = [orderBy('fullName', 'asc')]) => getCollection<Guest>(COLLECTIONS.GUESTS, constraints),
  listen: (callback: (data: Guest[]) => void, constraints: QueryConstraint[] = [orderBy('fullName', 'asc')]) =>
    getCollectionWithRealtimeUpdates<Guest>(COLLECTIONS.GUESTS, callback, constraints),
};

export const logService = {
  add: (data: NewData<Log>) => addDocument(COLLECTIONS.LOGS, data),
  get: (id: string) => getDocument<Log>(COLLECTIONS.LOGS, id),
  getAll: (constraints: QueryConstraint[] = [orderBy('timestamp', 'desc')]) => getCollection<Log>(COLLECTIONS.LOGS, constraints),
  listen: (callback: (data: Log[]) => void, constraints: QueryConstraint[] = [orderBy('timestamp', 'desc')]) =>
    getCollectionWithRealtimeUpdates<Log>(COLLECTIONS.LOGS, callback, constraints),
};

export const userService = {
  // Not: Kullanıcı oluşturma (add) Firebase Auth üzerinden yapılır.
  // Firestore'daki user belgesi, genellikle bir kullanıcı ilk kez giriş yaptığında
  // veya bir yönetici tarafından manuel olarak oluşturulduğunda tetiklenir.
  set(id: string, data: User) {
    // Belge ID'si, kullanıcının Firebase Auth UID'sidir.
    return setDocument(COLLECTIONS.USERS, id, data);
  },
  update(id: string, data: Partial<User>) {
    return updateDocument(COLLECTIONS.USERS, id, data);
  },
  delete(id: string) {
    return deleteDocument(COLLECTIONS.USERS, id);
  },
  get(id: string) {
    return getDocument<User>(COLLECTIONS.USERS, id);
  },
  getAll(constraints: QueryConstraint[] = [orderBy('email', 'asc')]) {
    return getCollection<User>(COLLECTIONS.USERS, constraints);
  },
  listen(callback: (data: User[]) => void, constraints: QueryConstraint[] = [orderBy('email', 'asc')]) {
    return getCollectionWithRealtimeUpdates<User>(COLLECTIONS.USERS, callback, constraints);
  },
};
