"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useParams } from "next/navigation";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug;

  // Blog yazılarının verileri
  const blogPosts = [
    {
      id: 4,
      title: "Edirne'de Alışveriş Rehberi",
      excerpt: "Edirne'nin en iyi alışveriş mekanları, hediyelik eşyalar ve yerel lezzetler. Edirne'den ne alınır sorusunun tüm cevapları...",
      date: "2 Haziran 2025",
      author: "Adalı Pansiyon",
      image: "/alisveris.jpg",
      slug: "edirnede-alisveris-rehberi",
      content: `
        <h2>Edirne'de Alışveriş Rehberi</h2>
        
        <p>Edirne, tarihi ve kültürel zenginliklerinin yanı sıra, alışveriş tutkunları için de birçok seçenek sunan bir şehirdir. Geleneksel el sanatlarından yerel lezzetlere, antika eşyalardan modern alışveriş merkezlerine kadar geniş bir yelpazede alışveriş imkanı bulabileceğiniz Edirne'de ne alınır, nereden alınır sorularının cevaplarını bu rehberimizde bulabilirsiniz.</p>
        
        <h3>Edirne'nin Alışveriş Caddeleri ve Çarşıları</h3>
        
        <h4>1. Saraçlar Caddesi</h4>
        <p>Edirne'nin en hareketli alışveriş caddesi olan Saraçlar Caddesi, şehrin kalbinde yer alır. Tarihi binaların arasında uzanan bu yaya caddesinde, yerel mağazalardan ulusal markalara, kafelerden restoranlara kadar birçok seçenek bulabilirsiniz. Özellikle hediyelik eşya dükkanları ve yerel lezzet satan pastaneler için ideal bir duraktır.</p>
        
        <h4>2. Alipaşa Çarşısı</h4>
        <p>1569 yılında Mimar Sinan tarafından inşa edilen tarihi Alipaşa Çarşısı, Edirne'nin en eski kapalı çarşılarından biridir. Çarşıda özellikle süpürge, ayna, sabun gibi geleneksel el sanatları ürünleri ile baharatlar, kuruyemişler ve yerel gıda ürünleri satan dükkanlar bulunmaktadır. Tarihi atmosferi ve otantik ürünleriyle ziyaretçilere nostaljik bir alışveriş deneyimi sunar.</p>
        
        <h4>3. Bedesten</h4>
        <p>15. yüzyılda inşa edilen Bedesten, Edirne'nin tarihi ticaret merkezlerinden biridir. Günümüzde antika eşyalar, el işi ürünler ve hediyelik eşyalar satan dükkanların bulunduğu Bedesten, özellikle koleksiyonerlerin ilgisini çeken bir mekandır.</p>
        
        <h3>Edirne'den Ne Alınır?</h3>
        
        <h4>1. Edirne Sabunu</h4>
        <p>Edirne'nin geleneksel el sanatlarından biri olan sabunculuk, yüzyıllardır devam eden bir zanaattır. Meyve özleri ve doğal yağlarla hazırlanan Edirne sabunları, hem cilt bakımı için idealdir hem de güzel kokusuyla dikkat çeker. Çeşitli renk ve kokularda bulunan bu sabunlar, hem kendiniz için hem de sevdiklerinize hediye olarak alabilirsiniz.</p>
        
        <h4>2. Edirne Süpürgesi</h4>
        <p>Süpürgecilik, Edirne'nin en eski el sanatlarından biridir. Süpürge otu denilen bitkiden yapılan Edirne süpürgeleri, hem kullanışlı hem de dekoratif bir hediyelik eşyadır. Özellikle renkli iplerle süslenmiş mini süpürgeler, popüler hediyelik eşyalar arasındadır.</p>
        
        <h4>3. Misk Sabunu</h4>
        <p>Edirne'nin bir diğer meşhur ürünü olan misk sabunu, geleneksel yöntemlerle üretilen ve kendine has kokusuyla bilinen bir sabun çeşididir. Cilt bakımı için ideal olan bu sabun, Edirne'den alınabilecek en güzel hediyelik eşyalardan biridir.</p>
        
        <h4>4. Badem Ezmesi</h4>
        <p>Edirne'nin meşhur tatlılarından biri olan badem ezmesi, badem, şeker ve az miktarda acıbadem özütü ile hazırlanır. Geleneksel yöntemlerle üretilen bu tatlı, özel kutularda satılır ve uzun süre tazeliğini korur. Edirne'den dönerken sevdiklerinize götürebileceğiniz lezzetli bir hediyedir.</p>
        
        <h4>5. Edirne Peyniri</h4>
        <p>Beyaz peynirin en kaliteli örneklerinden biri olan Edirne peyniri, koyun sütünden yapılır ve kendine has bir lezzete sahiptir. Vakumlu paketlerde satılan bu peynir, Edirne'den alınabilecek en lezzetli hediyelik ürünlerden biridir.</p>
        
        <h4>6. Deva-i Misk Macunu</h4>
        <p>Osmanlı saray mutfağından günümüze ulaşan deva-i misk macunu, 41 çeşit baharat ve bitkinin bal ile karıştırılmasıyla hazırlanır. Hem lezzetli hem de şifalı olduğuna inanılan bu macun, özel kavanozlarda satılır ve Edirne'den alınabilecek ilginç bir hediyedir.</p>
        
        <h3>Alışveriş İçin En İyi Zamanlar</h3>
        <p>Edirne'de alışveriş için en ideal zamanlar, bahar ve sonbahar aylarıdır. Özellikle Mayıs ayında düzenlenen Kakava Festivali ve Haziran-Temmuz aylarında gerçekleşen Kırkpınar Yağlı Güreşleri döneminde, şehirde çeşitli el sanatları sergileri ve yerel ürün pazarları kurulur. Bu dönemlerde daha geniş bir ürün yelpazesi bulabilir ve yerel üreticilerle tanışma fırsatı yakalayabilirsiniz.</p>
        
        <h3>Alışveriş İpuçları</h3>
        <ul>
          <li>Edirne'de alışveriş yaparken, özellikle turistik bölgelerde pazarlık yapabilirsiniz.</li>
          <li>Badem ezmesi ve peynir gibi gıda ürünlerini alırken, üretim ve son kullanma tarihlerine dikkat edin.</li>
          <li>El yapımı ürünlerde küçük farklılıklar olabileceğini unutmayın, bu ürünlerin doğal yapısının bir parçasıdır.</li>
          <li>Alipaşa Çarşısı ve Bedesten gibi tarihi çarşılar genellikle akşam saatlerinde kapanır, alışverişinizi planlarken bunu göz önünde bulundurun.</li>
          <li>Kredi kartı kullanımı yaygın olsa da, küçük dükkanlarda nakit bulundurmakta fayda var.</li>
        </ul>
        
        <p>Edirne'de yapacağınız alışverişlerde, hem kendiniz hem de sevdikleriniz için unutulmaz hatıralar ve lezzetler bulabilirsiniz. Bu tarihi şehrin zengin kültürel mirasını yansıtan ürünleri evlerinize taşıyarak, Edirne'nin eşsiz atmosferini her zaman yanınızda taşıyabilirsiniz.</p>
      `
    },
    {
      id: 1,
      title: "Edirne'nin En İyi 5 Tarihi Mekanı",
      excerpt: "Edirne'nin zengin tarihini yansıtan en etkileyici 5 tarihi mekanı keşfedin. Selimiye Camii'nden Karaağaç'a kadar...",
      date: "1 Haziran 2025",
      author: "Adalı Pansiyon",
      image: "/selimiye.jpg",
      slug: "edirnede-gezilecek-yerler",
      content: `
        <h2>Edirne'nin En İyi 5 Tarihi Mekanı</h2>
        
        <p>Edirne, Osmanlı İmparatorluğu'na 92 yıl başkentlik yapmış, tarih ve kültür açısından çok zengin bir şehirdir. Şehir merkezinde ve çevresinde görülmeye değer birçok tarihi yapı bulunmaktadır. İşte Edirne'de mutlaka görmeniz gereken 5 tarihi mekan:</p>
        
        <h3>1. Selimiye Camii</h3>
        <p>Mimar Sinan'ın "ustalık eserim" dediği, UNESCO Dünya Mirası Listesi'nde yer alan Selimiye Camii, Edirne'nin simgesidir. 1575 yılında tamamlanan cami, mimari açıdan dünyada eşi benzeri olmayan bir yapıdır. Dört zarif minaresi, muhteşem kubbesi ve içerideki eşsiz çini işçiliği ile görenleri büyülemektedir.</p>
        
        <h3>2. Eski Cami</h3>
        <p>Edirne'nin en eski camilerinden biri olan Eski Cami, 1414 yılında tamamlanmıştır. Sade mimarisi ve içerideki hat sanatının en güzel örneklerini barındıran duvarlarıyla dikkat çeker. Caminin içindeki dev hat levhaları, İslam kaligrafisinin en etkileyici örnekleri arasındadır.</p>
        
        <h3>3. Üç Şerefeli Cami</h3>
        <p>Adını dört minaresinden birinin üç şerefeli olmasından alan bu cami, 1447 yılında tamamlanmıştır. Osmanlı mimarisinde çok kubbeli cami yapısının ilk örneklerindendir. Farklı desenlere sahip dört minaresi ile Edirne siluetinin önemli parçalarından biridir.</p>
        
        <h3>4. Karaağaç ve Meriç Köprüsü</h3>
        <p>Edirne'nin Karaağaç semti, tarihi tren garı ve Lozan Anıtı ile ünlüdür. Meriç Nehri üzerindeki tarihi köprüden geçerek ulaşılan bu semt, özellikle günbatımında muhteşem manzaralar sunar. Tarihi tren garı binası günümüzde Trakya Üniversitesi'ne bağlı olarak hizmet vermektedir.</p>
        
        <h3>5. II. Bayezid Külliyesi</h3>
        <p>1488 yılında tamamlanan bu külliye, cami, medrese, imaret ve özellikle de şifahanesi ile ünlüdür. Şifahane bölümü, dönemin en ileri tıp merkezlerinden biri olarak hizmet vermiştir. Günümüzde Sağlık Müzesi olarak ziyarete açık olan bu bölümde, müzik, su sesi ve güzel kokularla hastaların tedavi edildiği odalar bulunmaktadır.</p>
        
        <p>Edirne'yi ziyaret ettiğinizde, bu tarihi mekanların yanı sıra Edirne Sarayı kalıntıları, Macedonian Tower, Ali Paşa Çarşısı ve Saraçlar Caddesi'ni de görmenizi tavsiye ederiz.</p>
      `
    },
    {
      id: 6,
      title: "Kırkpınar Yağlı Güreşleri",
      excerpt: "Türkiye'nin en eski spor organizasyonu ve UNESCO Kültürel Miras Listesi'nde yer alan Kırkpınar Yağlı Güreşleri hakkında her şey...",
      date: "5 Haziran 2025",
      author: "Adalı Pansiyon",
      image: "/kirkpinar.jpg",
      slug: "kirkpinar-yagli-guresleri",
      content: `
        <h2>Kırkpınar Yağlı Güreşleri: Yüzyıllardır Süren Bir Gelenek</h2>
        
        <p>Türkiye'nin en eski spor organizasyonu olan Kırkpınar Yağlı Güreşleri, 661 yıllık geçmişiyle dünyanın en eski spor etkinliklerinden biridir. Her yıl Haziran-Temmuz aylarında Edirne'de düzenlenen bu efsanevi organizasyon, 2010 yılında UNESCO İnsanlığın Somut Olmayan Kültürel Mirası Listesi'ne alınmıştır. Pehlivanların zeytinyağı ile yağlanmış vücutlarıyla mücadele ettikleri bu geleneksel spor, sadece fiziksel güç değil, aynı zamanda strateji, saygı ve centilmenlik gerektiren bir kültürel değerdir.</p>
        
        <h3>Kırkpınar'ın Tarihi</h3>
        <p>Kırkpınar Yağlı Güreşleri'nin tarihi, Osmanlı dönemine kadar uzanır. Rivayete göre, 1346 yılında Sultan Orhan Gazi döneminde, Rumeli'nin fethi sırasında, ordunun dinlenmek için mola verdiği bir yerde, kırk pehlivanın eğlenmek için güreş tuttuğu ve içlerinden ikisinin saatlerce berabere kaldıktan sonra öldükleri, cesetlerinin bir pınarın başında bulunduğu anlatılır. Bu iki pehlivanın anısına "Kırkpınar" adı verilen yerde her yıl güreş müsabakaları düzenlenmeye başlanmıştır. Zamanla bu gelenek Edirne'ye taşınmış ve günümüze kadar gelmiştir.</p>
        
        <h3>Güreş Kategorileri</h3>
        <p>Kırkpınar Yağlı Güreşleri'nde pehlivanlar, aşağıdaki kategorilerde mücadele ederler:</p>
        <ul>
          <li><strong>Baş Pehlivan:</strong> En üst kategori olup, en güçlü ve tecrübeli pehlivanların yarıştığı kategoridir. Baş güreşin galibi "Baş Pehlivan" unvanını alır ve altın kemer sahibi olur.</li>
          <li><strong>Başaltı:</strong> Baş pehlivanlığa aday pehlivanların güreştiği kategoridir.</li>
          <li><strong>Büyük Orta:</strong> Orta seviyedeki pehlivanların güreştiği kategoridir.</li>
          <li><strong>Küçük Orta:</strong> Daha genç ve tecrübesiz pehlivanların güreştiği kategoridir.</li>
          <li><strong>Deste:</strong> En genç pehlivanların güreştiği kategoridir.</li>
        </ul>
        
        <h3>Kırkpınar'da Gelenekler ve Ritüeller</h3>
        
        <h4>1. Peşrev</h4>
        <p>Güreş öncesi pehlivanların yaptığı geleneksel bir ritüel olan peşrev, güreşçilerin fiziksel ve zihinsel olarak hazırlanmasını sağlar. Pehlivanlar, müzik eşliğinde çeşitli hareketler yaparak güçlerini ve çevikliklerini sergilerler. Peşrev sırasında pehlivanlar, rakiplerine saygılarını gösterir ve seyircileri selamlarlar.</p>
        
        <h4>2. Yağlanma</h4>
        <p>Pehlivanlar, güreş öncesi vücutlarını zeytinyağı ile yağlarlar. Bu gelenek, rakibin tutunmasını zorlaştırmak için yapılır ve güreşi daha stratejik bir hale getirir. Yağlama işlemi, genellikle pehlivanların yardımcıları tarafından gerçekleştirilir.</p>
        
        <h4>3. Cazgır'ın Duası</h4>
        <p>Cazgır, güreşleri yöneten ve pehlivanları tanıtan kişidir. Güreş öncesi, cazgır tarafından yapılan dua ve pehlivanların tanıtımı, Kırkpınar'ın en önemli geleneklerinden biridir. Cazgır, maniler ve dualar okuyarak pehlivanları ve seyircileri güreşe hazırlar.</p>
        
        <h4>4. Davul-Zurna Eşliği</h4>
        <p>Kırkpınar Yağlı Güreşleri, geleneksel Türk müziği enstrümanları olan davul ve zurna eşliğinde gerçekleştirilir. Bu müzik, güreşlere ritim ve heyecan katar, aynı zamanda pehlivanların motivasyonunu artırır.</p>
        
        <h3>Altın Kemer</h3>
        <p>Kırkpınar'da başpehlivanlık kategorisinde üç yıl üst üste şampiyon olan güreşçi, altın kemerin ebedi sahibi olur. Bu gelenek, 1969 yılından beri devam etmektedir. Altın kemer, Kırkpınar'ın en prestijli ödülüdür ve pehlivanlar için büyük bir onurdur.</p>
        
        <h3>Kırkpınar Festivali</h3>
        <p>Kırkpınar Yağlı Güreşleri, sadece bir spor etkinliği değil, aynı zamanda büyük bir festival havasında geçer. Güreşlerin yanı sıra, konserler, halk oyunları gösterileri, sergi ve paneller gibi çeşitli kültürel etkinlikler de düzenlenir. Festival süresince Edirne, Türkiye'nin dört bir yanından ve yurt dışından gelen ziyaretçilerle dolup taşar.</p>
        
        <h3>Kırkpınar'a Nasıl Gidilir?</h3>
        <p>Edirne, İstanbul'a yaklaşık 220 km, Ankara'ya ise 650 km uzaklıktadır. Şehre otobüs, tren veya özel araçla ulaşmak mümkündür. Kırkpınar Yağlı Güreşleri, Edirne'nin Sarayiçi bölgesinde bulunan Er Meydanı'nda gerçekleştirilir. Festival döneminde şehir içi ulaşım için özel otobüs seferleri düzenlenir.</p>
        
        <h3>Ziyaretçiler İçin İpuçları</h3>
        <ul>
          <li>Kırkpınar Yağlı Güreşleri genellikle Haziran sonu veya Temmuz başında düzenlenir, kesin tarihler için önceden araştırma yapmanız önerilir.</li>
          <li>Festival döneminde Edirne'deki konaklama tesisleri doluluk yaşar, bu nedenle önceden rezervasyon yaptırmanız tavsiye edilir.</li>
          <li>Güreşler açık havada ve genellikle sıcak yaz günlerinde gerçekleştirilir, bu nedenle şapka, güneş kremi ve bol su bulundurmanız önemlidir.</li>
          <li>Güreşleri izlemek için bilet almanız gerekebilir, biletler genellikle festival alanında veya önceden online olarak satın alınabilir.</li>
          <li>Festival süresince Edirne'nin diğer tarihi ve kültürel mekanlarını da ziyaret etmek için zaman ayırmanız önerilir.</li>
        </ul>
        
        <p>Kırkpınar Yağlı Güreşleri, Türk kültürünün en önemli unsurlarından biridir ve bu eşsiz deneyimi yaşamak, Türkiye'nin geleneksel değerlerini yakından tanımak için mükemmel bir fırsattır. Edirne'yi ziyaret ettiğinizde, bu yüzyıllardır süren geleneğe tanıklık etmek, unutulmaz bir deneyim olacaktır.</p>
      `
    },
    {
      id: 2,
      title: "Edirne Mutfağından Lezzetler",
      excerpt: "Edirne'nin meşhur ciğerinden tava ciğerine, badem ezmesinden deva-i misk macununa kadar tadılması gereken lezzetler...",
      date: "25 Mayıs 2025",
      author: "Adalı Pansiyon",
      image: "/edirne-mutfagi.jpg",
      slug: "edirne-mutfagindan-lezzetler",
      content: `
        <h2>Edirne Mutfağından Lezzetler</h2>
        
        <p>Edirne, tarihi ve kültürel zenginliklerinin yanı sıra, kendine özgü lezzetleriyle de ünlü bir şehirdir. Balkan, Rumeli ve Osmanlı mutfaklarının izlerini taşıyan Edirne mutfağı, ziyaretçilerine unutulmaz tatlar sunar. İşte Edirne'de mutlaka tatmanız gereken lezzetler:</p>
        
        <h3>1. Edirne Tava Ciğeri</h3>
        <p>Edirne denince akla ilk gelen lezzet hiç şüphesiz tava ciğeridir. İnce dilimlenmiş kuzu ciğerinin özel bir şekilde kızartılmasıyla hazırlanan bu yemek, yanında piyaz (soğan salatası) ve acı biber turşusuyla servis edilir. Şehir merkezindeki ciğerci dükkanlarında bu lezzeti tatmadan Edirne'den ayrılmayın.</p>
        
        <h3>2. Edirne Peyniri</h3>
        <p>Beyaz peynirin en kaliteli örneklerinden biri olan Edirne peyniri, koyun sütünden yapılır ve kendine has bir lezzete sahiptir. Kahvaltıların vazgeçilmezi olan bu peynir, aynı zamanda çeşitli böreklerin de ana malzemesidir.</p>
        
        <h3>3. Badem Ezmesi</h3>
        <p>Edirne'nin meşhur tatlılarından biri olan badem ezmesi, badem, şeker ve az miktarda acıbadem özütü ile hazırlanır. Geleneksel yöntemlerle üretilen bu tatlı, hem hediyelik olarak alınabilir hem de yerinde tadılabilir.</p>
        
        <h3>4. Deva-i Misk Macunu</h3>
        <p>Osmanlı saray mutfağından günümüze ulaşan deva-i misk macunu, 41 çeşit baharat ve bitkinin bal ile karıştırılmasıyla hazırlanır. Hem lezzetli hem de şifalı olduğuna inanılan bu macun, Edirne'nin sokak lezzetleri arasında yer alır.</p>
        
        <h3>5. Edirne Köftesi</h3>
        <p>Edirne'nin bir diğer meşhur lezzeti olan Edirne köftesi, ızgara üzerinde pişirilen, baharatlı ve sulu bir köfte çeşididir. Yanında piyaz ve acı biberle servis edilir.</p>
        
        <h3>6. Mamzana</h3>
        <p>Edirne'nin geleneksel tatlılarından biri olan mamzana, un, süt ve tereyağı ile hazırlanan bir muhallebidir. Üzerine tarçın serpilerek servis edilir.</p>
        
        <h3>7. Zirva</h3>
        <p>Edirne'ye özgü bir diğer tatlı olan zirva, un, süt ve şekerle hazırlanan bir tür helva çeşididir. Özellikle kış aylarında tercih edilen bu tatlı, enerji vermesiyle bilinir.</p>
        
        <p>Edirne'yi ziyaret ettiğinizde, bu lezzetlerin yanı sıra kavala kurabiyesi, Edirne simidi ve hardaliyeyi (üzüm suyundan yapılan bir içecek) de tatmanızı öneririz.</p>
      `
    },
    {
      id: 5,
      title: "Edirne'de Bir Hafta Sonu",
      excerpt: "48 saatte Edirne'nin en güzel yerlerini keşfetmek için ideal rota. Tarihi mekanlar, lezzetli yemekler ve unutulmaz deneyimler...",
      date: "3 Haziran 2025",
      author: "Adalı Pansiyon",
      image: "/edirne-gezi.jpg",
      slug: "edirnede-bir-hafta-sonu",
      content: `
        <h2>Edirne'de Mükemmel Bir Hafta Sonu Geçirme Rehberi</h2>
        
        <p>Edirne, zengin tarihi, muhteşem mimarisi, lezzetli mutfağı ve sıcak insanıyla kısa süreli ziyaretler için bile unutulmaz deneyimler sunan bir şehirdir. Eğer sadece bir hafta sonunuz varsa ve bu sürede Edirne'nin en güzel yerlerini görmek istiyorsanız, işte size 48 saatlik ideal bir Edirne rotasi.</p>
        
        <h3>1. Gün: Tarihi Keşif</h3>
        
        <h4>Sabah (09:00 - 12:00)</h4>
        <p>Gününüze erken başlayın ve kahvaltınızı Edirne'nin meşhur peyniri, kaymak ve taze ekmekle yapın. Kahvaltının ardından, şehrin en önemli simgesi olan <strong>Selimiye Camii</strong>'ni ziyaret edin. Mimar Sinan'ın "ustalık eserim" dediği bu muhteşem yapı, UNESCO Dünya Mirası Listesi'nde yer almaktadır. Caminin iç kısmını gezerken, eşsiz çini işçiliğine ve mimari detaylara dikkat edin. Caminin yanında bulunan <strong>Türk İslam Eserleri Müzesi</strong>'ni de ziyaret ederek, Osmanlı dönemine ait eserleri görebilirsiniz.</p>
        
        <h4>Öğle (12:00 - 14:00)</h4>
        <p>Öğle yemeği için, Edirne'nin meşhur tava ciğerini tatmanın tam zamanı. Şehir merkezinde bulunan ciğerci dükkanlarından birinde, ince dilimlenmiş kuzu ciğerini, yanında piyaz (soğan salatası) ve acı biber turşusuyla deneyebilirsiniz. Yemekten sonra kısa bir yürüyüşle <strong>Eski Cami</strong> ve <strong>Üç Şerefeli Cami</strong>'yi ziyaret edin. Bu iki tarihi cami, Osmanlı mimarisinin güzel örneklerini sergiler.</p>
        
        <h4>Öğleden Sonra (14:00 - 18:00)</h4>
        <p>Saraçlar Caddesi boyunca yürüyerek, yerel dükkanlarda alışveriş yapabilir ve hediyelik eşyalar alabilirsiniz. Özellikle Edirne sabunu, badem ezmesi ve süpürgesi popüler hediyelik eşyalardır. Daha sonra <strong>Edirne Arkeoloji ve Etnografya Müzesi</strong>'ni ziyaret ederek, bölgenin tarih öncesi dönemlerinden Osmanlı dönemine kadar uzanan zengin koleksiyonunu görebilirsiniz.</p>
        
        <h4>Akşam (18:00 - 22:00)</h4>
        <p>Günün yorgunluğunu atmak için, Meriç Nehri kıyısında bir yaz akşamı geçirebilirsiniz. Nehir kenarındaki kafelerden birinde oturup, günbatımını izleyebilir ve yerel tatları deneyebilirsiniz. Akşam yemeği için, Edirne'nin geleneksel yemeklerini sunan bir restoranda, köfte, yaprak sarması ve mamzana gibi lezzetleri tadabilirsiniz.</p>
        
        <h3>2. Gün: Kültür ve Doğa</h3>
        
        <h4>Sabah (09:00 - 12:00)</h4>
        <p>Gününüze yine lezzetli bir Edirne kahvaltısıyla başladıktan sonra, <strong>II. Bayezid Külliyesi Sağlık Müzesi</strong>'ni ziyaret edin. 1488 yılında inşa edilen bu külliye, döneminin en ileri tıp merkezi olarak hizmet vermiştir. Müzede, Osmanlı döneminde müzik, su sesi ve güzel kokularla hastaların nasıl tedavi edildiğini öğrenebilirsiniz.</p>
        
        <h4>Öğle (12:00 - 14:00)</h4>
        <p>Öğle yemeği için, Edirne'nin bir diğer ünlü lezzeti olan Edirne köftesini deneyebilirsiniz. Şehir merkezindeki köftecilerde, ızgara üzerinde pişirilen, baharatlı ve sulu köfteleri, yanında piyaz ve acı biberle tadabilirsiniz.</p>
        
        <h4>Öğleden Sonra (14:00 - 18:00)</h4>
        <p>Yemekten sonra, Edirne'nin Karaağaç semtine giderek, <strong>Lozan Anıtı ve Müzesi</strong>'ni ziyaret edin. Tarihi tren garı binasında bulunan müzede, Lozan Barış Antlaşması'na dair belge ve fotoğrafları görebilirsiniz. Karaağaç'ta yürüyüş yaparak, Meriç Nehri üzerindeki tarihi köprüyü ve güzel manzarayı görebilirsiniz.</p>
        
        <h4>Akşam (18:00 - 22:00)</h4>
        <p>Edirne'deki son akşamınız için, şehir merkezindeki restoranlardan birinde, Edirne mutfağının diğer lezzetlerini deneyebilirsiniz. Yemekten sonra, tarihi Selimiye Camii'nin gece aydınlatması altındaki muhteşem görüntüsünü izleyerek, Edirne'deki hafta sonunuzu tamamlayabilirsiniz.</p>
        
        <h3>Konaklama Önerileri</h3>
        <p>Edirne'de konaklama için, tarihi dokuyu yansıtan butik oteller veya konaklar tercih edilebilir. Özellikle Kaleiçi bölgesindeki tarihi konaklarda kalarak, Osmanlı atmosferini yaşayabilirsiniz. Tabii ki Adalı Pansiyon olarak biz de size sıcak ve konforlu bir konaklama deneyimi sunmaktan mutluluk duyarız.</p>
        
        <h3>Ulaşım İpuçları</h3>
        <p>Edirne şehir merkezi, yürüyerek keşfedilebilecek kadar küçüktür. Ana turistik mekanların çoğu birbirine yakın mesafededir. Ancak Karaağaç gibi daha uzak semtlere gitmek için, yerel otobüsleri veya taksileri kullanabilirsiniz. Ayrıca, şehir merkezinde bisiklet kiralama hizmeti de bulunmaktadır.</p>
        
        <h3>Hafta Sonu İçin En İyi Zamanlar</h3>
        <p>Edirne'yi ziyaret etmek için en ideal zamanlar, ilkbahar (Nisan-Mayıs) ve sonbahar (Eylül-Ekim) aylarıdır. Bu dönemlerde hava genellikle ılıman ve turistik mekanlar daha az kalabalıktır. Özellikle Mayıs ayında düzenlenen Kakava Festivali ve Haziran-Temmuz aylarında gerçekleşen Kırkpınar Yağlı Güreşleri döneminde, şehirde renkli etkinlikler ve canlı bir atmosfer bulabilirsiniz.</p>
        
        <p>Edirne'de geçireceğiniz bir hafta sonu, size tarihi, kültürü, lezzetleri ve sıcak insanıyla unutulmaz anılar bırakacaktır. Bu kısa sürede bile, şehrin en önemli noktalarını görebilir ve Edirne'nin eşsiz atmosferini yaşayabilirsiniz.</p>
      `
    },
    {
      id: 3,
      title: "Kakava Festivali: Edirne'nin Renkli Bahar Şenliği",
      excerpt: "Her yıl 5-6 Mayıs tarihlerinde düzenlenen, Roman kültürünün en önemli etkinliklerinden Kakava Festivali hakkında bilmeniz gerekenler...",
      date: "10 Mayıs 2025",
      author: "Adalı Pansiyon",
      image: "/kakava.jpg",
      slug: "kakava-festivali",
      content: `
        <h2>Kakava Festivali: Edirne'nin Renkli Bahar Şenliği</h2>
        
        <p>Edirne'nin en renkli ve coşkulu etkinliklerinden biri olan Kakava Festivali, her yıl 5-6 Mayıs tarihlerinde düzenlenir. Roman kültürünün en önemli bayramlarından biri olan Kakava, baharın gelişini ve doğanın uyanışını kutlayan, yüzyıllardır süregelen bir gelenektir.</p>
        
        <h3>Kakava Festivali'nin Tarihi</h3>
        <p>Kakava'nın kökeni, Hint-Avrupa kökenli göçebe toplulukların bahar bayramlarına dayanır. Romanların Hindistan'dan Anadolu'ya göç ettikleri dönemde beraberlerinde getirdikleri bu gelenek, zamanla Trakya bölgesinde yaygınlaşmış ve günümüze kadar ulaşmıştır. Festival, UNESCO tarafından "Somut Olmayan Kültürel Miras" listesine alınmıştır.</p>
        
        <h3>Festivalin Ritüelleri</h3>
        <p>Kakava Festivali, bir dizi geleneksel ritüeli içerir:</p>
        
        <h4>1. Ateş Yakma ve Atlama</h4>
        <p>Festivalin en önemli ritüellerinden biri, 5 Mayıs akşamı yakılan büyük ateşin etrafında dans edilmesi ve gece yarısından sonra bu ateşin üzerinden atlanmasıdır. Ateşin üzerinden atlayan kişilerin günahlarından arındığına ve hastalıklardan korunduğuna inanılır.</p>
        
        <h4>2. Sarayiçi'nde Kutlamalar</h4>
        <p>6 Mayıs sabahı, festival katılımcıları Edirne'nin Sarayiçi bölgesine gider. Burada Tunca Nehri kıyısında müzik eşliğinde dans edilir, yemekler yenir ve çeşitli eğlenceler düzenlenir.</p>
        
        <h4>3. Suda Arınma</h4>
        <p>Festivalde bir diğer önemli ritüel, Tunca Nehri'nde yüzülmesi veya suya girilmesidir. Bu ritüelin sağlık ve bereket getirdiğine inanılır.</p>
        
        <h4>4. Dilek Tutma</h4>
        <p>Katılımcılar, nehir kıyısındaki ağaçlara renkli kurdeleler bağlayarak dilek tutarlar. Bu kurdeleler, dileklerin gerçekleşmesi için bir sembol olarak kabul edilir.</p>
        
        <h3>Festival Atmosferi</h3>
        <p>Kakava Festivali, renkli kostümleri, canlı müziği ve dans gösterileriyle tam bir görsel şölendir. Roman müziğinin vazgeçilmez enstrümanları olan davul, zurna ve klarnet eşliğinde yapılan danslar, festivalin en dikkat çekici unsurlarındandır. Festival boyunca Edirne sokakları, Roman müziği ve dans gösterileriyle dolup taşar.</p>
        
        <h3>Ziyaretçiler İçin Öneriler</h3>
        <p>Eğer Kakava Festivali döneminde Edirne'yi ziyaret etmeyi planlıyorsanız, şu noktalara dikkat etmenizde fayda var:</p>
        <ul>
          <li>Festival döneminde Edirne'deki konaklama tesisleri genellikle dolar, bu nedenle önceden rezervasyon yaptırmanız önerilir.</li>
          <li>5 Mayıs akşamı ateş yakma töreni için sıcak tutacak giysiler getirin, gecenin ilerleyen saatlerinde hava serinleyebilir.</li>
          <li>6 Mayıs günü Sarayiçi'ndeki etkinlikler için rahat ayakkabılar ve güneş koruyucu ürünler bulundurun.</li>
          <li>Festivalde çekilen fotoğraflar için yerel halktan izin almayı unutmayın.</li>
        </ul>
        
        <p>Kakava Festivali, sadece Romanların değil, tüm Edirnelilerin ve Türkiye'nin dört bir yanından gelen ziyaretçilerin katılımıyla gerçekleşen, kültürler arası diyaloğu güçlendiren önemli bir etkinliktir. Bu renkli bahar şenliğini deneyimlemek, Edirne'nin kültürel zenginliğini yakından tanımak için eşsiz bir fırsattır.</p>
      `
    }
  ];

  // URL'deki slug ile eşleşen blog yazısını bul
  const post = blogPosts.find(post => post.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-sage-800 mb-4">Yazı Bulunamadı</h1>
          <p className="text-sage-600 mb-6">Aradığınız blog yazısı bulunamadı.</p>
          <Button asChild>
            <Link href="/blog" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Blog'a Dön
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-sage-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">{post.title}</h1>
          <div className="flex items-center justify-center gap-3 text-sage-200 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
            <span className="mx-1">•</span>
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-96 mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content - Zenginleştirilmiş Blog İçeriği */}
          <div className="px-8 pb-12">
            {post.slug === "edirnede-gezilecek-yerler" && (
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-sage-800 mb-4 border-b-2 border-sage-300 pb-2 inline-block">Edirne'nin En İyi 5 Tarihi Mekanı</h2>
                  <p className="text-lg text-sage-600 italic">Tarih ve kültürün buluştuğu şehir Edirne'nin en etkileyici mekanları</p>
                </div>
                
                <p className="text-lg text-sage-700 leading-relaxed">Edirne, Osmanlı İmparatorluğu'na 92 yıl başkentlik yapmış, tarih ve kültür açısından çok zengin bir şehirdir. Şehir merkezinde ve çevresinde görülmeye değer birçok tarihi yapı bulunmaktadır. İşte Edirne'de mutlaka görmeniz gereken 5 tarihi mekan:</p>
                
                <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                  <h3 className="text-2xl font-bold text-sage-800 mb-3 flex items-center">
                    <span className="bg-sage-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                    Selimiye Camii
                  </h3>
                  <p className="text-sage-700 leading-relaxed">Mimar Sinan'ın "ustalık eserim" dediği, UNESCO Dünya Mirası Listesi'nde yer alan Selimiye Camii, Edirne'nin simgesidir. 1575 yılında tamamlanan cami, mimari açıdan dünyada eşi benzeri olmayan bir yapıdır. Dört zarif minaresi, muhteşem kubbesi ve içerideki eşsiz çini işçiliği ile görenleri büyülemektedir.</p>
                </div>
                
                <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                  <h3 className="text-2xl font-bold text-sage-800 mb-3 flex items-center">
                    <span className="bg-sage-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                    Eski Cami
                  </h3>
                  <p className="text-sage-700 leading-relaxed">Edirne'nin en eski camilerinden biri olan Eski Cami, 1414 yılında tamamlanmıştır. Sade mimarisi ve içerideki hat sanatının en güzel örneklerini barındıran duvarlarıyla dikkat çeker. Caminin içindeki dev hat levhaları, İslam kaligrafisinin en etkileyici örnekleri arasındadır.</p>
                </div>
                
                <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                  <h3 className="text-2xl font-bold text-sage-800 mb-3 flex items-center">
                    <span className="bg-sage-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                    Üç Şerefeli Cami
                  </h3>
                  <p className="text-sage-700 leading-relaxed">Adını dört minaresinden birinin üç şerefeli olmasından alan bu cami, 1447 yılında tamamlanmıştır. Osmanlı mimarisinde çok kubbeli cami yapısının ilk örneklerindendir. Farklı desenlere sahip dört minaresi ile Edirne siluetinin önemli parçalarından biridir.</p>
                </div>
                
                <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                  <h3 className="text-2xl font-bold text-sage-800 mb-3 flex items-center">
                    <span className="bg-sage-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                    Karaağaç ve Meriç Köprüsü
                  </h3>
                  <p className="text-sage-700 leading-relaxed">Edirne'nin Karaağaç semti, tarihi tren garı ve Lozan Anıtı ile ünlüdür. Meriç Nehri üzerindeki tarihi köprüden geçerek ulaşılan bu semt, özellikle günbatımında muhteşem manzaralar sunar. Tarihi tren garı binası günümüzde Trakya Üniversitesi'ne bağlı olarak hizmet vermektedir.</p>
                </div>
                
                <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                  <h3 className="text-2xl font-bold text-sage-800 mb-3 flex items-center">
                    <span className="bg-sage-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                    II. Bayezid Külliyesi
                  </h3>
                  <p className="text-sage-700 leading-relaxed">1488 yılında tamamlanan bu külliye, cami, medrese, imaret ve özellikle de şifahanesi ile ünlüdür. Şifahane bölümü, dönemin en ileri tıp merkezlerinden biri olarak hizmet vermiştir. Günümüzde Sağlık Müzesi olarak ziyarete açık olan bu bölümde, müzik, su sesi ve güzel kokularla hastaların tedavi edildiği odalar bulunmaktadır.</p>
                </div>
                
                <div className="bg-cream-100 p-6 rounded-lg border border-sage-200 mt-10">
                  <p className="text-sage-700 leading-relaxed">Edirne'yi ziyaret ettiğinizde, bu tarihi mekanların yanı sıra Edirne Sarayı kalıntıları, Macedonian Tower, Ali Paşa Çarşısı ve Saraçlar Caddesi'ni de görmenizi tavsiye ederiz.</p>
                </div>
              </div>
            )}

            {post.slug === "edirne-mutfagindan-lezzetler" && (
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-sage-800 mb-4 border-b-2 border-sage-300 pb-2 inline-block">Edirne Mutfağından Lezzetler</h2>
                  <p className="text-lg text-sage-600 italic">Damak tadınıza hitap edecek eşsiz tatlar</p>
                </div>
                
                <p className="text-lg text-sage-700 leading-relaxed">Edirne, tarihi ve kültürel zenginliklerinin yanı sıra, kendine özgü lezzetleriyle de ünlü bir şehirdir. Balkan, Rumeli ve Osmanlı mutfaklarının izlerini taşıyan Edirne mutfağı, ziyaretçilerine unutulmaz tatlar sunar. İşte Edirne'de mutlaka tatmanız gereken lezzetler:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                    <h3 className="text-xl font-bold text-sage-800 mb-3">Edirne Tava Ciğeri</h3>
                    <p className="text-sage-700">Edirne denince akla ilk gelen lezzet hiç şüphesiz tava ciğeridir. İnce dilimlenmiş kuzu ciğerinin özel bir şekilde kızartılmasıyla hazırlanan bu yemek, yanında piyaz (soğan salatası) ve acı biber turşusuyla servis edilir.</p>
                  </div>
                  
                  <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                    <h3 className="text-xl font-bold text-sage-800 mb-3">Edirne Peyniri</h3>
                    <p className="text-sage-700">Beyaz peynirin en kaliteli örneklerinden biri olan Edirne peyniri, koyun sütünden yapılır ve kendine has bir lezzete sahiptir. Kahvaltıların vazgeçilmezi olan bu peynir, aynı zamanda çeşitli böreklerin de ana malzemesidir.</p>
                  </div>
                  
                  <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                    <h3 className="text-xl font-bold text-sage-800 mb-3">Badem Ezmesi</h3>
                    <p className="text-sage-700">Edirne'nin meşhur tatlılarından biri olan badem ezmesi, badem, şeker ve az miktarda acıbadem özütü ile hazırlanır. Geleneksel yöntemlerle üretilen bu tatlı, hem hediyelik olarak alınabilir hem de yerinde tadılabilir.</p>
                  </div>
                  
                  <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                    <h3 className="text-xl font-bold text-sage-800 mb-3">Deva-i Misk Macunu</h3>
                    <p className="text-sage-700">Osmanlı saray mutfağından günümüze ulaşan deva-i misk macunu, 41 çeşit baharat ve bitkinin bal ile karıştırılmasıyla hazırlanır. Hem lezzetli hem de şifalı olduğuna inanılan bu macun, Edirne'nin sokak lezzetleri arasında yer alır.</p>
                  </div>
                  
                  <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                    <h3 className="text-xl font-bold text-sage-800 mb-3">Edirne Köftesi</h3>
                    <p className="text-sage-700">Edirne'nin bir diğer meşhur lezzeti olan Edirne köftesi, ızgara üzerinde pişirilen, baharatlı ve sulu bir köfte çeşididir. Yanında piyaz ve acı biberle servis edilir.</p>
                  </div>
                  
                  <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                    <h3 className="text-xl font-bold text-sage-800 mb-3">Mamzana</h3>
                    <p className="text-sage-700">Edirne'nin geleneksel tatlılarından biri olan mamzana, un, süt ve tereyağı ile hazırlanan bir muhallebidir. Üzerine tarçın serpilerek servis edilir.</p>
                  </div>
                </div>
                
                <div className="bg-cream-100 p-6 rounded-lg border border-sage-200 mt-8">
                  <p className="text-sage-700 font-medium">Edirne'yi ziyaret ettiğinizde, bu lezzetlerin yanı sıra kavala kurabiyesi, Edirne simidi ve hardaliyeyi (üzüm suyundan yapılan bir içecek) de tatmanızı öneririz.</p>
                </div>
              </div>
            )}

            {post.slug === "kakava-festivali" && (
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-sage-800 mb-4 border-b-2 border-sage-300 pb-2 inline-block">Kakava Festivali: Edirne'nin Renkli Bahar Şenliği</h2>
                  <p className="text-lg text-sage-600 italic">Baharın gelişini kutlayan yüzyıllık gelenek</p>
                </div>
                
                <p className="text-lg text-sage-700 leading-relaxed">Edirne'nin en renkli ve coşkulu etkinliklerinden biri olan Kakava Festivali, her yıl 5-6 Mayıs tarihlerinde düzenlenir. Roman kültürünün en önemli bayramlarından biri olan Kakava, baharın gelişini ve doğanın uyanışını kutlayan, yüzyıllardır süregelen bir gelenektir.</p>
                
                <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                  <h3 className="text-2xl font-bold text-sage-800 mb-3">Kakava Festivali'nin Tarihi</h3>
                  <p className="text-sage-700 leading-relaxed">Kakava'nın kökeni, Hint-Avrupa kökenli göçebe toplulukların bahar bayramlarına dayanır. Romanların Hindistan'dan Anadolu'ya göç ettikleri dönemde beraberlerinde getirdikleri bu gelenek, zamanla Trakya bölgesinde yaygınlaşmış ve günümüze kadar ulaşmıştır. Festival, UNESCO tarafından "Somut Olmayan Kültürel Miras" listesine alınmıştır.</p>
                </div>
                
                <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                  <h3 className="text-2xl font-bold text-sage-800 mb-3">Festivalin Ritüelleri</h3>
                  <p className="text-sage-700 mb-4">Kakava Festivali, bir dizi geleneksel ritüeli içerir:</p>
                  
                  <div className="space-y-4 pl-4">
                    <div className="border-l-2 border-sage-400 pl-4 py-2">
                      <h4 className="text-xl font-semibold text-sage-800 mb-2">1. Ateş Yakma ve Atlama</h4>
                      <p className="text-sage-700">Festivalin en önemli ritüellerinden biri, 5 Mayıs akşamı yakılan büyük ateşin etrafında dans edilmesi ve gece yarısından sonra bu ateşin üzerinden atlanmasıdır. Ateşin üzerinden atlayan kişilerin günahlarından arındığına ve hastalıklardan korunduğuna inanılır.</p>
                    </div>
                    
                    <div className="border-l-2 border-sage-400 pl-4 py-2">
                      <h4 className="text-xl font-semibold text-sage-800 mb-2">2. Sarayiçi'nde Kutlamalar</h4>
                      <p className="text-sage-700">6 Mayıs sabahı, festival katılımcıları Edirne'nin Sarayiçi bölgesine gider. Burada Tunca Nehri kıyısında müzik eşliğinde dans edilir, yemekler yenir ve çeşitli eğlenceler düzenlenir.</p>
                    </div>
                    
                    <div className="border-l-2 border-sage-400 pl-4 py-2">
                      <h4 className="text-xl font-semibold text-sage-800 mb-2">3. Suda Arınma</h4>
                      <p className="text-sage-700">Festivalde bir diğer önemli ritüel, Tunca Nehri'nde yüzülmesi veya suya girilmesidir. Bu ritüelin sağlık ve bereket getirdiğine inanılır.</p>
                    </div>
                    
                    <div className="border-l-2 border-sage-400 pl-4 py-2">
                      <h4 className="text-xl font-semibold text-sage-800 mb-2">4. Dilek Tutma</h4>
                      <p className="text-sage-700">Katılımcılar, nehir kıyısındaki ağaçlara renkli kurdeleler bağlayarak dilek tutarlar. Bu kurdeleler, dileklerin gerçekleşmesi için bir sembol olarak kabul edilir.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                  <h3 className="text-2xl font-bold text-sage-800 mb-3">Festival Atmosferi</h3>
                  <p className="text-sage-700 leading-relaxed">Kakava Festivali, renkli kostümleri, canlı müziği ve dans gösterileriyle tam bir görsel şölendir. Roman müziğinin vazgeçilmez enstrümanları olan davul, zurna ve klarnet eşliğinde yapılan danslar, festivalin en dikkat çekici unsurlarındandır. Festival boyunca Edirne sokakları, Roman müziği ve dans gösterileriyle dolup taşar.</p>
                </div>
                
                <div className="bg-sage-50 p-6 rounded-lg border-l-4 border-sage-600 shadow-sm">
                  <h3 className="text-2xl font-bold text-sage-800 mb-3">Ziyaretçiler İçin Öneriler</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sage-700">
                    <li>Festival döneminde Edirne'deki konaklama tesisleri genellikle dolar, bu nedenle önceden rezervasyon yaptırmanız önerilir.</li>
                    <li>5 Mayıs akşamı ateş yakma töreni için sıcak tutacak giysiler getirin, gecenin ilerleyen saatlerinde hava serinleyebilir.</li>
                    <li>6 Mayıs günü Sarayiçi'ndeki etkinlikler için rahat ayakkabılar ve güneş koruyucu ürünler bulundurun.</li>
                    <li>Festivalde çekilen fotoğraflar için yerel halktan izin almayı unutmayın.</li>
                  </ul>
                </div>
                
                <div className="bg-cream-100 p-6 rounded-lg border border-sage-200 mt-8">
                  <p className="text-sage-700 leading-relaxed">Kakava Festivali, sadece Romanların değil, tüm Edirnelilerin ve Türkiye'nin dört bir yanından gelen ziyaretçilerin katılımıyla gerçekleşen, kültürler arası diyaloğu güçlendiren önemli bir etkinliktir. Bu renkli bahar şenliğini deneyimlemek, Edirne'nin kültürel zenginliğini yakından tanımak için eşsiz bir fırsattır.</p>
                </div>
              </div>
            )}

            {/* Diğer blog yazıları için içerikler buraya eklenebilir */}
            {!['edirnede-gezilecek-yerler', 'edirne-mutfagindan-lezzetler', 'kakava-festivali'].includes(post.slug) && (
              <div className="prose prose-sage max-w-none" dangerouslySetInnerHTML={{ __html: post.content }}></div>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-12 border-t border-sage-200 pt-8">
            <Button asChild variant="outline" className="text-sage-600">
              <Link href="/blog" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" /> Tüm Yazılara Dön
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <div className="bg-sage-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-sage-800">İlgili Yazılar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts
              .filter(relatedPost => relatedPost.id !== post.id)
              .slice(0, 3)
              .map(relatedPost => (
                <div key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-sage-800 mb-2">
                      <Link href={`/blog/${relatedPost.slug}`} className="hover:text-sage-600 transition-colors">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-sage-600 mb-4">{relatedPost.excerpt}</p>
                    <Button asChild variant="ghost" className="text-sage-600 p-0 hover:bg-transparent">
                      <Link href={`/blog/${relatedPost.slug}`} className="flex items-center">
                        Devamını Oku
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
