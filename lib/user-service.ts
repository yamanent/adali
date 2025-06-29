// Kullanıcı servis fonksiyonları

import { auth, firestore } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  deleteUser,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { FirestoreUser } from "./firebase-models";
import { UserRole } from "@/types/auth";
import { getById, getAll, getFiltered, update, remove } from "./firebase-service";

// Koleksiyon adı
const USERS_COLLECTION = "users";

/**
 * Yeni bir kullanıcı oluşturur
 */
export async function createUser(email: string, password: string, displayName: string, role: UserRole = UserRole.USER): Promise<string> {
  try {
    // Firebase Authentication ile kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Kullanıcı profil bilgilerini güncelle
    await updateProfile(user, { displayName });
    
    // Kullanıcı bilgilerini Firestore'a kaydet
    const username = email.split('@')[0]; // E-postadan basit bir kullanıcı adı oluştur
    
    const userData: Omit<FirestoreUser, 'id'> = {
      username,
      email,
      displayName,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true
    };
    
    await setDoc(doc(firestore, USERS_COLLECTION, user.uid), userData);
    
    return user.uid;
  } catch (error) {
    console.error("Kullanıcı oluşturulurken hata:", error);
    throw error;
  }
}

/**
 * Tüm kullanıcıları getirir
 */
export async function getAllUsers(): Promise<FirestoreUser[]> {
  return await getAll<FirestoreUser>(USERS_COLLECTION);
}

/**
 * Belirli bir role sahip kullanıcıları getirir
 */
export async function getUsersByRole(role: UserRole): Promise<FirestoreUser[]> {
  return await getFiltered<FirestoreUser>(USERS_COLLECTION, [
    where("role", "==", role)
  ]);
}

/**
 * Kullanıcı bilgilerini günceller
 */
export async function updateUserProfile(userId: string, profileData: Partial<FirestoreUser>): Promise<void> {
  await update<FirestoreUser>(USERS_COLLECTION, userId, profileData);
  
  // Eğer displayName güncellendiyse, Firebase Auth'da da güncelle
  if (profileData.displayName && auth.currentUser && auth.currentUser.uid === userId) {
    await updateProfile(auth.currentUser, { displayName: profileData.displayName });
  }
}

/**
 * Kullanıcı rolünü günceller
 */
export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  await update<FirestoreUser>(USERS_COLLECTION, userId, { role });
}

/**
 * Kullanıcı şifresini sıfırlama e-postası gönderir
 */
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Kullanıcı e-posta adresini günceller
 */
export async function updateUserEmail(newEmail: string): Promise<void> {
  if (!auth.currentUser) throw new Error("Kullanıcı oturum açmamış");
  
  // Firebase Auth'da e-posta güncelle
  await updateEmail(auth.currentUser, newEmail);
  
  // Firestore'da e-posta güncelle
  await update<FirestoreUser>(USERS_COLLECTION, auth.currentUser.uid, { email: newEmail });
}

/**
 * Kullanıcı şifresini günceller
 */
export async function updateUserPassword(newPassword: string): Promise<void> {
  if (!auth.currentUser) throw new Error("Kullanıcı oturum açmamış");
  
  await updatePassword(auth.currentUser, newPassword);
}

/**
 * Kullanıcıyı siler
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  // Önce Firestore'dan kullanıcıyı sil
  await remove(USERS_COLLECTION, userId);
  
  // Eğer mevcut kullanıcı siliniyorsa, Firebase Auth'dan da sil
  if (auth.currentUser && auth.currentUser.uid === userId) {
    await deleteUser(auth.currentUser);
  }
}
