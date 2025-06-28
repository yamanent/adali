import { Room } from './models';

// LocalStorage'da odaları saklamak için anahtar
const ROOMS_KEY = 'hotel_rooms';

// Varsayılan odaları oluştur (ilk kez çalıştırıldığında)
const createDefaultRooms = (): Room[] => {
  const defaultRooms: Room[] = [
    { id: '1', number: '101', type: 'Standart', capacity: 2, price: 500, status: 'Boş' },
    { id: '2', number: '102', type: 'Standart', capacity: 2, price: 500, status: 'Boş' },
    { id: '3', number: '103', type: 'Standart', capacity: 3, price: 700, status: 'Boş' },
    { id: '4', number: '201', type: 'Deluxe', capacity: 2, price: 800, status: 'Boş' },
    { id: '5', number: '202', type: 'Deluxe', capacity: 4, price: 1000, status: 'Boş' },
    { id: '6', number: '301', type: 'Suit', capacity: 2, price: 1200, status: 'Boş' },
  ];
  
  return defaultRooms;
};

// Tüm odaları getir
export const getAllRooms = (): Room[] => {
  if (typeof window === 'undefined') return [];
  
  const roomsJson = localStorage.getItem(ROOMS_KEY);
  if (!roomsJson) {
    // Eğer odalar yoksa, varsayılan odaları oluştur ve kaydet
    const defaultRooms = createDefaultRooms();
    localStorage.setItem(ROOMS_KEY, JSON.stringify(defaultRooms));
    return defaultRooms;
  }
  
  try {
    return JSON.parse(roomsJson);
  } catch (error) {
    console.error('Odalar yüklenirken hata oluştu:', error);
    return [];
  }
};

// Yeni oda ekle
export const addRoom = (room: Omit<Room, 'id'>): Room => {
  const rooms = getAllRooms();
  
  const newRoom: Room = {
    ...room,
    id: Date.now().toString()
  };
  
  const updatedRooms = [...rooms, newRoom];
  localStorage.setItem(ROOMS_KEY, JSON.stringify(updatedRooms));
  
  return newRoom;
};

// Oda güncelle
export const updateRoom = (id: string, updatedData: Partial<Room>): Room | null => {
  const rooms = getAllRooms();
  
  const roomIndex = rooms.findIndex(room => room.id === id);
  if (roomIndex === -1) return null;
  
  const updatedRoom = {
    ...rooms[roomIndex],
    ...updatedData
  };
  
  rooms[roomIndex] = updatedRoom;
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  
  return updatedRoom;
};

// Oda sil
export const deleteRoom = (id: string): boolean => {
  const rooms = getAllRooms();
  
  const filteredRooms = rooms.filter(room => room.id !== id);
  
  if (filteredRooms.length === rooms.length) {
    return false; // Oda bulunamadı
  }
  
  localStorage.setItem(ROOMS_KEY, JSON.stringify(filteredRooms));
  return true;
};

// Belirli bir odayı getir
export const getRoomById = (id: string): Room | null => {
  const rooms = getAllRooms();
  return rooms.find(room => room.id === id) || null;
};

// Oda numarasına göre odayı getir
export const getRoomByNumber = (number: string): Room | null => {
  const rooms = getAllRooms();
  return rooms.find(room => room.number === number) || null;
};

// Oda tipine göre odaları filtrele
export const filterRoomsByType = (type: string): Room[] => {
  const rooms = getAllRooms();
  return rooms.filter(room => room.type === type);
};

// Oda durumuna göre odaları filtrele
export const filterRoomsByStatus = (status: Room['status']): Room[] => {
  const rooms = getAllRooms();
  return rooms.filter(room => room.status === status);
};
