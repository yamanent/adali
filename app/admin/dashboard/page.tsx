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
        <h1 className="text-3xl font-bold">Yönetici Paneli</h1>
        <Button onClick={handleLogout} variant="outline">
          Çıkış Yap
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Hoş Geldiniz</CardTitle>
          <CardDescription>Yönetici panelinize hoş geldiniz. Buradan site yönetimini gerçekleştirebilirsiniz.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              onClick={() => router.push('/admin/takvim')} 
              className="h-24 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span>Rezervasyon Takvimi</span>
            </Button>
            
            <Button 
              onClick={() => router.push('/admin/odalar')} 
              className="h-24 flex flex-col items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M3 22v-8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8" />
                <path d="M18 11V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v7" />
                <path d="M2 22h20" />
                <path d="M7 11v1" />
                <path d="M17 11v1" />
                <path d="M12 11v1" />
              </svg>
              <span>Odalar Yönetimi</span>
            </Button>
            
            <Button 
              onClick={() => router.push('/admin/rezervasyonlar')} 
              className="h-24 flex flex-col items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
                <path d="M12 11h4" />
                <path d="M12 16h4" />
                <path d="M8 11h.01" />
                <path d="M8 16h.01" />
              </svg>
              <span>Rezervasyonlar</span>
            </Button>
            
            <Button 
              onClick={() => router.push('/admin/ayarlar')} 
              className="h-24 flex flex-col items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Ayarlar</span>
            </Button>
            
            <Button 
              onClick={() => router.push('/admin/istatistikler')} 
              className="h-24 flex flex-col items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              <span>İstatistikler</span>
            </Button>
            
            <Button 
              onClick={() => router.push('/admin/misafirler')} 
              className="h-24 flex flex-col items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Misafirler</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Giriş Kayıtları</CardTitle>
          <CardDescription>Log kayıtları artık Telegram üzerinden takip edilmektedir.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="mb-4">Tüm giriş ve erişim logları Telegram botunuza gönderilmektedir.</p>
            <p className="text-sm text-gray-500">Telegram botunuzu yapılandırmak için lib/telegram.ts dosyasını düzenleyin.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
