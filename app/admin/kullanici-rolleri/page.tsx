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
import { getAllUsers, addUser, updateUser, deleteUser } from "@/lib/userService";

// Kullanıcı tipi tanımı
type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
};

// İzin tipi tanımı
type Permission = {
  id: string;
  name: string;
  description: string;
};

// Örnek izinler listesi
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

// Kullanıcılar artık userService üzerinden yönetiliyor

export default function UserRolesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.STAFF);
  const [newUserPermissions, setNewUserPermissions] = useState<string[]>([]);
  
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Kullanıcıları servis üzerinden yükle
    const loadedUsers = getAllUsers();
    setUsers(loadedUsers);
    setIsLoading(false);
  }, []);

  // Kullanıcı seçme fonksiyonu
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setNewUserName(user.name);
    setNewUserEmail(user.email);
    setNewUserRole(user.role);
    setNewUserPermissions(user.permissions);
    setIsEditing(true);
  };

  // Yeni kullanıcı oluşturma modunu açma
  const handleNewUser = () => {
    setSelectedUser(null);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole(UserRole.STAFF);
    setNewUserPermissions([]);
    setIsEditing(true);
  };

  // İzin değiştirme işlemi
  const handlePermissionChange = (permissionId: string, isChecked: boolean) => {
    if (isChecked) {
      setNewUserPermissions([...newUserPermissions, permissionId]);
    } else {
      setNewUserPermissions(newUserPermissions.filter(id => id !== permissionId));
    }
  };

  // Kullanıcı kaydetme işlemi
  const handleSaveUser = () => {
    if (!newUserName || !newUserEmail) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    const updatedUser: User = {
      id: selectedUser?.id || `new-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      permissions: newUserPermissions
    };

    if (selectedUser) {
      // Mevcut kullanıcıyı güncelle
      setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
      toast.success("Kullanıcı başarıyla güncellendi.");
    } else {
      // Yeni kullanıcı ekle
      setUsers([...users, updatedUser]);
      toast.success("Yeni kullanıcı başarıyla oluşturuldu.");
    }

    setIsEditing(false);
  };

  // Kullanıcı silme işlemi
  const handleDeleteUser = (userId: string) => {
    if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      setUsers(users.filter(u => u.id !== userId));
      toast.success("Kullanıcı başarıyla silindi.");
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
        setIsEditing(false);
      }
    }
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
              {isEditing ? (selectedUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı") : "Kullanıcı Detayları"}
            </CardTitle>
            <CardDescription>
              {isEditing ? "Kullanıcı bilgilerini ve izinlerini düzenleyin" : "Düzenlemek için bir kullanıcı seçin"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Ad Soyad</label>
                  <Input 
                    id="name" 
                    value={newUserName} 
                    onChange={(e) => setNewUserName(e.target.value)} 
                    placeholder="Kullanıcı adı soyadı"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">E-posta</label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={newUserEmail} 
                    onChange={(e) => setNewUserEmail(e.target.value)} 
                    placeholder="kullanici@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-1">Rol</label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  >
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.MANAGER}>Yönetici</option>
                    <option value={UserRole.STAFF}>Personel</option>
                    <option value={UserRole.USER}>Kullanıcı</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">İzinler</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-3 max-h-[300px] overflow-y-auto">
                    {availablePermissions.map(permission => (
                      <div key={permission.id} className="flex items-start space-x-2">
                        <Checkbox 
                          id={`permission-${permission.id}`} 
                          checked={newUserPermissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked === true)}
                        />
                        <div className="grid gap-1.5">
                          <label
                            htmlFor={`permission-${permission.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.name}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    İptal
                  </Button>
                  <Button onClick={handleSaveUser}>
                    {selectedUser ? "Güncelle" : "Oluştur"}
                  </Button>
                </div>
              </div>
            ) : selectedUser ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <p className="text-sm mt-1">Rol: <span className="font-medium">{getRoleName(selectedUser.role)}</span></p>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-2">İzinler</h4>
                  {selectedUser.permissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedUser.permissions.map(permId => {
                        const permission = availablePermissions.find(p => p.id === permId);
                        return (
                          <div key={permId} className="text-sm p-2 bg-gray-50 rounded-md">
                            <p className="font-medium">{permission?.name || permId}</p>
                            {permission && <p className="text-xs text-gray-500">{permission.description}</p>}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Bu kullanıcıya atanmış izin bulunmamaktadır.</p>
                  )}
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={() => handleSelectUser(selectedUser)}>
                    Düzenle
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
