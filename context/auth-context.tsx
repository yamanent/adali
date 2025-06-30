"use client";

// AuthContext.tsx
// Bu dosya, kullanıcı kimlik doğrulama ve oturum yönetimini sağlar.
// `AuthProvider` bileşeni, uygulama genelinde kullanıcı bilgilerine ve kimlik doğrulama fonksiyonlarına erişim sunar.
// `useAuth` hook'u, bu context'e kolay erişim için kullanılır.

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole, ROLE_PERMISSIONS } from "@/types/auth";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  guestLogin: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isGuest: boolean;
  hasPermission: (permissionCode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini al
    const loadUser = () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem("user");
        const storedExpiry = localStorage.getItem("user_expiry");
        
        if (storedUser && storedExpiry) {
          const expiryTime = parseInt(storedExpiry, 10);
          const now = Date.now();
          
          // Kullanıcı oturumu süresi dolmuş mu kontrol et (24 saat)
          if (now < expiryTime) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsGuest(!!parsedUser.isGuest);
          } else {
            // Süresi dolmuşsa oturumu temizle
            localStorage.removeItem("user");
            localStorage.removeItem("user_expiry");
            localStorage.removeItem("adminLoggedIn");
          }
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri yüklenirken hata:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("user_expiry");
        localStorage.removeItem("adminLoggedIn");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Giriş fonksiyonu
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Normalde burada API çağrısı yapılır
      // Şimdilik örnek kullanıcılar ile devam edelim
      const mockUsers = {
        "admin": {
          id: "1",
          username: "admin",
          email: "admin@adali.com",
          role: UserRole.ADMIN,
          displayName: "Admin Kullanıcı",
          createdAt: new Date(),
          lastLogin: new Date()
        },
        "manager": {
          id: "2",
          username: "manager",
          email: "manager@adali.com",
          role: UserRole.MANAGER,
          displayName: "Yönetici Kullanıcı",
          createdAt: new Date(),
          lastLogin: new Date()
        },
        "editor": {
          id: "3",
          username: "editor",
          email: "editor@adali.com",
          role: UserRole.EDITOR,
          displayName: "Editör Kullanıcı",
          createdAt: new Date(),
          lastLogin: new Date()
        },
        "reader": {
          id: "4",
          username: "reader",
          email: "reader@adali.com",
          role: UserRole.READER,
          displayName: "Okuyucu Kullanıcı",
          createdAt: new Date(),
          lastLogin: new Date()
        }
      };

      // Basit doğrulama - gerçek uygulamada API'den doğrulama yapılır
      if (mockUsers[username as keyof typeof mockUsers] && password === "123456") {
        const user = mockUsers[username as keyof typeof mockUsers];
        // Kullanıcı bilgilerini localStorage'a kaydet (24 saatlik süre ile)
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 saat
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user_expiry", expiryTime.toString());
        localStorage.setItem("adminLoggedIn", "true"); // Geriye dönük uyumluluk için
        setUser(user);
        setIsGuest(false);
        toast.success(`Hoş geldiniz, ${user.displayName}`);
        return true;
      } else {
        toast.error("Kullanıcı adı veya şifre hatalı");
        return false;
      }
    } catch (error) {
      console.error("Giriş yapılırken hata:", error);
      toast.error("Giriş yapılırken bir hata oluştu");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Misafir girişi fonksiyonu
  const guestLogin = async (name: string, email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Misafir kullanıcı oluştur
      const guestUser: User = {
        id: `guest-${Date.now()}`,
        username: email.split('@')[0],
        email: email,
        role: UserRole.GUEST,
        displayName: name,
        createdAt: new Date(),
        lastLogin: new Date(),
        isGuest: true
      };

      // Misafir kullanıcı bilgilerini localStorage'a kaydet (24 saatlik süre ile)
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 saat
      localStorage.setItem("user", JSON.stringify(guestUser));
      localStorage.setItem("user_expiry", expiryTime.toString());
      setUser(guestUser);
      setIsGuest(true);
      toast.success(`Hoş geldiniz, ${name}`);
      return true;
    } catch (error) {
      console.error("Misafir girişi yapılırken hata:", error);
      toast.error("Misafir girişi yapılırken bir hata oluştu");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Çıkış fonksiyonu
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_expiry");
    localStorage.removeItem("adminLoggedIn");
    setUser(null);
    setIsGuest(false);
    toast.success("Çıkış yapıldı");
  };

  // İzin kontrolü fonksiyonu
  const hasPermission = (permissionCode: string): boolean => {
    if (!user) return false;
    
    // Kullanıcının rolüne göre izinleri al
    const userPermissions = ROLE_PERMISSIONS[user.role];
    
    // İzin kontrolü yap
    return userPermissions.includes(permissionCode);
  };

  // Context değerini oluştur
  const value = {
    user,
    isLoading,
    login,
    guestLogin,
    logout,
    isAuthenticated: !!user,
    isGuest,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
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
