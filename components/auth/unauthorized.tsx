"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

interface UnauthorizedProps {
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export default function Unauthorized({
  message = "Bu sayfaya erişim yetkiniz bulunmamaktadır.",
  showBackButton = true,
  showHomeButton = true,
}: UnauthorizedProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-red-700 mb-2">Yetkisiz Erişim</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showBackButton && (
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="border-red-200 hover:bg-red-50 text-red-700"
            >
              Geri Dön
            </Button>
          )}
          {showHomeButton && (
            <Button 
              onClick={() => router.push("/admin/dashboard")}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ana Panele Git
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
