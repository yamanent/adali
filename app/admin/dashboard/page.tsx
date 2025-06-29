"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types/auth";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Oturum kontrolü
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
      return;
    }

    // Sayfa yüklendi
    console.log("Dashboard sayfası yüklendi");
    
    setIsLoading(false);
    setIsLoading(false);
  }, [router]);

  // Dashboard için gerekli fonksiyonlar buraya eklenebilir

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    toast.success("Çıkış yapıldı!");
    router.push("/admin");
  };

  // Dashboard fonksiyonları buraya eklenebilir

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-sage-800">Yönetici Paneli</h1>
          <p className="text-sage-600 mt-1">Hoş geldiniz, bugün {new Date().toLocaleDateString('tr-TR', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
        </div>
        <Button 
          onClick={handleLogout} 
          variant="outline" 
          className="border-sage-300 hover:bg-sage-50 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Çıkış Yap
        </Button>
      </div>

      {/* Temel İşlevler Kartı */}
      <Card className="mb-6 border-sage-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-sage-50 to-white pb-4">
          <CardTitle className="text-sage-800 flex items-center gap-2 text-xl sm:text-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Temel İşlevler
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">Günlük işlemler ve rezervasyon yönetimi</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Kullanıcı Rolleri - Sadece Admin için görünür */}
            
            {/* Rezervasyonlar */}
            <Button 
              onClick={() => router.push('/admin/rezervasyonlar')} 
              className="h-28 sm:h-36 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-8 sm:h-8">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
                <path d="M12 11h4" />
                <path d="M12 16h4" />
                <path d="M8 11h.01" />
                <path d="M8 16h.01" />
              </svg>
              <span className="font-medium text-sm sm:text-base">Rezervasyonlar</span>
              <p className="text-xs text-white/80 text-center px-1 sm:px-2 line-clamp-2">Tüm rezervasyonları yönetin</p>
            </Button>
            
            {/* Takvim */}
            <Button 
              onClick={() => router.push('/admin/takvim')} 
              className="h-28 sm:h-36 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-8 sm:h-8">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span className="font-medium text-sm sm:text-base">Rezervasyon Takvimi</span>
              <p className="text-xs text-white/80 text-center px-1 sm:px-2 line-clamp-2">Aylık doluluk durumunu görüntüleyin</p>
            </Button>
            
            {/* Odalar */}
            <Button 
              onClick={() => router.push('/admin/odalar')} 
              className="h-28 sm:h-36 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-8 sm:h-8">
                <path d="M3 22v-8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8" />
                <path d="M18 11V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v7" />
                <path d="M2 22h20" />
                <path d="M7 11v1" />
                <path d="M17 11v1" />
                <path d="M12 11v1" />
              </svg>
              <span className="font-medium text-sm sm:text-base">Odalar Yönetimi</span>
              <p className="text-xs text-white/80 text-center px-1 sm:px-2 line-clamp-2">Oda bilgilerini ve fiyatları düzenleyin</p>
            </Button>
            
            {/* Misafirler */}
            <Button 
              onClick={() => router.push('/admin/misafirler')} 
              className="h-28 sm:h-36 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gradient-to-br from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-8 sm:h-8">
                <path d="M18 21a8 8 0 0 0-16 0" />
                <circle cx="10" cy="8" r="5" />
                <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
              </svg>
              <span className="font-medium text-sm sm:text-base">Misafirler</span>
              <p className="text-xs text-white/80 text-center px-1 sm:px-2 line-clamp-2">Misafir kayıtlarını yönetin</p>
            </Button>
            
          </div>
        </CardContent>
      </Card>

      {/* Mali İşlemler Kartı */}
      <Card className="mb-6 border-sage-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-sage-50 to-white pb-4">
          <CardTitle className="text-sage-800 flex items-center gap-2 text-xl sm:text-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8" />
              <line x1="3" x2="6" y1="3" y2="6" />
              <line x1="21" x2="18" y1="3" y2="6" />
              <line x1="3" x2="6" y1="21" y2="18" />
              <line x1="21" x2="18" y1="21" y2="18" />
            </svg>
            Mali İşlemler
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">Finansal takip ve raporlama araçları</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* İstatistikler */}
            <Button 
              onClick={() => router.push('/admin/istatistikler')} 
              className="h-28 sm:h-36 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-8 sm:h-8">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              <span className="font-medium text-sm sm:text-base">İstatistikler</span>
              <p className="text-xs text-white/80 text-center px-1 sm:px-2 line-clamp-2">Gelir ve doluluk analizleri</p>
            </Button>
            
            {/* Giderler */}
            <Button 
              onClick={() => router.push('/admin/giderler')} 
              className="h-28 sm:h-36 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-8 sm:h-8">
                <path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
                <path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
              </svg>
              <span className="font-medium text-sm sm:text-base">Giderler</span>
              <p className="text-xs text-white/80 text-center px-1 sm:px-2 line-clamp-2">Gider kayıtları ve ödemeler</p>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Yetkili İşlemleri Kartı */}
      <Card className="mb-6 border-sage-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-sage-50 to-white pb-4">
          <CardTitle className="text-sage-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <path d="M7 7h.01" />
              <path d="M12 7h.01" />
              <path d="M17 7h.01" />
              <path d="M7 12h.01" />
              <path d="M12 12h.01" />
              <path d="M17 12h.01" />
              <path d="M7 17h.01" />
              <path d="M12 17h.01" />
              <path d="M17 17h.01" />
            </svg>
            Yetkili İşlemleri
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">Sistem yönetimi ve ayarlar</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Ayarlar */}
            <Button 
              onClick={() => router.push('/admin/ayarlar')} 
              className="h-28 sm:h-36 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gradient-to-br from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-8 sm:h-8">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="font-medium text-sm sm:text-base">Ayarlar</span>
              <p className="text-xs text-white/80 text-center px-1 sm:px-2 line-clamp-2">Sistem ayarları ve yapılandırma</p>
            </Button>

            {/* Kullanıcı Rolleri - Sadece Admin için görünür */}
            {user?.role === UserRole.ADMIN && (
              <Button 
                onClick={() => router.push('/admin/kullanici-rolleri')} 
                className="h-28 sm:h-36 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gradient-to-br from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 shadow-md rounded-xl transition-all duration-200 hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-8 sm:h-8">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <path d="M19 12h2" />
                  <path d="M19 16v-8" />
                </svg>
                <span className="font-medium text-sm sm:text-base">Kullanıcı Rolleri</span>
                <p className="text-xs text-white/80 text-center px-1 sm:px-2 line-clamp-2">Kullanıcı yetkileri ve izinleri</p>
              </Button>
            )}
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
