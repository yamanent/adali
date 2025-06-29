"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Room } from "@/lib/firebase-models"; // Firebase modelini kullan
import { roomService } from "@/lib/roomService"; // Firebase roomService'i import et (henüz oluşturulmadı varsayımı)
import { useAuth } from "@/context/auth-context"; // AuthContext'i kullan

export default function RoomsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  // Form durumları
  const [formData, setFormData] = useState<Omit<Room, 'id' | 'createdAt' | 'updatedAt'>>({ // Room tipine göre güncelle
    number: "",
    type: "Standart",
    capacity: 2,
    price: 0,
    status: "Boş",
    // Firebase modelinde olabilecek ek alanlar için varsayılan değerler eklenebilir
    // amenities: [],
    // imageUrls: [],
  });
  
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // if (!authLoading && !user) {
    //   router.push("/admin");
    //   return;
    // }
    // if (user) {
      setIsLoading(true);
      const unsubscribeRooms = roomService.listen((updatedRooms) => {
        setRooms(updatedRooms);
        setIsLoading(false);
      });

      return () => {
        unsubscribeRooms();
      };
    // }
  }, [router, user, authLoading]); // user ve authLoading eklendi, kullanıcı değişirse yeniden dinle

  // loadRooms fonksiyonu artık useEffect içinde yönetiliyor.

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
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
  };

  const handleAddOrUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.number || !formData.type) {
        toast.error("Lütfen oda numarası ve tipini girin!");
        return;
      }
      
      // Oda numarası benzersizliği Firestore seviyesinde daha iyi kontrol edilebilir (rules veya query ile)
      // Şimdilik istemci tarafında basit bir kontrol
      if (!editingRoom) { // Sadece yeni oda eklerken kontrol et
        const existingRoomQuery = await roomService.getRoomByNumber(formData.number);
        if (existingRoomQuery) { // Artık bir dizi değil, tek bir oda veya null dönecek
          toast.error("Bu oda numarası zaten kullanılıyor!");
          return;
        }
      }
      
      if (editingRoom && editingRoom.id) {
        await roomService.update(editingRoom.id, formData);
        toast.success("Oda başarıyla güncellendi!");
      } else {
        await roomService.create(formData);
        toast.success("Oda başarıyla eklendi!");
      }
      
      setFormData({
        number: "",
        type: "Standart",
        capacity: 2,
        price: 0,
        status: "Boş",
      });
      setEditingRoom(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving room in RoomsPage:", error);
      toast.error(`Oda kaydedilirken bir hata oluştu: ${error.message}`);
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setFormData({ // id, createdAt, updatedAt hariç diğer alanları al
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      price: room.price,
      status: room.status,
      // amenities: room.amenities || [],
      // imageUrls: room.imageUrls || [],
    });
    setIsDialogOpen(true);
  };

  const handleDeleteRoom = async (id: string) => {
    if (window.confirm("Bu odayı silmek istediğinizden emin misiniz?")) {
      try {
        await roomService.delete(id);
        toast.success("Oda başarıyla silindi!");
      } catch (error) {
        console.error("Error deleting room in RoomsPage:", error);
        toast.error(`Oda silinirken bir hata oluştu: ${error.message}`);
      }
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Odalar Yönetimi</h1>
        <Button onClick={() => router.push("/admin/dashboard")} variant="outline" className="w-full sm:w-auto">
          Dashboard'a Dön
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Odalar Listesi</CardTitle>
              <CardDescription>Tüm odaları görüntüleyin ve yönetin.</CardDescription>
            </div>
            <Button onClick={() => {
              setEditingRoom(null);
              setFormData({
                number: "",
                type: "Standart",
                capacity: 2,
                price: 0,
                status: "Boş"
              });
              setIsDialogOpen(true);
            }}>
              Yeni Oda Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rooms.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Oda No</TableHead>
                    <TableHead className="whitespace-nowrap">Oda Tipi</TableHead>
                    <TableHead className="whitespace-nowrap">Kapasite</TableHead>
                    <TableHead className="whitespace-nowrap">Fiyat</TableHead>
                    <TableHead className="whitespace-nowrap">Durum</TableHead>
                    <TableHead className="whitespace-nowrap">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.number} no {room.capacity} kişilik {room.type.toLowerCase()}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>{room.capacity} kişi</TableCell>
                      <TableCell>{room.price} ₺</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          room.status === "Boş" ? "bg-green-100 text-green-800" :
                          room.status === "Dolu" ? "bg-red-100 text-red-800" :
                          room.status === "Temizlik" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {room.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col xs:flex-row space-y-1 xs:space-y-0 xs:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRoom(room)}
                            className="text-xs py-1 h-auto"
                          >
                            Düzenle
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRoom(room.id)}
                            className="text-xs py-1 h-auto"
                          >
                            Sil
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Henüz hiç oda eklenmemiş.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Oda Ekleme/Düzenleme Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Odayı Düzenle" : "Yeni Oda Ekle"}</DialogTitle>
            <DialogDescription>
              {editingRoom ? "Oda bilgilerini güncelleyin." : "Yeni bir oda ekleyin."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddRoom} className="space-y-4">
            <div>
              <Label htmlFor="number">Oda Numarası *</Label>
              <Input
                id="number"
                name="number"
                value={formData.number}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="type">Oda Tipi *</Label>
              <select
                id="type"
                name="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.type}
                onChange={handleFormChange}
                required
              >
                <option value="Standart">Standart</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suit">Suit</option>
                <option value="Aile">Aile</option>
                <option value="Ekonomik">Ekonomik</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="capacity">Kapasite (Kişi) *</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Fiyat (₺) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="status">Durum *</Label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.status}
                onChange={handleFormChange}
                required
              >
                <option value="Boş">Boş</option>
                <option value="Dolu">Dolu</option>
                <option value="Temizlik">Temizlik</option>
                <option value="Bakım">Bakım</option>
              </select>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">
                {editingRoom ? "Güncelle" : "Kaydet"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
