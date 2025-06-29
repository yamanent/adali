// Firebase Yapılandırma Dosyası
// Bu dosya, Firebase projesi ile bağlantı kurmak için gerekli yapılandırma bilgilerini içerir
// ve Firebase servislerini (Authentication, Firestore, Storage, Analytics) başlatır.

import { initializeApp, getApps, getApp } from 'firebase/app'; // getApp eklendi
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyAbSDe3hUeYloxKxCsPo5rvXPbBellIaRM",
  authDomain: "adali-pansiyon.firebaseapp.com",
  projectId: "adali-pansiyon",
  storageBucket: "adali-pansiyon.firebasestorage.app",
  messagingSenderId: "835986340261",
  appId: "1:835986340261:web:b03f809c5c5d555119104c",
  measurementId: "G-MZ77STPRCG"
};

// Firebase uygulamasını başlat
// Birden fazla uygulama örneği oluşturulmasını engellemek için getApps() kontrolü yapılır.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp(); // getApps()[0] yerine getApp() kullanıldı.

// Firebase servislerini dışa aktarılabilir şekilde başlat
// Bu servisler, uygulamanın diğer bölümlerinde Firebase özelliklerine erişmek için kullanılır.
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Firebase Analytics'i sadece tarayıcı ortamında ve destekleniyorsa başlat
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(isAnalyticsSupported => {
    if (isAnalyticsSupported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics başlatıldı.");
    } else {
      console.log("Firebase Analytics bu tarayıcıda desteklenmiyor.");
    }
  });
}

export { app, auth, firestore, storage, analytics };
