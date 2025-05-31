import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Bed, Eye, Snowflake, Wifi, Coffee, ArrowLeft, Phone, Mail } from "lucide-react";
import { RoomImageSlider } from "@/components/room-image-slider";

// Room data (in a real application, this would come from a database)
const rooms = [
  {
    id: 1,
    name: "Tek Kişilik Pansiyon",
    price: "₺900",
    capacity: 1,
    bedType: "Tek Kişilik Yatak",
    view: "Tarihi Manzara",
    features: ["Klima", "Minibar", "Balkon", "Jakuzi"],
    description: "Panoramik deniz manzaralı lüks suit odamız. Geniş balkon ve jakuzi ile unutulmaz bir konaklama.",
    longDescription: "Deniz Manzaralı Suit odamız, konforun ve lüksün bir araya geldiği eşsiz bir konaklama deneyimi sunuyor. Panoramik deniz manzarasına sahip geniş balkonunuzda güne kahve ile başlayabilir, gün batımını izleyebilirsiniz. Özel jakuzili banyosu, minibarı ve klimalı ferah iç mekanıyla her detayı düşünülmüş bu odada kendinizi evinizde hissedeceksiniz.",
    images: [
      "/227667008.jpg?height=600&width=800",
      "/227668163.jpg?height=600&width=800&text=Deniz+Manzarası",
      "/253587397.jpg?height=600&width=800&text=Jakuzi",
      "/253588689.jpg?height=600&width=800&text=Balkon",
      "/253588829.jpg?height=600&width=800&text=Balkon",
      "/253588949.jpg?height=600&width=800&text=Balkon",
      "/253587577.jpg?height=600&width=800&text=Balkon",
      "/255010373.jpg?height=600&width=800&text=Balkon",
      "/253590109.jpg?height=600&width=800&text=Balkon",
      "/253590093.jpg?height=600&width=800&text=Balkon"
    ],
    amenities: ["Ücretsiz Wi-Fi", "LCD TV", "Klima", "Minibar", "Saç Kurutma Makinesi", "Kasa", "Balkon", "Jakuzi", "Deniz Manzarası", "Uydu Yayını", "Çay/Kahve Makinesi"]
  },
  {
    id: 2,
    name: "Çift Kişilik Pansiyon",
    price: "₺1800",
    capacity: 2,
    bedType: "Çift Kişilik Yatak",
    view: "Tarihi Manzara",
    features: ["Klima", "Minibar", "Balkon", "Jakuzi"],
    description: "Panoramik deniz manzaralı lüks suit odamız. Geniş balkon ve jakuzi ile unutulmaz bir konaklama.",
    longDescription: "Deniz Manzaralı Suit odamız, konforun ve lüksün bir araya geldiği eşsiz bir konaklama deneyimi sunuyor. Panoramik deniz manzarasına sahip geniş balkonunuzda güne kahve ile başlayabilir, gün batımını izleyebilirsiniz. Özel jakuzili banyosu, minibarı ve klimalı ferah iç mekanıyla her detayı düşünülmüş bu odada kendinizi evinizde hissedeceksiniz.",
    images: [
      "/253575921.jpg?height=600&width=800",
      "/227668163.jpg?height=600&width=800&text=Deniz+Manzarası",
      "/253587397.jpg?height=600&width=800&text=Jakuzi",
      "/253588689.jpg?height=600&width=800&text=Balkon",
      "/253588829.jpg?height=600&width=800&text=Balkon",
      "/253588949.jpg?height=600&width=800&text=Balkon",
      "/253587577.jpg?height=600&width=800&text=Balkon",
      "/255010373.jpg?height=600&width=800&text=Balkon",
      "/253590109.jpg?height=600&width=800&text=Balkon",
      "/253590093.jpg?height=600&width=800&text=Balkon"
    ],
    amenities: ["Ücretsiz Wi-Fi", "LCD TV", "Klima", "Minibar", "Saç Kurutma Makinesi", "Kasa", "Balkon", "Bahçe Manzarası", "Uydu Yayını", "Çay/Kahve Makinesi"]
  },
  {
    id: 3,
    name: "Üç Kişilik Pansiyon",
    price: "2700₺",
    capacity: 3,
    bedType: "Tek Kişilik Yatak",
    view: "Tarihi Manzara",
    features: ["Klima", "Minibar", "Balkon", "Jakuzi"],
    description: "Panoramik deniz manzaralı lüks suit odamız. Geniş balkon ve jakuzi ile unutulmaz bir konaklama.",
    longDescription: "Deniz Manzaralı Suit odamız, konforun ve lüksün bir araya geldiği eşsiz bir konaklama deneyimi sunuyor. Panoramik deniz manzarasına sahip geniş balkonunuzda güne kahve ile başlayabilir, gün batımını izleyebilirsiniz. Özel jakuzili banyosu, minibarı ve klimalı ferah iç mekanıyla her detayı düşünülmüş bu odada kendinizi evinizde hissedeceksiniz.",
    images: [
      "/227667320.jpg?height=600&width=800",
      "/227668163.jpg?height=600&width=800&text=Deniz+Manzarası",
      "/253587397.jpg?height=600&width=800&text=Jakuzi",
      "/253588689.jpg?height=600&width=800&text=Balkon",
      "/253588829.jpg?height=600&width=800&text=Balkon",
      "/253588949.jpg?height=600&width=800&text=Balkon",
      "/253587577.jpg?height=600&width=800&text=Balkon",
      "/255010373.jpg?height=600&width=800&text=Balkon",
      "/253590109.jpg?height=600&width=800&text=Balkon",
      "/253590093.jpg?height=600&width=800&text=Balkon"
    ],
    amenities: ["Ücretsiz Wi-Fi", "LCD TV", "Klima", "Minibar", "Saç Kurutma Makinesi", "Kasa", "Şehir Manzarası", "Uydu Yayını"]
  },
  {
    id: 4,
    name: "Aile Odası",
    price: "₺3600",
    capacity: 4,
    bedType: "Tek Kişilik Yatak",
    view: "Tarihi Manzara",
    features: ["Klima", "Minibar", "Balkon", "Jakuzi"],
    description: "Panoramik deniz manzaralı lüks suit odamız. Geniş balkon ve jakuzi ile unutulmaz bir konaklama.",
    longDescription: "Deniz Manzaralı Suit odamız, konforun ve lüksün bir araya geldiği eşsiz bir konaklama deneyimi sunuyor. Panoramik deniz manzarasına sahip geniş balkonunuzda güne kahve ile başlayabilir, gün batımını izleyebilirsiniz. Özel jakuzili banyosu, minibarı ve klimalı ferah iç mekanıyla her detayı düşünülmüş bu odada kendinizi evinizde hissedeceksiniz.",
    images: [
      "/253582329.jpg?height=600&width=800",
      "/227668163.jpg?height=600&width=800&text=Deniz+Manzarası",
      "/253587397.jpg?height=600&width=800&text=Jakuzi",
      "/253588689.jpg?height=600&width=800&text=Balkon",
      "/253588829.jpg?height=600&width=800&text=Balkon",
      "/253588949.jpg?height=600&width=800&text=Balkon",
      "/253587577.jpg?height=600&width=800&text=Balkon",
      "/255010373.jpg?height=600&width=800&text=Balkon",
      "/253590109.jpg?height=600&width=800&text=Balkon",
      "/253590093.jpg?height=600&width=800&text=Balkon"
    ],
    amenities: ["Ücretsiz Wi-Fi", "LCD TV", "Klima", "Minibar", "Saç Kurutma Makinesi", "Kasa", "Balkon", "Bahçe Manzarası", "Uydu Yayını", "Çay/Kahve Makinesi", "Oturma Alanı", "İki Ayrı Yatak Odası"]
  },
];



// Helper function to get feature icon
const getFeatureIcon = (feature: string) => {
  switch (feature) {
    case "Klima":
      return <Snowflake className="w-4 h-4" />;
    case "Wifi":
      return <Wifi className="w-4 h-4" />;
    case "Minibar":
      return <Coffee className="w-4 h-4" />;
    default:
      return null;
  }
};

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  // Find the room with the matching ID
  const roomId = parseInt(params.id);
  const room = rooms.find((r) => r.id === roomId);

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
          <div className="mt-4 flex items-center">
            <Badge className="bg-sage-600 text-white text-lg px-3 py-1">
              {room.price}/gece
            </Badge>
          </div>
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
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-sage-800">{room.price}</span>
                  <span className="text-sage-600 ml-1">/gece</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sage-700">
                    <span>Konaklama (1 gece)</span>
                    <span>{room.price}</span>
                  </div>
                  <div className="flex justify-between text-sage-700">
                    <span>Vergiler ve ücretler</span>
                    <span>₺50</span>
                  </div>
                  <div className="border-t border-sage-200 pt-4 flex justify-between font-bold">
                    <span>Toplam</span>
                    <span className="text-sage-800">
                      {`₺${parseInt(room.price.replace('₺', '')) + 50}`}
                    </span>
                  </div>
                </div>
                
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
                    İletişime Geç
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
      <section className="py-12 bg-cream-100">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-sage-800 mb-4">Oda Hakkında</h2>
              <p className="text-lg text-sage-600">{room.longDescription}</p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-sage-800 mb-4">Oda Özellikleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4">
                <div className="flex items-center gap-3 text-sage-700">
                  <Users className="w-5 h-5" />
                  <span className="text-lg">{room.capacity} Kişi Kapasitesi</span>
                </div>
                <div className="flex items-center gap-3 text-sage-700">
                  <Bed className="w-5 h-5" />
                  <span className="text-lg">{room.bedType}</span>
                </div>
                <div className="flex items-center gap-3 text-sage-700">
                  <Eye className="w-5 h-5" />
                  <span className="text-lg">{room.view}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-sage-800 mb-4">Oda Olanakları</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-sage-700">
                    <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-sage-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Başka Sorularınız mı Var?</h2>
          <p className="text-sage-200 mb-6">Daha fazla bilgi için bizi arayabilir veya e-posta gönderebilirsiniz</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-cream-600 hover:bg-cream-700 text-sage-800">
              İletişime Geçin
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sage-800">
              (0242) 123 45 67
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
