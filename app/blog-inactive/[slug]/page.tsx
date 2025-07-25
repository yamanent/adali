"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostBySlug } from '@/lib/blog-service';
import { BlogPost } from '@/lib/blog-models';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { slug } = React.use(params);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getBlogPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError("Blog yazısı bulunamadı.");
        }
      } catch (err) {
        console.error("Blog yazısı yüklenirken hata oluştu:", err);
        setError("Blog yazısı yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="w-full max-w-3xl">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="w-full max-w-3xl">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-2">Hata</h2>
                <p>{error || "Bilinmeyen bir hata oluştu."}</p>
                <Button asChild className="mt-4">
                  <Link href="/blog">Blog Sayfasına Dön</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // SEO başlığı ve açıklaması için varsayılan değerleri kullan
  const seoTitle = post.seoTitle || post.title;
  const seoDescription = post.seoDescription || post.excerpt;

  return (
    <div className="container mx-auto py-10 flex justify-center">
      <div className="w-full max-w-3xl">
        <Card>
          <CardContent className="pt-6">
            {/* Kapak Görseli */}
            {post.coverImageUrl && (
              <div className="mb-6 -mx-6 -mt-6">
                <Image 
                  src={post.coverImageUrl} 
                  alt={post.title} 
                  width={1200} 
                  height={600} 
                  className="w-full object-cover h-[300px]"
                />
              </div>
            )}
            
            {/* Başlık ve Meta Bilgiler */}
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 gap-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{post.author}</span>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(post.createdAt.toDate()).toLocaleDateString('tr-TR')}</span>
              </div>
              
              {post.readTime && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{post.readTime} dakika okuma</span>
                </div>
              )}
              
              {post.category && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>{post.category}</span>
                </div>
              )}
            </div>
            
            {/* Özet */}
            {post.excerpt && (
              <div className="mb-6 bg-gray-50 p-4 rounded-md border-l-4 border-primary italic">
                {post.excerpt}
              </div>
            )}
            
            {/* Ana Görsel */}
            {post.imageUrl && (
              <div className="mb-6">
                <Image 
                  src={post.imageUrl} 
                  alt={post.title} 
                  width={800} 
                  height={400} 
                  className="rounded-md w-full object-cover"
                />
              </div>
            )}
            
            {/* İçerik */}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {/* Etiketler */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Geri Dön Butonu */}
            <div className="mt-8 pt-4 border-t">
              <Button asChild variant="outline">
                <Link href="/blog">← Tüm Yazılar</Link>
              </Button>
            </div>

          </CardContent>
        </Card>
        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="text-sage-600">
            <Link href="/blog" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Tüm Yazılara Dön
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
