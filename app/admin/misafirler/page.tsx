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
import { Guest } from "@/lib/firebase-models"; // Guest modeli firebase-models'dan import edildi
import { createGuest, listGuests, updateGuest, deleteGuest, searchGuests } from "@/lib/guest-service"; // Guest service functions
import { formatDate } from "@/lib/utils"; // Tarih formatlama fonksiyonu
import { useAuth } from "@/context/auth-context"; // Auth context

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
    idNumber: "",
    nationality: "",
    notes: "",
  });

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Firebase Authentication ile oturum kontrolü
    if (!user) {
      router.push("/admin");
      return;
    }
    loadGuestsData();
  }, [router, user]);

  const loadGuestsData = async () => {
    setIsLoading(true);
    try {
      const guestsData = await listGuests();
      setGuests(guestsData);
    } catch (error) {
      console.error("Misafirler yüklenirken hata:", error);
      toast.error("Misafirler yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadGuestsData();
      return;
    }
    setIsLoading(true);
    try {
      const results = await searchGuests(searchTerm);
      setGuests(results);
    } catch (error) {
      console.error("Misafir aranırken hata:", error);
      toast.error("Misafir aranırken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev: Partial<Guest>) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Bu işlemi yapmak için giriş yapmalısınız.");
      return;
    }

    if (!formState.firstName || !formState.lastName) {
      toast.error("Ad ve Soyad alanları zorunludur.");
      return;
    }

    try {
      const userLog = { uid: user.uid, email: user.email || "" };
      if (currentGuest?.id) { // Editing existing guest
        await updateGuest(currentGuest.id, formState as Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>, userLog);
        toast.success("Misafir başarıyla güncellendi.");
      } else { // Creating new guest
        await createGuest(formState as Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>, userLog);
        toast.success("Misafir başarıyla oluşturuldu.");
      }
      resetForm();
      loadGuestsData();
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
      idNumber: "",
      nationality: "",
      notes: "",
    });
    setIsFormOpen(false);
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!user) {
      toast.error("Bu işlemi yapmak için giriş yapmalısınız.");
      return;
    }
    if (!confirm("Bu misafiri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return;
    }
    try {
      await deleteGuest(guestId, { uid: user.uid, email: user.email || "" });
      toast.success("Misafir başarıyla silindi.");
      loadGuestsData(); // Refresh the list
    } catch (error) {
      console.error("Misafir silinirken hata:", error);
      toast.error("Misafir silinirken bir hata oluştu. Bu misafirin aktif rezervasyonları olabilir.");
    }
  };

  // Tarih formatla
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      // Geçersiz tarih kontrolü
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.log("Geçersiz tarih değeri:", dateString);
        return "Geçersiz Tarih";
      }
      
      return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Tarih formatlanırken hata:", error, "Tarih değeri:", dateString);
      return "Geçersiz Tarih";
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
                      <TableCell>{guest.updatedAt ? formatDate(guest.updatedAt.toString()) : "-"}</TableCell>
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
