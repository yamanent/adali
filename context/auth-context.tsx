"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types/auth";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permissionCode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini al
    const loadUser = () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri yüklenirken hata:", error);
        localStorage.removeItem("user");
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
        // Kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("adminLoggedIn", "true"); // Geriye dönük uyumluluk için
        setUser(user);
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

  // Çıkış fonksiyonu
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("adminLoggedIn"); // Geriye dönük uyumluluk için
    setUser(null);
    toast.success("Başarıyla çıkış yapıldı");
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
