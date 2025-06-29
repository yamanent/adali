import { UserRole } from '@/types/auth';
import { demoUsers } from './demoData';

// Kullanıcı tipi tanımı
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
};

// İzin tipi tanımı
export type Permission = {
  id: string;
  name: string;
  description: string;
};

// LocalStorage'da kullanıcıları saklamak için anahtar
const USERS_KEY = 'hotel_users';

// Tüm kullanıcıları getir
export const getAllUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  
  const usersJson = localStorage.getItem(USERS_KEY);
  if (!usersJson) {
    // İlk kullanımda demo kullanıcıları kaydet
    localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
    return demoUsers;
  }
  
  try {
    return JSON.parse(usersJson);
  } catch (error) {
    console.error('Kullanıcılar yüklenirken hata oluştu:', error);
    return [];
  }
};

// Kullanıcı ekle
export const addUser = (user: Omit<User, 'id'>): User => {
  const users = getAllUsers();
  
  const newUser: User = {
    ...user,
    id: `user_${Date.now()}`
  };
  
  const updatedUsers = [...users, newUser];
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  
  return newUser;
};

// Kullanıcı güncelle
export const updateUser = (id: string, userData: Partial<User>): User | null => {
  const users = getAllUsers();
  
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) return null;
  
  const updatedUser = {
    ...users[userIndex],
    ...userData
  };
  
  users[userIndex] = updatedUser;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return updatedUser;
};

// Kullanıcı sil
export const deleteUser = (id: string): boolean => {
  const users = getAllUsers();
  
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (filteredUsers.length === users.length) {
    return false; // Kullanıcı bulunamadı
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
  return true;
};

// Kullanıcı ID'sine göre getir
export const getUserById = (id: string): User | null => {
  const users = getAllUsers();
  return users.find(user => user.id === id) || null;
};

// Kullanıcı rolüne göre filtrele
export const filterUsersByRole = (role: UserRole): User[] => {
  const users = getAllUsers();
  return users.filter(user => user.role === role);
};

// Örnek izinler listesi
export const availablePermissions: Permission[] = [
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
