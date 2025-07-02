// Oda servis fonksiyonları

import { roomService, where, orderBy } from "./firebase-service";
import { Room } from "./firebase-models";

// Oda durumu için tip tanımı
export type RoomStatus = "Boş" | "Müsait" | "Dolu" | "Bakımda" | "Temizleniyor";

/**
 * Tüm odaları getirir
 */
export async function getAllRooms(): Promise<Room[]> {
  return await roomService.getAll();
}

/**
 * Belirli bir odayı ID'ye göre getirir
 */
export async function getRoomById(id: string): Promise<Room | null> {
  return await roomService.get(id);
}

/**
 * Belirli bir tipteki odaları getirir
 */
export async function getRoomsByType(type: string): Promise<Room[]> {
  return await roomService.getAll([
    where("type", "==", type),
    orderBy("roomNumber")
  ]);
}

/**
 * Belirli bir duruma sahip odaları getirir
 */
export async function getRoomsByStatus(status: string): Promise<Room[]> {
  return await roomService.getAll([
    where("status", "==", status)
  ]);
}

/**
 * Yeni bir oda oluşturur
 */
export async function createRoom(roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  return await roomService.add(roomData);
}

/**
 * Bir odayı günceller
 */
export async function updateRoom(id: string, roomData: Partial<Room>): Promise<void> {
  await roomService.update(id, roomData);
}

/**
 * Bir odayı siler
 */
export async function deleteRoom(id: string): Promise<void> {
  await roomService.delete(id);
}

/**
 * Odanın durumunu günceller
 */
export async function updateRoomStatus(id: string, status: RoomStatus): Promise<void> {
  await roomService.update(id, { status });
}

/**
 * Varsayılan odaları oluşturur (eğer oda koleksiyonu boşsa)
 */
export async function initializeDefaultRooms(): Promise<void> {
  const rooms = await getAllRooms();
  if (rooms.length === 0) {
    const defaultRooms = [
      { name: 'Standart Oda 101', roomNumber: '101', type: 'Standart', capacity: 2, price: 500, status: 'Boş' as RoomStatus, description: 'Standart oda' },
      { name: 'Standart Oda 102', roomNumber: '102', type: 'Standart', capacity: 2, price: 500, status: 'Boş' as RoomStatus, description: 'Standart oda' },
      { name: 'Standart Oda 103', roomNumber: '103', type: 'Standart', capacity: 3, price: 700, status: 'Boş' as RoomStatus, description: 'Standart oda' },
      { name: 'Deluxe Oda 201', roomNumber: '201', type: 'Deluxe', capacity: 2, price: 800, status: 'Boş' as RoomStatus, description: 'Deluxe oda' },
      { name: 'Deluxe Oda 202', roomNumber: '202', type: 'Deluxe', capacity: 4, price: 1000, status: 'Boş' as RoomStatus, description: 'Deluxe oda' },
      { name: 'Suit Oda 301', roomNumber: '301', type: 'Suit', capacity: 2, price: 1200, status: 'Boş' as RoomStatus, description: 'Suit oda' },
    ];
    
    for (const room of defaultRooms) {
      await createRoom(room);
    }
    console.log('Varsayılan odalar başarıyla oluşturuldu.');
  }
}
