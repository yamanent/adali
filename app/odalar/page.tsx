"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Users, Bed, Eye, Wifi, Coffee, Tv, Wind, Scissors, Droplet, ShowerHead, KeyRound, Refrigerator } from "lucide-react";
import { useState } from "react";
import { ImageLightbox } from "@/components/image-lightbox";

export default function OdalarSayfasi() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    setLightboxOpen(true);
  };
  
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

  const odalar = [
    {
      name: "Grup Odası",
      slug: "grup-odasi",
      capacity: 3,
      bedType: "Tek Kişilik Yataklar",
      view: "Şehir Manzarası",
      features: ["Özel Banyo", "Wi-Fi", "TV"],
      description: "Özel banyolu konforlu grup odamız.",
      images: ["/253421065.jpg?height=400&width=600"],
    },
    {
      name: "Çift ve İkili Odalar",
      slug: "cift-ve-ikili-odalar",
      capacity: 2,
      bedType: "Çift Kişilik Yatak",
      view: "Şehir Manzarası",
      features: ["Ortak Banyo", "Wi-Fi", "TV"],
      description: "Çiftler veya arkadaşlar için ideal odalar.",
      images: ["/227666993.jpg?height=400&width=600"],
    },
    {
      name: "Ekonomik Oda",
      slug: "ekonomik-oda",
      capacity: 2,
      bedType: "Çift Kişilik Yatak",
      view: "Şehir Manzarası",
      features: ["Ortak Banyo", "Wi-Fi", "TV"],
      description: "Bütçe dostu konaklama seçeneği.",
      images: ["/227667008.jpg?height=400&width=600"],
    }
  ];

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "TV":
        return <Tv className="w-4 h-4" />
      case "Wi-Fi":
        return <Wifi className="w-4 h-4" />
      case "Havlu & Terlik":
        return <Wind className="w-4 h-4" />
      case "Saç Kurutma Makinesi":
        return <Wind className="w-4 h-4" />
      case "Şampuan":
        return <Droplet className="w-4 h-4" />
      case "Isıtıcı":
        return <Wind className="w-4 h-4" />
      case "Kasa":
        return <KeyRound className="w-4 h-4" />
      case "Balkon":
        return <Eye className="w-4 h-4" />
      case "Oturma Alanı":
        return <Users className="w-4 h-4" />
      case "Özel Banyo":
        return <ShowerHead className="w-4 h-4" />
      case "Ortak Banyo":
        return <ShowerHead className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-sage-800 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/texture-bg.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Odalarımız</h1>
          <div className="h-1 w-20 bg-cream-400 mx-auto mb-6"></div>
          <p className="text-xl text-sage-200 max-w-2xl mx-auto leading-relaxed">
            Konfor ve huzurun buluştuğu odalarımızda unutulmaz bir konaklama deneyimi yaşayın
          </p>
        </div>
      </section>

      {/* Rooms Categories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* Group Room */}
            <Card className="overflow-hidden border border-sage-200/60 rounded-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={odalar.find(oda => oda.slug === "grup-odasi")?.images[0] || "/253421065.jpg"} 
                  alt="Grup Odası" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" 
                  onClick={() => openLightbox(odalar.find(oda => oda.slug === "grup-odasi")?.images[0] || "/253421065.jpg")}
                />
                <Badge className="absolute top-3 right-3 bg-sage-700 text-white py-1 px-3 z-10">
                  Özel Banyo
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-sage-800 font-bold">Grup Odaları (3-6 Kişilik)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sage-600 leading-relaxed">Arkadaş grupları ve aileler için uygun odalar. Özel veya ortak banyo seçenekleriyle mevcuttur. Özel banyolu odalar: 201, 202, 302. Ortak banyolu odalar: 203, 301, 303, 403.</p>

                <div className="grid grid-cols-2 gap-4 text-sm bg-sage-50/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-sage-700">
                    <Users className="w-4 h-4 text-sage-600" />
                    <span className="font-medium">3-6 Kişi</span>
                  </div>
                  <div className="flex items-center gap-2 text-sage-700">
                    <Bed className="w-4 h-4 text-sage-600" />
                    <span className="font-medium">Çoklu Yatak</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Özel Banyo")}
                      <span className="font-medium">Özel Banyo</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Ortak Banyo")}
                      <span className="font-medium">Ortak Banyo</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Wi-Fi")}
                      <span className="font-medium">Wi-Fi</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("TV")}
                      <span className="font-medium">TV</span>
                    </span>
                  </Badge>
                </div>

                <div className="mt-6 pt-5 border-t border-sage-200/70">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                      <Link href="/odalar/grup-odasi" className="w-full">
                        <Button variant="outline" className="w-full border-sage-600 text-sage-600 hover:bg-sage-50 hover:border-sage-700 font-medium px-5 rounded-md">
                          <Eye className="w-4 h-4 mr-2" /> Odayı Görüntüle
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Double and Twin Room */}
            <Card className="overflow-hidden border border-sage-200/60 rounded-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={odalar.find(oda => oda.slug === "cift-ve-ikili-odalar")?.images[0] || "/227666993.jpg"} 
                  alt="Çift ve İkili Oda" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" 
                  onClick={() => openLightbox(odalar.find(oda => oda.slug === "cift-ve-ikili-odalar")?.images[0] || "/227666993.jpg")}
                />
                <Badge className="absolute top-3 right-3 bg-sage-700 text-white py-1 px-3 z-10">
                  Özel Banyo
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-sage-800 font-bold">Çift ve İkili Odalar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sage-600 leading-relaxed">2 kişilik odalar (çiftler veya ikili konaklama). Özel veya ortak banyo seçenekleriyle mevcuttur. Özel banyolu odalar: 205, 305, 405. Ortak banyolu odalar: 204, 304, 404.</p>

                <div className="grid grid-cols-2 gap-4 text-sm bg-sage-50/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-sage-700">
                    <Users className="w-4 h-4 text-sage-600" />
                    <span className="font-medium">2 Kişi</span>
                  </div>
                  <div className="flex items-center gap-2 text-sage-700">
                    <Bed className="w-4 h-4 text-sage-600" />
                    <span className="font-medium">Çift Kişilik Yatak</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Özel Banyo")}
                      <span className="font-medium">Özel Banyo</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Ortak Banyo")}
                      <span className="font-medium">Ortak Banyo</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Wi-Fi")}
                      <span className="font-medium">Wi-Fi</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("TV")}
                      <span className="font-medium">TV</span>
                    </span>
                  </Badge>
                </div>

                <div className="mt-6 pt-5 border-t border-sage-200/70">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                      <Link href="/odalar/cift-ve-ikili-odalar" className="w-full">
                        <Button variant="outline" className="w-full border-sage-600 text-sage-600 hover:bg-sage-50 hover:border-sage-700 font-medium px-5 rounded-md">
                          <Eye className="w-4 h-4 mr-2" /> Odayı Görüntüle
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Economy Room */}
            <Card className="overflow-hidden border border-sage-200/60 rounded-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={odalar.find(oda => oda.slug === "ekonomik-oda")?.images[0] || "/227667008.jpg"} 
                  alt="Ekonomik Oda" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" 
                  onClick={() => openLightbox(odalar.find(oda => oda.slug === "ekonomik-oda")?.images[0] || "/227667008.jpg")}
                />
                <Badge className="absolute top-3 right-3 bg-sage-700 text-white py-1 px-3 z-10">
                  Ortak Banyo
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-sage-800 font-bold">Ekonomik Odalar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sage-600 leading-relaxed">Bütçe dostu konaklama seçenekleri. Tüm ekonomik odalarımız ortak banyo kullanımı ile sunulmaktadır. Odalar: 203, 204, 301, 303, 304, 403, 404.</p>

                <div className="grid grid-cols-2 gap-4 text-sm bg-sage-50/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-sage-700">
                    <Users className="w-4 h-4 text-sage-600" />
                    <span className="font-medium">2-6 Kişi</span>
                  </div>
                  <div className="flex items-center gap-2 text-sage-700">
                    <Bed className="w-4 h-4 text-sage-600" />
                    <span className="font-medium">Çeşitli Yatak Tipleri</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Ortak Banyo")}
                      <span className="font-medium">Ortak Banyo</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Wi-Fi")}
                      <span className="font-medium">Wi-Fi</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("TV")}
                      <span className="font-medium">TV</span>
                    </span>
                  </Badge>
                </div>

                <div className="mt-6 pt-5 border-t border-sage-200/70">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                      <Link href="/odalar/ekonomik-oda" className="w-full">
                        <Button variant="outline" className="w-full border-sage-600 text-sage-600 hover:bg-sage-50 hover:border-sage-700 font-medium px-5 rounded-md">
                          <Eye className="w-4 h-4 mr-2" /> Odayı Görüntüle
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* All Rooms Grid */}
      

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          isOpen={lightboxOpen}
          imageUrl={lightboxImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}