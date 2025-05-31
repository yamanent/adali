import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cake, PartyPopper, Users, CalendarDays, Music, Utensils, Camera, Gift, HeartHandshake } from "lucide-react"

export default function OrganizasyonPage() {
  const events = [
    {
      id: 1,
      name: "Doğum Günü Kutlaması",
      price: "₺2500'den başlayan fiyatlarla",
      capacity: "10-50 kişi",
      icon: Cake,
      features: ["Özel Dekorasyon", "Doğum Günü Pastası", "İkramlar", "Müzik Sistemi", "Fotoğraf Çekimi"],
      description: "Sevdiklerinizle birlikte unutulmaz bir doğum günü kutlaması için özel hazırlanmış paketimiz. Pansiyonumuzun sıcak atmosferinde, şehir manzaralı salonumuzda doğum gününüzü kutlayın.",
      images: ["/birthday.jpg"],
    },
    {
      id: 2,
      name: "Özel Etkinlikler",
      price: "₺3500'den başlayan fiyatlarla",
      capacity: "20-80 kişi",
      icon: PartyPopper,
      features: ["Profesyonel Organizasyon", "İkram Seçenekleri", "Dekorasyon", "Ses ve Işık Sistemi", "Fotoğraf ve Video Çekimi"],
      description: "Nişan, mezuniyet, yıldönümü gibi özel günleriniz için tamamen size özel hazırlanmış organizasyon paketleri. Edirne'nin tarihi dokusunda, unutulmaz anılar biriktirin.",
      images: ["/special-event.jpg"],
    },
  ]

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "Özel Dekorasyon":
        return <PartyPopper className="w-4 h-4" />
      case "Doğum Günü Pastası":
        return <Cake className="w-4 h-4" />
      case "İkramlar":
      case "İkram Seçenekleri":
        return <Utensils className="w-4 h-4" />
      case "Müzik Sistemi":
      case "Ses ve Işık Sistemi":
        return <Music className="w-4 h-4" />
      case "Fotoğraf Çekimi":
      case "Fotoğraf ve Video Çekimi":
        return <Camera className="w-4 h-4" />
      case "Profesyonel Organizasyon":
        return <HeartHandshake className="w-4 h-4" />
      case "Dekorasyon":
        return <Gift className="w-4 h-4" />
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Organizasyonlar</h1>
          <div className="h-1 w-20 bg-cream-400 mx-auto mb-6"></div>
          <p className="text-xl text-sage-200 max-w-2xl mx-auto leading-relaxed">
            Özel günlerinizi unutulmaz kılacak organizasyon seçeneklerimizle tanışın
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 xl:gap-10">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden border border-sage-200/60 rounded-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden bg-sage-100 flex items-center justify-center">
                  {event.images[0] ? (
                    <Image 
                      src={event.images[0]} 
                      alt={event.name} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <event.icon className="w-24 h-24 text-sage-300" />
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-sage-700/90 text-white font-medium px-3 py-1 text-sm shadow-md">{event.price}</Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl text-sage-800 font-bold flex items-center gap-2">
                    <event.icon className="w-5 h-5" />
                    {event.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sage-600 leading-relaxed">{event.description}</p>

                  <div className="grid grid-cols-1 gap-4 text-sm bg-sage-50/50 p-3 rounded-md">
                    <div className="flex items-center gap-2 text-sage-700">
                      <Users className="w-4 h-4 text-sage-600" />
                      <span className="font-medium">Kapasite: {event.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sage-700">
                      <CalendarDays className="w-4 h-4 text-sage-600" />
                      <span className="font-medium">Önceden rezervasyon gereklidir</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                        <span className="flex items-center gap-1.5">
                          {getFeatureIcon(feature)}
                          <span className="font-medium">{feature}</span>
                        </span>
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-sage-200/70">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="bg-sage-50/70 px-4 py-2 rounded-md mb-3 sm:mb-0 inline-flex">
                        <span className="text-sage-800">{event.price}</span>
                      </div>
                      <Button className="w-full sm:w-auto bg-sage-600 hover:bg-sage-700 text-white font-medium px-5 rounded-md shadow-sm">
                        Teklif Alın
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-sage-800 mb-6 text-center">Organizasyon Detayları</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-sage-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-sage-700 mb-4 flex items-center gap-2">
                  <Cake className="w-5 h-5" /> Doğum Günü Paketleri
                </h3>
                <ul className="space-y-3 text-sage-600">
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Temalı dekorasyon seçenekleri</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Özel tasarım pasta (isteğe bağlı)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Çeşitli ikram menüleri</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Müzik ve eğlence aktiviteleri</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Profesyonel fotoğraf çekimi</span>
                  </li>
                </ul>
              </div>
              <div className="bg-sage-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-sage-700 mb-4 flex items-center gap-2">
                  <PartyPopper className="w-5 h-5" /> Özel Etkinlik Paketleri
                </h3>
                <ul className="space-y-3 text-sage-600">
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Nişan, söz, mezuniyet organizasyonları</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Kurumsal toplantı ve etkinlikler</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Yıldönümü kutlamaları</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Özel menü seçenekleri</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Profesyonel organizasyon desteği</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-sage-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/texture-bg.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cream-400 to-transparent opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Organizasyon Teklifi Almak İster misiniz?</h2>
          <div className="h-1 w-16 bg-cream-400 mx-auto mb-6 opacity-70"></div>
          <p className="text-sage-200 mb-8 max-w-2xl mx-auto">Özel gününüz için detaylı bilgi ve fiyat teklifi alın</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button size="lg" className="bg-cream-600 hover:bg-cream-700 text-sage-800 font-medium rounded-md shadow-md w-full sm:w-auto" asChild>
              <Link href="/iletisim">Teklif Alın</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sage-800 font-medium rounded-md w-full sm:w-auto" asChild>
              <Link href="tel:02842135527">0(284) 213 5527</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
