"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Reservation } from "@/lib/models";
import { getAllReservations } from "@/lib/reservationService";
import { getAllRooms } from "@/lib/roomService";
import CalendarView from "@/components/reservation/CalendarView";

export default function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<{id: string, number: string, type: string}[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  
  const router = useRouter();

  useEffect(() => {
    // Oturum kontrolü
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
      return;
    }

    loadData();
  }, [router]);

  const loadData = () => {
    try {
      const allReservations = getAllReservations();
      const allRooms = getAllRooms();
      
      setReservations(allReservations);
      setRooms(allRooms.map(room => ({ id: room.id, number: room.number, type: room.type })));
      setIsLoading(false);
    } catch (error) {
      console.error("Veriler yüklenirken hata:", error);
      toast.error("Veriler yüklenirken bir hata oluştu.");
      setIsLoading(false);
    }
  };

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
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rezervasyon Takvimi</h1>
        <Button onClick={() => router.push("/admin/dashboard")} variant="outline">
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
                  className="rounded-none"
                  onClick={() => setViewMode('day')}
                >
                  Gün
                </Button>
                <Button 
                  variant={viewMode === 'week' ? "default" : "ghost"}
                  className="rounded-none"
                  onClick={() => setViewMode('week')}
                >
                  Hafta
                </Button>
                <Button 
                  variant={viewMode === 'month' ? "default" : "ghost"}
                  className="rounded-none"
                  onClick={() => setViewMode('month')}
                >
                  Ay
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handlePrevious}>
                &lt; Önceki
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Bugün
              </Button>
              <Button variant="outline" size="sm" onClick={handleNext}>
                Sonraki &gt;
              </Button>
            </div>
            <div className="text-lg font-medium">
              {currentDate.toLocaleDateString('tr-TR', { 
                month: 'long', 
                year: 'numeric',
                ...(viewMode === 'day' && { day: 'numeric' })
              })}
            </div>
          </div>
          
          <div className="overflow-x-auto" style={{ position: 'relative' }}>
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
