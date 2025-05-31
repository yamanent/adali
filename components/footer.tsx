import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-sage-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-cream-600 rounded-full flex items-center justify-center">
                <span className="text-sage-900 font-bold text-sm">AP</span>
              </div>
              <span className="text-xl font-bold">Adalı Pansiyon</span>
            </div>
            <p className="text-sage-300 mb-4">
              1995'ten beri deniz kenarında sıcak ve samimi hizmet anlayışıyla misafirlerimizi ağırlıyoruz.
            </p>
            <div className="flex space-x-3">
              <Button size="icon" variant="ghost" className="text-sage-300 hover:text-white hover:bg-sage-800">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-sage-300 hover:text-white hover:bg-sage-800">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-sage-300 hover:text-white hover:bg-sage-800">
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sage-300 hover:text-white transition-colors">
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link href="/odalar" className="text-sage-300 hover:text-white transition-colors">
                  Odalarımız
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="text-sage-300 hover:text-white transition-colors">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sage-300 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/rezervasyon" className="text-sage-300 hover:text-white transition-colors">
                  Online Rezervasyon
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2 text-sage-300">
              <li>Ücretsiz Wi-Fi</li>
              <li>Kahvaltı Dahil</li>
              <li>Ücretsiz Otopark</li>
              <li>24 Saat Resepsiyon</li>
              <li>Oda Servisi</li>
              <li>Çamaşırhane</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sage-400 mt-0.5" />
                <div className="text-sage-300">
                  <p>Yancıkçı Şahin</p>
                  <p>Şeyh Davut Sk. No:5</p>
                  <p>22100 Edirne Merkez/Edirne</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sage-400" />
                <span className="text-sage-300">0(284) 213 5527</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sage-400" />
                <span className="text-sage-300">bilgi@adalipansiyonedirne.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sage-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sage-400 text-sm">© 2024 Adalı Pansiyon. Tüm hakları saklıdır.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/gizlilik-politikasi" className="text-sage-400 hover:text-white text-sm transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/cerez-politikasi" className="text-sage-400 hover:text-white text-sm transition-colors">
                Çerez Politikası
              </Link>
              <Link href="/kullanim-kosullari" className="text-sage-400 hover:text-white text-sm transition-colors">
                Kullanım Koşulları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
