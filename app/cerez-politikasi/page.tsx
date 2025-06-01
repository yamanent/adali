import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-sage-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Çerez Politikası</h1>
          <p className="text-xl text-sage-200 max-w-2xl mx-auto">
            Web sitemizde kullanılan çerezler hakkında bilgilendirme.
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

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">1. Çerezler Nedir?</h2>
              <p className="mb-6">
                Çerezler (cookies), bir web sitesini ziyaret ettiğinizde tarayıcınız tarafından cihazınıza kaydedilen küçük metin dosyalarıdır. Bu dosyalar, web sitesinin düzgün çalışması, kullanıcı deneyiminin iyileştirilmesi, site kullanımı hakkında analiz yapılması ve kişiselleştirilmiş içerik sunulması gibi amaçlar için kullanılır.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">2. Kullandığımız Çerez Türleri</h2>
              <p className="mb-4">
                Web sitemizde aşağıdaki çerez türlerini kullanmaktayız:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>
                  <strong>Zorunlu Çerezler:</strong> Bu çerezler, web sitesinin temel işlevlerini yerine getirmesi için gereklidir ve kapatılamazlar. Genellikle yalnızca sizin eylemlerinize yanıt olarak ayarlanırlar, örneğin gizlilik tercihlerinizi ayarlamak, oturum açmak veya form doldurmak gibi.
                </li>
                <li>
                  <strong>Performans Çerezleri:</strong> Bu çerezler, ziyaretçilerin web sitesini nasıl kullandığı hakkında bilgi toplar. Bu çerezler, hangi sayfaların en çok ziyaret edildiği veya hata mesajları alınıp alınmadığı gibi bilgileri toplar. Bu çerezler, ziyaretçinin kimliğini tanımlamaz.
                </li>
                <li>
                  <strong>İşlevsellik Çerezleri:</strong> Bu çerezler, web sitesinin dil tercihi veya bölge seçimi gibi yaptığınız seçimleri hatırlamasını sağlar ve gelişmiş, kişiselleştirilmiş özellikler sunar.
                </li>
                <li>
                  <strong>Hedefleme/Reklam Çerezleri:</strong> Bu çerezler, size ve ilgi alanlarınıza uygun reklamlar göstermek için kullanılır. Ayrıca, bir reklamı görme sayınızı sınırlamak ve reklam kampanyasının etkinliğini ölçmek için de kullanılırlar.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">3. Üçüncü Taraf Çerezleri</h2>
              <p className="mb-6">
                Web sitemizde, aşağıdaki üçüncü taraf hizmetlerinden gelen çerezler de kullanılabilir:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Google Analytics (ziyaretçi istatistikleri için)</li>
                <li>Google Maps (harita gösterimi için)</li>
                <li>Sosyal medya paylaşım düğmeleri (Facebook, Twitter, Instagram)</li>
                <li>Ödeme işlemcileri (güvenli ödeme işlemleri için)</li>
              </ul>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">4. Çerezleri Nasıl Kontrol Edebilirsiniz?</h2>
              <p className="mb-4">
                Çoğu web tarayıcısı, çerezleri otomatik olarak kabul edecek şekilde ayarlanmıştır. Ancak, tarayıcı ayarlarınızı değiştirerek çerezleri kabul etmeyi reddedebilir veya çerez gönderildiğinde uyarı alabilirsiniz. Tarayıcınızın çerez ayarlarını değiştirmek için tarayıcınızın yardım menüsüne başvurabilirsiniz.
              </p>
              <p className="mb-6">
                Çerezleri devre dışı bırakmak, web sitemizin bazı özelliklerinin düzgün çalışmamasına neden olabilir.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">5. Çerez Politikası Değişiklikleri</h2>
              <p className="mb-6">
                Çerez politikamızı zaman zaman güncelleyebiliriz. Önemli değişiklikler olması durumunda, web sitemizde bir bildirim yayınlayacağız. Bu sayfayı düzenli olarak kontrol etmenizi öneririz.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">6. İletişim</h2>
              <p className="mb-6">
                Çerez politikamız hakkında herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin:
              </p>
              <p className="mb-2">E-posta: bilgi@adalipansiyonedirne.com</p>
              <p className="mb-2">Telefon: 0(284) 213 5527</p>
              <p>Adres: Sarıcapaşa Mah.Şeyh Davut Sk. No:5, 22100 Edirne Merkez/Edirne</p>
            </div>

            <div className="mt-10 pt-6 border-t border-sage-200 flex gap-4">
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
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
