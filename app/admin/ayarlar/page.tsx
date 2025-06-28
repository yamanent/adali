"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Settings {
  hotelName: string;
  address: string;
  phone: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  enableNotifications: boolean;
  darkMode: boolean;
  language: string;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    hotelName: "Adalı Pansiyon",
    address: "Sahil Caddesi No:123, Datça/Muğla",
    phone: "+90 555 123 4567",
    email: "info@adalipansiyon.com",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    enableNotifications: true,
    darkMode: false,
    language: "tr"
  });
  
  const router = useRouter();

  useEffect(() => {
    // Oturum kontrolü
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
      return;
    }

    loadSettings();
  }, [router]);

  const loadSettings = () => {
    try {
      // LocalStorage'dan ayarları yükle
      const savedSettings = localStorage.getItem("hotelSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Ayarlar yüklenirken hata:", error);
      toast.error("Ayarlar yüklenirken bir hata oluştu.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveSettings = () => {
    try {
      // Ayarları localStorage'a kaydet
      localStorage.setItem("hotelSettings", JSON.stringify(settings));
      toast.success("Ayarlar başarıyla kaydedildi!");
    } catch (error) {
      console.error("Ayarlar kaydedilirken hata:", error);
      toast.error("Ayarlar kaydedilirken bir hata oluştu!");
    }
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
        <h1 className="text-3xl font-bold">Ayarlar</h1>
        <Button onClick={() => router.push("/admin/dashboard")} variant="outline">
          Dashboard'a Dön
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Otel Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle>Otel Bilgileri</CardTitle>
            <CardDescription>Temel otel bilgilerini düzenleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hotelName">Otel Adı</Label>
              <Input
                id="hotelName"
                name="hotelName"
                value={settings.hotelName}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                name="address"
                value={settings.address}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                name="phone"
                value={settings.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={settings.email}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Rezervasyon Ayarları */}
        <Card>
          <CardHeader>
            <CardTitle>Rezervasyon Ayarları</CardTitle>
            <CardDescription>Rezervasyon ile ilgili ayarları düzenleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="checkInTime">Giriş Saati</Label>
              <Input
                id="checkInTime"
                name="checkInTime"
                type="time"
                value={settings.checkInTime}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="checkOutTime">Çıkış Saati</Label>
              <Input
                id="checkOutTime"
                name="checkOutTime"
                type="time"
                value={settings.checkOutTime}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Uygulama Ayarları */}
        <Card>
          <CardHeader>
            <CardTitle>Uygulama Ayarları</CardTitle>
            <CardDescription>Uygulama tercihlerini düzenleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableNotifications">Bildirimleri Etkinleştir</Label>
                <p className="text-sm text-gray-500">Yeni rezervasyonlar için bildirim alın</p>
              </div>
              <Switch
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => handleSwitchChange("enableNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="darkMode">Karanlık Mod</Label>
                <p className="text-sm text-gray-500">Karanlık tema kullanın</p>
              </div>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => handleSwitchChange("darkMode", checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="language">Dil</Label>
              <select
                id="language"
                name="language"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={settings.language}
                onChange={handleInputChange}
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="ru">Русский</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Yedekleme ve Veri */}
        <Card>
          <CardHeader>
            <CardTitle>Yedekleme ve Veri</CardTitle>
            <CardDescription>Veri yönetimi ve yedekleme seçenekleri.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-4">Tüm verilerinizi yedekleyin veya sıfırlayın.</p>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const data = {
                      settings: settings,
                      reservations: localStorage.getItem("reservations"),
                      rooms: localStorage.getItem("rooms")
                    };
                    
                    const dataStr = JSON.stringify(data);
                    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                    
                    const exportFileDefaultName = `adali-pansiyon-yedek-${new Date().toISOString().split('T')[0]}.json`;
                    
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                    
                    toast.success("Veriler başarıyla indirildi!");
                  }}
                >
                  Verileri İndir
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (window.confirm("Tüm verileri sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz!")) {
                      localStorage.removeItem("reservations");
                      localStorage.removeItem("rooms");
                      toast.success("Tüm veriler sıfırlandı!");
                      setTimeout(() => {
                        window.location.reload();
                      }, 1500);
                    }
                  }}
                >
                  Verileri Sıfırla
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings}>Ayarları Kaydet</Button>
      </div>
    </div>
  );
}
