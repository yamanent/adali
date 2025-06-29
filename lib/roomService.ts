// lib/roomService.ts
// Bu dosya, lib/firebase-service.ts içindeki roomService objesini sarmalar (wrap)
// ve eski import yapılarını korumak için kullanılır.
// Hata yönetimi firebase-service.ts içinde zaten yapıldığı için burada ek try-catch gerekmez.

import { roomService as fsRoomService, where, QueryConstraint } from './firebase-service';
import { Room as FirebaseRoom } from './firebase-models'; // Modelin doğru import edildiğinden emin ol
// Eğer Room modeli lib/types.ts içindeyse oradan import edilmeli. Şu an firebase-models.ts varsayılıyor.

// NewData tipini firebase-service.ts'den almak yerine burada tanımlayabiliriz veya oradan import edebiliriz.
type NewData<TModel> = Omit<TModel, 'id' | 'createdAt' | 'updatedAt'>;

export const roomService = {
  // addRoom yerine create kullanalım (firebase-service.ts ile uyumlu olması için)
  create: async (data: NewData<FirebaseRoom>): Promise<string> => {
    try {
      return await fsRoomService.add(data); // fsRoomService.add zaten ID döndürüyor
    } catch (error) {
      console.error("Error creating room in roomService wrapper:", error);
      throw new Error(`Failed to create room: ${error.message}`);
    }
  },
  
  // set: fsRoomService.set, // Eğer setDocument kullanılacaksa
  
  // updateRoom yerine update
  update: async (id: string, data: Partial<FirebaseRoom>): Promise<void> => {
    try {
      await fsRoomService.update(id, data);
    } catch (error) {
      console.error(`Error updating room ${id} in roomService wrapper:`, error);
      throw new Error(`Failed to update room: ${error.message}`);
    }
  },

  // deleteRoom yerine delete
  delete: async (id: string): Promise<void> => {
    try {
      await fsRoomService.delete(id);
    } catch (error) {
      console.error(`Error deleting room ${id} in roomService wrapper:`, error);
      throw new Error(`Failed to delete room: ${error.message}`);
    }
  },

  // getRoomById yerine get
  get: async (id: string): Promise<FirebaseRoom | null> => {
    try {
      return await fsRoomService.get(id);
    } catch (error) {
      console.error(`Error fetching room ${id} in roomService wrapper:`, error);
      throw new Error(`Failed to fetch room: ${error.message}`);
    }
  },

  // getAllRooms yerine getAll
  getAll: async (constraints: QueryConstraint[] = []): Promise<FirebaseRoom[]> => {
    try {
      // firebase-service.ts içindeki roomService.getAll varsayılan olarak roomNumber'a göre sıralar.
      // Eğer farklı bir sıralama isteniyorsa, constraints buraya eklenebilir.
      return await fsRoomService.getAll(constraints);
    } catch (error) {
      console.error("Error fetching all rooms in roomService wrapper:", error);
      throw new Error(`Failed to fetch all rooms: ${error.message}`);
    }
  },

  listen: (
    callback: (data: FirebaseRoom[]) => void,
    constraints?: QueryConstraint[] // constraints opsiyonel yapıldı
  ): (() => void) => {
    try {
      return fsRoomService.listen(callback, constraints);
    } catch (error) {
      console.error("Error listening to rooms in roomService wrapper:", error);
      throw new Error(`Failed to listen to rooms: ${error.message}`);
    }
  },

  // Oda numarasına göre odayı getirme (Bu fonksiyon firebase-service.ts'de yok, burada implement edilebilir)
  getRoomByNumber: async (roomNumber: string): Promise<FirebaseRoom | null> => {
    try {
      const rooms = await fsRoomService.getAll([where('roomNumber', '==', roomNumber)]);
      return rooms.length > 0 ? rooms[0] : null;
    } catch (error) {
      console.error(`Error fetching room by number ${roomNumber} in roomService wrapper:`, error);
      throw new Error(`Failed to fetch room by number: ${error.message}`);
    }
  },

  // filterRoomsByType ve filterRoomsByStatus gibi özel filtreleme fonksiyonları
  // gerekirse burada fsRoomService.getAll ve where kullanılarak implement edilebilir.
  // Örneğin:
  // filterByType: async (type: string): Promise<FirebaseRoom[]> => {
  //   return await fsRoomService.getAll([where('type', '==', type)]);
  // }
};

// Eski fonksiyon adlarıyla uyumluluk için (opsiyonel, idealde bunlar kaldırılmalı)
export const getAllRooms = roomService.getAll;
export const addRoom = roomService.create; // addRoom -> create
export const updateRoom = roomService.update; // updateRoom -> update
export const deleteRoom = roomService.delete; // deleteRoom -> delete
export const getRoomById = roomService.get; // getRoomById -> get
// getRoomByNumber zaten roomService içinde tanımlı
// filterRoomsByType ve filterRoomsByStatus şimdilik eklenmedi.
