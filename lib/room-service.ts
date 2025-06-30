// Oda servis fonksiyonları

import { firestore } from "./firebase"; // Firestore mock servisi
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
  serverTimestamp
} from "./firebase-service"; // Firestore fonksiyonları
import { Room } from "./firebase-models"; // Room modeli
import { create, getAll, getById, getFiltered, update, remove } from "./firebase-service"; // CRUD fonksiyonları

// Oda durumu için tip tanımı
export type RoomStatus = "Boş" | "Müsait" | "Dolu" | "Bakımda" | "Temizleniyor";

// Koleksiyon adları
const ROOMS_COLLECTION = "rooms";

/**
 * Tüm odaları getirir
 */
export async function getAllRooms(): Promise<Room[]> {
  return await getAll<Room>(ROOMS_COLLECTION);
}

/**
 * Belirli bir odayı ID'ye göre getirir
 */
export async function getRoomById(id: string): Promise<Room | null> {
  return await getById<Room>(ROOMS_COLLECTION, id);
}

/**
 * Belirli bir tipteki odaları getirir
 */
export async function getRoomsByType(type: string): Promise<Room[]> {
  return await getFiltered<Room>(ROOMS_COLLECTION, [
    where("type", "==", type),
    orderBy("roomNumber")
  ]);
}

/**
 * Belirli bir duruma sahip odaları getirir
 */
export async function getRoomsByStatus(status: string): Promise<Room[]> {
  return await getFiltered<Room>(ROOMS_COLLECTION, [
    where("status", "==", status)
  ]);
}

/**
 * Yeni bir oda oluşturur
 */
export async function createRoom(roomData: Omit<Room, 'id'>): Promise<string> {
  return await create<Omit<Room, 'id'>>(ROOMS_COLLECTION, roomData);
}

/**
 * Bir odayı günceller
 */
export async function updateRoom(id: string, roomData: Partial<Room>): Promise<void> {
  await update(ROOMS_COLLECTION, id, roomData);
}

/**
 * Bir odayı siler
 */
export async function deleteRoom(id: string): Promise<void> {
  await remove(ROOMS_COLLECTION, id);
}

/**
 * Odanın durumunu günceller
 */
export async function updateRoomStatus(id: string, status: RoomStatus): Promise<void> {
  await update(ROOMS_COLLECTION, id, { status });
}

/**
 * Varsayılan odaları oluşturur (eğer oda koleksiyonu boşsa)
 */
export async function initializeDefaultRooms(): Promise<void> {
  const rooms = await getAllRooms();
  if (rooms.length === 0) {
    const now = new Date().toISOString();
    const defaultRooms = [
      { name: 'Standart Oda 101', roomNumber: '101', type: 'Standart', capacity: 2, price: 500, status: 'Boş' as RoomStatus, description: 'Standart oda', createdAt: now, updatedAt: now },
      { name: 'Standart Oda 102', roomNumber: '102', type: 'Standart', capacity: 2, price: 500, status: 'Boş' as RoomStatus, description: 'Standart oda', createdAt: now, updatedAt: now },
      { name: 'Standart Oda 103', roomNumber: '103', type: 'Standart', capacity: 3, price: 700, status: 'Boş' as RoomStatus, description: 'Standart oda', createdAt: now, updatedAt: now },
      { name: 'Deluxe Oda 201', roomNumber: '201', type: 'Deluxe', capacity: 2, price: 800, status: 'Boş' as RoomStatus, description: 'Deluxe oda', createdAt: now, updatedAt: now },
      { name: 'Deluxe Oda 202', roomNumber: '202', type: 'Deluxe', capacity: 4, price: 1000, status: 'Boş' as RoomStatus, description: 'Deluxe oda', createdAt: now, updatedAt: now },
      { name: 'Suit Oda 301', roomNumber: '301', type: 'Suit', capacity: 2, price: 1200, status: 'Boş' as RoomStatus, description: 'Suit oda', createdAt: now, updatedAt: now },
    ];
    
    for (const room of defaultRooms) {
      await createRoom(room);
    }
  }
}
