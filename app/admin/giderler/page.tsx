"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Expense } from "@/lib/models";
import { getAllExpenses, addExpense, deleteExpense } from "@/lib/expenseService";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types/auth";
import RoleGate from "@/components/auth/role-gate";
import Unauthorized from "@/components/auth/unauthorized";
import PermissionGate from "@/components/auth/permission-gate";

export default function ExpensesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Diğer",
    date: new Date().toISOString().split('T')[0],
    description: "",
    paymentMethod: "Nakit",
    receiptNumber: ""
  });

  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin");
      return;
    }

    loadExpenses();
  }, [router, isAuthenticated]);

  const loadExpenses = () => {
    try {
      const allExpenses = getAllExpenses();
      setExpenses(allExpenses);
      setIsLoading(false);
    } catch (error) {
      console.error("Giderler yüklenirken hata:", error);
      toast.error("Giderler yüklenirken bir hata oluştu.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasyon
    if (!formData.title.trim()) {
      toast.error("Lütfen gider başlığını girin.");
      return;
    }
    
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      toast.error("Lütfen geçerli bir tutar girin.");
      return;
    }

    try {
      // Gider ekle
      addExpense({
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category as any,
        date: formData.date,
        description: formData.description,
        paymentMethod: formData.paymentMethod as any,
        receiptNumber: formData.receiptNumber
      });

      // Formu sıfırla
      setFormData({
        title: "",
        amount: "",
        category: "Diğer",
        date: new Date().toISOString().split('T')[0],
        description: "",
        paymentMethod: "Nakit",
        receiptNumber: ""
      });

      // Giderleri yeniden yükle
      loadExpenses();
      toast.success("Gider başarıyla eklendi.");
    } catch (error) {
      console.error("Gider eklenirken hata:", error);
      toast.error("Gider eklenirken bir hata oluştu.");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bu gideri silmek istediğinizden emin misiniz?")) {
      try {
        deleteExpense(id);
        loadExpenses();
        toast.success("Gider başarıyla silindi.");
      } catch (error) {
        console.error("Gider silinirken hata:", error);
        toast.error("Gider silinirken bir hata oluştu.");
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Geçersiz tarih kontrolü
      if (isNaN(date.getTime())) {
        return dateString; // Geçersiz tarih ise orijinal string'i döndür
      }
      
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Tarih formatlanırken hata:", error);
      return dateString; // Hata durumunda orijinal string'i döndür
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <RoleGate
      allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}
      fallback={<Unauthorized message="Giderler sayfasına erişim için yönetici veya admin yetkisi gereklidir." />}
    >
      <PermissionGate
        permissionNeeded="manage:expenses"
        fallback={<Unauthorized message="Gider yönetimi izniniz bulunmamaktadır." />}
      >
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gider Yönetimi</h1>
            <Button onClick={() => router.push("/admin/dashboard")} variant="outline">
              Dashboard'a Dön
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gider Ekleme Formu */}
            <Card className="lg:col-span-1 border-sage-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-sage-50 to-white pb-4">
                <CardTitle className="text-sage-800">Yeni Gider Ekle</CardTitle>
                <CardDescription>Pansiyon giderlerini buradan ekleyebilirsiniz.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Gider Başlığı</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Gider başlığını girin"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Tutar (₺)</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Personel">Personel</SelectItem>
                        <SelectItem value="Elektrik">Elektrik</SelectItem>
                        <SelectItem value="Su">Su</SelectItem>
                        <SelectItem value="Doğalgaz">Doğalgaz</SelectItem>
                        <SelectItem value="İnternet">İnternet</SelectItem>
                        <SelectItem value="Temizlik">Temizlik</SelectItem>
                        <SelectItem value="Bakım">Bakım</SelectItem>
                        <SelectItem value="Gıda">Gıda</SelectItem>
                        <SelectItem value="Diğer">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Tarih</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Ödeme Yöntemi</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ödeme yöntemi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nakit">Nakit</SelectItem>
                        <SelectItem value="Kredi Kartı">Kredi Kartı</SelectItem>
                        <SelectItem value="Banka Transferi">Banka Transferi</SelectItem>
                        <SelectItem value="Diğer">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receiptNumber">Fiş/Fatura No</Label>
                    <Input
                      id="receiptNumber"
                      name="receiptNumber"
                      value={formData.receiptNumber}
                      onChange={handleInputChange}
                      placeholder="Fiş/Fatura numarası (opsiyonel)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Gider hakkında detaylı açıklama (opsiyonel)"
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Gider Ekle
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Gider Listesi */}
            <Card className="lg:col-span-2 border-sage-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-sage-50 to-white pb-4">
                <CardTitle className="text-sage-800">Gider Listesi</CardTitle>
                <CardDescription>Son eklenen giderler burada listelenir.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Başlık</th>
                        <th className="text-left py-3 px-2">Kategori</th>
                        <th className="text-left py-3 px-2">Tarih</th>
                        <th className="text-right py-3 px-2">Tutar</th>
                        <th className="text-right py-3 px-2">İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-gray-500">
                            Henüz gider kaydı bulunmamaktadır.
                          </td>
                        </tr>
                      ) : (
                        expenses.map((expense) => (
                          <tr key={expense.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2">
                              <div className="font-medium">{expense.title}</div>
                              {expense.description && (
                                <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                  {expense.description}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-2">
                              <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100">
                                {expense.category}
                              </span>
                            </td>
                            <td className="py-3 px-2">{formatDate(expense.date)}</td>
                            <td className="py-3 px-2 text-right font-medium">
                              {expense.amount.toLocaleString('tr-TR')} ₺
                            </td>
                            <td className="py-3 px-2 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(expense.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                Sil
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PermissionGate>
    </RoleGate>
  );
}
