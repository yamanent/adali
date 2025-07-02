"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Room } from "@/lib/firebase-models"; 
import { getAllRooms, createRoom, updateRoom, deleteRoom } from "@/lib/room-service"; 
import { useAuth } from "@/context/auth-context"; 

const roomTypes = [
  { type: '6 Kişilik Özel Banyolu', capacity: 6 },
  { type: '3 Kişilik Ortak Banyolu', capacity: 3 },
  { type: '2 Kişilik Ortak Banyolu', capacity: 2 },
  { type: '2 Kişilik Özel Banyolu', capacity: 2 },
  { type: '4 Kişilik Ortak Banyolu', capacity: 4 },
  { type: '3 Kişilik Özel Banyolu', capacity: 3 },
];

export default function RoomsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  const [formData, setFormData] = useState<Omit<Room, 'id' | 'createdAt' | 'updatedAt'>>({
    name: "",
    roomNumber: "",
    type: roomTypes[0].type,
    capacity: roomTypes[0].capacity,
    price: 0,
    status: "Müsait"
  });
  
  const router = useRouter();
  const { user } = useAuth(); 

  useEffect(() => {
    if (!user) {
        router.push("/admin");
        return;
    }
    fetchRooms();
  }, [user, router]);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const allRooms = await getAllRooms();
      setRooms(allRooms);
    } catch (error) {
      toast.error("Odalar yüklenirken bir hata oluştu.");
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'type') {
        const selectedRoomType = roomTypes.find(rt => rt.type === value);
        if (selectedRoomType) {
            setFormData(prev => ({ 
                ...prev, 
                type: selectedRoomType.type,
                capacity: selectedRoomType.capacity 
            }));
        }
    } else {
        const parsedValue = name === 'price' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    }
  };

  const handleDialogOpen = (room: Room | null) => {
    setEditingRoom(room);
    if (room) {
      setFormData({
        name: room.name,
        roomNumber: room.roomNumber,
        type: room.type,
        capacity: room.capacity,
        price: room.price,
        status: room.status,
      });
    } else {
      setFormData({
        name: "",
        roomNumber: "",
        type: roomTypes[0].type,
        capacity: roomTypes[0].capacity,
        price: 0,
        status: "Müsait",
      });
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingRoom(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Oda adı/numarası zorunludur.");
      return;
    }

    const payload: Omit<Room, 'id' | 'createdAt' | 'updatedAt'> = {
        ...formData,
        roomNumber: formData.name, 
    };

    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, payload);
        toast.success(`Oda ${formData.name} başarıyla güncellendi.`);
      } else {
        await createRoom(payload);
        toast.success(`Oda ${formData.name} başarıyla eklendi.`);
      }
      fetchRooms();
      handleDialogClose();
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu.");
      console.error("Error saving room:", error);
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm("Bu odayı silmek istediğinizden emin misiniz?")) {
      return;
    }
    try {
      await deleteRoom(roomId);
      toast.success("Oda başarıyla silindi.");
      fetchRooms();
    } catch (error) {
      toast.error("Oda silinirken bir hata oluştu.");
      console.error("Error deleting room:", error);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-10">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Oda Yönetimi</h1>
        <Button onClick={() => handleDialogOpen(null)}>Yeni Oda Ekle</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Oda Listesi</CardTitle>
          <CardDescription>Mevcut odaları yönetin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Oda No</TableHead>
                <TableHead>Tipi</TableHead>
                <TableHead>Kapasite</TableHead>
                <TableHead>Fiyat (Gecelik)</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.length > 0 ? (
                rooms.map(room => (
                  <TableRow key={room.id}>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>₺{room.price}</TableCell>
                    <TableCell>{room.status}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDialogOpen(room)}>Düzenle</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(room.id)}>Sil</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Hiç oda bulunamadı.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Odayı Düzenle" : "Yeni Oda Ekle"}</DialogTitle>
            <DialogDescription>
              {editingRoom ? `Oda ${editingRoom.name} bilgilerini güncelleyin.` : "Yeni bir oda oluşturun."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Oda Numarası</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Oda Tipi</Label>
              <select
                id="type"
                name="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.type}
                onChange={handleFormChange}
                required
              >
                {roomTypes.map(rt => (
                    <option key={rt.type} value={rt.type}>{rt.type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="capacity">Kapasite</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                readOnly 
                className="bg-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="price">Fiyat (Gecelik)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Durum</Label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.status}
                onChange={handleFormChange}
                required
              >
                <option value="Müsait">Müsait</option>
                <option value="Dolu">Dolu</option>
                <option value="Bakımda">Bakımda</option>
                <option value="Temizleniyor">Temizleniyor</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleDialogClose}>İptal</Button>
              <Button type="submit">{editingRoom ? "Güncelle" : "Oluştur"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
