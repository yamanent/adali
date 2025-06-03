"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "Tümü" },
    { id: "rooms", name: "Odalar" },
    { id: "garden", name: "Bahçe" },
    { id: "common", name: "Ortak Alanlar" },
    { id: "disgorunum", name: "Dış Görünüm" },
  ]

  const images = [
    {
      id: 1,
      src: "/227666993.jpg?height=400&width=600",
      alt: "Tarihi Merkeze Yakın Suit",
      category: "rooms",
      title: "",
    },
    {
      id: 2,
      src: "/226188560.jpg?height=400&width=600",
      alt: "Bahçe Manzarası",
      category: "garden",
      title: "",
    },
    {
      id: 3,
      src: "/227666582.jpg?height=400&width=600",
      alt: "Resepsiyon Alanı",
      category: "garden",
      title: "",
    },
    {
      id: 4,
      src: "/227666999.jpg?height=400&width=600",
      alt: "Tarihi Merkez Manzarası",
      category: "garden",
      title: "",
    },
    {
      id: 5,
      src: "/227667008.jpg?height=400&width=600",
      alt: "Aile Odası",
      category: "rooms",
      title: "",
    },
    {
      id: 6,
      src: "/227667320.jpg?height=400&width=600",
      alt: "Bahçe Oturma Alanı",
      category: "rooms",
      title: "",
    },
    {
      id: 7,
      src: "/227668163.jpg?height=400&width=600",
      alt: "Kahvaltı Salonu",
      category: "common",
      title: "",
    },
    {
      id: 8,
      src: "/253421065.jpg?height=400&width=600",
      alt: "Tarihi Sokak Yürüyüşü",
      category: "rooms",
      title: "",
    },
    {
      id: 9,
      src: "/253575921.jpg?height=400&width=600",
      alt: "Balayı Suit",
      category: "rooms",
      title: "",
    },
    {
      id: 10,
      src: "/253577261.jpg?height=400&width=600",
      alt: "Çiçek Bahçesi",
      category: "rooms",
      title: "",
    },
    {
      id: 11,
      src: "/253582481.jpg?height=400&width=600",
      alt: "Terras Alanı",
      category: "rooms",
      title: "",
    },
    {
      id: 12,
      src: "/253582949.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "rooms",
      title: "",
    },
    {
      id: 13,
      src: "/253584761.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "common",
      title: "",
    },
    {
      id: 14,
      src: "/253584941.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "common",
      title: "",
    },
    {
      id: 15,
      src: "/253586277.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "rooms",
      title: "",
    },
    {
      id: 16,
      src: "/253586385.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "rooms",
      title: "",
    },
    {
      id: 17,
      src: "/253587153.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "common",
      title: "",
    },
    {
      id: 18,
      src: "/253587397.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "commmon",
      title: "",
    },
    {
      id: 19,
      src: "/253587577.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "common",
      title: "",
    },
    {
      id: 20,
      src: "/253588677.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "garden",
      title: "",
    },  {
      id: 21,
      src: "/253588689.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "garden",
      title: "",
    },  {
      id: 22,
      src: "/253588737.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "garden",
      title: "",
    },  {
      id: 23,
      src: "/253588677.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "garden",
      title: "",
    },  {
      id: 24,
      src: "/253588949.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "garden",
      title: "",
    },
    {
      id: 25,
      src: "/255010373.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "disgorunum",
      title: "",
    },
    {
      id: 26,
      src: "/347543128.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "disgorunum",
      title: "",
    },
    {
      id: 27,
      src: "/253588829.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "disgorunum",
      title: "",
    },
    {
      id: 28,
      src: "/253590093.jpg?height=400&width=600",
      alt: "Antik Şehir",
      category: "disgorunum",
      title: "",
    },

  ]

  const filteredImages = activeCategory === "all" ? images : images.filter((image) => image.category === activeCategory)

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-sage-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Galeri</h1>
          <p className="text-xl text-sage-200 max-w-2xl mx-auto">
            Pansiyonumuzun güzel anlarını ve atmosferini keşfedin
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-sage-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={
                  activeCategory === category.id
                    ? "bg-sage-600 hover:bg-sage-700 text-white"
                    : "border-sage-300 text-sage-700 hover:bg-sage-50"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Image Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                    <Badge variant="secondary" className="mt-2 bg-white/20 text-white">
                      {categories.find((cat) => cat.id === image.category)?.name}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-sage-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cream-300 mb-2">25+</div>
              <div className="text-sage-200">Yıllık Deneyim</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cream-300 mb-2">12</div>
              <div className="text-sage-200">Konforlu Oda</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cream-300 mb-2">500+</div>
              <div className="text-sage-200">Mutlu Misafir</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cream-300 mb-2">4.8</div>
              <div className="text-sage-200">Ortalama Puan</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-cream-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-sage-800 mb-4">Bu Güzellikleri Yaşamak İster misiniz?</h2>
          <p className="text-sage-600 mb-6 max-w-2xl mx-auto">
            Fotoğraflarda gördüğünüz bu güzel anları siz de yaşayabilirsiniz. Hemen rezervasyon yapın ve unutulmaz bir
            tatil geçirin.
          </p>
          <Button size="lg" className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3">
            <a href="/iletisim">Rezervasyon Yap</a>
          </Button>
        </div>
      </section>
      
    </div>
  )
}
