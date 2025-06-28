"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logAdminAccess } from "@/lib/telegram";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Oturum kontrolü
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
      return;
    }

    // Telegram'a erişim logu gönder - hata olsa bile devam et
    const sendAccessLog = async () => {
      try {
        // Telegram log gönderme işlemi başarısız olsa bile uygulamayı etkilemeyecek
        logAdminAccess("admin", "dashboard", "client-side")
          .catch(error => {
            console.warn("Telegram log gönderme hatası (işlem devam ediyor):", error);
          });
      } catch (error) {
        console.error("Log gönderme hatası:", error);
        // Hata olsa bile devam et
      }
    };
    
    // Log gönderme işlemini başlat ama bekleme
    sendAccessLog();
    
    // Logları yükle
    fetchLogs();
    setIsLoading(false);
  }, [router]);

  const fetchLogs = async () => {
    try {
      toast.info("Telegram'dan log kayıtları alınıyor...");
      // Not: Artık loglar Telegram'a gönderildiği için burada bir şey yapmamıza gerek yok
      // Gerçek bir uygulamada, Telegram'dan logları çekmek için bir API endpoint'i oluşturabilirsiniz
      setLogs([]);
    } catch (error) {
      console.error("Log fetch error:", error);
      toast.error("Loglar yüklenirken bir hata oluştu.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    toast.success("Çıkış yapıldı!");
    router.push("/admin");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-sage-800">Yönetici Paneli</h1>
          <p className="text-sage-600 mt-1">Hoş geldiniz, bugün {new Date().toLocaleDateString('tr-TR', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="border-sage-300 hover:bg-sage-50">
          Çıkış Yap
        </Button>
      </div>

      <Card className="mb-6 border-sage-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-sage-50 to-white pb-4">
          <CardTitle className="text-sage-800">Hızlı Erişim</CardTitle>
          <CardDescription>Yönetici panelinize hoş geldiniz. Aşağıdaki menülerden hızlıca erişim sağlayabilirsiniz.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Rezervasyonlar */}
            <Button 
              onClick={() => router.push('/admin/rezervasyonlar')} 
              className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
                <path d="M12 11h4" />
                <path d="M12 16h4" />
                <path d="M8 11h.01" />
                <path d="M8 16h.01" />
              </svg>
              <span className="font-medium text-base">Rezervasyonlar</span>
            </Button>
            
            {/* Takvim */}
            <Button 
              onClick={() => router.push('/admin/takvim')} 
              className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span className="font-medium text-base">Rezervasyon Takvimi</span>
            </Button>
            
            {/* Odalar */}
            <Button 
              onClick={() => router.push('/admin/odalar')} 
              className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M3 22v-8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8" />
                <path d="M18 11V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v7" />
                <path d="M2 22h20" />
                <path d="M7 11v1" />
                <path d="M17 11v1" />
                <path d="M12 11v1" />
              </svg>
              <span className="font-medium text-base">Odalar Yönetimi</span>
            </Button>
            
            {/* Misafirler */}
            <Button 
              onClick={() => router.push('/admin/misafirler')} 
              className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="font-medium text-base">Misafirler</span>
            </Button>
            
            {/* İstatistikler */}
            <Button 
              onClick={() => router.push('/admin/istatistikler')} 
              className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              <span className="font-medium text-base">İstatistikler</span>
            </Button>
            
            {/* Giderler */}
            <Button 
              onClick={() => router.push('/admin/giderler')} 
              className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
                <path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
                <path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12" />
                <path d="M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z" />
              </svg>
              <span className="font-medium text-base">Giderler</span>
            </Button>
            
            {/* Ayarlar */}
            <Button 
              onClick={() => router.push('/admin/ayarlar')} 
              className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="font-medium text-base">Ayarlar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-sage-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-sage-50 to-white pb-4">
          <CardTitle className="text-sage-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sage-600">
              <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/>
              <circle cx="17" cy="7" r="5"/>
            </svg>
            Sistem Kayıtları
          </CardTitle>
          <CardDescription>Log kayıtları artık Telegram üzerinden takip edilmektedir.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-4 border rounded-lg bg-sage-50/30 px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <path d="M12 9v4"/>
                  <path d="M12 17h.01"/>
                </svg>
              </div>
              <div>
                <p className="font-medium">Tüm giriş ve erişim logları Telegram botunuza gönderilmektedir.</p>
                <p className="text-sm text-sage-600 mt-1">Telegram botunuzu yapılandırmak için lib/telegram.ts dosyasını düzenleyin.</p>
              </div>
            </div>
            <div className="text-xs text-sage-500 border-t pt-3 mt-2">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
