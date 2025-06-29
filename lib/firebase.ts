// Firebase yapılandırma dosyası
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Firebase servislerini başlat
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Analytics sadece tarayıcı ortamında çalışır
let analytics = null;
if (typeof window !== 'undefined') {
  // Analytics'i başlatmayı dene
  isSupported().then(yes => yes ? getAnalytics(app) : null);
}

// Geliştirme ortamında emülatörleri kullan
if (process.env.NODE_ENV === 'development') {
  // Yerel emülatörleri kullanmak için aşağıdaki satırları açabilirsiniz
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(firestore, 'localhost', 8080);
  // connectStorageEmulator(storage, 'localhost', 9199);
}

export { app, auth, firestore, storage, analytics };
