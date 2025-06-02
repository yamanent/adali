"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone, MessageCircle, Mail, Globe, Menu, X } from "lucide-react"

export default function MobileQuickAccess() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Mevcut dilin İngilizce olup olmadığını kontrol et
    setIsEnglish(pathname.startsWith('/en'));
  }, [pathname]);

  // Dil değiştirme fonksiyonu
  const toggleLanguage = () => {
    // Mevcut yolu al ve dil değişikliğine göre yeni yolu oluştur
    let newPath = '';
    if (isEnglish) {
      // İngilizceden Türkçeye geçiş
      newPath = pathname.replace(/^\/en/, '');
      if (newPath === '') newPath = '/';
    } else {
      // Türkçeden İngilizceye geçiş
      newPath = `/en${pathname}`;
    }
    
    // Sayfayı yeni yola yönlendir (client-side navigation)
    window.location.href = newPath;
  };
  
  // Menü öğelerini dile göre ayarla
  const menuItems = isEnglish ? {
    home: "Home",
    rooms: "Rooms",
    services: "Services",
    gallery: "Gallery",
    contact: "Contact",
    menu: "Menu",
    call: "Call",
    switchLang: "Türkçe"
  } : {
    home: "Ana Sayfa",
    rooms: "Odalar",
    services: "Hizmetler",
    gallery: "Galeri",
    contact: "İletişim",
    menu: "Menü",
    call: "Ara",
    switchLang: "English"
  };

  // CSS sınıflarını dinamik olarak oluştur
  const menuClasses = `absolute bottom-full left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 shadow-lg transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 md:hidden z-50">
      <div className={menuClasses}>
        <div className="grid grid-cols-2 gap-4">
          <Link href={isEnglish ? "/en" : "/"} className="flex flex-col items-center text-sage-800 p-3 rounded-lg hover:bg-sage-50 transition-colors">
            <span>{menuItems.home}</span>
          </Link>
          <Link href={isEnglish ? "/en/odalar" : "/odalar"} className="flex flex-col items-center text-sage-800 p-3 rounded-lg hover:bg-sage-50 transition-colors">
            <span>{menuItems.rooms}</span>
          </Link>
          <Link href={isEnglish ? "/en/hizmetlerimiz" : "/hizmetlerimiz"} className="flex flex-col items-center text-sage-800 p-3 rounded-lg hover:bg-sage-50 transition-colors">
            <span>{menuItems.services}</span>
          </Link>
          <Link href={isEnglish ? "/en/galeri" : "/galeri"} className="flex flex-col items-center text-sage-800 p-3 rounded-lg hover:bg-sage-50 transition-colors">
            <span>{menuItems.gallery}</span>
          </Link>
          <Link href={isEnglish ? "/en/iletisim" : "/iletisim"} className="flex flex-col items-center text-sage-800 p-3 rounded-lg hover:bg-sage-50 transition-colors">
            <span>{menuItems.contact}</span>
          </Link>
          <button 
            onClick={toggleLanguage}
            className="flex flex-col items-center text-sage-800 p-3 rounded-lg hover:bg-sage-50 transition-colors"
          >
            <span>{menuItems.switchLang}</span>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link href="tel:02842135527" className="flex flex-col items-center text-sage-800">
          <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center mb-1 hover:bg-sage-200 transition-colors">
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-xs">{menuItems.call}</span>
        </Link>
        
        <Link href="https://wa.me/02842135527" className="flex flex-col items-center text-sage-800">
          <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center mb-1 hover:bg-sage-200 transition-colors">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-xs">WhatsApp</span>
        </Link>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col items-center text-sage-800"
        >
          <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center mb-1 hover:bg-sage-200 transition-all transform active:scale-95">
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </div>
          <span className="text-xs">{menuItems.menu}</span>
        </button>
        
        <button 
          onClick={toggleLanguage}
          className="flex flex-col items-center text-sage-800"
        >
          <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center mb-1 hover:bg-sage-200 transition-all transform active:scale-95">
            <Globe className="w-5 h-5" />
          </div>
          <span className="text-xs">{isEnglish ? 'TR' : 'EN'}</span>
        </button>
      </div>
    </div>
  )
}
