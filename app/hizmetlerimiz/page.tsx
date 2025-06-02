"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wifi, Coffee, Car, Clock, Utensils, MapPin, Bed, Users, ShowerHead, Tv, Check } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "Ücretsiz Wi-Fi",
      description: "Tüm odalarımızda ve ortak alanlarda yüksek hızlı internet",
      icon: <Wifi className="w-5 h-5 text-sage-600" />,
      category: "Konaklama"
    },
    {
      id: 2,
      title: "Merkezi Isıtma",
      description: "Kış aylarında konforlu konaklama için merkezi ısıtma sistemi",
      icon: <Coffee className="w-5 h-5 text-sage-600" />,
      category: "Konaklama"
    },
    {
      id: 3,
      title: "Konforlu Yataklar",
      description: "Kaliteli uyku için özel seçilmiş yataklar",
      icon: <Bed className="w-5 h-5 text-sage-600" />,
      category: "Konaklama"
    },
    {
      id: 4,
      title: "Aile Odaları",
      description: "Aileler ve gruplar için özel tasarlanmış geniş odalar",
      icon: <Users className="w-5 h-5 text-sage-600" />,
      category: "Konaklama"
    },
    {
      id: 5,
      title: "Temiz Banyolar",
      description: "Her gün temizlenen, hijyenik banyo ve tuvaletler",
      icon: <ShowerHead className="w-5 h-5 text-sage-600" />,
      category: "Konaklama"
    },
    {
      id: 6,
      title: "TV",
      description: "Tüm odalarımızda LCD televizyon",
      icon: <Tv className="w-5 h-5 text-sage-600" />,
      category: "Konaklama"
    },
    {
      id: 7,
      title: "Kahvaltı",
      description: "Geleneksel Edirne lezzetlerini içeren zengin açık büfe",
      icon: <Coffee className="w-5 h-5 text-sage-600" />,
      category: "Yiyecek & İçecek"
    },
    {
      id: 8,
      title: "Restoran Önerileri",
      description: "Edirne'nin en iyi restoranları hakkında bilgi ve destek",
      icon: <Utensils className="w-5 h-5 text-sage-600" />,
      category: "Yiyecek & İçecek"
    },
    {
      id: 9,
      title: "Şehir Merkezi Konumu",
      description: "Tarihi Edirne şehir merkezinde, tüm noktalara yakın",
      icon: <MapPin className="w-5 h-5 text-sage-600" />,
      category: "Konum & Ulaşım"
    },
    {
      id: 10,
      title: "Ücretsiz Otopark",
      description: "Misafirlerimiz için pansiyonumuzun yakınında ücretsiz otopark",
      icon: <Car className="w-5 h-5 text-sage-600" />,
      category: "Konum & Ulaşım"
    },
    {
      id: 11,
      title: "24 Saat Resepsiyon",
      description: "Gece gündüz hizmetinizdeyiz. İhtiyaç duyduğunuz her an resepsiyonumuz açık",
      icon: <Clock className="w-5 h-5 text-sage-600" />,
      category: "Konum & Ulaşım"
    }
  ];

  // Kategorilere göre hizmetleri gruplandır
  const categories = [
    "Konaklama",
    "Yiyecek & İçecek",
    "Konum & Ulaşım"
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-sage-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Hizmetlerimiz</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Adalı Pansiyon'da konforunuz ve memnuniyetiniz için sunduğumuz hizmetlerimiz
          </p>
        </div>
      </div>

      {/* Featured Services */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"></div>
          

        
        
        {/* Service Categories */}
        {categories.map((category) => (
          <div key={category} className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-sage-800 mb-2">{category}</h2>
              <div className="w-20 h-1 bg-sage-500 mx-auto"></div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services
                  .filter(service => service.category === category)
                  .map((service) => (
                    <div key={service.id} className="flex items-start p-4 hover:bg-sage-50 rounded-lg transition-colors">
                      <div className="bg-sage-100 p-2 rounded-full mr-4">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-sage-800 mb-1">{service.title}</h3>
                        <p className="text-sm text-sage-600">{service.description}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-sage-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-sage-800">Konaklamanızı Planlamaya Hazır mısınız?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-sage-700">
            Edirne'nin kalbinde, tarihi atmosferi ve modern konforu bir arada sunan Adalı Pansiyon'da yerinizi ayırtın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-sage-600 hover:bg-sage-700 text-white">
              <a href="https://wa.me/2842135527">WhatsApp ile Rezervasyon</a>
            </Button>
            <Button size="lg" variant="outline" className="border-sage-600 text-sage-700 hover:bg-sage-50">
              <Link href="/odalar">Odalarımızı İncele</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
