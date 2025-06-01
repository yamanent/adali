import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-sage-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kullanım Koşulları</h1>
          <p className="text-xl text-sage-200 max-w-2xl mx-auto">
            Web sitemizi kullanırken uymanız gereken kurallar ve koşullar.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <div className="prose prose-sage max-w-none">
              <p className="text-sage-700 mb-6">
                Son Güncelleme: 31 Mayıs 2025
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">1. Giriş</h2>
              <p className="mb-6">
                Bu web sitesini kullanarak, aşağıda belirtilen kullanım koşullarını kabul etmiş sayılırsınız. Bu koşulları kabul etmiyorsanız, lütfen sitemizi kullanmayın. Adalı Pansiyon Edirne olarak, bu koşulları herhangi bir zamanda değiştirme hakkını saklı tutarız.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">2. Tanımlar</h2>
              <p className="mb-6">
                Bu kullanım koşullarında geçen "biz", "bizim", "pansiyon" veya "Adalı Pansiyon" ifadeleri Adalı Pansiyon Edirne'yi; "siz", "sizin" veya "kullanıcı" ifadeleri ise web sitesini kullanan kişiyi ifade eder. "Web sitesi" ifadesi, adalipansiyonedirne.com alan adı altında sunulan tüm içerikleri kapsar.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">3. Fikri Mülkiyet Hakları</h2>
              <p className="mb-6">
                Web sitemizdeki tüm içerikler (metinler, görseller, logolar, tasarımlar, videolar vb.) fikri mülkiyet hakları ile korunmaktadır ve Adalı Pansiyon Edirne'ye aittir. Bu içeriklerin izinsiz kullanılması, kopyalanması, dağıtılması veya değiştirilmesi yasaktır. Web sitesini kişisel ve ticari olmayan amaçlarla görüntüleme hakkına sahipsiniz.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">4. Rezervasyon ve Ödeme Koşulları</h2>
              <p className="mb-4">
                Web sitemiz üzerinden yapılan rezervasyonlar için aşağıdaki koşullar geçerlidir:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Rezervasyon onayı, ödemenin tamamlanmasından sonra geçerlilik kazanır.</li>
                <li>Rezervasyon iptal ve değişiklik politikalarımız, rezervasyon sırasında belirtilen koşullara tabidir.</li>
                <li>Ödeme bilgileriniz güvenli bir şekilde işlenir ve saklanır.</li>
                <li>Yanlış veya yanıltıcı bilgi verilmesi durumunda rezervasyonunuzu iptal etme hakkını saklı tutarız.</li>
                <li>Fiyatlandırma hatalarından kaynaklanan durumlarda, rezervasyonu iptal etme veya doğru fiyatı talep etme hakkına sahibiz.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">5. Kullanıcı Sorumlulukları</h2>
              <p className="mb-4">
                Web sitemizi kullanırken aşağıdaki kurallara uymayı kabul edersiniz:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Web sitesini yasalara uygun şekilde kullanmak</li>
                <li>Diğer kullanıcıların web sitesini kullanmasını engelleyecek veya zorlaştıracak faaliyetlerde bulunmamak</li>
                <li>Web sitesinin güvenliğini tehlikeye atacak eylemlerde bulunmamak</li>
                <li>Doğru ve güncel bilgiler sağlamak</li>
                <li>Hesap bilgilerinizi (varsa) gizli tutmak ve başkalarıyla paylaşmamak</li>
              </ul>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">6. Sorumluluk Sınırlaması</h2>
              <p className="mb-6">
                Web sitemizdeki bilgilerin doğruluğu, güncelliği ve eksiksizliği konusunda garanti vermemekteyiz. Web sitesinin kullanımından doğabilecek doğrudan veya dolaylı zararlardan sorumlu değiliz. Web sitemizde bağlantı verilen üçüncü taraf web sitelerinin içeriğinden ve gizlilik politikalarından sorumlu değiliz.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">7. Gizlilik</h2>
              <p className="mb-6">
                Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi için lütfen <Link href="/gizlilik-politikasi" className="text-sage-600 hover:text-sage-800 underline">Gizlilik Politikamızı</Link> inceleyin. Web sitemizi kullanarak, Gizlilik Politikamızı da kabul etmiş sayılırsınız.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">8. Çerezler</h2>
              <p className="mb-6">
                Web sitemiz çerezleri kullanmaktadır. Çerezler hakkında daha fazla bilgi için lütfen <Link href="/cerez-politikasi" className="text-sage-600 hover:text-sage-800 underline">Çerez Politikamızı</Link> inceleyin.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">9. Uygulanacak Hukuk ve Anlaşmazlıkların Çözümü</h2>
              <p className="mb-6">
                Bu kullanım koşulları Türkiye Cumhuriyeti kanunlarına tabidir. Bu koşullardan doğabilecek herhangi bir anlaşmazlık durumunda Edirne Mahkemeleri ve İcra Daireleri yetkilidir.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">10. İletişim</h2>
              <p className="mb-6">
                Kullanım koşullarımız hakkında herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin:
              </p>
              <p className="mb-2">E-posta: bilgi@adalipansiyonedirne.com</p>
              <p className="mb-2">Telefon: 0(284) 213 5527</p>
              <p>Adres: Sarıcapaşa Mah.Şeyh Davut Sk. No:5, 22100 Edirne Merkez/Edirne</p>
            </div>

            <div className="mt-10 pt-6 border-t border-sage-200 flex flex-wrap gap-4">
              <Link href="/" passHref>
                <Button variant="outline" className="text-sage-700 border-sage-300">
                  Ana Sayfaya Dön
                </Button>
              </Link>
              <Link href="/gizlilik-politikasi" passHref>
                <Button variant="outline" className="text-sage-700 border-sage-300">
                  Gizlilik Politikası
                </Button>
              </Link>
              <Link href="/cerez-politikasi" passHref>
                <Button variant="outline" className="text-sage-700 border-sage-300">
                  Çerez Politikası
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
