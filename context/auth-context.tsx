"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User as AuthUser, UserRole } from "@/types/auth";
import { toast } from "sonner";
import { 
  User as FirebaseUser, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permissionCode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Firebase Auth durumunu dinle
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          // Firestore'dan kullanıcı bilgilerini al
          const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            // Firestore'dan gelen kullanıcı verilerini kullan
            const userData = userDoc.data();
            const appUser: AuthUser = {
              id: firebaseUser.uid,
              username: userData.username || '',
              email: firebaseUser.email || '',
              role: userData.role || UserRole.USER,
              displayName: userData.displayName || firebaseUser.displayName || '',
              createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
              lastLogin: new Date()
            };
            
            setUser(appUser);
            localStorage.setItem("adminLoggedIn", "true"); // Geriye dönük uyumluluk için
          } else {
            // Kullanıcı Firestore'da yoksa çıkış yap
            await signOut(auth);
            setUser(null);
            localStorage.removeItem("adminLoggedIn");
          }
        } catch (error) {
          console.error("Kullanıcı bilgileri yüklenirken hata:", error);
          toast.error("Kullanıcı bilgileri yüklenirken bir hata oluştu");
        }
      } else {
        setUser(null);
        localStorage.removeItem("adminLoggedIn");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Giriş fonksiyonu - Firebase Authentication kullanarak
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Firebase ile giriş yap
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      toast.success("Giriş başarılı");
      return true;
    } catch (error: any) {
      console.error("Giriş yapılırken hata:", error);
      
      // Firebase hata kodlarına göre özelleştirilmiş mesajlar
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error("E-posta veya şifre hatalı");
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.");
      } else {
        toast.error("Giriş yapılırken bir hata oluştu");
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Kayıt fonksiyonu - Firebase Authentication kullanarak
  const register = async (email: string, password: string, displayName: string, role: UserRole = UserRole.USER): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Firebase ile yeni kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Kullanıcı bilgilerini Firestore'a kaydet
      const username = email.split('@')[0]; // E-postadan basit bir kullanıcı adı oluştur
      
      await setDoc(doc(firestore, 'users', firebaseUser.uid), {
        username,
        email,
        displayName,
        role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      
      toast.success("Kayıt başarılı");
      return true;
    } catch (error: any) {
      console.error("Kayıt olunurken hata:", error);
      
      // Firebase hata kodlarına göre özelleştirilmiş mesajlar
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Bu e-posta adresi zaten kullanılıyor");
      } else if (error.code === 'auth/weak-password') {
        toast.error("Şifre çok zayıf. En az 6 karakter kullanın.");
      } else {
        toast.error("Kayıt olunurken bir hata oluştu");
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Çıkış fonksiyonu - Firebase Authentication kullanarak
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("adminLoggedIn"); // Geriye dönük uyumluluk için
      setUser(null);
      toast.success("Başarıyla çıkış yapıldı");
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
      toast.error("Çıkış yapılırken bir hata oluştu");
    }
  };

  // İzin kontrolü
  const hasPermission = (permissionCode: string): boolean => {
    if (!user) return false;
    
    // Kullanıcı rolüne göre izinleri kontrol et
    const { ROLE_PERMISSIONS } = require("@/types/auth");
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permissionCode);
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
