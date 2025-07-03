// lib/firebase/firebase-config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// DİKKAT: Bu bilgileri Firebase projenizin ayarlarından alıp buraya yapıştırmanız gerekmektedir.
// Firebase Console -> Proje Ayarları (Project Settings) -> Genel (General) sekmesinde "SDK kurulumu ve yapılandırması" (SDK setup and configuration) bölümünde bulabilirsiniz.
const firebaseConfig = {
  apiKey: "AIzaSyAbSDe3hUeYloxKxCsPo5rvXPbBellIaRM",
  authDomain: "adali-pansiyon.firebaseapp.com",
  projectId: "adali-pansiyon",
  storageBucket: "adali-pansiyon.firebasestorage.app",
  messagingSenderId: "835986340261",
  appId: "1:835986340261:web:b03f809c5c5d555119104c"
};

// Firebase uygulamasını başlat
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
