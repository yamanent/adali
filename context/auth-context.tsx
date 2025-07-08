"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebase-config'; // Firebase config dosyanızın yolu

// Kullanıcı arayüzü (rol gibi ek bilgilerle genişletilmiş)
interface AppUser {
  uid: string;
  email: string | null;
  role: string; // 'admin', 'erisim', 'user' vb.
  displayName: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Kullanıcı giriş yapmış, Firestore'dan ek bilgileri (rol gibi) al
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: userData.displayName || firebaseUser.displayName || firebaseUser.email,
            role: userData.role || 'user', // Varsayılan rol
          });
        } else {
          // Firestore'da kullanıcı belgesi yoksa, temel bilgilerle ayarla
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email,
            role: 'user', // Varsayılan rol
          });
          console.warn(`Kullanıcı için Firestore belgesi bulunamadı: ${firebaseUser.uid}`);
        }
      } else {
        // Kullanıcı çıkış yapmış
        setUser(null);
      }
      setLoading(false);
    });

    // Component unmount olduğunda listener'ı temizle
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const hasPermission = (permission: string): boolean => {
    // Şu an için basit bir kontrol - tüm izinleri ADMIN rolüne veriyoruz
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    
    // İleride burada daha karmaşık izin kontrolleri yapılabilir
    // Örneğin: Firestore'dan kullanıcının izinlerini çekip kontrol etmek
    return false;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
