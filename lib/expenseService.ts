import { Expense } from './models';
import { demoExpenses } from './demoData';

// Örnek gider verileri
const sampleExpenses: Expense[] = [
  {
    id: '1',
    title: 'Personel Maaşları',
    amount: 15000,
    category: 'Personel',
    date: '2025-06-15',
    description: 'Haziran ayı personel maaşları',
    paymentMethod: 'Banka Transferi',
    receiptNumber: 'TR2025061500',
    createdAt: '2025-06-15T10:00:00Z',
    updatedAt: '2025-06-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Elektrik Faturası',
    amount: 3500,
    category: 'Elektrik',
    date: '2025-06-10',
    description: 'Haziran ayı elektrik faturası',
    paymentMethod: 'Banka Transferi',
    receiptNumber: 'ELK2025061001',
    createdAt: '2025-06-10T14:30:00Z',
    updatedAt: '2025-06-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Su Faturası',
    amount: 1200,
    category: 'Su',
    date: '2025-06-12',
    description: 'Haziran ayı su faturası',
    paymentMethod: 'Kredi Kartı',
    receiptNumber: 'SU2025061202',
    createdAt: '2025-06-12T09:15:00Z',
    updatedAt: '2025-06-12T09:15:00Z'
  },
  {
    id: '4',
    title: 'Temizlik Malzemeleri',
    amount: 2800,
    category: 'Temizlik',
    date: '2025-06-20',
    description: 'Aylık temizlik malzemeleri alımı',
    paymentMethod: 'Nakit',
    receiptNumber: 'TM2025062001',
    createdAt: '2025-06-20T11:45:00Z',
    updatedAt: '2025-06-20T11:45:00Z'
  },
  {
    id: '5',
    title: 'İnternet Faturası',
    amount: 750,
    category: 'İnternet',
    date: '2025-06-18',
    description: 'Haziran ayı internet faturası',
    paymentMethod: 'Kredi Kartı',
    receiptNumber: 'INT2025061801',
    createdAt: '2025-06-18T16:20:00Z',
    updatedAt: '2025-06-18T16:20:00Z'
  }
];

// LocalStorage anahtar adı
const EXPENSES_STORAGE_KEY = 'adali_expenses';

// LocalStorage'dan giderleri getir
export const getAllExpenses = (): Expense[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const storedExpenses = localStorage.getItem(EXPENSES_STORAGE_KEY);
  if (!storedExpenses) {
    // İlk kullanımda demo verileri kaydet
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(demoExpenses));
    return demoExpenses;
  }
  
  return JSON.parse(storedExpenses);
};

// Gider ekleme
export const addExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Expense => {
  const expenses = getAllExpenses();
  
  const now = new Date().toISOString();
  const newExpense: Expense = {
    ...expense,
    id: `exp_${Date.now()}`,
    createdAt: now,
    updatedAt: now
  };
  
  const updatedExpenses = [newExpense, ...expenses];
  localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(updatedExpenses));
  
  return newExpense;
};

// Gider güncelleme
export const updateExpense = (id: string, expenseData: Partial<Expense>): Expense | null => {
  const expenses = getAllExpenses();
  const expenseIndex = expenses.findIndex(exp => exp.id === id);
  
  if (expenseIndex === -1) {
    return null;
  }
  
  const updatedExpense: Expense = {
    ...expenses[expenseIndex],
    ...expenseData,
    updatedAt: new Date().toISOString()
  };
  
  expenses[expenseIndex] = updatedExpense;
  localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  
  return updatedExpense;
};

// Gider silme
export const deleteExpense = (id: string): boolean => {
  const expenses = getAllExpenses();
  const filteredExpenses = expenses.filter(exp => exp.id !== id);
  
  if (filteredExpenses.length === expenses.length) {
    return false; // Silinecek gider bulunamadı
  }
  
  localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(filteredExpenses));
  return true;
};

// Gider kategorilerine göre toplam tutarları hesapla
export const getExpensesByCategory = (): Record<string, number> => {
  const expenses = getAllExpenses();
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
};

// Belirli bir tarih aralığındaki giderleri getir
export const getExpensesByDateRange = (startDate: string, endDate: string): Expense[] => {
  const expenses = getAllExpenses();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date).getTime();
    return expenseDate >= start && expenseDate <= end;
  });
};

// Toplam gider tutarını hesapla
export const getTotalExpenses = (): number => {
  const expenses = getAllExpenses();
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};
