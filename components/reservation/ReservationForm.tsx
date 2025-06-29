import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Reservation, Guest } from "@/lib/firebase-models"; // Guest modelini import et
import { createReservation, updateReservation } from "@/lib/reservation-service"; // Corrected import
import { getAllRooms } from "@/lib/roomService";
import { listGuests, createGuest, getGuest } from "@/lib/guest-service"; // Guest service
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";


interface ReservationFormProps {
  reservation: Reservation | null; // Reservation modelini firebase-models'dan alıyoruz
  onSave: () => void;
  onCancel: () => void;
}

export default function ReservationForm({ reservation, onSave, onCancel }: ReservationFormProps) {
  const [rooms, setRooms] = useState<{id: string, name: string, type: string}[]>([]); // Oda modeline göre name kullanılabilir
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [guestSearchTerm, setGuestSearchTerm] = useState("");
  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState(false);
  const [isNewGuestModalOpen, setIsNewGuestModalOpen] = useState(false);
  const [newGuestForm, setNewGuestForm] = useState<Partial<Guest>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [formData, setFormData] = useState<Omit<Reservation, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>({
    guestId: "", // guestId olarak değişti
    roomId: "", // roomNumber yerine roomId
    checkInDate: "",
    checkOutDate: "",
    roomType: "",
    guestCount: 1,
    totalPrice: 0,
    paymentStatus: "Bekliyor" as Reservation["paymentStatus"],
    reservationChannel: "Website" as Reservation["reservationChannel"],
    notes: ""
  });

  const fetchRoomsAndGuests = useCallback(async () => {
    try {
      const roomData = await getAllRooms(); // roomService'den odaları al
      setRooms(roomData.map(r => ({ id: r.id, name: r.name, type: r.type }))); // Modelinize göre 'name' veya 'number'

      const guestData = await listGuests();
      setAllGuests(guestData);
    } catch (error) {
      toast.error("Odalar veya misafirler yüklenirken bir hata oluştu.");
      console.error("Error fetching rooms or guests:", error);
    }
  }, []);

  useEffect(() => {
    fetchRoomsAndGuests();
  }, [fetchRoomsAndGuests]);

  useEffect(() => {
    if (reservation) {
      setSelectedGuestId(reservation.guestId);
      setFormData({
        guestId: reservation.guestId,
        roomId: reservation.roomId,
        checkInDate: reservation.checkInDate.split('T')[0], // Tarih formatını YYYY-MM-DD yap
        checkOutDate: reservation.checkOutDate.split('T')[0], // Tarih formatını YYYY-MM-DD yap
        adults: reservation.adults,
        children: reservation.children || 0,
        totalPrice: reservation.totalPrice,
        paymentStatus: reservation.paymentStatus,
        status: reservation.status,
        notes: reservation.notes || "",
        // roomType ve guestCount alanları Reservation modelinde yoksa kaldırılmalı veya uyarlandıralım
        // Şimdilik Reservation modelinde olanları kullanıyorum: adults, children
        // guestCount yerine adults + children kullanılabilir veya ayrı bir alan olarak eklenebilir.
        // roomType, roomId seçildiğinde otomatik ayarlanacak.
      });
      // Oda tipi için:
      const selectedRoom = rooms.find(r => r.id === reservation.roomId);
      if (selectedRoom) {
        setFormData(prev => ({ ...prev, roomType: selectedRoom.type }));
      }
    } else {
      // Yeni rezervasyon için formu sıfırla
      setSelectedGuestId(null);
      setFormData({
        guestId: "",
        roomId: "",
        checkInDate: "",
        checkOutDate: "",
        adults: 1,
        children: 0,
        totalPrice: 0,
        paymentStatus: 'unpaid',
        status: 'pending',
        notes: "",
        roomType: ""
      });
    }
  }, [reservation, rooms]);

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    const val = type === "number" ? parseInt(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: val }));

    if (name === "roomId") {
      const selectedRoom = rooms.find(room => room.id === value);
      if (selectedRoom) {
        setFormData(prev => ({ ...prev, roomType: selectedRoom.type }));
      } else {
        setFormData(prev => ({ ...prev, roomType: "" }));
      }
    }
  };

  const handleGuestSelect = (guestId: string) => {
    setSelectedGuestId(guestId);
    setFormData(prev => ({ ...prev, guestId: guestId }));
    setIsGuestPopoverOpen(false);
  };

  const handleNewGuestFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGuestForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNewGuest = async () => {
    if (!newGuestForm.firstName || !newGuestForm.lastName) {
      toast.error("Yeni misafir için ad ve soyad zorunludur.");
      return;
    }
    try {
      const newGuestId = await createGuest(newGuestForm as Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success("Yeni misafir başarıyla eklendi.");
      setIsNewGuestModalOpen(false);
      setNewGuestForm({ firstName: "", lastName: "", email: "", phone: "" }); // Formu temizle
      await fetchRoomsAndGuests(); // Misafir listesini yenile
      handleGuestSelect(newGuestId); // Yeni eklenen misafiri seç
    } catch (error) {
      toast.error("Yeni misafir eklenirken hata oluştu.");
      console.error("Error creating new guest:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestId || !formData.checkInDate || !formData.checkOutDate || !formData.roomId) {
      toast.error("Lütfen misafir, oda ve tarih bilgilerini doldurun!");
      return;
    }

    // createdBy alanı AuthContext'ten alınacak, şimdilik placeholder
    const finalData = { ...formData, createdBy: 'adminUser' };

    try {
      if (reservation?.id) {
        await updateReservation(reservation.id, finalData);
        toast.success("Rezervasyon başarıyla güncellendi!");
      } else {
        await createReservation(finalData);
        toast.success("Yeni rezervasyon oluşturuldu!");
      }
      onSave(); // Parent component'e bildir
    } catch (error) {
      console.error("Rezervasyon kaydedilirken hata:", error);
      toast.error(`Rezervasyon kaydedilirken bir hata oluştu: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const selectedGuest = allGuests.find(g => g.id === selectedGuestId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Misafir Bilgileri */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Misafir Bilgileri</h3>
          <div>
            <Label htmlFor="guest">Misafir Seçin *</Label>
            <Popover open={isGuestPopoverOpen} onOpenChange={setIsGuestPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isGuestPopoverOpen}
                  className="w-full justify-between"
                >
                  {selectedGuest
                    ? `${selectedGuest.firstName} ${selectedGuest.lastName}`
                    : "Misafir seçin..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput
                    placeholder="Misafir ara (isim, email)..."
                    value={guestSearchTerm}
                    onValueChange={setGuestSearchTerm}
                  />
                  <CommandList>
                    <CommandEmpty>
                      <div className="py-2 text-center text-sm">
                        Misafir bulunamadı.
                        <Button variant="link" size="sm" onClick={() => { setIsGuestPopoverOpen(false); setIsNewGuestModalOpen(true); }}>
                           Yeni Misafir Ekle
                        </Button>
                      </div>
                    </CommandEmpty>
                    <CommandGroup>
                      {allGuests
                        .filter(guest =>
                           `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(guestSearchTerm.toLowerCase()) ||
                           guest.email?.toLowerCase().includes(guestSearchTerm.toLowerCase())
                        )
                        .map((guest) => (
                        <CommandItem
                          key={guest.id}
                          value={`${guest.firstName} ${guest.lastName} ${guest.email || ''}`}
                          onSelect={() => handleGuestSelect(guest.id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedGuestId === guest.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {guest.firstName} {guest.lastName} ({guest.email || guest.phone || 'Detay yok'})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
                <Button
                    variant="ghost"
                    className="w-full justify-start p-2"
                    onClick={() => { setIsGuestPopoverOpen(false); setIsNewGuestModalOpen(true); }}
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Yeni Misafir Ekle
                </Button>
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="adults">Yetişkin Sayısı *</Label>
            <Input
              id="adults"
              name="adults"
              type="number"
              min="1"
              value={formData.adults || 1}
              onChange={handleFormInputChange}
              required
            />
          </div>
           <div>
            <Label htmlFor="children">Çocuk Sayısı</Label>
            <Input
              id="children"
              name="children"
              type="number"
              min="0"
              value={formData.children || 0}
              onChange={handleFormInputChange}
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
              onChange={handleFormInputChange}
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
              onChange={handleFormInputChange}
              required
              className="cursor-pointer"
              onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
            />
          </div>
          
          <div>
            <Label htmlFor="roomId">Oda Seçin *</Label> {/* roomNumber yerine roomId */}
            <select
              id="roomId"
              name="roomId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.roomId}
              onChange={handleFormInputChange}
              required
            >
              <option value="">Oda Seçin</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}> {/* value olarak room.id */}
                  {room.name} - {room.type} {/* Oda adı veya numarası gösterilebilir (modelinize göre) */}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="roomType">Oda Tipi</Label>
            <Input
              id="roomType"
              name="roomType"
              value={formData.roomType || ""}
              onChange={handleFormInputChange}
              readOnly
              className="bg-gray-100"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ödeme Bilgileri */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Ödeme ve Durum</h3>
          
          <div>
            <Label htmlFor="totalPrice">Toplam Ücret (₺) *</Label>
            <Input
              id="totalPrice"
              name="totalPrice"
              type="number"
              min="0"
              value={formData.totalPrice}
              onChange={handleFormInputChange}
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
              onChange={handleFormInputChange}
              required
            >
              <option value="unpaid">Ödenmedi</option>
              <option value="partial">Kısmi Ödeme</option>
              <option value="paid">Ödendi</option>
            </select>
          </div>
           <div>
            <Label htmlFor="status">Rezervasyon Durumu *</Label>
            <select
              id="status"
              name="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.status}
              onChange={handleFormInputChange}
              required
            >
              <option value="pending">Beklemede</option>
              <option value="confirmed">Onaylandı</option>
              <option value="cancelled">İptal Edildi</option>
              <option value="completed">Tamamlandı</option>
            </select>
          </div>
        </div>

        {/* Diğer Bilgiler */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notlar</h3>
          <div>
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleFormInputChange}
              rows={5}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit">
          {reservation?.id ? "Rezervasyonu Güncelle" : "Rezervasyon Oluştur"}
        </Button>
      </div>

      {/* Yeni Misafir Ekleme Modalı */}
      <Dialog open={isNewGuestModalOpen} onOpenChange={setIsNewGuestModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yeni Misafir Ekle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newGuestFirstName" className="text-right">Ad*</Label>
              <Input id="newGuestFirstName" name="firstName" value={newGuestForm.firstName || ""} onChange={handleNewGuestFormChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newGuestLastName" className="text-right">Soyad*</Label>
              <Input id="newGuestLastName" name="lastName" value={newGuestForm.lastName || ""} onChange={handleNewGuestFormChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newGuestEmail" className="text-right">Email</Label>
              <Input id="newGuestEmail" name="email" type="email" value={newGuestForm.email || ""} onChange={handleNewGuestFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newGuestPhone" className="text-right">Telefon</Label>
              <Input id="newGuestPhone" name="phone" value={newGuestForm.phone || ""} onChange={handleNewGuestFormChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">İptal</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveNewGuest}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
