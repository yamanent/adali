"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Reservation } from "@/lib/firebase-models";
import { getAllReservations } from "@/lib/reservation-service";
import { getAllRooms, initializeDefaultRooms } from "@/lib/room-service";
import CalendarView from "@/components/reservation/CalendarView";

export default function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<any[]>([]);
  const [rooms, setRooms] = useState<{id: string, number: string, type: string}[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
      return;
    }

    setIsLoading(true);

    // Odaları bir kez yükle
    const fetchRooms = async () => {
      try {
        // await initializeDefaultRooms(); // Bu script ile zaten yapıldı, tekrar gerek yok.
        const allRooms = await getAllRooms();
        setRooms(allRooms.map(room => ({ 
          id: room.id, 
          number: room.roomNumber, 
          type: room.type
        })));
      } catch (error) {
        console.error("Odalar yüklenirken hata:", error);
        toast.error("Odalar yüklenirken bir hata oluştu.");
      }
    };

    fetchRooms();

    // Rezervasyonları gerçek zamanlı dinle
    const unsubscribe = getAllReservations(
      (reservations: Reservation[]) => {
        setReservations(reservations);
        setIsLoading(false);
      },
      (error: Error) => {
        console.error("Rezervasyonları dinlerken hata:", error);
        toast.error("Rezervasyonlar güncellenirken bir hata oluştu.");
        setIsLoading(false);
      }
    );

    // Component unmount olduğunda dinleyiciyi kaldır
    return () => unsubscribe();
  }, [router]);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold">Rezervasyon Takvimi</h1>
        <Button onClick={() => router.push("/admin/dashboard")} variant="outline" className="w-full sm:w-auto">
          Dashboard'a Dön
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Takvim Görünümü</CardTitle>
              <CardDescription>Oda bazlı rezervasyon takvimi</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex border rounded-md overflow-hidden">
                <Button 
                  variant={viewMode === 'day' ? "default" : "ghost"}
                  className="rounded-none text-xs sm:text-sm py-1 h-auto"
                  onClick={() => setViewMode('day')}
                >
                  Gün
                </Button>
                <Button 
                  variant={viewMode === 'week' ? "default" : "ghost"}
                  className="rounded-none text-xs sm:text-sm py-1 h-auto"
                  onClick={() => setViewMode('week')}
                >
                  Hafta
                </Button>
                <Button 
                  variant={viewMode === 'month' ? "default" : "ghost"}
                  className="rounded-none text-xs sm:text-sm py-1 h-auto"
                  onClick={() => setViewMode('month')}
                >
                  Ay
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={handlePrevious} className="text-xs sm:text-sm py-1 h-auto">
                &lt; Önceki
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday} className="text-xs sm:text-sm py-1 h-auto">
                Bugün
              </Button>
              <Button variant="outline" size="sm" onClick={handleNext} className="text-xs sm:text-sm py-1 h-auto">
                Sonraki &gt;
              </Button>
            </div>
            <div className="text-base sm:text-lg font-medium">
              {currentDate.toLocaleDateString('tr-TR', { 
                month: 'long', 
                year: 'numeric',
                ...(viewMode === 'day' && { day: 'numeric' })
              })}
            </div>
          </div>
          
          <div className="overflow-x-auto -mx-4 sm:mx-0" style={{ position: 'relative' }}>
            <div className="sticky left-0 z-10" style={{ width: '100%', overflowX: 'auto' }}>
              <CalendarView 
                reservations={reservations}
                rooms={rooms}
                currentDate={currentDate}
                viewMode={viewMode}
                onReservationClick={(id) => router.push(`/admin/rezervasyonlar?id=${id}`)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
