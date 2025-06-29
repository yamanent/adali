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
        try {
          // Get ID token result to access custom claims
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const userClaims = idTokenResult.claims;

          // Determine role from custom claims first
          let roleFromClaims: UserRole | undefined = undefined;
          if (userClaims.role && Object.values(UserRole).includes(userClaims.role as UserRole)) {
            roleFromClaims = userClaims.role as UserRole;
          } else if (userClaims.admin === true) { // Example for a boolean admin claim
             roleFromClaims = UserRole.ADMIN;
          }
          // Add more conditions if other claim structures are used (e.g. other boolean flags for roles)

          // Fetch additional user data from Firestore (optional, if needed)
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          let firestoreData: any = {};
          let firestoreRole: UserRole | undefined = undefined;

          if (userDocSnap.exists()) {
            firestoreData = userDocSnap.data();
            if (firestoreData.role && Object.values(UserRole).includes(firestoreData.role as UserRole)) {
                firestoreRole = firestoreData.role as UserRole;
            }
          } else {
            // If user is not in Firestore, it might be an issue depending on app logic.
            // For now, we'll allow login if custom claims provide a role,
            // or default to USER. A warning can be logged.
            console.warn(`User ${firebaseUser.uid} not found in Firestore. Relying on custom claims or default role.`);
          }

          // Role hierarchy: Custom Claim > Firestore Role > Default (UserRole.USER)
          const finalRole = roleFromClaims || firestoreRole || UserRole.USER;

          const appUser: AuthUser = {
            id: firebaseUser.uid,
            username: firestoreData.username || firebaseUser.email?.split('@')[0] || '',
            email: firebaseUser.email || '',
            role: finalRole,
            displayName: firestoreData.displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            createdAt: firestoreData.createdAt ? new Date(firestoreData.createdAt.seconds ? firestoreData.createdAt.toDate() : firestoreData.createdAt) : new Date(),
            lastLogin: new Date(), // This could also be updated in Firestore if needed
            // customClaims: userClaims, // Optionally store all claims if needed elsewhere
          };

          setUser(appUser);

        } catch (error) {
          console.error("Auth context: Error processing user state:", error);
          toast.error("Kullanıcı oturumu doğrulanırken bir hata oluştu.");
          await signOut(auth);
          setUser(null);
        }
      } else {
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

import { ROLE_PERMISSIONS } from "@/types/auth"; // Import at the top

// ... (rest of the AuthProvider component)

  // hasPermission: Kullanıcının belirtilen izin koduna sahip olup olmadığını kontrol eder.
  // İzinler, kullanıcının rolüne göre `types/auth.ts` dosyasındaki `ROLE_PERMISSIONS` objesinden alınır.
  const hasPermission = (permissionCode: string): boolean => {
    if (!user || !user.role) return false; // Kullanıcı yoksa veya rolü tanımsızsa izin yoktur.
    
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
