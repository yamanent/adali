'use client';

import { useCallback } from 'react';
import { Facebook, Twitter, Linkedin, Link2 } from 'lucide-react';

interface BlogPostClientProps {
  title: string;
  content: string;
  tableOfContents: Array<{ text: string; level: number; id: string }>;
  relatedPosts: Array<{
    slug: string;
    title: string;
    imageUrl?: string;
    readTime: number;
    createdAt: string; // Artık string olarak alıyoruz
  }>;
  shareLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    copy: string;
  };
  post: {
    author: string;
    coverImageUrl?: string;
    excerpt?: string;
    readTime: number;
    createdAt: string; // Artık string olarak alıyoruz
    tags?: string[];
    category?: string;
  };
}

// Tarih formatlama fonksiyonu
const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function BlogPostClient({
  title,
  content,
  tableOfContents,
  relatedPosts,
  shareLinks,
  post
}: BlogPostClientProps) {

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareLinks.copy);
      alert('Bağlantı panoya kopyalandı!');
    } catch (err) {
      console.error('URL kopyalanırken hata oluştu:', err);
    }
  }, [shareLinks.copy]);

  return (
    <div className="lg:flex gap-12">
      {/* Ana İçerik */}
      <div className="lg:w-2/3">
        <article>
          <header className="mb-12">
            <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap gap-3">
              <span className="flex items-center">
                <span className="mr-2">📅</span>
                {formatDate(post.createdAt)}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <span className="mr-2">⏱️</span>
                {post.readTime} dk okuma süresi
              </span>
              {post.category && (
                <>
                  <span>•</span>
                  <span className="flex items-center bg-sage-50 text-sage-700 px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-sage-900 mb-6 leading-tight">
              {title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center mt-6">
              <div className="h-12 w-12 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-xl mr-4">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">Yazar</p>
              </div>
            </div>
          </header>

          {post.coverImageUrl && (
            <div className="relative h-96 w-full mb-10 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={post.coverImageUrl} 
                alt={title}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          )}

          <div className="prose prose-sage max-w-none prose-lg">
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          </div>

          {/* Etiketler */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiketler</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <a 
                    key={tag} 
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-sm font-medium transition-colors"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Paylaşım Butonları */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bu yazıyı paylaş</h3>
            <div className="flex gap-3">
              <a 
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Facebook'ta paylaş"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                aria-label="Twitter'da paylaş"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
                aria-label="LinkedIn'de paylaş"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <button 
                onClick={copyToClipboard}
                className="h-10 px-4 rounded-full bg-gray-100 text-gray-700 flex items-center gap-2 text-sm font-medium hover:bg-gray-200 transition-colors"
                aria-label="Bağlantıyı kopyala"
              >
                <Link2 className="h-4 w-4" />
                Kopyala
              </button>
            </div>
          </div>

          {/* İlgili Yazılar */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-sage-900 mb-6">İlgili Yazılar</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <a 
                    key={relatedPost.slug} 
                    href={`/blog/${relatedPost.slug}`}
                    className="group block rounded-xl overflow-hidden border border-gray-100 hover:border-sage-200 transition-colors"
                  >
                    <div className="relative h-48 w-full">
                      <img 
                        src={relatedPost.imageUrl || '/images/placeholder.jpg'} 
                        alt={relatedPost.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-sage-700 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {formatDate(relatedPost.createdAt)} • {relatedPost.readTime} dk okuma
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      {/* Sağ Sidebar */}
      <div className="lg:w-1/3 mt-12 lg:mt-0 lg:pl-8">
        <div className="sticky top-24">
          {/* İçindekiler Tablosu */}
          {tableOfContents.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📚</span>
                İçindekiler
              </h3>
              <nav>
                <ul className="space-y-2">
                  {tableOfContents.map((item, index) => (
                    <li key={index} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
                      <a 
                        href={`#${item.id}`}
                        className="text-sm text-gray-600 hover:text-sage-700 transition-colors block py-1.5"
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}

          {/* Yazar Bilgisi */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-xl mr-4">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">Yazar</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {post.author} hakkında kısa bir açıklama buraya gelebilir. Yazarın uzmanlık alanları, deneyimleri veya ilgi çekici bilgileri paylaşılabilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
