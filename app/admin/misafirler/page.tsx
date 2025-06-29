"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Guest } from "@/lib/firebase-models"; // Updated Guest model
import { createGuest, listGuests, updateGuest, deleteGuest, searchGuests } from "@/lib/guest-service"; // Guest service functions

export default function GuestsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentGuest, setCurrentGuest] = useState<Partial<Guest> | null>(null); // For editing
  const [formState, setFormState] = useState<Partial<Guest>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    idNumber: "",
    nationality: "",
    notes: "",
  });

  const router = useRouter();
  // AuthContext ve RoleGate/PermissionGate bu kontrolü üstleneceği için
  // useEffect içindeki localStorage kontrolü kaldırılacak.
  // const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // if (!authLoading && !user) {
    //   router.push('/admin'); // Veya login
    //   return;
    // }
    // if(user) {
      loadGuestsData();
    // }
    // if(user) {
      setIsLoading(true);
      const unsubscribeGuests = guestService.listen((updatedGuests) => {
        setGuests(updatedGuests);
        setIsLoading(false);
      });
      // Arama yapıldığında veya filtre değiştiğinde bu listener'ı güncellemek gerekebilir.
      // Şimdilik basit bir tümünü dinleme yapıyoruz.

      return () => {
        unsubscribeGuests();
      };
    // }
  }, [router]); // user, authLoading, searchTerm gibi bağımlılıklar eklenebilir.

  // loadGuestsData fonksiyonu artık useEffect içinde yönetiliyor.

  const handleSearch = async () => {
    // Gerçek zamanlı dinleyici ile arama yapmak için queryConstraint'leri güncellemek ve
    // listener'ı yeniden başlatmak gerekir. Bu, firebase-service.ts'deki listen metodunu
    // dinamik QueryConstraint alacak şekilde düzenlemeyi gerektirebilir.
    // Şimdilik, arama fonksiyonu statik kalacak ve tüm misafirler üzerinde istemci tarafında filtreleme yapacak
    // veya manuel olarak yeniden yükleme yapacak (önerilmez).
    // Mevcut implementasyonda, listen tüm misafirleri getirdiği için,
    // arama işlemi filteredGuests gibi bir state üzerinde yapılabilir.
    // Ya da listen metoduna query parametreleri eklenir.
    // Şimdilik bu fonksiyonu değiştirmiyorum, ancak ideal çözüm listener'ı dinamikleştirmek.
    if (!searchTerm.trim()) {
      // loadGuestsData(); // Listener olduğu için buna gerek yok, tüm misafirler zaten state'de.
      // Eğer arama term'i boşsa, filtreyi temizle (eğer client-side filtreleme varsa)
      return;
    }
    setIsLoading(true);
    try {
      // Bu kısım idealde guestService.listen içinde query ile yapılmalı.
      // Geçici olarak, tüm misafirleri alıp filtreleyebiliriz veya searchGuests'i kullanabiliriz.
      const results = await guestService.search(searchTerm); // searchGuests'in adı search olduysa
      setGuests(results); // Bu, listener'dan gelen veriyi ezer. Dikkat!
    } catch (error) {
      console.error("Misafir aranırken hata:", error);
      toast.error("Misafir aranırken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.firstName || !formState.lastName) {
      toast.error("Ad ve Soyad alanları zorunludur.");
      return;
    }

    try {
      if (currentGuest?.id) { // Editing existing guest
        await updateGuest(currentGuest.id, formState as Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success("Misafir başarıyla güncellendi.");
      } else { // Creating new guest
        await createGuest(formState as Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success("Misafir başarıyla oluşturuldu.");
      }
      resetForm();
      // loadGuestsData(); // Bu satır kaldırıldı, listen metodu güncellemeyi yapacak.
    } catch (error) {
      console.error("Misafir kaydedilirken hata:", error);
      toast.error("Misafir kaydedilirken bir hata oluştu.");
    }
  };

  const openEditForm = (guest: Guest) => {
    setCurrentGuest(guest);
    setFormState({
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email || "",
      phone: guest.phone || "",
      address: guest.address || "",
      idNumber: guest.idNumber || "",
      nationality: guest.nationality || "",
      notes: guest.notes || "",
    });
    setIsFormOpen(true);
  };

  const openNewForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setCurrentGuest(null);
    setFormState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      idNumber: "",
      nationality: "",
      notes: "",
    });
    setIsFormOpen(false);
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Bu misafiri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return;
    }
    try {
      await guestService.delete(guestId); // guestService üzerinden sil
      toast.success("Misafir başarıyla silindi.");
      // loadGuestsData(); // Bu satır kaldırıldı, listen metodu güncellemeyi yapacak.
    } catch (error) {
      console.error("Misafir silinirken hata:", error);
      toast.error("Misafir silinirken bir hata oluştu. Bu misafirin aktif rezervasyonları olabilir.");
    }
  };

  // Tarih formatla (kullanılmıyorsa kaldırılabilir)
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };


  if (isLoading && guests.length === 0) { // Show loading only on initial load
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Misafir Yönetimi</h1>
        <div>
          <Button onClick={openNewForm} className="mr-2">Yeni Misafir Ekle</Button>
          <Button onClick={() => router.push("/admin/dashboard")} variant="outline">
            Dashboard'a Dön
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Misafir Listesi</CardTitle>
          <CardDescription>Kayıtlı tüm misafirleri görüntüleyin ve yönetin.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Input
              placeholder="İsim, e-posta veya telefon ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm mr-2"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Aranıyor..." : "Ara"}
            </Button>
             {searchTerm && (
                <Button variant="outline" onClick={() => { setSearchTerm(""); loadGuestsData(); }} className="ml-2">
                    Temizle
                </Button>
            )}
          </div>
          
          {guests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Son Güncelleme</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">{guest.firstName} {guest.lastName}</TableCell>
                      <TableCell>{guest.email || "-"}</TableCell>
                      <TableCell>{guest.phone || "-"}</TableCell>
                      <TableCell>{formatDate(guest.updatedAt)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => openEditForm(guest)} className="mr-2">
                          Düzenle
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteGuest(guest.id)}>
                          Sil
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>{searchTerm ? "Aranan kriterlere uygun misafir bulunamadı." : "Henüz kayıtlı misafir yok."}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Misafir Ekleme/Düzenleme Formu (Dialog içinde) */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{currentGuest?.id ? "Misafiri Düzenle" : "Yeni Misafir Ekle"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">Ad*</Label>
                <Input id="firstName" name="firstName" value={formState.firstName || ""} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">Soyad*</Label>
                <Input id="lastName" name="lastName" value={formState.lastName || ""} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" value={formState.email || ""} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Telefon</Label>
                <Input id="phone" name="phone" value={formState.phone || ""} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Adres</Label>
                <Input id="address" name="address" value={formState.address || ""} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="idNumber" className="text-right">Kimlik/Pasaport No</Label>
                <Input id="idNumber" name="idNumber" value={formState.idNumber || ""} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nationality" className="text-right">Uyruk</Label>
                <Input id="nationality" name="nationality" value={formState.nationality || ""} onChange={handleInputChange} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notlar</Label>
                <textarea id="notes" name="notes" value={formState.notes || ""} onChange={handleInputChange} className="col-span-3 border rounded-md p-2" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={resetForm}>İptal</Button>
              </DialogClose>
              <Button type="submit">{currentGuest?.id ? "Güncelle" : "Kaydet"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
