"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";

export default function ReservationPage() {
  const router = useRouter();
  const { user, isAuthenticated, isGuest } = useAuth();
  
  // Rezervasyon bilgileri için state
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guestCount, setGuestCount] = useState(1);
  const [roomType, setRoomType] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  
  // Kullanılabilir oda tipleri
  const roomTypes = [
    { id: "standard", name: "Standart Oda", price: 1000 },
    { id: "deluxe", name: "Deluxe Oda", price: 1500 },
    { id: "suite", name: "Suit Oda", price: 2500 },
    { id: "family", name: "Aile Odası", price: 3000 },
  ];
  
  // Kullanıcı girişi kontrolü
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/giris");
      toast.error("Rezervasyon yapmak için giriş yapmalısınız");
    }
  }, [isAuthenticated, router]);
  
  // Rezervasyon oluşturma işlemi
  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate || !roomType) {
      toast.error("Lütfen tüm gerekli alanları doldurun");
      return;
    }
    
    // Tarih kontrolü
    if (checkInDate >= checkOutDate) {
      toast.error("Çıkış tarihi, giriş tarihinden sonra olmalıdır");
      return;
    }
    
    // Burada normalde API'ye rezervasyon kaydı yapılır
    // Şimdilik başarılı olduğunu varsayalım
    toast.success("Rezervasyonunuz başarıyla oluşturuldu!");
    
    // Rezervasyon detay sayfasına yönlendir
    setTimeout(() => {
      router.push("/rezervasyon/basarili");
    }, 1500);
  };
  
  // Seçilen oda tipinin fiyatını hesapla
  const getSelectedRoomPrice = () => {
    const selectedRoom = roomTypes.find(room => room.id === roomType);
    return selectedRoom?.price || 0;
  };
  
  // Toplam kalış süresini hesapla (gün sayısı)
  const calculateStayDuration = () => {
    if (!checkInDate || !checkOutDate) return 0;
    
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Toplam fiyatı hesapla
  const calculateTotalPrice = () => {
    const roomPrice = getSelectedRoomPrice();
    const stayDuration = calculateStayDuration();
    return roomPrice * stayDuration;
  };
  
  if (!isAuthenticated) {
    return null; // useEffect içinde yönlendirme yapılıyor
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-sage-800">Rezervasyon Yap</h1>
        
        {isGuest && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-700">
              <span className="font-bold">Hoş geldiniz, {user?.displayName}!</span> Misafir hesabınızla rezervasyon yapıyorsunuz.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rezervasyon Formu */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Rezervasyon Bilgileri</CardTitle>
                <CardDescription>Rezervasyon yapmak için aşağıdaki formu doldurun</CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleCreateReservation} className="space-y-4">
                  {/* Tarih Seçimi */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkin">Giriş Tarihi</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="checkin"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkInDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkInDate ? (
                              format(checkInDate, "PPP", { locale: tr })
                            ) : (
                              <span>Tarih seçin</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkInDate}
                            onSelect={setCheckInDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="checkout">Çıkış Tarihi</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="checkout"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkOutDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOutDate ? (
                              format(checkOutDate, "PPP", { locale: tr })
                            ) : (
                              <span>Tarih seçin</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOutDate}
                            onSelect={setCheckOutDate}
                            initialFocus
                            disabled={(date) => 
                              date < new Date() || 
                              (checkInDate ? date <= checkInDate : false)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  {/* Oda Tipi ve Misafir Sayısı */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="roomType">Oda Tipi</Label>
                      <Select value={roomType} onValueChange={setRoomType}>
                        <SelectTrigger id="roomType">
                          <SelectValue placeholder="Oda tipi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {roomTypes.map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.name} - {room.price} ₺/gece
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="guestCount">Misafir Sayısı</Label>
                      <Select 
                        value={guestCount.toString()} 
                        onValueChange={(value) => setGuestCount(parseInt(value))}
                      >
                        <SelectTrigger id="guestCount">
                          <SelectValue placeholder="Misafir sayısı seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((count) => (
                            <SelectItem key={count} value={count.toString()}>
                              {count} Kişi
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Özel İstekler */}
                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Özel İstekler (Opsiyonel)</Label>
                    <Input
                      id="specialRequests"
                      placeholder="Özel isteklerinizi belirtin"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-sage-600 hover:bg-sage-700">
                    Rezervasyonu Tamamla
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Rezervasyon Özeti */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Rezervasyon Özeti</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {roomType && checkInDate && checkOutDate ? (
                  <>
                    <div className="flex justify-between">
                      <span>Oda Tipi:</span>
                      <span className="font-medium">
                        {roomTypes.find(room => room.id === roomType)?.name}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Giriş Tarihi:</span>
                      <span className="font-medium">
                        {format(checkInDate, "d MMMM yyyy", { locale: tr })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Çıkış Tarihi:</span>
                      <span className="font-medium">
                        {format(checkOutDate, "d MMMM yyyy", { locale: tr })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Kalış Süresi:</span>
                      <span className="font-medium">{calculateStayDuration()} gece</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Misafir Sayısı:</span>
                      <span className="font-medium">{guestCount} kişi</span>
                    </div>
                    
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Toplam Tutar:</span>
                        <span className="text-sage-700">{calculateTotalPrice().toLocaleString('tr-TR')} ₺</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">KDV dahil fiyattır</p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Rezervasyon özeti için lütfen tarih ve oda tipi seçin.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
