// Kullanıcı rolleri için tip tanımlamaları

export enum UserRole {
  READER = 'reader',     // Sadece okuma yetkisi
  EDITOR = 'editor',     // Düzenleme yetkisi
  MANAGER = 'manager',   // Yönetici yetkisi
  STAFF = 'staff',       // Personel yetkisi
  USER = 'user',         // Normal kullanıcı yetkisi
  ADMIN = 'admin',       // Tam yetki
  GUEST = 'guest'        // Misafir kullanıcı
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  displayName: string;
  createdAt: Date;
  lastLogin?: Date;
  isGuest?: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  code: string;
}

// Her rol için izinler
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.GUEST]: [
    'view:rooms',
    'view:calendar',
    'create:reservation',
    'view:reservation',
    'edit:own_reservation',
  ],
  [UserRole.READER]: [
    'view:dashboard',
    'view:reservations',
    'view:calendar',
    'view:rooms',
    'view:guests',
    'view:statistics',
  ],
  [UserRole.EDITOR]: [
    // Reader izinleri
    'view:dashboard',
    'view:reservations',
    'view:calendar',
    'view:rooms',
    'view:guests',
    'view:statistics',
    // Editor ek izinleri
    'create:reservation',
    'edit:reservation',
    'create:guest',
    'edit:guest',
  ],
  [UserRole.STAFF]: [
    // Personel izinleri
    'view:dashboard',
    'view:reservations',
    'view:calendar',
    'view:rooms',
    'view:guests',
    'create:reservation',
    'edit:reservation',
  ],
  [UserRole.USER]: [
    // Normal kullanıcı izinleri
    'view:dashboard',
    'view:reservations',
    'view:calendar',
  ],
  [UserRole.MANAGER]: [
    // Editor izinleri
    'view:dashboard',
    'view:reservations',
    'view:calendar',
    'view:rooms',
    'view:guests',
    'view:statistics',
    'create:reservation',
    'edit:reservation',
    'create:guest',
    'edit:guest',
    // Manager ek izinleri
    'delete:reservation',
    'delete:guest',
    'manage:rooms',
    'view:reports',
    'export:data',
  ],
  [UserRole.ADMIN]: [
    // Tüm izinler
    'view:dashboard',
    'view:reservations',
    'view:calendar',
    'view:rooms',
    'view:guests',
    'view:statistics',
    'create:reservation',
    'edit:reservation',
    'create:guest',
    'edit:guest',
    'delete:reservation',
    'delete:guest',
    'manage:rooms',
    'view:reports',
    'export:data',
    // Admin ek izinleri
    'manage:users',
    'manage:roles',
    'manage:settings',
    'view:logs',
    'system:config',
  ],
};

// Kullanıcının belirli bir izne sahip olup olmadığını kontrol eden yardımcı fonksiyon
// Bu fonksiyon context/auth-context.tsx içerisinde implemente edildiği için burada kaldırılmıştır.
// İzin kontrolü için useAuth() hook'u kullanılmalıdır.
