"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, query, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Reservation } from "@/lib/firebase-models";
import { Expense } from "@/lib/models";
import { getAllReservations, getReservationStatistics } from "@/lib/reservation-service";
import { getAllExpenses, getExpensesByCategory, getTotalExpenses } from "@/lib/expenseService";
import { useAuth } from "@/context/auth-context";
// Admin ve Manager rolleri için sabit değerler
const ADMIN_ROLE = 'ADMIN';
const MANAGER_ROLE = 'MANAGER';
import Unauthorized from "@/components/auth/unauthorized";

export default function StatisticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  
  const router = useRouter();
  // useAuth hook'undan gerekli değerleri alıyoruz
  const { user, hasPermission } = useAuth();

  useEffect(() => {
    // Oturum kontrolü user objesi ile yapılıyor
    if (!user) {
      router.push("/admin");
      return;
    }

    loadReservations();
  }, [router, user]);

  const loadReservations = async () => {
    try {
      const allReservations = await getAllReservations();
      const stats = await getReservationStatistics();
      const allExpenses = getAllExpenses();
      
      setReservations(allReservations);
      setExpenses(allExpenses);
      setIsLoading(false);
      
      // İstatistikleri konsola yazdırarak kontrol edelim
      console.log("Rezervasyon istatistikleri:", stats);
    } catch (error) {
      console.error("Veriler yüklenirken hata:", error);
      toast.error("Veriler yüklenirken bir hata oluştu.");
      setIsLoading(false);
    }
  };

  // Seçilen ay ve yıla göre rezervasyonları filtrele
  const getFilteredReservations = () => {
    return reservations.filter(res => {
      const checkInDate = new Date(res.checkInDate);
      return checkInDate.getFullYear() === selectedYear && checkInDate.getMonth() === selectedMonth;
    });
  };
  
  // Seçilen ay ve yıla göre giderleri filtrele
  const getFilteredExpenses = () => {
    return expenses.filter(exp => {
      const expenseDate = new Date(exp.date);
      return expenseDate.getFullYear() === selectedYear && expenseDate.getMonth() === selectedMonth;
    });
  };
  
  // Gider kategorilerine göre toplam tutarları hesapla
  const getExpenseTotalsByCategory = () => {
    const filteredExpenses = getFilteredExpenses();
    return filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  };
  
  // Toplam gider tutarını hesapla
  const getTotalFilteredExpenses = () => {
    const filteredExpenses = getFilteredExpenses();
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // Kanal bazlı rezervasyon sayılarını hesapla
  const getChannelStats = () => {
    const filteredReservations = getFilteredReservations();
    const channelCounts: Record<string, number> = {};
    const channelRevenue: Record<string, number> = {};
    
    filteredReservations.forEach(res => {
      const channel = res.source || 'Doğrudan';
      channelCounts[channel] = (channelCounts[channel] || 0) + 1;
      channelRevenue[channel] = (channelRevenue[channel] || 0) + res.totalPrice;
    });
    
    return Object.entries(channelCounts).map(([channel, count]) => ({
      channel,
      count,
      revenue: channelRevenue[channel] || 0
    }));
  };

  // Aylık doluluk oranını hesapla
  const getOccupancyRate = () => {
    const filteredReservations = getFilteredReservations();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const roomOccupancy: Record<string, Set<string>> = {};
    
    // Her rezervasyon için, oda ve tarih kombinasyonlarını hesapla
    filteredReservations.forEach(res => {
      try {
        const checkIn = new Date(res.checkInDate);
        const checkOut = new Date(res.checkOutDate);
        
        // Geçersiz tarih kontrolü
        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
          console.warn("Geçersiz tarih değeri:", { checkInDate: res.checkInDate, checkOutDate: res.checkOutDate });
          return; // Bu rezervasyonu atla
        }
        
        // Rezervasyonun bu aydaki günlerini hesapla
        for (let d = new Date(Math.max(checkIn.getTime(), new Date(selectedYear, selectedMonth, 1).getTime()));
             d < new Date(Math.min(checkOut.getTime(), new Date(selectedYear, selectedMonth + 1, 0).getTime()));
             d.setDate(d.getDate() + 1)) {
          
          const dateStr = d.toISOString().split('T')[0];
          if (!roomOccupancy[res.roomId]) {
            roomOccupancy[res.roomId] = new Set();
          }
          roomOccupancy[res.roomId].add(dateStr);
        }
      } catch (error) {
        console.error("Tarih hesaplaması sırasında hata:", error, { reservation: res });
      }
    });
    
    // Toplam oda sayısı
    const roomCount = Object.keys(roomOccupancy).length || 1; // Sıfıra bölme hatasını önlemek için
    
    // Toplam dolu oda-gün sayısı
    const totalOccupiedRoomDays = Object.values(roomOccupancy).reduce((sum, dates) => sum + dates.size, 0);
    
    // Toplam potansiyel oda-gün sayısı
    const totalPotentialRoomDays = roomCount * daysInMonth;
    
    return (totalOccupiedRoomDays / totalPotentialRoomDays) * 100;
  };

  // Toplam geliri hesapla
  const getTotalRevenue = () => {
    const filteredReservations = getFilteredReservations();
    return filteredReservations.reduce((sum, res) => sum + res.totalPrice, 0);
  };

  // Ödeme durumuna göre gelir dağılımını hesapla
  const getPaymentStatusRevenue = () => {
    const filteredReservations = getFilteredReservations();
    const statusRevenue: Record<string, number> = {
      "Ödendi": 0,
      "Kısmi": 0,
      "Bekliyor": 0
    };
    
    filteredReservations.forEach(res => {
      statusRevenue[res.paymentStatus] += res.totalPrice;
    });
    
    return statusRevenue;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  const channelStats = getChannelStats();
  const occupancyRate = getOccupancyRate();
  const totalRevenue = getTotalRevenue();
  const paymentStatusRevenue = getPaymentStatusRevenue();

  // Rol kontrolü
  if (!user || ![ADMIN_ROLE, MANAGER_ROLE].includes(user.role)) {
    return <Unauthorized message="İstatistikler sayfasına erişim için yönetici veya admin yetkisi gereklidir." />;
  }
  
  // İzin kontrolü - ADMIN rolü için izin kontrolünü atlıyoruz
  if (user.role !== ADMIN_ROLE && !hasPermission("view:statistics")) {
    return <Unauthorized message="İstatistikler görüntüleme izniniz bulunmamaktadır." />;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">İstatistikler ve Raporlar</h1>
        <Button onClick={() => router.push("/admin/dashboard")} variant="outline">
          Dashboard'a Dön
        </Button>
      </div>
      
      {/* Tarih Seçici */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tarih Aralığı Seçin</CardTitle>
          <CardDescription>İstatistikleri görüntülemek istediğiniz ay ve yılı seçin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium mb-1">Ay</label>
              <select
                id="month"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                <option value={0}>Ocak</option>
                <option value={1}>Şubat</option>
                <option value={2}>Mart</option>
                <option value={3}>Nisan</option>
                <option value={4}>Mayıs</option>
                <option value={5}>Haziran</option>
                <option value={6}>Temmuz</option>
                <option value={7}>Ağustos</option>
                <option value={8}>Eylül</option>
                <option value={9}>Ekim</option>
                <option value={10}>Kasım</option>
                <option value={11}>Aralık</option>
              </select>
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-1">Yıl</label>
              <select
                id="year"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Toplam Rezervasyon</CardTitle>
            <CardDescription>Bu ayki toplam rezervasyon sayısı</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{getFilteredReservations().length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Doluluk Oranı</CardTitle>
            <CardDescription>Bu ayki doluluk yüzdesi</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{occupancyRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Toplam Gelir</CardTitle>
            <CardDescription>Bu ayki toplam gelir</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalRevenue.toLocaleString('tr-TR')} ₺</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Kanal Bazlı İstatistikler */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Kanal Bazlı Rezervasyonlar</CardTitle>
          <CardDescription>Rezervasyon kanallarına göre dağılım</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Rezervasyon Kanalı</th>
                  <th className="text-center py-2">Rezervasyon Sayısı</th>
                  <th className="text-right py-2">Toplam Gelir</th>
                </tr>
              </thead>
              <tbody>
                {channelStats.length > 0 ? (
                  channelStats.map((stat, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{stat.channel}</td>
                      <td className="text-center py-2">{stat.count}</td>
                      <td className="text-right py-2">{stat.revenue.toLocaleString('tr-TR')} ₺</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4">Bu ay için veri bulunamadı.</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="font-medium">
                  <td className="py-2">Toplam</td>
                  <td className="text-center py-2">{getFilteredReservations().length}</td>
                  <td className="text-right py-2">{totalRevenue.toLocaleString('tr-TR')} ₺</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ödeme Durumu İstatistikleri */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ödeme Durumu İstatistikleri</CardTitle>
          <CardDescription>Seçilen ay ve yıla göre ödeme durumu dağılımı</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Ödeme Durumu</th>
                  <th className="text-right py-2">Toplam Tutar</th>
                  <th className="text-right py-2">Yüzde</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Ödendi</td>
                  <td className="text-right py-2">{paymentStatusRevenue.Ödendi.toLocaleString('tr-TR')} ₺</td>
                  <td className="text-right py-2">
                    {totalRevenue ? ((paymentStatusRevenue.Ödendi / totalRevenue) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Kısmi Ödeme</td>
                  <td className="text-right py-2">{paymentStatusRevenue.Kısmi.toLocaleString('tr-TR')} ₺</td>
                  <td className="text-right py-2">
                    {totalRevenue ? ((paymentStatusRevenue.Kısmi / totalRevenue) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Bekleyen Ödeme</td>
                  <td className="text-right py-2">{paymentStatusRevenue.Bekliyor.toLocaleString('tr-TR')} ₺</td>
                  <td className="text-right py-2">
                    {totalRevenue ? ((paymentStatusRevenue.Bekliyor / totalRevenue) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="font-medium">
                  <td className="py-2">Toplam</td>
                  <td className="text-right py-2">{totalRevenue.toLocaleString('tr-TR')} ₺</td>
                  <td className="text-right py-2">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Gider İstatistikleri */}
      <Card className="mb-6 border-sage-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-red-50 to-white pb-4">
          <CardTitle className="text-red-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
              <path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
              <path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
            </svg>
            Gider İstatistikleri
          </CardTitle>
          <CardDescription>Seçilen ay ve yıla göre gider dağılımı</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Gider Kategorisi</th>
                  <th className="text-right py-2">Toplam Tutar</th>
                  <th className="text-right py-2">Yüzde</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(getExpenseTotalsByCategory()).length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      Seçilen dönem için gider kaydı bulunmamaktadır.
                    </td>
                  </tr>
                ) : (
                  Object.entries(getExpenseTotalsByCategory()).map(([category, amount]) => {
                    const totalExpenses = getTotalFilteredExpenses();
                    const percentage = totalExpenses ? ((amount / totalExpenses) * 100).toFixed(1) : 0;
                    
                    return (
                      <tr key={category} className="border-b">
                        <td className="py-2">{category}</td>
                        <td className="text-right py-2">{amount.toLocaleString('tr-TR')} ₺</td>
                        <td className="text-right py-2">{percentage}%</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              <tfoot>
                <tr className="font-medium">
                  <td className="py-2">Toplam</td>
                  <td className="text-right py-2">{getTotalFilteredExpenses().toLocaleString('tr-TR')} ₺</td>
                  <td className="text-right py-2">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
