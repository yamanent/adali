// scripts/update-rooms.ts
// Bu script, Firestore'daki oda verilerini toplu olarak güncellemek için kullanılır.
// ts-node ile çalıştırmak için: npx ts-node -r tsconfig-paths/register ./scripts/update-rooms.ts

import { db } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, addDoc, doc, serverTimestamp } from 'firebase/firestore';

// Kullanıcının sağladığı oda verileri
const roomsData = [
  { name: '201', capacity: 6, type: '6 Kişilik Özel Banyolu' },
  { name: '202', capacity: 6, type: '6 Kişilik Özel Banyolu' },
  { name: '203', capacity: 3, type: '3 Kişilik Ortak Banyolu' },
  { name: '204', capacity: 2, type: '2 Kişilik Ortak Banyolu' },
  { name: '205', capacity: 2, type: '2 Kişilik Özel Banyolu' },
  { name: '301', capacity: 4, type: '4 Kişilik Ortak Banyolu' },
  { name: '302', capacity: 3, type: '3 Kişilik Özel Banyolu' },
  { name: '303', capacity: 3, type: '3 Kişilik Ortak Banyolu' },
  { name: '304', capacity: 2, type: '2 Kişilik Ortak Banyolu' },
  { name: '305', capacity: 2, type: '2 Kişilik Özel Banyolu' },
  { name: '403', capacity: 3, type: '3 Kişilik Ortak Banyolu' },
  { name: '404', capacity: 2, type: '2 Kişilik Ortak Banyolu' },
  { name: '405', capacity: 2, type: '2 Kişilik Özel Banyolu' },
];

const updateRoomsInFirestore = async () => {
  console.log('Oda güncelleme scripti başlatılıyor...');
  const roomsCollectionRef = collection(db, 'rooms');

  for (const roomData of roomsData) {
    // Oda numarasına göre mevcut odayı sorgula
    const q = query(roomsCollectionRef, where('name', '==', roomData.name));
    const querySnapshot = await getDocs(q);

    const payload = {
      name: roomData.name,
      roomNumber: roomData.name, // Oda adı ve numarası aynı kabul edildi
      type: roomData.type,
      capacity: roomData.capacity,
      price: 0, // Varsayılan fiyat, panelden güncellenebilir
      status: 'Müsait' as const, // Varsayılan durum
      updatedAt: serverTimestamp(),
    };

    if (querySnapshot.empty) {
      // Oda mevcut değilse, yeni oluştur
      console.log(`Oda ${roomData.name} bulunamadı, yeni kayıt oluşturuluyor...`);
      await addDoc(roomsCollectionRef, {
        ...payload,
        createdAt: serverTimestamp(),
      });
      console.log(`Oda ${roomData.name} başarıyla oluşturuldu.`);
    } else {
      // Oda mevcutsa, güncelle
      const existingDoc = querySnapshot.docs[0];
      console.log(`Oda ${roomData.name} (ID: ${existingDoc.id}) bulundu, güncelleniyor...`);
      const docRef = doc(db, 'rooms', existingDoc.id);
      await updateDoc(docRef, payload);
      console.log(`Oda ${roomData.name} başarıyla güncellendi.`);
    }
  }

  console.log('Tüm odaların güncellenmesi tamamlandı.');
};

updateRoomsInFirestore().catch(error => {
  console.error('Oda güncelleme sırasında bir hata oluştu:', error);
});
