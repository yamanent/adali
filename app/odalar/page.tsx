import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Bed, Eye, Snowflake, Wifi, Coffee } from "lucide-react"

export default function RoomsPage() {
  const rooms = [
    {
      id: 1,
      name: "Tek Kişilik Oda",
      price: "₺900",
      capacity: 2,
      bedType: "Tek Kişilik Yatak",
      view: "Deniz Manzarası",
      features: ["Klima", "Minibar", "Balkon", "Jakuzi"],
      description: "Panoramik deniz manzaralı lüks suit odamız. Geniş balkon ve jakuzi ile unutulmaz bir konaklama.",
      images: ["/227667008.jpg?height=400&width=600"],
    },
    {
      id: 2,
      name: "Çift Kişilik Oda",
      price: "₺1800",
      capacity: 3,
      bedType: "1 Çift + 1 Tek Yatak",
      view: "Bahçe Manzarası",
      features: ["Klima", "Balkon", "Minibar"],
      description: "Yeşil bahçemize bakan ferah odamız. Aileler için ideal, rahat ve konforlu.",
      images: ["/253575921.jpg?height=400&width=600"],
    },
    {
      id: 3,
      name: "Üç Kişilik Oda",
      price: "₺2700",
      capacity: 2,
      bedType: "Çift Kişilik Yatak",
      view: "Şehir Manzarası",
      features: ["Klima", "Minibar"],
      description: "Konforlu ve ekonomik seçeneğimiz. Tüm temel ihtiyaçlarınızı karşılayan standart odamız.",
      images: ["/227667320.jpg?height=400&width=600"],
    },
    {
      id: 4,
      name: "Aile Odası",
      price: "₺900",
      capacity: 4,
      bedType: "2 Çift Kişilik Yatak",
      view: "Bahçe Manzarası",
      features: ["Klima", "Balkon", "Minibar", "Oturma Alanı"],
      description: "Geniş aileler için tasarlanmış ferah odamız. İki ayrı yatak odası ve oturma alanı.",
      images: ["/253582329.jpg?height=400&width=600"],
    },
  ]

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "Klima":
        return <Snowflake className="w-4 h-4" />
      case "Wifi":
        return <Wifi className="w-4 h-4" />
      case "Minibar":
        return <Coffee className="w-4 h-4" />
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

      {/* Rooms Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 xl:gap-10">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden border border-sage-200/60 rounded-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={room.images[0] || "/placeholder.svg"} 
                    alt={room.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-sage-700/90 text-white font-medium px-3 py-1 text-sm shadow-md">{room.price}/gece</Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl text-sage-800 font-bold">{room.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sage-600 leading-relaxed">{room.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm bg-sage-50/50 p-3 rounded-md">
                    <div className="flex items-center gap-2 text-sage-700">
                      <Users className="w-4 h-4 text-sage-600" />
                      <span className="font-medium">{room.capacity} Kişi</span>
                    </div>
                    <div className="flex items-center gap-2 text-sage-700">
                      <Bed className="w-4 h-4 text-sage-600" />
                      <span className="font-medium">{room.bedType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sage-700 col-span-2">
                      <Eye className="w-4 h-4 text-sage-600" />
                      <span className="font-medium">{room.view}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {room.features.map((feature, index) => (
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
                        <span className="text-2xl font-bold text-sage-800">{room.price}</span>
                        <span className="text-sage-600 self-end ml-1 mb-0.5">/gece</span>
                      </div>
                      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                        <Link href={`/odalar/${room.id}`} className="w-full sm:w-auto">
                          <Button variant="outline" className="w-full sm:w-auto border-sage-600 text-sage-600 hover:bg-sage-50 hover:border-sage-700 font-medium px-5 rounded-md">
                            <Eye className="w-4 h-4 mr-2" /> Odayı İncele
                          </Button>
                        </Link>
                        <Button className="w-full sm:w-auto bg-sage-600 hover:bg-sage-700 text-white font-medium px-5 rounded-md shadow-sm">
                          Hemen Rezervasyon Yap
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-sage-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/texture-bg.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cream-400 to-transparent opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Rezervasyon Yapmak İster misiniz?</h2>
          <div className="h-1 w-16 bg-cream-400 mx-auto mb-6 opacity-70"></div>
          <p className="text-sage-200 mb-8 max-w-2xl mx-auto">Müsaitlik durumu için bizi arayın veya online rezervasyon yapın</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button size="lg" className="bg-cream-600 hover:bg-cream-700 text-sage-800 font-medium rounded-md shadow-md w-full sm:w-auto">
              Online Rezervasyon
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sage-800 font-medium rounded-md w-full sm:w-auto">
              0(284) 213 5527
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
