"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import Unauthorized from "@/components/auth/unauthorized";
import { User, UserRole } from "@/lib/firebase-models";
import { userService } from "@/lib/firebase-service";

// İzin tipi tanımı (UI için)
type Permission = {
  id: string;
  name: string;
  description: string;
};

// Mevcut izinler listesi
const availablePermissions: Permission[] = [
  { id: "view:dashboard", name: "Dashboard Görüntüleme", description: "Dashboard sayfasını görüntüleme izni" },
  { id: "view:statistics", name: "İstatistik Görüntüleme", description: "İstatistik sayfasını görüntüleme izni" },
  { id: "view:reservations", name: "Rezervasyon Görüntüleme", description: "Rezervasyonları görüntüleme izni" },
  { id: "create:reservation", name: "Rezervasyon Oluşturma", description: "Yeni rezervasyon oluşturma izni" },
  { id: "edit:reservation", name: "Rezervasyon Düzenleme", description: "Mevcut rezervasyonları düzenleme izni" },
  { id: "delete:reservation", name: "Rezervasyon Silme", description: "Rezervasyonları silme izni" },
  { id: "view:expenses", name: "Gider Görüntüleme", description: "Giderleri görüntüleme izni" },
  { id: "create:expense", name: "Gider Oluşturma", description: "Yeni gider oluşturma izni" },
  { id: "edit:expense", name: "Gider Düzenleme", description: "Mevcut giderleri düzenleme izni" },
  { id: "delete:expense", name: "Gider Silme", description: "Giderleri silme izni" },
  { id: "view:rooms", name: "Oda Görüntüleme", description: "Odaları görüntüleme izni" },
  { id: "edit:rooms", name: "Oda Düzenleme", description: "Odaları düzenleme izni" },
  { id: "view:customers", name: "Müşteri Görüntüleme", description: "Müşterileri görüntüleme izni" },
  { id: "edit:customers", name: "Müşteri Düzenleme", description: "Müşterileri düzenleme izni" },
];

export default function UserRolesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state'i
  const [editForm, setEditForm] = useState<{ role: UserRole; permissions: string[] }>({ 
    role: UserRole.STAFF, 
    permissions: [] 
  });

  const router = useRouter();
  const { user: authUser } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = userService.listen((fetchedUsers) => {
      setUsers(fetchedUsers);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({ role: user.role, permissions: user.permissions || [] });
    setIsEditing(true);
  };

  const handleNewUser = () => {
    toast.info("Yeni Kullanıcı Ekleme", {
      description: "Güvenlik nedeniyle, yeni kullanıcılar doğrudan Firebase Authentication panelinden eklenmelidir. Eklendikten sonra burada otomatik olarak görüneceklerdir.",
    });
  };

  const handlePermissionChange = (permissionId: string, isChecked: boolean) => {
    setEditForm(prev => ({
      ...prev,
      permissions: isChecked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(id => id !== permissionId)
    }));
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      await userService.update(selectedUser.id, {
        role: editForm.role,
        permissions: editForm.permissions,
      });
      toast.success(`'${selectedUser.name || selectedUser.email}' kullanıcısı güncellendi.`);
      setIsEditing(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Kullanıcı güncellenirken hata:", error);
      toast.error("Kullanıcı güncellenemedi.");
    }
  };

  const handleDeleteUser = async (userToDelete: User) => {
    if (userToDelete.id === authUser?.uid) {
        toast.error("Kendinizi silemezsiniz.");
        return;
    }

    if (confirm(`'${userToDelete.name || userToDelete.email}' adlı kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      try {
        await userService.delete(userToDelete.id);
        toast.success("Kullanıcı başarıyla silindi.");
        if (selectedUser?.id === userToDelete.id) {
          setSelectedUser(null);
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Kullanıcı silinirken hata:", error);
        toast.error("Kullanıcı silinemedi.");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedUser(null);
  };

  const getRoleName = (role: UserRole) => {
    const roleMap: Record<UserRole, string> = {
      [UserRole.ADMIN]: "Admin",
      [UserRole.MANAGER]: "Yönetici",
      [UserRole.STAFF]: "Personel",
    };
    return roleMap[role] || "Bilinmeyen";
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><p>Kullanıcılar yükleniyor...</p></div>;
  }

  if (!authUser || authUser.role !== UserRole.ADMIN) {
    return <Unauthorized message="Bu sayfaya erişim için admin yetkisi gereklidir." />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kullanıcı Rolleri ve İzinleri</h1>
        <Button onClick={() => router.push("/admin/dashboard")} variant="outline">Dashboard'a Dön</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Kullanıcılar</CardTitle>
            <CardDescription>Sistemdeki mevcut kullanıcılar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button onClick={handleNewUser} variant="outline" className="text-green-600 hover:bg-green-50">Yeni Kullanıcı</Button>
            </div>
            <div className="space-y-2">
              {users.map(user => (
                <div 
                  key={user.id} 
                  className={`p-3 border rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-blue-50 border-blue-200' : ''}`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div>
                    <p className="font-medium">{user.name || 'İsimsiz'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">Rol: {getRoleName(user.role)}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => { e.stopPropagation(); handleDeleteUser(user); }}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    disabled={authUser?.uid === user.id}
                  >
                    Sil
                  </Button>
                </div>
              ))}
              {users.length === 0 && <p className="text-center py-4 text-gray-500">Henüz kullanıcı bulunmamaktadır.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{isEditing && selectedUser ? "Kullanıcıyı Düzenle" : "Kullanıcı Detayları"}</CardTitle>
            <CardDescription>{isEditing && selectedUser ? `Düzenlenen: ${selectedUser.name || selectedUser.email}` : "Düzenlemek için bir kullanıcı seçin"}</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing && selectedUser ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ad Soyad</label>
                  <Input value={selectedUser.name || ''} disabled placeholder="Kullanıcı adı soyadı" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">E-posta</label>
                  <Input type="email" value={selectedUser.email} disabled placeholder="kullanici@example.com" />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-1">Rol</label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editForm.role}
                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  >
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.MANAGER}>Yönetici</option>
                    <option value={UserRole.STAFF}>Personel</option>

                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">İzinler</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-3 max-h-[300px] overflow-y-auto">
                    {availablePermissions.map(permission => (
                      <div key={permission.id} className="flex items-start space-x-2">
                        <Checkbox 
                          id={`permission-${permission.id}`} 
                          checked={editForm.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked === true)}
                        />
                        <div className="grid gap-1.5">
                          <label htmlFor={`permission-${permission.id}`} className="text-sm font-medium leading-none">{permission.name}</label>
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCancel}>İptal</Button>
                  <Button onClick={handleSaveUser}>Güncelle</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 flex flex-col items-center justify-center h-full">
                <p>Detayları görüntülemek veya düzenlemek için bir kullanıcı seçin.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
