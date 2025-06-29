// Firebase servis fonksiyonları

import { firestore } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  DocumentReference,
  Timestamp
} from "firebase/firestore";

// Genel CRUD işlemleri için yardımcı fonksiyonlar

/**
 * Belirli bir koleksiyondan tüm belgeleri getirir
 */
export async function getAll<T>(collectionName: string): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  } catch (error) {
    console.error(`${collectionName} verileri alınırken hata:`, error);
    throw error;
  }
}

/**
 * Belirli bir koleksiyondan filtreleme ve sıralama ile belgeleri getirir
 */
export async function getFiltered<T>(
  collectionName: string,
  constraints: QueryConstraint[],
): Promise<T[]> {
  try {
    const q = query(collection(firestore, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  } catch (error) {
    console.error(`${collectionName} filtrelenirken hata:`, error);
    throw error;
  }
}

/**
 * Belirli bir belgeyi ID'ye göre getirir
 */
export async function getById<T>(collectionName: string, id: string): Promise<T | null> {
  try {
    const docRef = doc(firestore, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as T;
    } else {
      console.log(`${collectionName} koleksiyonunda ${id} ID'li belge bulunamadı`);
      return null;
    }
  } catch (error) {
    console.error(`${collectionName}/${id} alınırken hata:`, error);
    throw error;
  }
}

/**
 * Yeni bir belge oluşturur
 */
export async function create<T extends {[key: string]: any}>(
  collectionName: string,
  data: Omit<T, 'id'>
): Promise<string> {
  try {
    // Zaman damgalarını ekle
    const dataWithTimestamps = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(firestore, collectionName), dataWithTimestamps);
    return docRef.id;
  } catch (error) {
    console.error(`${collectionName} oluşturulurken hata:`, error);
    throw error;
  }
}

/**
 * Mevcut bir belgeyi günceller
 */
export async function update<T extends {[key: string]: any}>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  try {
    // Zaman damgasını güncelle
    const dataWithTimestamp = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    const docRef = doc(firestore, collectionName, id);
    await updateDoc(docRef, dataWithTimestamp);
  } catch (error) {
    console.error(`${collectionName}/${id} güncellenirken hata:`, error);
    throw error;
  }
}

/**
 * Bir belgeyi siler
 */
export async function remove(collectionName: string, id: string): Promise<void> {
  try {
    const docRef = doc(firestore, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`${collectionName}/${id} silinirken hata:`, error);
    throw error;
  }
}
