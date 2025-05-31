import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Wifi, Coffee, MapPin, Car, Utensils, Waves } from "lucide-react"

export default function HomePage() {
  const services = [
    { icon: Wifi, title: "Ücretsiz Wi-Fi", description: "Tüm alanlarda hızlı internet" },
    { icon: Coffee, title: "Kahvaltı Dahil", description: "Ev yapımı lezzetler" },
    { icon: Waves, title: "Tarihi Yerleri Keşfet", description: "Tarihe Çok Yakın" },
    { icon: Car, title: "Ücretsiz Otopark", description: "Güvenli park alanı" },
    { icon: Utensils, title: "Restoran", description: "Yerel lezzetler" },
    { icon: MapPin, title: "Merkezi Konum", description: "Her yere yakın" },
  ]

  const testimonials = [
    {
      name: "Orhan G.",
      rating: 5,
      comment: "Oda çok temizdi, kahvaltı lezzetliydi. Konum harika, her yere yürüyerek gittik.",
      location: "İstanbul",
    },
    {
      name: "Ayşe K.",
      rating: 5,
      comment: "Sessiz, rahat ve fiyatına göre fazlasıyla iyi. Tekrar gelirim!",
      location: "Ankara",
    },
    {
      name: "Martin S.",
      rating: 5,
      comment: "Very clean and cozy place. Great location and friendly staff!",
      location: "İzmir",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <Image
          src="/231232.png?height=1080&width=1920"
          alt="Pansiyon Tarihi Manzarası"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Tarihin İçinde
            <span className="block text-sage-200">Huzurlu Konaklama</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-sage-100 max-w-2xl mx-auto">
            Doğanın kalbinde, denizin sesiyle uyandığınız unutulmaz bir tatil deneyimi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 text-lg" asChild>
              <a href="/iletisim">Rezervasyon Yap</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-white/20 hover:bg-white hover:text-sage-800 px-8 py-3 text-lg"
              asChild
            >
              <a href="/odalar">Odalarımızı İncele</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-sage-800 mb-6">Hoş Geldiniz</h2>
            <p className="text-lg text-sage-600 leading-relaxed mb-8">
              1995 yılından beri misafirlerimizi ağırlayan pansiyonumuz, denizin hemen kenarında yer alıyor. Aile
              işletmemizde, sıcak bir atmosfer ve samimi hizmet anlayışıyla unutulmaz anılar biriktirmenizi sağlıyoruz.
              Doğal güzelliklerin ortasında, konforlu odalarımız ve lezzetli yemeklerimizle sizleri bekliyoruz.
            </p>
            <Badge variant="secondary" className="bg-sage-100 text-sage-800 px-4 py-2 text-base">
              25+ Yıllık Deneyim
            </Badge>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">Hizmetlerimiz</h2>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">
              Konforlu ve keyifli bir konaklama için ihtiyacınız olan her şey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-sage-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <service.icon className="w-12 h-12 text-sage-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-sage-800 mb-2">{service.title}</h3>
                  <p className="text-sage-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-sage-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">Misafir Yorumları</h2>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">Bizimle konaklayan misafirlerimizin deneyimleri</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-sage-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sage-700 mb-4 italic">"{testimonial.comment}"</p>
                  <div className="border-t border-sage-200 pt-4">
                    <p className="font-semibold text-sage-800">{testimonial.name}</p>
                    <p className="text-sm text-sage-600">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sage-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Rezervasyonunuzu Yapın</h2>
          <p className="text-xl mb-8 text-sage-200 max-w-2xl mx-auto">
            Deniz kenarında unutulmaz bir tatil için bugün rezervasyon yapın. Erken rezervasyon indirimleri için bizi
            arayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-cream-600 hover:bg-cream-700 text-sage-800 px-8 py-3 text-lg" asChild>
              <a href="/iletisim">Online Rezervasyon</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-white/20 hover:bg-white hover:text-sage-800 px-8 py-3 text-lg"
              asChild
            >
              <a href="tel:02842135527">Bizi Arayın: 0 (284) 213 5527</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
