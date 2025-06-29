"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types/auth";
import Unauthorized from "@/components/auth/unauthorized";
import { FirestoreUser } from "@/lib/firebase-models"; // FirestoreUser modelini kullan
import * as userService from "@/lib/services/userService"; // userService'i import et

// İzin yönetimi şimdilik kaldırıldı
// type Permission = {
//   id: string;
//   name: string;
//   description: string;
// };
// const availablePermissions: Permission[] = [ /* ... */ ];

export default function UserRolesPage() {
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<FirestoreUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  // newUserName ve newUserEmail state'leri FirestoreUser'dan gelecek, düzenleme için ayrı state tutmaya gerek yok.
  const [editingUserRole, setEditingUserRole] = useState<UserRole>(UserRole.STAFF);
  
  const router = useRouter();
  const { user: loggedInUser, loading: authLoading } = useAuth(); // Mevcut giriş yapmış kullanıcı

  useEffect(() => {
    // if (authLoading) return; // Auth yüklenene kadar bekle
    // if (!loggedInUser || loggedInUser.role !== UserRole.ADMIN) {
    //   // Yetkisiz erişim, ana sayfaya veya login'e yönlendirilebilir.
    //   // Bu kontrol zaten sayfanın sonunda yapılıyor.
    //   return;
    // }

    setIsLoading(true);
    const unsubscribe = userService.listenToUsers((fetchedUsers) => {
      setUsers(fetchedUsers);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [loggedInUser, authLoading]);

  // Kullanıcı seçme fonksiyonu
  const handleSelectUser = (userToEdit: FirestoreUser) => {
    setSelectedUser(userToEdit);
    setEditingUserRole(userToEdit.role); // Seçilen kullanıcının mevcut rolünü al
    setIsEditing(true);
  };

  // Yeni kullanıcı oluşturma şimdilik devre dışı
  const handleNewUser = () => {
    toast.info("Yeni kullanıcı oluşturma özelliği şu anda aktif değil.");
    // setSelectedUser(null);
    // setEditingUserRole(UserRole.STAFF);
    // setIsEditing(true);
  };

  // İzin yönetimi kaldırıldı
  // const handlePermissionChange = (permissionId: string, isChecked: boolean) => { /* ... */ };

  // Kullanıcı rolünü kaydetme işlemi
  const handleSaveUserRole = async () => {
    if (!selectedUser) {
      toast.error("Güncellenecek kullanıcı seçili değil.");
      return;
    }

    // Sadece rol güncellenecek
    try {
      await userService.updateUserRole(selectedUser.id, editingUserRole);
      toast.success(`${selectedUser.displayName || selectedUser.email}' adlı kullanıcının rolü başarıyla güncellendi.`);
      setIsEditing(false);
      setSelectedUser(null); // Seçimi temizle
    } catch (error) {
      toast.error("Kullanıcı rolü güncellenirken bir hata oluştu.");
      console.error("Error updating user role:", error);
    }
  };

  // Kullanıcı silme şimdilik devre dışı
  const handleDeleteUser = (userId: string) => {
    toast.info("Kullanıcı silme özelliği şu anda aktif değil.");
    // if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
    //   // userService.deleteUser(userId) çağrılacak
    // }
  };

  // İptal işlemi
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Rol adını Türkçe olarak gösterme
  const getRoleName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "Admin";
      case UserRole.MANAGER:
        return "Yönetici";
      case UserRole.STAFF:
        return "Personel";
      case UserRole.USER:
        return "Kullanıcı";
      default:
        return "Bilinmeyen";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  // Admin kontrolü
  if (!user || user.role !== UserRole.ADMIN) {
    return <Unauthorized message="Bu sayfaya erişim için admin yetkisi gereklidir." />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kullanıcı Rolleri ve İzinleri</h1>
        <Button onClick={() => router.push("/admin/dashboard")} variant="outline">
          Dashboard'a Dön
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kullanıcı Listesi */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Kullanıcılar</CardTitle>
            <CardDescription>Sistem kullanıcılarının listesi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button onClick={handleNewUser} variant="outline" className="text-green-600 hover:bg-green-50">
                Yeni Kullanıcı
              </Button>
            </div>
            <div className="space-y-2">
              {users.map(user => (
                <div 
                  key={user.id} 
                  className={`p-3 border rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-blue-50 border-blue-200' : ''}`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">Rol: {getRoleName(user.role)}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(user.id);
                    }}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    Sil
                  </Button>
                </div>
              ))}
              
              {users.length === 0 && (
                <p className="text-center py-4 text-gray-500">Henüz kullanıcı bulunmamaktadır.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Kullanıcı Detayları ve Düzenleme */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {isEditing && selectedUser ? `Rol Düzenle: ${selectedUser.displayName || selectedUser.email}` : "Kullanıcı Detayları"}
            </CardTitle>
            <CardDescription>
              {isEditing && selectedUser ? "Kullanıcının rolünü değiştirin." : "Rolünü düzenlemek için bir kullanıcı seçin."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing && selectedUser ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Kullanıcı: {selectedUser.displayName || selectedUser.email}</p>
                  <p className="text-xs text-gray-500">ID: {selectedUser.id}</p>
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-1">Rol</label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editingUserRole} // editingUserRole state'ini kullan
                    onChange={(e) => setEditingUserRole(e.target.value as UserRole)}
                  >
                    {Object.values(UserRole).map(roleValue => (
                      <option key={roleValue} value={roleValue}>{getRoleName(roleValue)}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    İptal
                  </Button>
                  <Button onClick={handleSaveUserRole}>
                    Rolü Güncelle
                  </Button>
                </div>
              </div>
            ) : selectedUser ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.displayName || selectedUser.email}</h3>
                  <p className="text-gray-500">E-posta: {selectedUser.email}</p>
                  <p className="text-sm mt-1">Rol: <span className="font-medium">{getRoleName(selectedUser.role)}</span></p>
                  {selectedUser.username && <p className="text-sm">Kullanıcı Adı: {selectedUser.username}</p>}
                  {selectedUser.lastLogin && <p className="text-xs text-gray-400 mt-1">Son Giriş: {new Date(selectedUser.lastLogin).toLocaleString()}</p>}
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => handleSelectUser(selectedUser)}>
                    Rolü Düzenle
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Detayları görüntülemek veya düzenlemek için bir kullanıcı seçin</p>
                <p className="mt-2">veya</p>
                <Button onClick={handleNewUser} variant="outline" className="mt-2">
                  Yeni Kullanıcı Oluştur
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
