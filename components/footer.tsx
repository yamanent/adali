import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-sage-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Image 
                src="/Adalibeyaz.svg" 
                alt="Adalı Pansiyon Logo" 
                width={310}
                height={100}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-sage-300 mb-4">
            Edirne’nin kalbinde sıcak ve samimi bir konaklama deneyimi sunan pansiyonumuzda. Misafirlerimize rahatlık ve huzuru bir arada sunarken, şehrin tarihî dokusunu keşfetmeniz için ideal bir ortam sağlıyoruz.
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
                <Link href="/hizmetlerimiz" className="text-sage-300 hover:text-white transition-colors">
                  Hizmetlerimiz
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="text-sage-300 hover:text-white transition-colors">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sage-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sage-300 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2 text-sage-300">
              <li>Ücretsiz Wi-Fi</li>
              <li>Kahvaltı </li>
              <li>Ücretsiz Otopark</li>
              <li>24 Saat Resepsiyon</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sage-400 mt-0.5" />
                <div className="text-sage-300">
                  <p>Sarıcapaşa Mah.</p>
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
            <p className="text-sage-400 text-sm">© 2025 Adalı Pansiyon. Tüm hakları saklıdır.</p>
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
