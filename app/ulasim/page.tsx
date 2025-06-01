"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Car, Train, Plane, Bus, Navigation, ExternalLink, CornerDownRight, ArrowRight } from "lucide-react"

export default function TransportationPage() {
  // Detailed directions from different entry points
  const detailedDirections = [
    {
      title: "İstanbul Yönünden (D-100 ve O-3 Karayolu)",
      steps: [
        "D-100 veya O-3 (TEM) otoyolunu takip ederek Edirne'ye ulaşın",
        "Edirne girişinde Kapıkule-Merkez tabelalarını takip edin",
        "Sarayiçi Köprüsü'nden geçerek şehir merkezine doğru ilerleyin",
        "Talat Paşa Caddesi'ne girin ve düz devam edin",
        "Selimiye Camii'ni sağınızda göreceksiniz",
        "Caminin hemen arkasındaki Şeyh Davut Sokak'a sağa dönün",
        "Sokağın sonuna doğru, sağ tarafta Adalı Pansiyon tabelasını göreceksiniz"
      ]
    },
    {
      title: "Kapıkule Sınır Kapısı Yönünden",
      steps: [
        "Kapıkule Sınır Kapısı'ndan Edirne merkeze doğru D-100 karayolunu takip edin",
        "Edirne merkez tabelalarını takip ederek şehre giriş yapın",
        "Londra Asfaltı Caddesi'nden devam edin",
        "Talatpaşa Köprüsü'nden geçerek Talatpaşa Bulvarı'na girin",
        "Selimiye Camii'ni solunuzda göreceksiniz",
        "Caminin hemen arkasındaki Şeyh Davut Sokak'a sola dönün",
        "Sokağın sonuna doğru, sağ tarafta Adalı Pansiyon tabelasını göreceksiniz"
      ]
    },
    {
      title: "Otobüs Terminali'nden",
      steps: [
        "Edirne Şehirlerarası Otobüs Terminali'nden çıkışta, şehir merkezi minibüslerine binin",
        "Minibüsten 'Selimiye Camii' durağında inin",
        "Selimiye Camii'nin ana girişine doğru yürüyün",
        "Caminin sağ tarafından dolaşarak arka kısmına geçin",
        "Şeyh Davut Sokak'a girin",
        "Yaklaşık 50 metre ilerledikten sonra sağda Adalı Pansiyon'u göreceksiniz"
      ]
    },
    {
      title: "Tren Garı'ndan",
      steps: [
        "Edirne Tren Garı'ndan çıkışta, taksi ile 'Selimiye Camii' deyin (yaklaşık 10-15 dakika)",
        "Alternatif olarak, Karaağaç-Merkez minibüslerine binerek 'Selimiye' durağında inin",
        "Selimiye Camii'nin ana girişine doğru yürüyün",
        "Caminin sağ tarafından dolaşarak arka kısmına geçin",
        "Şeyh Davut Sokak'a girin",
        "Yaklaşık 50 metre ilerledikten sonra sağda Adalı Pansiyon'u göreceksiniz"
      ]
    },
    {
      title: "Şehir Merkezi'nden (Yaya Olarak)",
      steps: [
        "Edirne şehir merkezindeki Saraçlar Caddesi'nden (yaya bölgesi) başlayın",
        "Caddenin sonunda Eski Cami'yi göreceksiniz",
        "Eski Cami'den sola dönün ve Selimiye Camii'ne doğru yürüyün (yaklaşık 5 dakika)",
        "Selimiye Camii'ne ulaştığınızda, caminin sağ tarafından dolaşarak arka kısmına geçin",
        "Şeyh Davut Sokak'a girin",
        "Yaklaşık 50 metre ilerledikten sonra sağda Adalı Pansiyon'u göreceksiniz"
      ]
    }
  ];

  const transportOptions = [
    {
      icon: Car,
      title: "Özel Araç ile",
      description: "Edirne merkeze özel aracınızla ulaştıktan sonra, Selimiye Camii'ne doğru ilerleyerek pansiyonumuza kolayca ulaşabilirsiniz.",
      details: [
        "İstanbul'dan yaklaşık 2.5 saat (220 km)",
        "Ankara'dan yaklaşık 7 saat (650 km)",
        "İzmir'den yaklaşık 8 saat (700 km)",
        "Tekirdağ'dan yaklaşık 1.5 saat (140 km)",
        "Çanakkale'den yaklaşık 3 saat (220 km)"
      ]
    },
    {
      icon: Bus,
      title: "Otobüs ile",
      description: "Türkiye'nin birçok şehrinden Edirne'ye düzenli otobüs seferleri bulunmaktadır.",
      details: [
        "İstanbul'dan yaklaşık 3 saat",
        "Ankara'dan yaklaşık 8 saat",
        "İzmir'den yaklaşık 10 saat",
        "Otobüs terminalinden şehir merkezine minibüslerle ulaşım sağlayabilirsiniz",
        "Şehir merkezinden pansiyonumuza yürüyerek 10 dakika mesafededir"
      ]
    },
    {
      icon: Train,
      title: "Tren ile",
      description: "İstanbul'dan Edirne'ye tren seferleri bulunmaktadır.",
      details: [
        "İstanbul Halkalı'dan Edirne'ye Marmaray ve bağlantılı trenler",
        "Kapıkule sınır istasyonuna kadar devam eden uluslararası tren seferleri",
        "Tren garından şehir merkezine minibüs veya taksi ile ulaşım",
        "Şehir merkezinden pansiyonumuza yürüyerek 10-15 dakika mesafededir"
      ]
    },
    {
      icon: Plane,
      title: "Uçak ile",
      description: "En yakın havalimanları İstanbul'dadır.",
      details: [
        "İstanbul Havalimanı'ndan Edirne'ye yaklaşık 2.5 saat",
        "Sabiha Gökçen Havalimanı'ndan Edirne'ye yaklaşık 3.5 saat",
        "Havalimanlarından Edirne'ye otobüs, servis veya özel araç ile ulaşım mümkündür",
        "Havalimanlarından Edirne'ye shuttle servisleri mevcuttur"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-sage-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Ulaşım</h1>
          <p className="text-xl text-sage-200 max-w-2xl mx-auto">
            Adalı Pansiyon'a nasıl ulaşabileceğiniz hakkında detaylı bilgiler
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-sage-800 mb-6">Edirne'nin Kalbinde Konaklama</h2>
            <p className="text-lg text-sage-600 leading-relaxed mb-8">
              Adalı Pansiyon, Edirne'nin tarihi merkezinde, Selimiye Camii'ne yürüme mesafesinde yer almaktadır. 
              Şehrin tüm önemli tarihi ve turistik mekanlarına kolayca ulaşabileceğiniz merkezi bir konumda bulunuyoruz.
            </p>
            <div className="flex items-center justify-center gap-2 text-sage-700">
              <MapPin className="h-5 w-5" />
              <p className="font-medium">Yancıkçı Şahin, Şeyh Davut Sk. No:5, 22100 Edirne Merkez/Edirne</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.5!2d26.5565!3d41.6785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b32f95a7d1e631%3A0x7c2c1a5c6cd5bac!2sAdalı%20Pansiyon!5e0!3m2!1str!2str!4v1622222222222!5m2!1str!2str" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" className="text-sage-700 border-sage-300" asChild>
                <a href="https://goo.gl/maps/YOUR_GOOGLE_MAPS_LINK" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Google Haritalar'da Görüntüle
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Directions Section */}
      <section className="py-16 bg-cream-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">Adım Adım Yol Tarifleri</h2>
              <p className="text-lg text-sage-600 max-w-2xl mx-auto">
                Farklı noktalardan Adalı Pansiyon'a nasıl ulaşacağınızı detaylı olarak öğrenin
              </p>
            </div>

            <Tabs defaultValue={detailedDirections[0].title} className="w-full">
              <TabsList className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 h-auto p-0 bg-transparent gap-2">
                {detailedDirections.map((direction, index) => (
                  <TabsTrigger 
                    key={index} 
                    value={direction.title}
                    className="bg-white border border-sage-200 text-sage-700 hover:bg-sage-50 data-[state=active]:bg-sage-700 data-[state=active]:text-white data-[state=active]:shadow py-3"
                  >
                    {direction.title.split(' ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {detailedDirections.map((direction, index) => (
                <TabsContent key={index} value={direction.title} className="mt-6">
                  <Card className="border-sage-200">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-sage-800 mb-4">{direction.title}</h3>
                      <ol className="space-y-4">
                        {direction.steps.map((step, stepIdx) => (
                          <li key={stepIdx} className="flex items-start gap-3">
                            <div className="bg-sage-100 text-sage-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {stepIdx + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sage-700">{step}</p>
                              {stepIdx < direction.steps.length - 1 && (
                                <div className="ml-3 mt-2 pl-3 border-l-2 border-dashed border-sage-300">
                                  <ArrowRight className="w-4 h-4 text-sage-400 -rotate-90 ml-[-10px] my-1" />
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                      <div className="mt-6 pt-4 border-t border-sage-200">
                        <p className="flex items-center text-sage-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>Varış Noktası: <strong>Adalı Pansiyon, Şeyh Davut Sk. No:5, Edirne</strong></span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-8 bg-white p-6 rounded-lg border border-sage-200 shadow-sm">
              <h3 className="text-xl font-semibold text-sage-800 mb-3 flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-sage-600" /> Önemli Referans Noktaları
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CornerDownRight className="w-4 h-4 text-sage-500 mt-1" />
                  <p className="text-sage-700">
                    <span className="font-medium">Selimiye Camii:</span> Pansiyonumuz, Selimiye Camii'nin hemen arkasında yer almaktadır. Şehirde kaybolursanız, Selimiye Camii'ni bulun ve caminin arka tarafına geçin.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <CornerDownRight className="w-4 h-4 text-sage-500 mt-1" />
                  <p className="text-sage-700">
                    <span className="font-medium">Eski Cami:</span> Şehir merkezindeki bu tarihi camiden Selimiye Camii'ne yürüyerek 5 dakikada ulaşabilirsiniz.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <CornerDownRight className="w-4 h-4 text-sage-500 mt-1" />
                  <p className="text-sage-700">
                    <span className="font-medium">Saraçlar Caddesi:</span> Edirne'nin ana yaya bölgesi ve alışveriş caddesidir. Bu caddeden Selimiye Camii'ne kolayca ulaşabilirsiniz.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <CornerDownRight className="w-4 h-4 text-sage-500 mt-1" />
                  <p className="text-sage-700">
                    <span className="font-medium">Ali Paşa Çarşısı:</span> Tarihi kapalı çarşı, pansiyonumuza yaklaşık 7-8 dakika yürüme mesafesindedir.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transportation Options */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">Ulaşım Seçenekleri</h2>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">
              Adalı Pansiyon'a farklı ulaşım araçlarıyla nasıl gelebileceğinizi öğrenin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {transportOptions.map((option, index) => (
              <Card key={index} className="border-sage-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-sage-100 p-3 rounded-full">
                      <option.icon className="w-6 h-6 text-sage-700" />
                    </div>
                    <h3 className="text-xl font-semibold text-sage-800">{option.title}</h3>
                  </div>
                  <p className="text-sage-600 mb-4">{option.description}</p>
                  <ul className="space-y-2">
                    {option.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-sage-500 mt-1">•</span>
                        <span className="text-sage-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Local Transportation */}
      <section className="py-16 bg-sage-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-sage-800 mb-4">Şehir İçi Ulaşım</h2>
              <p className="text-lg text-sage-600">
                Edirne şehir merkezi içinde ulaşım seçenekleri
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-sage-200">
                <h3 className="text-xl font-semibold text-sage-800 mb-3 flex items-center">
                  <Bus className="w-5 h-5 mr-2 text-sage-600" /> Minibüsler ve Otobüsler
                </h3>
                <p className="text-sage-700 mb-2">
                  Edirne şehir merkezinde belediye otobüsleri ve minibüsler ile kolayca ulaşım sağlayabilirsiniz. 
                  Pansiyonumuza en yakın durak Selimiye Camii durağıdır.
                </p>
                <div className="mt-3 pl-7">
                  <h4 className="font-medium text-sage-800 mb-2">Önemli Otobüs Hatları:</h4>
                  <ul className="space-y-1">
                    <li className="text-sage-700 text-sm">• <span className="font-medium">Hat 1:</span> Otobüs Terminali - Selimiye - Karaağaç</li>
                    <li className="text-sage-700 text-sm">• <span className="font-medium">Hat 3:</span> Yeni Mahalle - Selimiye - Kıyık</li>
                    <li className="text-sage-700 text-sm">• <span className="font-medium">Hat 5:</span> Şükrüpaşa - Selimiye - Ayşekadın</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-sage-200">
                <h3 className="text-xl font-semibold text-sage-800 mb-3 flex items-center">
                  <Car className="w-5 h-5 mr-2 text-sage-600" /> Taksi
                </h3>
                <p className="text-sage-700 mb-2">
                  Şehir içinde taksi hizmeti yaygın olarak bulunmaktadır. Otobüs terminali, tren garı veya şehrin 
                  herhangi bir noktasından taksi ile pansiyonumuza kolayca ulaşabilirsiniz.
                </p>
                <p className="text-sage-700 mb-3">
                  <span className="font-medium">Taksi Durağı Telefon:</span> 0(284) 212 XX XX
                </p>
                <div className="bg-sage-50 p-3 rounded-md text-sm">
                  <p className="text-sage-700 font-medium">Taksi şoförüne şöyle tarif edebilirsiniz:</p>
                  <p className="text-sage-600 italic mt-1">"Selimiye Camii'nin arkasında, Şeyh Davut Sokak'taki Adalı Pansiyon'a gidiyoruz lütfen."</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-sage-200">
                <h3 className="text-xl font-semibold text-sage-800 mb-3 flex items-center">
                  <Navigation className="w-5 h-5 mr-2 text-sage-600" /> Yürüyerek
                </h3>
                <p className="text-sage-700 mb-3">
                  Edirne'nin tarihi merkezi yürüyerek keşfetmek için idealdir. Selimiye Camii, Eski Cami, Üç Şerefeli Cami, 
                  Kapalı Çarşı ve diğer tarihi yapılar pansiyonumuza yürüme mesafesindedir.
                </p>
                <div className="space-y-2 pl-2">
                  <p className="text-sage-700 text-sm flex items-start">
                    <span className="text-sage-500 mr-2">•</span>
                    <span><span className="font-medium">Saraçlar Caddesi'nden:</span> Yürüyerek 8-10 dakika</span>
                  </p>
                  <p className="text-sage-700 text-sm flex items-start">
                    <span className="text-sage-500 mr-2">•</span>
                    <span><span className="font-medium">Eski Cami'den:</span> Yürüyerek 5 dakika</span>
                  </p>
                  <p className="text-sage-700 text-sm flex items-start">
                    <span className="text-sage-500 mr-2">•</span>
                    <span><span className="font-medium">Üç Şerefeli Cami'den:</span> Yürüyerek 6-7 dakika</span>
                  </p>
                  <p className="text-sage-700 text-sm flex items-start">
                    <span className="text-sage-500 mr-2">•</span>
                    <span><span className="font-medium">Ali Paşa Çarşısı'ndan:</span> Yürüyerek 7-8 dakika</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-cream-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-sage-800 mb-4">Seyahat İpuçları</h2>
              <p className="text-lg text-sage-600">
                Edirne'ye seyahatinizi planlarken dikkat etmeniz gerekenler
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border border-sage-200">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-sage-600 font-bold text-lg">1.</span>
                  <p className="text-sage-700">
                    <span className="font-medium">Yoğun Dönemler:</span> Edirne, özellikle Kırkpınar Yağlı Güreşleri ve Kakava 
                    Şenlikleri gibi etkinlikler sırasında çok kalabalık olabilir. Bu dönemlerde seyahat edecekseniz, 
                    önceden rezervasyon yaptırmanızı öneririz.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-600 font-bold text-lg">2.</span>
                  <p className="text-sage-700">
                    <span className="font-medium">Hava Durumu:</span> Edirne'de kışlar soğuk ve yağışlı, yazlar ise sıcak ve 
                    kurak geçmektedir. Seyahat planınızı yaparken mevsim koşullarını göz önünde bulundurun.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-600 font-bold text-lg">3.</span>
                  <p className="text-sage-700">
                    <span className="font-medium">Sınır Geçişleri:</span> Yunanistan ve Bulgaristan sınırına yakın olan Edirne'den 
                    bu ülkelere geçiş yapmayı planlıyorsanız, gerekli vize ve pasaport işlemlerinizi önceden halledin.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-600 font-bold text-lg">4.</span>
                  <p className="text-sage-700">
                    <span className="font-medium">Yerel Ulaşım Kartı:</span> Edirne'de birkaç gün kalacaksanız, toplu taşıma 
                    araçlarında kullanabileceğiniz bir ulaşım kartı almanız ekonomik olacaktır.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-sage-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Sorularınız mı var?</h2>
          <p className="text-xl mb-8 text-sage-200 max-w-2xl mx-auto">
            Ulaşım ile ilgili detaylı bilgi almak veya rezervasyon yapmak için bizimle iletişime geçebilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-cream-600 hover:bg-cream-700 text-sage-800 px-8 py-3 text-lg" asChild>
              <a href="/iletisim">İletişime Geç</a>
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
