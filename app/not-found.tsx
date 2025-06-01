import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
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
        
        <h1 className="text-6xl font-bold text-sage-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-sage-700 mb-4">Sayfa Bulunamadı</h2>
        <p className="text-sage-600 mb-8">
          Aradığınız sayfa taşınmış, kaldırılmış veya hiç var olmamış olabilir.
        </p>
        
        <div className="space-y-4">
          <Button asChild size="lg" className="bg-sage-600 hover:bg-sage-700 text-white">
            <Link href="/" className="flex items-center">
              <Home className="w-5 h-5 mr-2" /> Ana Sayfaya Dön
            </Link>
          </Button>
          
          <div className="text-sage-500 text-sm mt-8">
            <p>Yardıma mı ihtiyacınız var?</p>
            <p>Bize <Link href="/iletisim" className="text-sage-600 underline hover:text-sage-700">iletişim sayfamızdan</Link> ulaşabilirsiniz.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
