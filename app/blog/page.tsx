"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";
import { getBlogPosts } from '@/lib/blog-service';
import { BlogPost } from '@/lib/blog-models';

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Sadece yayınlanmış yazıları çekmek daha doğru olabilir, şimdilik hepsi çekiliyor.
        const posts = await getBlogPosts();
        setBlogPosts(posts.filter(p => p.published)); // Sadece yayınlanmış olanları göster
      } catch (error) {
        console.error("Blog yazıları çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
        {loading ? (
          <div className="text-center">Yazılar yükleniyor...</div>
        ) : blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={post.imageUrl || "/placeholder-image.jpg"} // Varsayılan görsel
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sage-600 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('tr-TR') : 'Tarih yok'}</span>
                    <span className="mx-1">•</span>
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <CardTitle className="h-16">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Link href={`/blog/${post.slug}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Devamını Oku
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center col-span-full">
            <p>Henüz yayınlanmış bir blog yazısı bulunmuyor.</p>
          </div>
        )}
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
