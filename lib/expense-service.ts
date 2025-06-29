// Gider servis fonksiyonları

import { firestore } from "./firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { Expense } from "./firebase-models";
import { getById, getAll, getFiltered, create, update, remove } from "./firebase-service";

// Koleksiyon adı
const EXPENSES_COLLECTION = "expenses";

/**
 * Tüm giderleri getirir
 */
export async function getAllExpenses(): Promise<Expense[]> {
  return await getAll<Expense>(EXPENSES_COLLECTION);
}

/**
 * Belirli bir tarih aralığındaki giderleri getirir
 */
export async function getExpensesByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
  const startDateStr = startDate.toISOString();
  const endDateStr = endDate.toISOString();
  
  return await getFiltered<Expense>(EXPENSES_COLLECTION, [
    where("date", ">=", startDateStr),
    where("date", "<=", endDateStr),
    orderBy("date", "desc")
  ]);
}

/**
 * Belirli bir kategorideki giderleri getirir
 */
export async function getExpensesByCategory(category: string): Promise<Expense[]> {
  return await getFiltered<Expense>(EXPENSES_COLLECTION, [
    where("category", "==", category),
    orderBy("date", "desc")
  ]);
}

/**
 * Belirli bir ödeme yöntemine göre giderleri getirir
 */
export async function getExpensesByPaymentMethod(paymentMethod: Expense['paymentMethod']): Promise<Expense[]> {
  return await getFiltered<Expense>(EXPENSES_COLLECTION, [
    where("paymentMethod", "==", paymentMethod),
    orderBy("date", "desc")
  ]);
}

/**
 * Yeni bir gider oluşturur
 */
export async function createExpense(expenseData: Omit<Expense, 'id'>): Promise<string> {
  return await create<Expense>(EXPENSES_COLLECTION, expenseData);
}

/**
 * Bir gideri günceller
 */
export async function updateExpense(id: string, expenseData: Partial<Expense>): Promise<void> {
  await update<Expense>(EXPENSES_COLLECTION, id, expenseData);
}

/**
 * Bir gideri siler
 */
export async function deleteExpense(id: string): Promise<void> {
  await remove(EXPENSES_COLLECTION, id);
}

/**
 * Gider istatistiklerini hesaplar
 */
export async function getExpenseStatistics() {
  const expenses = await getAllExpenses();
  
  // İstatistikler
  const stats = {
    total: expenses.length,
    totalAmount: 0,
    byCategory: {} as Record<string, number>,
    byPaymentMethod: {} as Record<string, number>,
    byMonth: {} as Record<string, number>
  };
  
  // İstatistikleri hesapla
  expenses.forEach(expense => {
    // Toplam miktar
    stats.totalAmount += expense.amount;
    
    // Kategoriye göre
    if (!stats.byCategory[expense.category]) {
      stats.byCategory[expense.category] = 0;
    }
    stats.byCategory[expense.category] += expense.amount;
    
    // Ödeme yöntemine göre
    if (!stats.byPaymentMethod[expense.paymentMethod]) {
      stats.byPaymentMethod[expense.paymentMethod] = 0;
    }
    stats.byPaymentMethod[expense.paymentMethod] += expense.amount;
    
    // Aya göre
    const date = new Date(expense.date);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!stats.byMonth[monthYear]) {
      stats.byMonth[monthYear] = 0;
    }
    stats.byMonth[monthYear] += expense.amount;
  });
  
  return stats;
}
