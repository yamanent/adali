// lib/expenseService.ts
// Bu dosya, lib/firebase-service.ts içindeki expenseService objesini sarmalar (wrap)
// ve eski import yapılarını korumak için kullanılır.

import { expenseService as fsExpenseService, where, orderBy, QueryConstraint } from './firebase-service';
import { Expense as FirebaseExpense } from './firebase-models'; // Modelin doğru import edildiğinden emin ol
// Eğer Expense modeli lib/types.ts içindeyse oradan import edilmeli.

type NewData<TModel> = Omit<TModel, 'id' | 'createdAt' | 'updatedAt'>;

export const expenseService = {
  create: async (data: NewData<FirebaseExpense>): Promise<string> => {
    try {
      return await fsExpenseService.add(data);
    } catch (error) {
      console.error("Error creating expense in expenseService wrapper:", error);
      throw new Error(`Failed to create expense: ${error.message}`);
    }
  },

  update: async (id: string, data: Partial<FirebaseExpense>): Promise<void> => {
    try {
      await fsExpenseService.update(id, data);
    } catch (error) {
      console.error(`Error updating expense ${id} in expenseService wrapper:`, error);
      throw new Error(`Failed to update expense: ${error.message}`);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await fsExpenseService.delete(id);
    } catch (error) {
      console.error(`Error deleting expense ${id} in expenseService wrapper:`, error);
      throw new Error(`Failed to delete expense: ${error.message}`);
    }
  },

  get: async (id: string): Promise<FirebaseExpense | null> => {
    try {
      return await fsExpenseService.get(id);
    } catch (error) {
      console.error(`Error fetching expense ${id} in expenseService wrapper:`, error);
      throw new Error(`Failed to fetch expense: ${error.message}`);
    }
  },

  getAll: async (constraints: QueryConstraint[] = [orderBy("date", "desc")]): Promise<FirebaseExpense[]> => {
    try {
      return await fsExpenseService.getAll(constraints);
    } catch (error) {
      console.error("Error fetching all expenses in expenseService wrapper:", error);
      throw new Error(`Failed to fetch all expenses: ${error.message}`);
    }
  },

  listen: (
    callback: (data: FirebaseExpense[]) => void,
    constraints: QueryConstraint[] = [orderBy("date", "desc")]
  ): (() => void) => {
    try {
      return fsExpenseService.listen(callback, constraints);
    } catch (error) {
      console.error("Error listening to expenses in expenseService wrapper:", error);
      throw new Error(`Failed to listen to expenses: ${error.message}`);
    }
  },

  // Gider kategorilerine göre toplam tutarları hesapla (Firestore sorgusu ile yapılmalı)
  getExpensesByCategory: async (): Promise<Record<string, number>> => {
    // Bu fonksiyonun Firestore'a göre yeniden yazılması gerekir.
    // Basit bir istemci tarafı toplama yerine, Firestore aggregations veya
    // tüm giderleri çekip burada işlemek gerekebilir (performans sorunlarına yol açabilir).
    // Şimdilik boş bir obje döndürüyoruz veya hata fırlatıyoruz.
    console.warn("getExpensesByCategory is not implemented for Firestore yet in expenseService wrapper.");
    // throw new Error("getExpensesByCategory is not implemented for Firestore yet.");
    return {};
  },

  // Belirli bir tarih aralığındaki giderleri getir
  getExpensesByDateRange: async (startDate: string, endDate: string): Promise<FirebaseExpense[]> => {
    try {
      // firebase-service.ts'deki processDataForFirestore string tarihleri Timestamp'e çevirir.
      // Ancak where sorgusunda direkt string kullanmak yerine Timestamp objesi oluşturmak daha güvenli olabilir.
      // const startTimestamp = Timestamp.fromDate(new Date(startDate));
      // const endTimestamp = Timestamp.fromDate(new Date(endDate));
      // return await fsExpenseService.getAll([
      //   where('date', '>=', startTimestamp),
      //   where('date', '<=', endTimestamp),
      //   orderBy('date', 'desc')
      // ]);
      // Şimdilik firebase-service.ts'deki date string'lerinin doğru işlendiğini varsayıyoruz.
       return await fsExpenseService.getAll([
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      ]);
    } catch (error) {
        console.error("Error fetching expenses by date range in expenseService wrapper:", error);
        throw new Error(`Failed to fetch expenses by date range: ${error.message}`);
    }
  },

  // Toplam gider tutarını hesapla (Firestore aggregation ile yapılmalı)
  getTotalExpenses: async (): Promise<number> => {
    // İdealde Firestore aggregation ile yapılmalı.
    // Alternatif olarak tüm giderleri çekip toplayabiliriz ama büyük veri setlerinde verimsiz olur.
    console.warn("getTotalExpenses might be inefficient for large datasets in expenseService wrapper.");
    try {
        const allExpenses = await fsExpenseService.getAll();
        return allExpenses.reduce((total, expense) => total + expense.amount, 0);
    } catch (error) {
        console.error("Error calculating total expenses in expenseService wrapper:", error);
        throw new Error(`Failed to calculate total expenses: ${error.message}`);
    }
  }
};

// Eski fonksiyon adlarıyla uyumluluk için
export const getAllExpenses = expenseService.getAll;
export const addExpense = expenseService.create;
export const updateExpense = expenseService.update;
export const deleteExpense = expenseService.delete;
// getExpensesByCategory, getExpensesByDateRange, getTotalExpenses yukarıda expenseService içinde.
