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
import { Room } from "@/lib/models";
import { getAllRooms, addRoom, updateRoom, deleteRoom } from "@/lib/roomService";

export default function RoomsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  // Form durumları
  const [formData, setFormData] = useState({
    number: "",
    type: "Standart",
    capacity: 2,
    price: 0,
    status: "Boş" as Room["status"]
  });
  
  const router = useRouter();

  useEffect(() => {
    // Oturum kontrolü
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
      return;
    }

    loadRooms();
  }, [router]);

  const loadRooms = () => {
    try {
      const allRooms = getAllRooms();
      setRooms(allRooms);
      setIsLoading(false);
    } catch (error) {
      console.error("Odalar yüklenirken hata:", error);
      toast.error("Odalar yüklenirken bir hata oluştu.");
      setIsLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Form doğrulama
      if (!formData.number || !formData.type) {
        toast.error("Lütfen zorunlu alanları doldurun!");
        return;
      }
      
      // Oda numarası kontrolü
      const existingRoom = rooms.find(room => room.number === formData.number);
      if (existingRoom && (!editingRoom || existingRoom.id !== editingRoom.id)) {
        toast.error("Bu oda numarası zaten kullanılıyor!");
        return;
      }
      
      if (editingRoom) {
        // Odayı güncelle
        updateRoom(editingRoom.id, formData);
        toast.success("Oda başarıyla güncellendi!");
      } else {
        // Yeni oda ekle
        addRoom(formData);
        toast.success("Oda başarıyla eklendi!");
      }
      
      // Formu temizle ve odaları yeniden yükle
      setFormData({
        number: "",
        type: "Standart",
        capacity: 2,
        price: 0,
        status: "Boş"
      });
      setEditingRoom(null);
      setIsDialogOpen(false);
      loadRooms();
    } catch (error) {
      console.error("Oda kaydedilirken hata:", error);
      toast.error("Oda kaydedilirken bir hata oluştu!");
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      price: room.price,
      status: room.status
    });
    setIsDialogOpen(true);
  };

  const handleDeleteRoom = (id: string) => {
    if (window.confirm("Bu odayı silmek istediğinizden emin misiniz?")) {
      try {
        deleteRoom(id);
        toast.success("Oda başarıyla silindi!");
        loadRooms();
      } catch (error) {
        console.error("Oda silinirken hata:", error);
        toast.error("Oda silinirken bir hata oluştu!");
      }
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
