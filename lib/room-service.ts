import {
    collection,
    query,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    where,
    orderBy,
    Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { Room } from "./firebase-models";

// Oda durumu için tip tanımı
export type RoomStatus = "Boş" | "Müsait" | "Dolu" | "Bakımda" | "Temizleniyor";

// Firestore dökümanını Room nesnesine çeviren yardımcı fonksiyon
const docToRoom = (doc: any): Room => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    } as Room;
};

/**
 * Tüm odaları getirir
 */
export async function getAllRooms(): Promise<Room[]> {
    const roomsCol = collection(db, 'rooms');
    const q = query(roomsCol, orderBy("roomNumber"));
    const roomSnapshot = await getDocs(q);
    return roomSnapshot.docs.map(docToRoom);
}

/**
 * Belirli bir odayı ID'ye göre getirir
 */
export async function getRoomById(id: string): Promise<Room | null> {
    const docRef = doc(db, "rooms", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToRoom(docSnap) : null;
}

/**
 * Belirli bir tipteki odaları getirir
 */
export async function getRoomsByType(type: string): Promise<Room[]> {
    const roomsCol = collection(db, 'rooms');
    const q = query(roomsCol, where("type", "==", type), orderBy("roomNumber"));
    const roomSnapshot = await getDocs(q);
    return roomSnapshot.docs.map(docToRoom);
}

/**
 * Belirli bir duruma sahip odaları getirir
 */
export async function getRoomsByStatus(status: string): Promise<Room[]> {
    const roomsCol = collection(db, 'rooms');
    const q = query(roomsCol, where("status", "==", status));
    const roomSnapshot = await getDocs(q);
    return roomSnapshot.docs.map(docToRoom);
}

/**
 * Yeni bir oda oluşturur
 */
export async function createRoom(roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const roomsCol = collection(db, 'rooms');
    const docRef = await addDoc(roomsCol, {
        ...roomData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
    return docRef.id;
}

/**
 * Bir odayı günceller
 */
export async function updateRoom(id: string, roomData: Partial<Omit<Room, 'id'>>): Promise<void> {
    const docRef = doc(db, "rooms", id);
    await updateDoc(docRef, {
        ...roomData,
        updatedAt: Timestamp.now(),
    });
}

/**
 * Bir odayı siler
 */
export async function deleteRoom(id: string): Promise<void> {
    const docRef = doc(db, "rooms", id);
    await deleteDoc(docRef);
}

/**
 * Odanın durumunu günceller
 */
export async function updateRoomStatus(id: string, status: RoomStatus): Promise<void> {
    await updateRoom(id, { status });
}

/**
 * Varsayılan odaları oluşturur (eğer oda koleksiyonu boşsa)
 */
export async function initializeDefaultRooms(): Promise<void> {
    const rooms = await getAllRooms();
    if (rooms.length === 0) {
        const defaultRooms: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>[] = [
            { name: 'Standart Oda 101', roomNumber: '101', type: 'Standart', capacity: 2, price: 500, status: 'Boş', description: 'Standart oda' },
            { name: 'Standart Oda 102', roomNumber: '102', type: 'Standart', capacity: 2, price: 500, status: 'Boş', description: 'Standart oda' },
            { name: 'Standart Oda 103', roomNumber: '103', type: 'Standart', capacity: 3, price: 700, status: 'Boş', description: 'Standart oda' },
            { name: 'Deluxe Oda 201', roomNumber: '201', type: 'Deluxe', capacity: 2, price: 800, status: 'Boş', description: 'Deluxe oda' },
            { name: 'Deluxe Oda 202', roomNumber: '202', type: 'Deluxe', capacity: 4, price: 1000, status: 'Boş', description: 'Deluxe oda' },
            { name: 'Suit Oda 301', roomNumber: '301', type: 'Suit', capacity: 2, price: 1200, status: 'Boş', description: 'Suit oda' },
        ];

        for (const room of defaultRooms) {
            await createRoom(room);
        }
        console.log('Varsayılan odalar başarıyla oluşturuldu.');
    }
}
