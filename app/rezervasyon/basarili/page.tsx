"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ReservationSuccessPage() {
  const router = useRouter();
  const { isAuthenticated, isGuest, user } = useAuth();
  
  // Kullanıcı girişi kontrolü
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/giris");
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return null; // useEffect içinde yönlendirme yapılıyor
  }
  
  // Rastgele bir rezervasyon numarası oluştur
  const reservationNumber = `ADP-${Math.floor(100000 + Math.random() * 900000)}`;
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-lg mx-auto">
        <Card className="border-sage-200 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-sage-800">Rezervasyon Başarılı!</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Rezervasyonunuz başarıyla oluşturuldu. Rezervasyon detaylarınız e-posta adresinize gönderilecektir.
            </p>
            
            <div className="bg-sage-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Rezervasyon Numaranız</p>
              <p className="text-xl font-bold text-sage-700">{reservationNumber}</p>
            </div>
            
            {isGuest && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left">
                <p className="text-blue-700">
                  <span className="font-bold">Sayın {user?.displayName},</span> misafir hesabınızla yaptığınız rezervasyon kaydedildi.
                  Rezervasyon detaylarınıza <span className="font-medium">{user?.email}</span> adresinden ulaşabilirsiniz.
                </p>
              </div>
            )}
            
            <div className="pt-4">
              <p className="text-sm text-gray-500">
                Rezervasyonunuzla ilgili herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin.
              </p>
              <p className="text-sm font-medium text-sage-600">+90 (555) 123 4567</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              onClick={() => router.push("/")} 
              className="w-full bg-sage-600 hover:bg-sage-700"
            >
              Ana Sayfaya Dön
            </Button>
            
            {isGuest && (
              <Button 
                variant="outline" 
                onClick={() => router.push("/rezervasyon")} 
                className="w-full"
              >
                Yeni Rezervasyon Yap
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
