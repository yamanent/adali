"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
// import { logAdminAccess } from "@/lib/telegram";
import { format, addDays, parseISO, isSameDay, isWithinInterval, startOfDay, subDays } from "date-fns";
import { tr } from "date-fns/locale";
import { ROOMS, generateReservationsForAllRooms } from "@/lib/mockData";
import { Reservation, ReservationStatus, PaymentStatus, BookingSource } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Rezervasyon durumu renklerini tanımla
const statusColors = {
  [ReservationStatus.CONFIRMED]: "bg-blue-100 border-blue-300 text-blue-800",
  [ReservationStatus.PENDING]: "bg-yellow-100 border-yellow-300 text-yellow-800",
  [ReservationStatus.CHECKED_IN]: "bg-green-100 border-green-300 text-green-800",
  [ReservationStatus.CHECKED_OUT]: "bg-gray-100 border-gray-300 text-gray-800",
  [ReservationStatus.CANCELLED]: "bg-red-100 border-red-300 text-red-800",
};

// Ödeme durumu renklerini tanımla
const paymentColors = {
  [PaymentStatus.PAID]: "bg-green-100 border-green-300 text-green-800",
  [PaymentStatus.PARTIAL]: "bg-yellow-100 border-yellow-300 text-yellow-800",
  [PaymentStatus.UNPAID]: "bg-red-100 border-red-300 text-red-800",
};

// Rezervasyon kaynağı simgeleri
const sourceIcons = {
  [BookingSource.DIRECT]: "🏠",
  [BookingSource.BOOKING]: "🔵",
  [BookingSource.AIRBNB]: "🏡",
  [BookingSource.PHONE]: "📞",
  [BookingSource.EMAIL]: "📧",
  [BookingSource.WALK_IN]: "👣",
};

// Rezervasyon durumu Türkçe çevirileri
const statusTranslations = {
  [ReservationStatus.CONFIRMED]: "Onaylandı",
  [ReservationStatus.PENDING]: "Beklemede",
  [ReservationStatus.CHECKED_IN]: "Giriş Yapıldı",
  [ReservationStatus.CHECKED_OUT]: "Çıkış Yapıldı",
  [ReservationStatus.CANCELLED]: "İptal Edildi",
};

// Ödeme durumu Türkçe çevirileri
const paymentTranslations = {
  [PaymentStatus.PAID]: "Ödendi",
  [PaymentStatus.PARTIAL]: "Kısmi Ödeme",
  [PaymentStatus.UNPAID]: "Ödenmedi",
};

// Rezervasyon kaynağı Türkçe çevirileri
const sourceTranslations = {
  [BookingSource.DIRECT]: "Doğrudan",
  [BookingSource.BOOKING]: "Booking.com",
  [BookingSource.AIRBNB]: "Airbnb",
  [BookingSource.PHONE]: "Telefon",
  [BookingSource.EMAIL]: "E-posta",
  [BookingSource.WALK_IN]: "Yüz Yüze",
};

// Rezervasyon detaylarını gösteren bileşen
function ReservationDetails({ reservation }: { reservation: Reservation }) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{reservation.guestName}</h3>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[reservation.status]}>
            {statusTranslations[reservation.status]}
          </Badge>
          <Badge className={paymentColors[reservation.paymentStatus]}>
            {paymentTranslations[reservation.paymentStatus]}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500">Giriş Tarihi</p>
          <p>{format(new Date(reservation.startDate), "d MMMM yyyy", { locale: tr })}</p>
        </div>
        <div>
          <p className="text-gray-500">Çıkış Tarihi</p>
          <p>{format(new Date(reservation.endDate), "d MMMM yyyy", { locale: tr })}</p>
        </div>
        <div>
          <p className="text-gray-500">Kişi Sayısı</p>
          <p>{reservation.guestCount} kişi</p>
        </div>
        <div>
          <p className="text-gray-500">Kaynak</p>
          <p className="flex items-center gap-1">
            <span>{sourceIcons[reservation.source]}</span>
            <span>{sourceTranslations[reservation.source]}</span>
          </p>
        </div>
        <div>
          <p className="text-gray-500">Telefon</p>
          <p>{reservation.phoneNumber}</p>
        </div>
        <div>
          <p className="text-gray-500">E-posta</p>
          <p className="truncate">{reservation.email}</p>
        </div>
      </div>
      
      {reservation.notes && (
        <div className="mt-2">
          <p className="text-gray-500">Notlar</p>
          <p className="text-sm bg-gray-50 p-2 rounded">{reservation.notes}</p>
        </div>
      )}
      
      <div className="text-xs text-gray-400 mt-2">
        Rezervasyon ID: {reservation.id} | Oluşturulma: {format(new Date(reservation.createdAt), "d MMM yyyy", { locale: tr })}
      </div>
    </div>
  );
}

export default function ReservationCalendarPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  // Başlangıç tarihini ayarlama - varsayılan olarak içinde bulunulan ayın 1'i
  const [startDate, setStartDate] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1); // Ayın 1'i
  });
  const [daysToShow, setDaysToShow] = useState(30);
  const [reservationData, setReservationData] = useState<Reservation[][]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const printFrameRef = useRef<Window | null>(null);

  // Admin erişimini kaydetme devre dışı bırakıldı
  // useEffect(() => {
  //   const logAccess = async () => {
  //     try {
  //       await logAdminAccess("admin", "Takvim sayfası", "local");
  //     } catch (error) {
  //       console.error("Log kaydı oluşturulamadı:", error);
  //     }
  //   };
  //   logAccess();
  // }, []);

  // Rezervasyon verilerini yükle
  useEffect(() => {
    setIsLoading(true);
    // Mock veri oluştur
    const data = generateReservationsForAllRooms(startDate, daysToShow);
    setReservationData(data);
    setIsLoading(false);
  }, [startDate, daysToShow]);

  // Tarih değiştirme işleyicisi
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : new Date();
    setStartDate(newDate);
  };
  
  // Haftayı değiştirme işleyicileri
  const handlePreviousWeek = () => {
    setStartDate(prevDate => subDays(prevDate, 7));
  };
  
  const handleNextWeek = () => {
    setStartDate(prevDate => addDays(prevDate, 7));
  };
  
  const handlePreviousDay = () => {
    setStartDate(prevDate => subDays(prevDate, 1));
  };
  
  const handleNextDay = () => {
    setStartDate(prevDate => addDays(prevDate, 1));
  };

  // Gün sayısı değiştirme işleyicisi
  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(e.target.value);
    if (!isNaN(days) && days > 0 && days <= 60) {
      setDaysToShow(days);
    }
  };

  // Rezervasyon seçme işleyicisi
  const handleReservationClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDialogOpen(true);
  };

  // Yazdırma işleyicisi
  const handlePrint = () => {
    // Yazdırma öncesi başlık ekle
    const printTitle = document.createElement('div');
    printTitle.className = 'print-title';
    printTitle.innerHTML = `
      <h1>Adalı Pansiyon - Rezervasyon Takvimi</h1>
      <p>${format(startDate, "d MMMM yyyy", { locale: tr })} - ${format(addDays(startDate, daysToShow - 1), "d MMMM yyyy", { locale: tr })}</p>
    `;
    
    // Başlığı geçici olarak ekle
    const container = document.querySelector('.calendar-container');
    container?.parentNode?.insertBefore(printTitle, container);
    
    // Yazdır
    window.print();
    
    // Yazdırma sonrası başlığı kaldır
    setTimeout(() => {
      printTitle.remove();
    }, 100);
  };

  // Takvimi indirme işleyicisi
  const handleDownload = () => {
    // Yeni pencere aç
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Lütfen popup engelleyiciyi kapatın ve tekrar deneyin.');
      return;
    }
    
    printFrameRef.current = printWindow;
    
    // HTML içeriği oluştur
    const tableHTML = document.getElementById('reservation-table')?.outerHTML || '';
    const printCSS = `
      @page {
        size: A4 landscape;
        margin: 1cm;
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .print-header {
        text-align: center;
        margin-bottom: 20px;
      }
      .print-header h1 {
        font-size: 24px;
        margin: 0;
      }
      .print-header h2 {
        font-size: 20px;
        margin: 5px 0;
        color: #333;
      }
      .print-header p {
        font-size: 14px;
        color: #666;
        margin: 5px 0;
      }
      .print-title {
        text-align: center;
        margin-bottom: 20px;
        display: none;
      }
      .print-title h1 {
        font-size: 24px;
        margin: 0;
      }
      .print-title p {
        font-size: 14px;
        color: #666;
        margin: 5px 0;
      }
      @media print {
        .print-title {
          display: block;
        }
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th {
        background-color: #f3f4f6;
        padding: 8px;
        text-align: center;
        font-size: 12px;
        border: 1px solid #e5e7eb;
      }
      td {
        border: 1px solid #e5e7eb;
        padding: 4px;
        font-size: 11px;
        vertical-align: top;
        height: 40px;
      }
      .reservation-cell {
        padding: 2px 4px;
        border-radius: 4px;
        margin: 2px 0;
        font-size: 10px;
      }
      .confirmed { background-color: #dbeafe; border: 1px solid #bfdbfe; }
      .pending { background-color: #fef3c7; border: 1px solid #fde68a; }
      .checked-in { background-color: #d1fae5; border: 1px solid #a7f3d0; }
      .checked-out { background-color: #f3f4f6; border: 1px solid #e5e7eb; }
      .cancelled { background-color: #fee2e2; border: 1px solid #fecaca; }
      .date-header {
        writing-mode: vertical-lr;
        transform: rotate(180deg);
        white-space: nowrap;
        text-align: center;
        padding: 8px 0;
        font-size: 10px;
      }
      .room-name {
        font-weight: bold;
        font-size: 12px;
      }
      .print-button {
        display: block;
        margin: 20px auto;
        padding: 10px 20px;
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
      }
      .print-button:hover {
        background-color: #1d4ed8;
      }
      @media print {
        .print-button {
          display: none;
        }
      }
    `;
    
    // Başlık ve tarih bilgisi ekle
    const startDateStr = format(startDate, "d MMMM yyyy", { locale: tr });
    const endDateStr = format(addDays(startDate, daysToShow - 1), "d MMMM yyyy", { locale: tr });
    const monthYearStr = format(startDate, "MMMM yyyy", { locale: tr });
    
    // HTML içeriği oluştur
    const html = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rezervasyon Takvimi - ${monthYearStr}</title>
        <style>${printCSS}</style>
      </head>
      <body>
        <div class="print-header">
          <h1>Adalı Pansiyon - Rezervasyon Takvimi</h1>
          <h2>${monthYearStr}</h2>
          <p>${startDateStr} - ${endDateStr} tarihleri arası rezervasyonlar</p>
        </div>
        ${tableHTML}
        <button class="print-button" onclick="window.print()">Yazdır</button>
      </body>
      </html>
    `;
    
    // HTML içeriğini yeni pencereye yaz
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Bugüne git butonu işleyicisi
  const handleGoToToday = () => {
    const today = new Date();
    setStartDate(new Date(today.getFullYear(), today.getMonth(), 1)); // Ayın 1'i
  };
  
  // Ayın 1'ine git butonu işleyicisi
  const handleGoToFirstOfMonth = () => {
    const currentMonth = new Date(startDate);
    setStartDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1));
  };

  // Tarih başlıklarını oluştur
  const dateHeaders = Array.from({ length: daysToShow }, (_, i) => {
    const date = addDays(startDate, i);
    return (
      <th key={i} className="p-1 text-center border">
        <div className="date-header">
          <div>{format(date, "EEE", { locale: tr })}</div>
          <div className="font-bold">{format(date, "d", { locale: tr })}</div>
          <div>{format(date, "MMM", { locale: tr })}</div>
        </div>
      </th>
    );
  });

  // Tarih aralığını oluştur
  const dateRange = Array.from({ length: daysToShow }, (_, i) => addDays(startDate, i));

  // Odaları al
  const rooms = ROOMS;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Rezervasyon Takvimi</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleGoToToday}>
                Bugün
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                Yazdır
              </Button>
              <Button variant="default" size="sm" onClick={handleDownload}>
                İndir
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="start-date">Başlangıç Tarihi</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="start-date"
                  type="date"
                  value={format(startDate, "yyyy-MM-dd")}
                  onChange={handleDateChange}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={handleGoToToday} title="Bugüne Git">
                  <span className="text-xs">Bugün</span>
                </Button>
              </div>
              
              {/* Tarih navigasyon butonları */}
              <div className="flex items-center justify-between border rounded p-2 bg-gray-50">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={handlePreviousWeek} title="Önceki Hafta" className="h-8 w-8">
                    <span className="text-xs">«</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handlePreviousDay} title="Önceki Gün" className="h-8 w-8">
                    <span className="text-xs">‹</span>
                  </Button>
                </div>
                
                <div className="text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={handleGoToFirstOfMonth} className="text-xs py-0 h-6">
                      {format(startDate, "MMMM yyyy", { locale: tr })}
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(startDate, "d MMMM", { locale: tr })} - {format(addDays(startDate, daysToShow - 1), "d MMMM yyyy", { locale: tr })}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={handleNextDay} title="Sonraki Gün" className="h-8 w-8">
                    <span className="text-xs">›</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleNextWeek} title="Sonraki Hafta" className="h-8 w-8">
                    <span className="text-xs">»</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="days-to-show">Gösterilecek Gün Sayısı</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="days-to-show"
                  type="number"
                  min="1"
                  max="60"
                  value={daysToShow}
                  onChange={handleDaysChange}
                  className="w-24"
                />
                <div className="flex flex-wrap gap-1">
                  {[7, 14, 21, 30].map((days) => (
                    <Button 
                      key={days} 
                      variant={daysToShow === days ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setDaysToShow(days)}
                      className="px-2 py-1 h-8"
                    >
                      {days} gün
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Takvim tablosu */}
          <div className="overflow-x-auto calendar-container">
            <table id="reservation-table" className="w-full border-collapse calendar-grid">
              <thead>
                <tr>
                  <th className="border p-1 bg-gray-100 text-left">Oda</th>
                  {dateRange.map((date) => (
                    <th key={date.toISOString()} className="border p-1 bg-gray-100 text-center date-cell" style={{ minWidth: "32px" }}>
                      <div className="flex flex-col items-center justify-center date-header">
                        <span>{format(date, "d", { locale: tr })}</span>
                        <span className="text-xs">{format(date, "EEE", { locale: tr })}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, roomIndex) => (
                  <tr key={room.id}>
                    <td className="border p-1 bg-gray-100 text-left room-name">{room.name}</td>
                    {dateRange.map((date, dayIndex) => {
                      // Bu oda ve gün için rezervasyonları bul
                      const reservationsForDay = reservationData[roomIndex]?.filter(reservation => 
                        isWithinInterval(date, {
                          start: startOfDay(new Date(reservation.startDate)),
                          end: startOfDay(new Date(reservation.endDate))
                        })
                      ) || [];
                      
                      return (
                        <td key={dayIndex} className="border p-1 align-top min-w-[40px]">
                          {reservationsForDay.map(reservation => {
                            let statusClass = "";
                            switch (reservation.status) {
                              case ReservationStatus.CONFIRMED:
                                statusClass = "confirmed";
                                break;
                              case ReservationStatus.PENDING:
                                statusClass = "pending";
                                break;
                              case ReservationStatus.CHECKED_IN:
                                statusClass = "checked-in";
                                break;
                              case ReservationStatus.CHECKED_OUT:
                                statusClass = "checked-out";
                                break;
                              case ReservationStatus.CANCELLED:
                                statusClass = "cancelled";
                                break;
                            }
                            
                            return (
                              <div key={reservation.id} className="mb-2 last:mb-0">
                                {/* Kaynak bilgisi - isimden bağımsız ayrı bir satır */}
                                <div className="inline-flex items-center text-[9px] bg-gray-100 rounded-t px-1 py-0.5 border-b border-gray-200">
                                  <span className="mr-1">{sourceIcons[reservation.source]}</span>
                                  <span>{sourceTranslations[reservation.source]}</span>
                                </div>
                                
                                {/* Rezervasyon bilgisi */}
                                <div
                                  className={`reservation-cell ${statusClass} cursor-pointer text-xs rounded-t-none`}
                                  onClick={() => handleReservationClick(reservation)}
                                >
                                  <div className="font-semibold truncate">{reservation.guestName}</div>
                                </div>
                              </div>
                            );
                          })}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rezervasyon Detayları</DialogTitle>
          </DialogHeader> 
          {selectedReservation && <ReservationDetails reservation={selectedReservation} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
