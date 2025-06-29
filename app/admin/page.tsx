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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Firebase Authentication ile giriş
    const success = await login(email, password);
    
    if (success) {
      router.push("/admin/dashboard");
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Şifre kontrolü
    if (registerPassword !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor");
      return;
    }
    
    // Firebase Authentication ile kayıt
    const success = await register(registerEmail, registerPassword, displayName);
    
    if (success) {
      toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
      // Kayıt formunu temizle
      setRegisterEmail("");
      setRegisterPassword("");
      setDisplayName("");
      setConfirmPassword("");
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
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Giriş Yap</TabsTrigger>
            <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="w-full border-sage-200 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-center text-sage-800">Yönetici Girişi</CardTitle>
                <CardDescription className="text-center text-sage-600">
                  Lütfen e-posta ve şifrenizle giriş yapın
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sage-700">E-posta</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="E-posta adresinizi girin"
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
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="w-full border-sage-200 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-center text-sage-800">Yeni Kayıt</CardTitle>
                <CardDescription className="text-center text-sage-600">
                  Yeni bir yönetici hesabı oluşturun
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-sage-700">Ad Soyad</Label>
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      placeholder="Adınızı ve soyadınızı girin"
                      className="border-sage-300 focus:border-sage-500 focus:ring-sage-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail" className="text-sage-700">E-posta</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      placeholder="E-posta adresinizi girin"
                      className="border-sage-300 focus:border-sage-500 focus:ring-sage-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword" className="text-sage-700">Şifre</Label>
                    <Input
                      id="registerPassword"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      placeholder="Şifrenizi girin (en az 6 karakter)"
                      className="border-sage-300 focus:border-sage-500 focus:ring-sage-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sage-700">Şifre Tekrar</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Şifrenizi tekrar girin"
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
                    {isLoading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center text-sm text-sage-600">
          © {new Date().getFullYear()} Adalı Pansiyon - Tüm hakları saklıdır.
        </div>
      </div>
    </div>
  );
}
