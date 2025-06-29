"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reservation } from "@/lib/models";
import { getAllReservations, deleteReservation } from "@/lib/reservationService";
import ReservationForm from "@/components/reservation/ReservationForm";
import ReservationList from "@/components/reservation/ReservationList";

export default function ReservationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterChannel, setFilterChannel] = useState<string | null>(null);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string | null>(null);
  const [dateRangeStart, setDateRangeStart] = useState<string>("");
  const [dateRangeEnd, setDateRangeEnd] = useState<string>("");
  
  const router = useRouter();

  useEffect(() => {
    // Oturum kontrolü
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
      return;
    }

    loadReservations();
  }, [router]);

  const loadReservations = () => {
    try {
      const allReservations = getAllReservations();
      setReservations(allReservations);
      setIsLoading(false);
    } catch (error) {
      console.error("Rezervasyonlar yüklenirken hata:", error);
      toast.error("Rezervasyonlar yüklenirken bir hata oluştu.");
      setIsLoading(false);
    }
  };

  const handleDeleteReservation = (id: string) => {
    if (window.confirm("Bu rezervasyonu silmek istediğinize emin misiniz?")) {
      const success = deleteReservation(id);
      if (success) {
        toast.success("Rezervasyon başarıyla silindi.");
        loadReservations();
      } else {
        toast.error("Rezervasyon silinirken bir hata oluştu.");
      }
    }
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
  };

  const handleReservationSaved = () => {
    setSelectedReservation(null);
    loadReservations();
  };

  const filteredReservations = reservations.filter(res => {
    // İsim veya telefon numarasına göre arama
    const searchMatch = searchTerm === "" || 
      res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.phone.includes(searchTerm);
    
    // Rezervasyon kanalına göre filtreleme
    const channelMatch = !filterChannel || res.reservationChannel === filterChannel;
    
    // Ödeme durumuna göre filtreleme
    const paymentMatch = !filterPaymentStatus || res.paymentStatus === filterPaymentStatus;
    
    // Tarih aralığına göre filtreleme
    const dateMatch = (!dateRangeStart || !dateRangeEnd) || 
      (res.checkInDate >= dateRangeStart && res.checkOutDate <= dateRangeEnd);
    
    return searchMatch && channelMatch && paymentMatch && dateMatch;
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
                    <Label htmlFor="channel" className="text-sm">Rezervasyon Kanalı</Label>
                    <select
                      id="channel"
                      className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={filterChannel || ""}
                      onChange={(e) => setFilterChannel(e.target.value || null)}
                    >
                      <option value="">Tümü</option>
                      <option value="Booking.com">Booking.com</option>
                      <option value="Airbnb">Airbnb</option>
                      <option value="Website">Website</option>
                      <option value="Telefon">Telefon</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Sosyal Medya">Sosyal Medya</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="paymentStatus">Ödeme Durumu</Label>
                    <select
                      id="paymentStatus"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={filterPaymentStatus || ""}
                      onChange={(e) => setFilterPaymentStatus(e.target.value || null)}
                    >
                      <option value="">Tümü</option>
                      <option value="Ödendi">Ödendi</option>
                      <option value="Kısmi">Kısmi</option>
                      <option value="Bekliyor">Bekliyor</option>
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
                        setFilterChannel(null);
                        setFilterPaymentStatus(null);
                        setDateRangeStart("");
                        setDateRangeEnd("");
                      }}
                    >
                      Filtreleri Temizle
                    </Button>
                  </div>
                </div>
                
                <ReservationList 
                  reservations={filteredReservations} 
                  onDelete={handleDeleteReservation}
                  onEdit={handleEditReservation}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedReservation ? "Rezervasyon Düzenle" : "Yeni Rezervasyon"}
              </CardTitle>
              <CardDescription>
                {selectedReservation 
                  ? "Mevcut rezervasyonu güncelleyin." 
                  : "Yeni bir rezervasyon oluşturun."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReservationForm 
                reservation={selectedReservation} 
                onSave={handleReservationSaved} 
                onCancel={() => setSelectedReservation(null)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
