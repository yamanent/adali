"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hata loglaması yapılabilir
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="relative w-40 h-40 mx-auto mb-6">
          <Image
            src="/adali.svg"
            alt="Adalı Pansiyon Logo"
            fill
            className="object-contain"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-sage-800 mb-4">Bir Şeyler Yanlış Gitti</h1>
        <p className="text-sage-600 mb-8">
          Üzgünüz, bir hata oluştu. Lütfen tekrar deneyin veya daha sonra tekrar ziyaret edin.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => reset()}
            size="lg" 
            className="bg-sage-600 hover:bg-sage-700 text-white"
          >
            <RefreshCcw className="w-5 h-5 mr-2" /> Tekrar Dene
          </Button>
          
          <Button asChild variant="outline" size="lg" className="border-sage-600 text-sage-600">
            <Link href="/" className="flex items-center">
              <Home className="w-5 h-5 mr-2" /> Ana Sayfaya Dön
            </Link>
          </Button>
        </div>
        
        <div className="text-sage-500 text-sm mt-8">
          <p>Sorun devam ederse, lütfen bize <Link href="/iletisim" className="text-sage-600 underline hover:text-sage-700">iletişim sayfamızdan</Link> bildirin.</p>
        </div>
      </div>
    </div>
  );
}
