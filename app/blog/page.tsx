"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Edirne'nin En İyi 5 Tarihi Mekanı",
      excerpt: "Edirne'nin zengin tarihini yansıtan en etkileyici 5 tarihi mekanı keşfedin. Selimiye Camii'nden Karaağaç'a kadar...",
      date: "1 Haziran 2025",
      author: "Adalı Pansiyon",
      image: "/selimiye.jpg",
      slug: "edirnede-gezilecek-yerler"
    },
    {
      id: 2,
      title: "Edirne Mutfağından Lezzetler",
      excerpt: "Edirne'nin meşhur ciğerinden tava ciğerine, badem ezmesinden deva-i misk macununa kadar tadılması gereken lezzetler...",
      date: "25 Mayıs 2025",
      author: "Adalı Pansiyon",
      image: "/edirne-mutfagi.jpg",
      slug: "edirne-mutfagindan-lezzetler"
    },
    {
      id: 3,
      title: "Kakava Festivali: Edirne'nin Renkli Bahar Şenliği",
      excerpt: "Her yıl 5-6 Mayıs tarihlerinde düzenlenen, Roman kültürünün en önemli etkinliklerinden Kakava Festivali hakkında bilmeniz gerekenler...",
      date: "10 Mayıs 2025",
      author: "Adalı Pansiyon",
      image: "/kakava.jpg",
      slug: "kakava-festivali"
    },
    {
      id: 4,
      title: "Edirne'de Alışveriş Rehberi",
      excerpt: "Edirne'den ne alınır? Meriç kenarındaki Alipaşa Çarşısı'ndan süpürge ve sabunlara, hediyelik eşyalardan antikalara kadar...",
      date: "2 Mayıs 2025",
      author: "Adalı Pansiyon",
      image: "/alisveris.jpg",
      slug: "edirnede-alisveris-rehberi"
    },
    {
      id: 5,
      title: "Edirne'de Bir Hafta Sonu: Gezi Planı",
      excerpt: "Edirne'yi iki günde keşfetmek isteyenler için ideal rota ve ziyaret edilmesi gereken yerler...",
      date: "15 Nisan 2025",
      author: "Adalı Pansiyon",
      image: "/edirne-gezi.jpg",
      slug: "edirnede-bir-hafta-sonu"
    },
    {
      id: 6,
      title: "Kırkpınar Yağlı Güreşleri: Asırlık Gelenek",
      excerpt: "650 yılı aşkın tarihi ile dünyanın en eski spor organizasyonu olan Kırkpınar Yağlı Güreşleri'nin hikayesi...",
      date: "1 Nisan 2025",
      author: "Adalı Pansiyon",
      image: "/kirkpinar.jpg",
      slug: "kirkpinar-yagli-guresleri"
    }
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-sage-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Edirne'nin tarihi, kültürü, lezzetleri ve daha fazlası hakkında yazılarımız
          </p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sage-600 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                  <span className="mx-1">•</span>
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <CardTitle className="hover:text-sage-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{post.excerpt}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="text-sage-600 hover:text-sage-700 p-0 hover:bg-transparent">
                  <Link href={`/blog/${post.slug}`} className="flex items-center">
                    Devamını Oku <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-sage-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-sage-800">Bültenimize Abone Olun</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-sage-700">
            Edirne'deki etkinlikler, özel teklifler ve blog yazılarımızdan haberdar olmak için bültenimize abone olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="px-4 py-3 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 flex-grow"
            />
            <Button className="bg-sage-600 hover:bg-sage-700 text-white">
              Abone Ol
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
