"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Reservation ve Guest modellerini firebase-models'dan al
import { Reservation, Guest } from "@/lib/firebase-models";
import {
  getAllReservations,
  deleteReservation,
  updateReservationStatus, // Ekledik, gerekebilir
  // createReservation, updateReservation // Bunlar form içinde yönetiliyor artık
} from "@/lib/reservation-service"; // reservation-service.ts kullanılıyor
import { listGuests } from "@/lib/guest-service"; // Misafirleri çekmek için
import ReservationForm from "@/components/reservation/ReservationForm";
import ReservationList, { EnrichedReservation } from "@/components/reservation/ReservationList"; // EnrichedReservation tipini al

export default function ReservationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]); // Ham rezervasyonlar
  const [allGuestsMap, setAllGuestsMap] = useState<Map<string, Guest>>(new Map()); // Misafirleri map olarak tut
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // filterChannel Reservation modelinde yok, eğer kullanılacaksa modele eklenmeli. Şimdilik kaldırıyorum.
  // const [filterChannel, setFilterChannel] = useState<string | null>(null);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string | null>(null);
  const [dateRangeStart, setDateRangeStart] = useState<string>("");
  const [dateRangeEnd, setDateRangeEnd] = useState<string>("");
  
  const router = useRouter();

  useEffect(() => {
    // TODO: Replace with proper AuthContext check and RoleGate/protected route
    // Oturum kontrolü (AuthContext ile değiştirilecek)
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
      return;
    }
    loadInitialData();
  }, [router]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [reservationsData, guestsData] = await Promise.all([
        getAllReservations(),
        listGuests()
      ]);

      setReservations(reservationsData);

      const guestMap = new Map<string, Guest>();
      guestsData.forEach(guest => guestMap.set(guest.id, guest));
      setAllGuestsMap(guestMap);

    } catch (error) {
      console.error("Veri yüklenirken hata:", error);
      toast.error("Rezervasyonlar veya misafirler yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (window.confirm("Bu rezervasyonu silmek istediğinize emin misiniz?")) {
      try {
        await deleteReservation(id);
        toast.success("Rezervasyon başarıyla silindi.");
        loadInitialData(); // Veriyi yeniden yükle
      } catch (error) {
        toast.error("Rezervasyon silinirken bir hata oluştu.");
        console.error("Error deleting reservation:", error);
      }
    }
  };

  // handleEditReservation direkt ReservationForm'a selectedReservation'ı set edecek şekilde Tabs içinde ele alınabilir
  // veya bir Tab state'i ile yönetilebilir. Şimdilik bu fonksiyonu ReservationList prop'u olarak bırakıyorum.
  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    // Yeni Rezervasyon sekmesine geçiş yapmak için bir yol gerekebilir.
    // Örneğin: document.querySelector('[data-radix-collection-item][value="new"]')?.click();
    // Ya da Tabs'ın value'sunu state ile yönetip onu değiştirebiliriz.
    // Şimdilik, kullanıcı manuel olarak sekmeyi değiştirecek varsayalım.
    const newTabTrigger = document.querySelector('[data-radix-collection-item][value="new"]') as HTMLButtonElement | null;
    if (newTabTrigger) {
        newTabTrigger.click(); // Programmatically click the "Yeni Rezervasyon" tab
    }
  };


  const handleReservationSaved = () => {
    setSelectedReservation(null);
    loadInitialData(); // Veriyi yeniden yükle
     const listTabTrigger = document.querySelector('[data-radix-collection-item][value="list"]') as HTMLButtonElement | null;
    if (listTabTrigger) {
        listTabTrigger.click();
    }
  };

  const enrichedReservations: EnrichedReservation[] = reservations.map(res => {
    const guest = allGuestsMap.get(res.guestId);
    return {
      ...res,
      guestName: guest ? `${guest.firstName} ${guest.lastName}` : "Bilinmeyen Misafir",
      guestEmail: guest?.email || "",
      guestPhone: guest?.phone || "",
    };
  });

  // Rezervasyon kanalı filtresi kaldırıldı (modelde yok)

  // Filtreleme işlemi
  const filteredReservations = enrichedReservations.filter(res => {
    // Arama terimi kontrolü
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = searchTerm === "" || 
      res.guestName.toLowerCase().includes(searchLower) ||
      (res.guestEmail && res.guestEmail.toLowerCase().includes(searchLower)) ||
      (res.guestPhone && res.guestPhone.includes(searchLower));
    
    // Ödeme durumu kontrolü
    const paymentMatch = !filterPaymentStatus || res.paymentStatus === filterPaymentStatus;
    
    // Tarih aralığı kontrolü
    const dateMatch = (!dateRangeStart || !dateRangeEnd) || 
      (res.checkInDate >= dateRangeStart && res.checkOutDate <= dateRangeEnd);
    
    // Tüm filtrelerin birleşimi
    return searchMatch && paymentMatch && dateMatch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Rezervasyonlar</h1>
        <Button onClick={() => router.push("/admin/dashboard")} variant="outline" className="w-full sm:w-auto">
          Dashboard'a Dön
        </Button>
      </div>

      <Tabs defaultValue="list">
        <TabsList className="grid w-full grid-cols-2 text-xs sm:text-sm">
          <TabsTrigger value="list">Rezervasyon Listesi</TabsTrigger>
          <TabsTrigger value="new">Yeni Rezervasyon</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Rezervasyon Listesi</CardTitle>
              <CardDescription>Tüm rezervasyonları görüntüleyin ve yönetin.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-2 sm:gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search" className="text-sm">Ara</Label>
                    <Input
                      id="search"
                      placeholder="İsim veya telefon numarası..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="w-full md:w-auto">
                    <Label htmlFor="paymentStatus" className="text-sm">Ödeme Durumu</Label>
                    <select
                      id="paymentStatus"
                      className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={filterPaymentStatus || ""}
                      onChange={(e) => setFilterPaymentStatus(e.target.value || null)}
                    >
                      <option value="">Tümü</option>
                      <option value="paid">Ödendi</option>
                      <option value="partial">Kısmi Ödeme</option>
                      <option value="unpaid">Ödenmedi</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-2 sm:gap-4">
                  <div className="w-full md:w-auto">
                    <Label htmlFor="dateStart" className="text-sm">Başlangıç Tarihi</Label>
                    <Input
                      id="dateStart"
                      type="date"
                      value={dateRangeStart}
                      onChange={(e) => setDateRangeStart(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="w-full md:w-auto">
                    <Label htmlFor="dateEnd" className="text-sm">Bitiş Tarihi</Label>
                    <Input
                      id="dateEnd"
                      type="date"
                      value={dateRangeEnd}
                      onChange={(e) => setDateRangeEnd(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        // setFilterChannel(null); // Kaldırıldı
                        setFilterPaymentStatus(null);
                        setDateRangeStart("");
                        setDateRangeEnd("");
                      }}
                      className="h-9 sm:h-10 text-xs sm:text-sm"
                    >
                      Filtreleri Temizle
                    </Button>
                  </div>
                </div>
                
                <ReservationList 
                  reservations={filteredReservations} // Enriched reservations
                  onDelete={handleDeleteReservation}
                  onEdit={handleEditReservation} // This sets selectedReservation and switches tab
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedReservation ? "Rezervasyonu Düzenle" : "Yeni Rezervasyon Oluştur"}
              </CardTitle>
              <CardDescription>
                {selectedReservation 
                  ? `"${selectedReservation.id}" ID'li rezervasyonu güncelleyin.`
                  : "Yeni bir rezervasyon için aşağıdaki formu doldurun."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReservationForm 
                reservation={selectedReservation} // Ham selectedReservation (Reservation | null)
                onSave={handleReservationSaved} 
                onCancel={() => {
                  setSelectedReservation(null);
                  // İsteğe bağlı olarak listeleme sekmesine geri dönülebilir:
                  const listTabTrigger = document.querySelector('[data-radix-collection-item][value="list"]') as HTMLButtonElement | null;
                  if (listTabTrigger) listTabTrigger.click();
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
