"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Reservation } from "@/lib/models";
import { getAllReservations } from "@/lib/reservationService";

interface Guest {
  name: string;
  phone: string;
  email: string;
  totalStays: number;
  lastStay: string;
  totalSpent: number;
}

export default function GuestsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    // Oturum kontrolü
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
      return;
    }

    loadGuests();
  }, [router]);

  const loadGuests = () => {
    try {
      // Tüm rezervasyonları al
      const allReservations = getAllReservations();
      
      // Misafir verilerini oluştur
      const guestMap = new Map<string, Guest>();
      
      allReservations.forEach(res => {
        const key = `${res.guestName}-${res.phone}`;
        
        if (guestMap.has(key)) {
          // Mevcut misafiri güncelle
          const guest = guestMap.get(key)!;
          guest.totalStays += 1;
          guest.totalSpent += res.totalPrice;
          
          // Son konaklama tarihini kontrol et
          const lastStayDate = new Date(guest.lastStay);
          const currentStayDate = new Date(res.checkInDate);
          if (currentStayDate > lastStayDate) {
            guest.lastStay = res.checkInDate;
          }
        } else {
          // Yeni misafir oluştur
          guestMap.set(key, {
            name: res.guestName,
            phone: res.phone,
            email: res.email || "",
            totalStays: 1,
            lastStay: res.checkInDate,
            totalSpent: res.totalPrice
          });
        }
      });
      
      // Map'ten diziye dönüştür
      setGuests(Array.from(guestMap.values()));
      setIsLoading(false);
    } catch (error) {
      console.error("Misafirler yüklenirken hata:", error);
      toast.error("Misafirler yüklenirken bir hata oluştu.");
      setIsLoading(false);
    }
  };

  // Arama filtrelemesi
  const filteredGuests = guests.filter(guest => {
    const searchLower = searchTerm.toLowerCase();
    return (
      guest.name.toLowerCase().includes(searchLower) ||
      guest.phone.includes(searchTerm) ||
      guest.email.toLowerCase().includes(searchLower)
    );
  });

  // Tarih formatla
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(date);
    } catch (error) {
      return dateString;
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
        <h1 className="text-3xl font-bold">Misafirler</h1>
        <Button onClick={() => router.push("/admin/dashboard")} variant="outline">
          Dashboard'a Dön
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Misafir Listesi</CardTitle>
          <CardDescription>Tüm misafirleri görüntüleyin ve yönetin.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="search">Ara</Label>
            <Input
              id="search"
              placeholder="İsim, telefon veya e-posta ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {filteredGuests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Misafir Adı</TableHead>
                    <TableHead>İletişim</TableHead>
                    <TableHead>Toplam Konaklama</TableHead>
                    <TableHead>Son Konaklama</TableHead>
                    <TableHead>Toplam Harcama</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGuests.map((guest, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{guest.name}</TableCell>
                      <TableCell>
                        <div>{guest.phone}</div>
                        {guest.email && <div className="text-xs text-gray-500">{guest.email}</div>}
                      </TableCell>
                      <TableCell>{guest.totalStays}</TableCell>
                      <TableCell>{formatDate(guest.lastStay)}</TableCell>
                      <TableCell>{guest.totalSpent.toLocaleString('tr-TR')} ₺</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/rezervasyonlar?guest=${encodeURIComponent(guest.name)}&phone=${encodeURIComponent(guest.phone)}`)}
                        >
                          Rezervasyonları Gör
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Aranan kriterlere uygun misafir bulunamadı.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
