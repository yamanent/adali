import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Reservation } from "@/lib/models";
import { addReservation, updateReservation } from "@/lib/reservationService";
import { getAllRooms } from "@/lib/roomService";

interface ReservationFormProps {
  reservation: Reservation | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function ReservationForm({ reservation, onSave, onCancel }: ReservationFormProps) {
  const [rooms, setRooms] = useState<{id: string, number: string, type: string}[]>([]);
  
  const [formData, setFormData] = useState({
    guestName: "",
    phone: "",
    email: "",
    checkInDate: "",
    checkOutDate: "",
    roomNumber: "",
    roomType: "",
    guestCount: 1,
    totalPrice: 0,
    paymentStatus: "Bekliyor" as Reservation["paymentStatus"],
    reservationChannel: "Website" as Reservation["reservationChannel"],
    notes: ""
  });

  useEffect(() => {
    // Odaları yükle
    const allRooms = getAllRooms();
    setRooms(allRooms.map(room => ({ id: room.id, number: room.number, type: room.type })));
    
    // Eğer düzenleme modundaysa, form verilerini doldur
    if (reservation) {
      setFormData({
        guestName: reservation.guestName,
        phone: reservation.phone,
        email: reservation.email || "",
        checkInDate: reservation.checkInDate,
        checkOutDate: reservation.checkOutDate,
        roomNumber: reservation.roomNumber,
        roomType: reservation.roomType,
        guestCount: reservation.guestCount,
        totalPrice: reservation.totalPrice,
        paymentStatus: reservation.paymentStatus,
        reservationChannel: reservation.reservationChannel,
        notes: reservation.notes || ""
      });
    }
  }, [reservation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Sayısal değerler için dönüşüm yap
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Oda seçildiğinde oda tipini otomatik doldur
    if (name === "roomNumber") {
      const selectedRoom = rooms.find(room => room.number === value);
      if (selectedRoom) {
        setFormData(prev => ({
          ...prev,
          roomType: selectedRoom.type
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form doğrulama
    if (!formData.guestName || !formData.checkInDate || !formData.checkOutDate || !formData.roomNumber) {
      toast.error("Lütfen zorunlu alanları doldurun!");
      return;
    }
    
    try {
      if (reservation) {
        // Mevcut rezervasyonu güncelle
        updateReservation(reservation.id, formData);
        toast.success("Rezervasyon başarıyla güncellendi!");
      } else {
        // Yeni rezervasyon ekle
        addReservation(formData);
        toast.success("Yeni rezervasyon oluşturuldu!");
      }
      
      // Formu temizle ve kayıt işlemini bildir
      setFormData({
        guestName: "",
        phone: "",
        email: "",
        checkInDate: "",
        checkOutDate: "",
        roomNumber: "",
        roomType: "",
        guestCount: 1,
        totalPrice: 0,
        paymentStatus: "Bekliyor",
        reservationChannel: "Website",
        notes: ""
      });
      
      onSave();
    } catch (error) {
      console.error("Rezervasyon kaydedilirken hata:", error);
      toast.error("Rezervasyon kaydedilirken bir hata oluştu!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Misafir Bilgileri */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Misafir Bilgileri</h3>
          
          <div>
            <Label htmlFor="guestName">Misafir Adı *</Label>
            <Input
              id="guestName"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefon Numarası (opsiyonel)</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="email">E-posta (opsiyonel)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="guestCount">Kişi Sayısı *</Label>
            <Input
              id="guestCount"
              name="guestCount"
              type="number"
              min="1"
              value={formData.guestCount}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        {/* Rezervasyon Detayları */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Rezervasyon Detayları</h3>
          
          <div>
            <Label htmlFor="checkInDate">Giriş Tarihi *</Label>
            <Input
              id="checkInDate"
              name="checkInDate"
              type="date"
              value={formData.checkInDate}
              onChange={handleChange}
              required
              className="cursor-pointer"
              onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
            />
          </div>
          
          <div>
            <Label htmlFor="checkOutDate">Çıkış Tarihi *</Label>
            <Input
              id="checkOutDate"
              name="checkOutDate"
              type="date"
              value={formData.checkOutDate}
              onChange={handleChange}
              required
              className="cursor-pointer"
              onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
            />
          </div>
          
          <div>
            <Label htmlFor="roomNumber">Oda No *</Label>
            <select
              id="roomNumber"
              name="roomNumber"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.roomNumber}
              onChange={handleChange}
              required
            >
              <option value="">Oda Seçin</option>
              {rooms.map(room => (
                <option key={room.id} value={room.number}>
                  {room.number} - {room.type}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="roomType">Oda Tipi</Label>
            <Input
              id="roomType"
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              readOnly
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ödeme Bilgileri */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Ödeme Bilgileri</h3>
          
          <div>
            <Label htmlFor="totalPrice">Toplam Ücret (₺) *</Label>
            <Input
              id="totalPrice"
              name="totalPrice"
              type="number"
              min="0"
              value={formData.totalPrice}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="paymentStatus">Ödeme Durumu *</Label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.paymentStatus}
              onChange={handleChange}
              required
            >
              <option value="Ödendi">Ödendi</option>
              <option value="Kısmi">Kısmi</option>
              <option value="Bekliyor">Bekliyor</option>
            </select>
          </div>
        </div>
        
        {/* Diğer Bilgiler */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Diğer Bilgiler</h3>
          
          <div>
            <Label htmlFor="reservationChannel">Rezervasyon Kanalı *</Label>
            <select
              id="reservationChannel"
              name="reservationChannel"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.reservationChannel}
              onChange={handleChange}
              required
            >
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
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit">
          {reservation ? "Güncelle" : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}
