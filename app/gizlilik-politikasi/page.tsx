import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-sage-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gizlilik Politikası</h1>
          <p className="text-xl text-sage-200 max-w-2xl mx-auto">
            Kişisel verilerinizin korunması ve gizliliğiniz bizim için önemlidir.
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
                Adalı Pansiyon Edirne olarak kişisel verilerinizin güvenliği konusunda büyük hassasiyet göstermekteyiz. Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde veya hizmetlerimizi kullandığınızda kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">2. Toplanan Bilgiler</h2>
              <p className="mb-4">
                Sizden aşağıdaki kişisel bilgileri toplayabiliriz:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Ad, soyad, e-posta adresi, telefon numarası gibi iletişim bilgileri</li>
                <li>Rezervasyon tarihleri, oda tercihleri, özel istekler</li>
                <li>Ödeme bilgileri (kredi kartı bilgileri doğrudan tarafımızca saklanmaz)</li>
                <li>Web sitemizi nasıl kullandığınıza dair bilgiler</li>
                <li>Cihaz bilgileri ve IP adresi</li>
              </ul>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">3. Bilgilerin Kullanımı</h2>
              <p className="mb-4">
                Topladığımız bilgileri aşağıdaki amaçlar için kullanırız:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Rezervasyonunuzu yönetmek ve teyit etmek</li>
                <li>Size hizmetlerimiz hakkında bilgi sağlamak</li>
                <li>Özel isteklerinizi karşılamak</li>
                <li>Müşteri hizmetleri sağlamak</li>
                <li>Web sitemizi ve hizmetlerimizi geliştirmek</li>
                <li>Yasal yükümlülüklerimizi yerine getirmek</li>
              </ul>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">4. Bilgilerin Paylaşımı</h2>
              <p className="mb-6">
                Kişisel bilgilerinizi, yasal zorunluluklar dışında, açık rızanız olmadan üçüncü taraflarla paylaşmayız. Bilgilerinizi aşağıdaki durumlarda paylaşabiliriz:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Hizmet sağlayıcılarımız (rezervasyon sistemleri, ödeme işlemcileri gibi)</li>
                <li>Yasal zorunluluk durumunda (mahkeme kararı veya yasal süreç)</li>
                <li>İşletmemizin satılması veya birleşmesi durumunda</li>
              </ul>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">5. Çerezler ve Takip Teknolojileri</h2>
              <p className="mb-6">
                Web sitemiz, deneyiminizi geliştirmek için çerezleri ve benzer teknolojileri kullanır. Bu teknolojiler hakkında daha fazla bilgi için <Link href="/cerez-politikasi" className="text-sage-600 hover:text-sage-800 underline">Çerez Politikamızı</Link> inceleyebilirsiniz.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">6. Veri Güvenliği</h2>
              <p className="mb-6">
                Kişisel verilerinizi korumak için uygun teknik ve organizasyonel önlemler alıyoruz. Ancak, internet üzerinden hiçbir veri iletiminin %100 güvenli olmadığını unutmayın.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">7. Haklarınız</h2>
              <p className="mb-4">
                Kişisel verilerinizle ilgili olarak aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Verilerinize erişim talep etme</li>
                <li>Verilerinizin düzeltilmesini talep etme</li>
                <li>Verilerinizin silinmesini talep etme</li>
                <li>Verilerinizin işlenmesine itiraz etme</li>
                <li>Veri taşınabilirliği talep etme</li>
              </ul>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">8. Değişiklikler</h2>
              <p className="mb-6">
                Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olması durumunda, web sitemizde bir bildirim yayınlayacağız.
              </p>

              <h2 className="text-2xl font-semibold text-sage-800 mb-4">9. İletişim</h2>
              <p className="mb-6">
                Gizlilik politikamız veya kişisel verilerinizle ilgili herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin:
              </p>
              <p className="mb-2">E-posta: bilgi@adalipansiyonedirne.com</p>
              <p className="mb-2">Telefon: 0(284) 213 5527</p>
              <p>Adres: Sarıcapaşa Mah.Şeyh Davut Sk. No:5, 22100 Edirne Merkez/Edirne</p>
            </div>

            <div className="mt-10 pt-6 border-t border-sage-200">
              <Link href="/" passHref>
                <Button variant="outline" className="text-sage-700 border-sage-300">
                  Ana Sayfaya Dön
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
