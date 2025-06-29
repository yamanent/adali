import { demoStatistics } from './demoData';

// LocalStorage'da istatistikleri saklamak için anahtar
const STATISTICS_KEY = 'hotel_statistics';

// İstatistik veri tipleri
type StatisticsData = {
  occupancyRates: Record<string, number>;
  channelDistribution: Record<string, number>;
  monthlyRevenue: Record<string, number>;
  monthlyExpenses: Record<string, number>;
};

// Tüm istatistikleri getir
export const getAllStatistics = (): StatisticsData => {
  if (typeof window === 'undefined') return {
    occupancyRates: {},
    channelDistribution: {},
    monthlyRevenue: {},
    monthlyExpenses: {}
  };
  
  const statisticsJson = localStorage.getItem(STATISTICS_KEY);
  if (!statisticsJson) {
    // İlk kullanımda demo istatistikleri kaydet
    localStorage.setItem(STATISTICS_KEY, JSON.stringify(demoStatistics));
    return demoStatistics as StatisticsData;
  }
  
  try {
    return JSON.parse(statisticsJson) as StatisticsData;
  } catch (error) {
    console.error('İstatistikler yüklenirken hata oluştu:', error);
    return {
      occupancyRates: {},
      channelDistribution: {},
      monthlyRevenue: {},
      monthlyExpenses: {}
    };
  }
};

// Doluluk oranlarını getir
export const getOccupancyRates = (): Record<string, number> => {
  const statistics = getAllStatistics();
  return statistics.occupancyRates || {};
};

// Kanal dağılımını getir
export const getChannelDistribution = (): Record<string, number> => {
  const statistics = getAllStatistics();
  return statistics.channelDistribution || {};
};

// Aylık gelirleri getir
export const getMonthlyRevenue = (): Record<string, number> => {
  const statistics = getAllStatistics();
  return statistics.monthlyRevenue || {};
};

// Aylık giderleri getir
export const getMonthlyExpenses = (): Record<string, number> => {
  const statistics = getAllStatistics();
  return statistics.monthlyExpenses || {};
};

// Belirli bir ay için kar/zarar hesapla
export const calculateProfitForMonth = (yearMonth: string): number => {
  const revenue = getMonthlyRevenue()[yearMonth] || 0;
  const expenses = getMonthlyExpenses()[yearMonth] || 0;
  return revenue - expenses;
};

// Tüm aylar için kar/zarar hesapla
export const calculateProfitForAllMonths = (): Record<string, number> => {
  const revenue = getMonthlyRevenue();
  const expenses = getMonthlyExpenses();
  
  const profit: Record<string, number> = {};
  
  // Tüm ayları birleştir
  const allMonths = [...new Set([...Object.keys(revenue), ...Object.keys(expenses)])];
  
  allMonths.forEach(month => {
    profit[month] = (revenue[month] || 0) - (expenses[month] || 0);
  });
  
  return profit;
};

// Toplam geliri hesapla
export const calculateTotalRevenue = (): number => {
  const revenue = getMonthlyRevenue();
  return Object.values(revenue).reduce((total: number, amount: number) => total + amount, 0);
};

// Toplam gideri hesapla
export const calculateTotalExpenses = (): number => {
  const expenses = getMonthlyExpenses();
  return Object.values(expenses).reduce((total: number, amount: number) => total + amount, 0);
};

// Toplam karı hesapla
export const calculateTotalProfit = (): number => {
  return calculateTotalRevenue() - calculateTotalExpenses();
};
