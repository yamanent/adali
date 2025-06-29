"use client";

// AuthContext.tsx
// Bu dosya, Firebase Authentication ve Firestore kullanarak kullanıcı kimlik doğrulama
// ve oturum yönetimini sağlar. `AuthProvider` bileşeni, uygulama genelinde
// kullanıcı bilgilerine ve kimlik doğrulama fonksiyonlarına erişim sunar.
// `useAuth` hook'u, bu context'e kolay erişim için kullanılır.

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
  const [user, setUser] = useState<AuthUser | null>(null); // Mevcut giriş yapmış kullanıcı veya null
  const [isLoading, setIsLoading] = useState(true); // Kimlik doğrulama durumu yükleniyor mu?

  useEffect(() => {
    // onAuthStateChanged, Firebase Authentication durumundaki değişiklikleri dinler.
    // Kullanıcı giriş yaptığında, çıkış yaptığında veya token yenilendiğinde tetiklenir.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        // Kullanıcı giriş yapmışsa (firebaseUser objesi mevcutsa)
        try {
          // Firestore'dan kullanıcının ek bilgilerini (rol, displayName vb.) al.
          // Kullanıcı ID'si (firebaseUser.uid) ile 'users' koleksiyonundan doküman okunur.
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            // Firestore'da kullanıcı dokümanı bulundu.
            const userData = userDocSnap.data();
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
          } else {
            // Kullanıcı Firestore'da yoksa çıkış yap
            // Bu durum, bir kullanıcı Firebase Auth'da var ama Firestore'da ilgili dokümanı yoksa oluşur.
            // Örneğin, kullanıcı oluşturulduktan sonra Firestore'a yazma işlemi başarısız olduysa.
            console.warn(`Kullanıcı ${firebaseUser.uid} Firestore'da bulunamadı. Çıkış yapılıyor.`);
            await signOut(auth); // Firebase Auth oturumunu sonlandır
            setUser(null); // Lokal kullanıcı state'ini temizle
          }
        } catch (error) {
          console.error("Auth context: Kullanıcı bilgileri Firestore'dan yüklenirken hata:", error);
          toast.error("Kullanıcı bilgileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
          // Hata durumunda kullanıcı oturumunu sonlandırmak güvenli bir yaklaşım olabilir.
          await signOut(auth);
          setUser(null);
        }
      } else {
        // Kullanıcı giriş yapmamışsa (firebaseUser objesi null ise)
        setUser(null);
      }
      setIsLoading(false);
    });

    // useEffect cleanup fonksiyonu: Component unmount olduğunda onAuthStateChanged listener'ını kaldırır.
    // Bu, memory leak'leri ve gereksiz listener'ları önler.
    return () => unsubscribe();
  }, []);

  // login: Kullanıcıyı e-posta ve şifre ile Firebase Authentication kullanarak giriş yaptırır.
  // Başarılı giriş sonrası onAuthStateChanged tetiklenir ve kullanıcı bilgileri Firestore'dan yüklenir.
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Giriş başarılı olduğunda onAuthStateChanged listener'ı yukarıda kullanıcı state'ini güncelleyecektir.
      toast.success("Giriş başarılı!");
      return true;
    } catch (error: any) {
      console.error("Auth context: Giriş yapılırken hata:", error);
      
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
  
  // register: Yeni bir kullanıcıyı Firebase Authentication ile kaydeder ve
  // ek kullanıcı bilgilerini (displayName, role vb.) Firestore'daki 'users' koleksiyonuna yazar.
  const register = async (email: string, password: string, displayName: string, role: UserRole = UserRole.USER): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const username = email.split('@')[0]; // E-postanın @ işaretinden önceki kısmını kullanıcı adı olarak alır.
      
      // Yeni kullanıcı için Firestore'da doküman oluştur.
      // Not: `createdAt` ve `lastLogin` alanları burada `toISOString()` ile oluşturuluyor.
      // `lib/firebase-service.ts` içindeki `processDataForFirestore` fonksiyonu,
      // Firestore'a yazarken `serverTimestamp()` kullanır. Tutarlılık için bu fonksiyonun
      // oradaki gibi `serverTimestamp()` kullanması veya Firestore'a yazılacak verinin
      // `processDataForFirestore` ile işlenmesi daha iyi bir pratiktir.
      // Şimdilik mevcut haliyle bırakılmıştır.
      await setDoc(doc(firestore, 'users', firebaseUser.uid), {
        username,
        email: firebaseUser.email, // Auth objesinden gelen doğrulanmış e-postayı kullanmak daha güvenlidir.
        displayName,
        role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      
      toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
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

  // logout: Kullanıcının Firebase Authentication oturumunu sonlandırır.
  // Başarılı çıkış sonrası onAuthStateChanged tetiklenir ve kullanıcı state'i null olur.
  const logout = async () => {
    try {
      await signOut(auth);
      // setUser(null) çağrısı burada gereksizdir, çünkü onAuthStateChanged bunu zaten yapacaktır.
      toast.success("Başarıyla çıkış yapıldı");
    } catch (error) {
      console.error("Auth context: Çıkış yapılırken hata:", error);
      toast.error("Çıkış yapılırken bir hata oluştu");
    }
  };

  // hasPermission: Kullanıcının belirtilen izin koduna sahip olup olmadığını kontrol eder.
  // İzinler, kullanıcının rolüne göre `types/auth.ts` dosyasındaki `ROLE_PERMISSIONS` objesinden alınır.
  const hasPermission = (permissionCode: string): boolean => {
    if (!user || !user.role) return false; // Kullanıcı yoksa veya rolü tanımsızsa izin yoktur.
    
    // Dinamik require kullanımı yerine, dosyanın başında import edilmesi daha standart bir yaklaşımdır.
    // const { ROLE_PERMISSIONS } = require("@/types/auth");
    // Öneri: import { ROLE_PERMISSIONS } from "@/types/auth"; (dosyanın en başına)
    // Ancak mevcut haliyle de çalışır.
    const { ROLE_PERMISSIONS } = require("@/types/auth");
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permissionCode);
  };

  // AuthContext provider'ının sağladığı değerler.
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

// useAuth: AuthContext'e kolay erişim sağlayan custom hook.
// Bu hook, AuthProvider ile sarmalanmış component'ler içinden çağrılmalıdır.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Context'in AuthProvider dışında kullanılmaya çalışıldığını belirtir.
    throw new Error("useAuth hook must be used within an AuthProvider");
  }
  return context;
}
