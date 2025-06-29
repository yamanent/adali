"use client";

// Admin Paneli Giriş ve Kayıt Sayfası
// Bu sayfa, Firebase Authentication kullanarak yöneticilerin sisteme
// giriş yapmasını veya yeni yönetici hesabı oluşturmasını sağlar.
// `useAuth` hook'u (context/auth-context.tsx) aracılığıyla Firebase
// kimlik doğrulama fonksiyonlarına (login, register) erişir.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Yeni auth sistemi ile giriş
    const success = await login(username, password);
    
    if (success) {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <Image 
            src="/Adali.svg" 
            alt="Adalı Pansiyon Logo" 
            width={250}
            height={80}
            className="mx-auto mb-6"
            priority
          />
        </div>
        
        <Card className="w-full border-sage-200 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-center text-sage-800">Yönetici Girişi</CardTitle>
            <CardDescription className="text-center text-sage-600">
              Lütfen yönetici bilgilerinizle giriş yapın
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sage-700">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Kullanıcı adınızı girin"
                  className="border-sage-300 focus:border-sage-500 focus:ring-sage-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sage-700">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Şifrenizi girin"
                  className="border-sage-300 focus:border-sage-500 focus:ring-sage-500"
                />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-sage-600 hover:bg-sage-700 text-white" 
                disabled={isLoading}
              >
                {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-sage-600">
          © {new Date().getFullYear()} Adalı Pansiyon - Tüm hakları saklıdır.
        </div>
      </div>
    </div>
  );
}
