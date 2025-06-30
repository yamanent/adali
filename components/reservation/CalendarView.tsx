import { useState, useEffect } from "react";
import { Reservation } from "@/lib/models";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CalendarViewProps {
  reservations: Reservation[];
  rooms: { id: string; number: string; type: string }[];
  currentDate: Date;
  viewMode: "day" | "week" | "month";
  onReservationClick: (id: string) => void;
}

export default function CalendarView({
  reservations,
  rooms,
  currentDate,
  viewMode,
  onReservationClick,
}: CalendarViewProps) {
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Görünüm moduna göre takvim günlerini hesapla
  useEffect(() => {
    const days: Date[] = [];
    const startDate = new Date(currentDate);

    if (viewMode === "day") {
      days.push(new Date(startDate));
    } else if (viewMode === "week") {
      // Haftanın başlangıç gününü (Pazartesi) bul
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Pazar günü için ayarlama
      startDate.setDate(diff);

      // Haftanın 7 gününü ekle
      for (let i = 0; i < 7; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i);
        days.push(newDate);
      }
    } else if (viewMode === "month") {
      // Ayın ilk gününü bul
      startDate.setDate(1);

      // Ayın son gününü bul
      const lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();

      // Ayın tüm günlerini ekle
      for (let i = 0; i < lastDay; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i);
        days.push(newDate);
      }
    }

    setCalendarDays(days);
  }, [currentDate, viewMode]);

  // Tarih aralığında rezervasyon var mı kontrol et
  const getReservationsForDateRange = (roomNumber: string, date: Date) => {
    try {
      const dateStr = date.toISOString().split("T")[0];

      return reservations.filter((res) => {
        try {
          const checkIn = new Date(res.checkInDate);
          const checkOut = new Date(res.checkOutDate);
          
          // Geçersiz tarih kontrolü
          if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            console.warn("Geçersiz tarih değeri:", { checkInDate: res.checkInDate, checkOutDate: res.checkOutDate, reservation: res });
            return false;
          }
          
          const checkInDate = checkIn.toISOString().split("T")[0];
          const checkOutDate = checkOut.toISOString().split("T")[0];

          return (
            res.roomNumber === roomNumber &&
            dateStr >= checkInDate &&
            dateStr < checkOutDate
          );
        } catch (error) {
          console.error("Rezervasyon tarih kontrolü sırasında hata:", error, { reservation: res });
          return false;
        }
      });
    } catch (error) {
      console.error("Tarih işlemi sırasında hata:", error);
      return [];
    }
  };

  // Rezervasyon kanalına göre renk belirle
  const getReservationColor = (channel: string) => {
    switch (channel) {
      case "Booking.com":
        return "bg-blue-500";
      case "Airbnb":
        return "bg-red-500";
      case "Website":
        return "bg-purple-500";
      case "Telefon":
        return "bg-green-500";
      case "WhatsApp":
        return "bg-emerald-500";
      case "Sosyal Medya":
        return "bg-pink-500";
      case "Walk-in":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  // Bugün mü kontrol et
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] relative">
        {/* Takvim Başlık */}
        <div className="grid grid-cols-[150px_1fr] border-b sticky top-0 bg-white z-10">
          <div className="p-2 font-medium border-r sticky left-0 bg-white z-20">Oda</div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${calendarDays.length}, minmax(100px, 1fr))` }}>
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`p-2 text-center font-medium border-r ${isToday(day) ? "bg-blue-50" : ""}`}
              >
                <div>{day.toLocaleDateString("tr-TR", { weekday: "short" })}</div>
                <div>{day.getDate()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Oda Satırları */}
        {rooms.map((room) => (
          <div key={room.id} className="grid grid-cols-[150px_1fr] border-b">
            <div className="p-2 border-r sticky left-0 bg-white z-10">
              <div className="font-medium">{room.number}</div>
              <div className="text-xs text-gray-500">{room.type}</div>
            </div>
            <div className="grid relative" style={{ gridTemplateColumns: `repeat(${calendarDays.length}, minmax(100px, 1fr))` }}>
              {calendarDays.map((day, dayIndex) => {
                const dayReservations = getReservationsForDateRange(room.number, day);
                return (
                  <div
                    key={dayIndex}
                    className={`border-r h-16 ${isToday(day) ? "bg-blue-50" : ""}`}
                  >
                    {dayReservations.map((reservation) => {
                      try {
                        // Rezervasyon başlangıç ve bitiş günlerini kontrol et
                        const checkIn = new Date(reservation.checkInDate);
                        const checkOut = new Date(reservation.checkOutDate);
                        
                        // Geçersiz tarih kontrolü
                        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
                          return null; // Geçersiz tarih ise gösterme
                        }
                        
                        const isCheckIn = checkIn.toISOString().split("T")[0] === day.toISOString().split("T")[0];
                        const isCheckOut = checkOut.toISOString().split("T")[0] === day.toISOString().split("T")[0];
                        
                        // Rezervasyon kaynağı için güvenli erişim
                        const channel = (reservation as any).reservationChannel || "OTHER";
                        
                        return (
                          <div
                            key={reservation.id}
                            className={`${getReservationColor(channel)} text-white p-1 text-xs cursor-pointer h-full overflow-hidden`}
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setIsModalOpen(true);
                            }}
                            title={`${reservation.guestName} - ${(reservation as any).phone || reservation.phoneNumber || 'Telefon yok'}`}
                          >
                            <div className="font-medium truncate">
                              {isCheckIn && "► "}{reservation.guestName}{isCheckOut && " ◄"}
                            </div>
                            <div className="truncate">{(reservation as any).guestCount || '1'} kişi</div>
                            <div className="truncate">{channel}</div>
                          </div>
                        );
                      } catch (error) {
                        console.error("Rezervasyon gösterimi sırasında hata:", error);
                        return null;
                      }
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Rezervasyon Detay Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          {selectedReservation && (
            <>
              <DialogHeader>
                <DialogTitle>Rezervasyon Detayları</DialogTitle>
                <DialogDescription>
                  {selectedReservation.checkInDate} - {selectedReservation.checkOutDate}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Misafir Bilgileri</h4>
                    <p><span className="font-medium">İsim:</span> {selectedReservation.guestName}</p>
                    <p><span className="font-medium">Telefon:</span> {selectedReservation.phoneNumber || "Belirtilmemiş"}</p>
                    <p><span className="font-medium">E-posta:</span> {selectedReservation.email || "Belirtilmemiş"}</p>
                    <p><span className="font-medium">Kişi Sayısı:</span> {selectedReservation.guestCount}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Rezervasyon Bilgileri</h4>
                    <p><span className="font-medium">Oda:</span> {selectedReservation.roomNumber} - {selectedReservation.roomType}</p>
                    <p><span className="font-medium">Kanal:</span> {selectedReservation.source}</p>
                    <p><span className="font-medium">Ödeme Durumu:</span> {selectedReservation.paymentStatus}</p>
                    <p><span className="font-medium">Toplam Ücret:</span> {selectedReservation.totalPrice} ₺</p>
                  </div>
                </div>
                
                {selectedReservation.notes && (
                  <div>
                    <h4 className="font-medium mb-1">Notlar</h4>
                    <p>{selectedReservation.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => onReservationClick(selectedReservation.id)}
                  >
                    Düzenle
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
