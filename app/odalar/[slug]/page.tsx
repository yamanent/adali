"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Bed, Eye, Wifi, Coffee, ArrowLeft, Phone, Mail, Tv, ShowerHead, Wind, Droplet } from "lucide-react";
import { RoomImageSlider } from "@/components/room-image-slider";
import React from "react";
const { use } = React;

// Türkçe karakter ve boşlukları URL'ye uygun hale getiren yardımcı fonksiyon
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Boşlukları tire ile değiştir
    .replace(/[ğ]/g, 'g')           // Türkçe karakterleri değiştir
    .replace(/[ü]/g, 'u')
    .replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i')
    .replace(/[ö]/g, 'o')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9-]/g, '')     // Alfanümerik ve tire dışındaki karakterleri kaldır
    .replace(/-+/g, '-')            // Birden fazla tireyi tek tireye indir
    .replace(/^-+/, '')             // Baştaki tireleri kaldır
    .replace(/-+$/, '');            // Sondaki tireleri kaldır
};

// Room data (in a real application, this would come from a database)
const rooms = [
  {
    name: "Grup Odası (Özel Banyo)",
    slug: "grup-odasi",
    capacity: 3,
    bedType: "Tek Kişilik Yataklar",
    view: "Şehir Manzarası",
    features: ["Özel Banyo", "Wi-Fi", "TV"],
    description: "Özel banyolu konforlu grup odamız.",
    longDescription: "Özel banyolu grup odamız, 3 kişilik gruplar için ideal bir konaklama seçeneği sunmaktadır. Odamızda bulunan üç adet tek kişilik yatak, arkadaş grupları veya küçük aileler için mükemmel bir seçimdir. Özel banyosu sayesinde konforlu bir konaklama deneyimi yaşayabilirsiniz. Odamız temel konfor ihtiyaçlarınızı karşılayacak şekilde tasarlanmıştır.",
    images: [
      "/227667008.jpg?height=600&width=800",
      "/227668163.jpg?height=600&width=800&text=Şehir+Manzarası",
      "/253588689.jpg?height=600&width=800&text=Oda",
      "/253588829.jpg?height=600&width=800&text=Oda",
      "/253588949.jpg?height=600&width=800&text=Oda",
      "/253587577.jpg?height=600&width=800&text=Oda"
    ],
    amenities: ["Ücretsiz Wi-Fi", "LCD TV", "Saç Kurutma Makinesi", "Havlu", "Özel Banyo", "Şehir Manzarası", "Uydu Yayını"]
  },
  
  {
    name: "Ekonomik Oda",
    slug: "ekonomik-oda",
    capacity: 2,
    bedType: "Çift Kişilik Yatak",
    view: "Şehir Manzarası",
    features: ["Ortak Banyo", "Wi-Fi", "TV"],
    description: "Ortak banyolu, çift kişilik ekonomik oda.",
    longDescription: "Ortak banyolu ekonomik odamız, çiftler için uygun fiyatlı bir konaklama seçeneği sunmaktadır. Odamızda bulunan bir adet çift kişilik yatak, çiftler için konforlu bir konaklama imkanı sağlar. Koridorda bulunan ortak banyoyu kullanarak ekonomik bir konaklama deneyimi yaşayabilirsiniz. Odamız temel konfor ihtiyaçlarınızı karşılayacak şekilde tasarlanmıştır.",
    images: [
      "/227667320.jpg?height=600&width=800",
      "/227668163.jpg?height=600&width=800&text=Şehir+Manzarası",
      "/253588689.jpg?height=600&width=800&text=Oda",
      "/253588829.jpg?height=600&width=800&text=Oda",
      "/253588949.jpg?height=600&width=800&text=Oda",
      "/253587577.jpg?height=600&width=800&text=Oda"
    ],
    amenities: ["Ücretsiz Wi-Fi", "LCD TV", "Saç Kurutma Makinesi", "Havlu", "Ortak Banyo", "Şehir Manzarası", "Uydu Yayını"]
  },
  {
    name: "Çift ve İkili Odalar",
    slug: "cift-ve-ikili-odalar",
    capacity: 2,
    bedType: "Çift Kişilik Yatak",
    view: "Şehir Manzarası",
    features: ["Ortak Banyo", "Wi-Fi", "TV"],
    description: "Ortak banyolu, 3 kişilik ekonomik grup odası.",
    longDescription: "Ortak banyolu grup odamız, 3 kişilik gruplar için ekonomik bir konaklama seçeneği sunmaktadır. Odamızda bulunan üç adet tek kişilik yatak, arkadaş grupları veya küçük aileler için idealdir. Koridorda bulunan ortak banyoyu kullanarak ekonomik bir konaklama deneyimi yaşayabilirsiniz. Odamız temel konfor ihtiyaçlarınızı karşılayacak şekilde tasarlanmıştır.",
    images: [
      "/227667320.jpg?height=600&width=800",
      "/227668163.jpg?height=600&width=800&text=Şehir+Manzarası",
      "/253588689.jpg?height=600&width=800&text=Oda",
      "/253588829.jpg?height=600&width=800&text=Oda",
      "/253588949.jpg?height=600&width=800&text=Oda",
      "/253587577.jpg?height=600&width=800&text=Oda"
    ],
    amenities: ["Ücretsiz Wi-Fi", "LCD TV", "Saç Kurutma Makinesi", "Havlu", "Ortak Banyo", "Şehir Manzarası", "Uydu Yayını"]
  }
];

// Helper function to get feature icon
const getFeatureIcon = (feature: string) => {
  switch (feature) {
    case "Wi-Fi":
      return <Wifi className="w-4 h-4" />;
    case "TV":
      return <Tv className="w-4 h-4" />;
    case "Özel Banyo":
      return <ShowerHead className="w-4 h-4" />;
    case "Ortak Banyo":
      return <ShowerHead className="w-4 h-4" />;
    case "Havlu & Terlik":
      return <Droplet className="w-4 h-4" />;
    case "Saç Kurutma Makinesi":
      return <Wind className="w-4 h-4" />;
    case "Şampuan":
      return <Droplet className="w-4 h-4" />;
    case "Isıtıcı":
      return <Coffee className="w-4 h-4" />;
    default:
      return <Coffee className="w-4 h-4" />;
  }
};

export default function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params with React.use()
  const resolvedParams = use(params);
  
  // Find the room with the matching slug
  const roomSlug = resolvedParams.slug;
  const room = rooms.find((r) => r.slug === roomSlug);

  // If room not found, return 404
  if (!room) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-sage-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link href="/odalar" className="flex items-center text-sage-200 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Tüm Odalar</span>
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{room.name}</h1>
          {/* Fiyat bilgisi kaldırıldı */}
        </div>
      </section>

      {/* Room Gallery and Price Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Room Gallery */}
            <div className="lg:col-span-2">
              <RoomImageSlider images={room.images} roomName={room.name} />
            </div>
            
            {/* Right Column - Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md border border-sage-100 sticky top-4">
                <h3 className="text-2xl font-bold text-sage-800 mb-4">İletişim Bilgileri</h3>
                
                <div className="space-y-4 mb-6 border-t border-sage-200 pt-4">
                  <div className="flex items-center gap-3 text-sage-700">
                    <Phone className="w-5 h-5 text-sage-600" />
                    <a href="tel:02842135527" className="hover:text-sage-800 transition-colors">
                      0(284) 213 5527
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sage-700">
                    <Mail className="w-5 h-5 text-sage-600" />
                    <a href="mailto:bilgi@adalipansiyonedirne.com" className="hover:text-sage-800 transition-colors">
                      bilgi@adalipansiyonedirne.com
                    </a>
                  </div>
                </div>
                
                <Link href="/iletisim" passHref>
                  <Button className="w-full bg-sage-600 hover:bg-sage-700 text-white text-lg py-6">
                    Bize Ulaşın
                  </Button>
                </Link>

                <p className="text-center text-sage-500 text-sm mt-4">
                  * Rezervasyon için lütfen iletişime geçiniz
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Details */}
      <section className="py-12 bg-sage-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Room Details */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md border border-sage-100 mb-8">
                <h3 className="text-2xl font-bold text-sage-800 mb-4">Oda Detayları</h3>
                <p className="text-sage-600 leading-relaxed mb-6">{room.longDescription}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-sage-50 p-4 rounded-md border border-sage-100">
                    <h4 className="font-semibold text-sage-800 mb-2">Oda Bilgileri</h4>
                    <ul className="space-y-2 text-sage-600">
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-sage-500" />
                        <span>Kapasite: {room.capacity} kişi</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-sage-500" />
                        <span>Yatak Tipi: {room.bedType}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-sage-500" />
                        <span>Manzara: {room.view}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-sage-50 p-4 rounded-md border border-sage-100">
                    <h4 className="font-semibold text-sage-800 mb-2">Oda Özellikleri</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="bg-sage-100 text-sage-700 py-1 px-2 rounded-full border border-sage-200/50">
                          <span className="flex items-center gap-1.5">
                            {getFeatureIcon(feature)}
                            <span>{feature}</span>
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-sage-100">
                <h3 className="text-2xl font-bold text-sage-800 mb-4">Oda Olanakları</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {room.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sage-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-sage-500"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Other Rooms */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md border border-sage-100 sticky top-4">
                <h3 className="text-2xl font-bold text-sage-800 mb-4">Diğer Odalarımız</h3>
                <div className="space-y-4">
                  {rooms
                    .filter(r => r.slug !== room.slug)
                    .slice(0, 3)
                    .map((otherRoom) => (
                      <Link key={otherRoom.slug} href={`/odalar/${otherRoom.slug}`}>
                        <div className="group flex gap-3 p-2 rounded-md hover:bg-sage-50 transition-colors">
                          <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                            <Image 
                              src={otherRoom.images[0]} 
                              alt={otherRoom.name} 
                              fill 
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-sage-800 group-hover:text-sage-600 transition-colors">{otherRoom.name}</h4>
                            <p className="text-sm text-sage-600">{otherRoom.capacity} kişilik</p>
                            <div className="flex items-center gap-1 text-xs text-sage-500 mt-1">
                              <span className="flex items-center gap-0.5">
                                <Users className="w-3 h-3" />
                                {otherRoom.capacity}
                              </span>
                              <span>•</span>
                              <span>{otherRoom.features.includes("Özel Banyo") ? "Özel Banyo" : "Ortak Banyo"}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-sage-200">
                  <Link href="/odalar">
                    <Button variant="outline" className="w-full border-sage-600 text-sage-600 hover:bg-sage-50 hover:text-sage-700">
                      Tüm Odaları Görüntüle
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
