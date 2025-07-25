import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';
import { parseDate } from '@/lib/blog-models';
import BlogPostClient from './BlogPostClient';
import type { BlogPost } from '@/lib/blog-models';

// Tarih formatlama yardımcı fonksiyonu
const formatDate = (date: Date | string | number): string => {
  const parsedDate = parseDate(date);
  return parsedDate.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// İçindekiler tablosu oluşturma
const generateTableOfContents = (content: string) => {
  const headings = content.match(/<h[23][^>]*>(.*?)<\/h[23]>/g) || [];
  return headings.map(heading => {
    const text = heading.replace(/<[^>]*>/g, '');
    const level = heading.startsWith('<h2') ? 2 : 3;
    const id = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
    return { text, level, id };
  });
};

// Sosyal medya paylaşım bağlantıları
const getShareLinks = (title: string, url: string) => ({
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  copy: url
});

interface RelatedPost {
  slug: string;
  title: string;
  imageUrl?: string;
  readTime: number;
  createdAt: string;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(post => post.slug === params.slug);

  if (!post || !post.published) {
    notFound();
  }

  const tableOfContents = generateTableOfContents(post.content);
  
  // İçerikteki başlıklara ID ekle
  const formattedContent = post.content
    .replace(/<h2[^>]*>([^<]+)<\/h2>/g, (match, text) => {
      const id = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
      return `<h2 id="${id}" class="scroll-mt-24 text-2xl font-bold mt-12 mb-4 pb-2 border-b border-gray-200">${text}</h2>`;
    })
    .replace(/<h3[^>]*>([^<]+)<\/h3>/g, (match, text) => {
      const id = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
      return `<h3 id="${id}" class="scroll-mt-24 text-xl font-semibold mt-8 mb-3">${text}</h3>`;
    })
    .replace(/<p/g, '<p class="mb-6 leading-relaxed text-gray-700"')
    .replace(/<ul/g, '<ul class="list-disc pl-6 mb-6 space-y-2"')
    .replace(/<ol/g, '<ol class="list-decimal pl-6 mb-6 space-y-2"')
    .replace(/<blockquote/g, '<blockquote class="border-r-4 border-sage-200 pr-4 my-6 text-gray-600 italic"');

  // İlgili yazıları bul (aynı kategoriden rastgele 2 yazı)
  const relatedPosts: RelatedPost[] = blogPosts
    .filter(p => p.slug !== post.slug && p.published && p.category === post.category)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)
    .map(p => ({
      slug: p.slug,
      title: p.title,
      imageUrl: p.imageUrl,
      readTime: p.readTime || 5,
      createdAt: formatDate(parseDate(p.createdAt))
    }));

  // Paylaşım bağlantıları
  const shareLinks = getShareLinks(
    post.title,
    typeof window !== 'undefined' ? window.location.href : ''
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Button asChild variant="ghost" className="text-sage-700 hover:bg-sage-50 mb-8">
        <Link href="/blog" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tüm Yazılar
        </Link>
      </Button>

      <BlogPostClient 
        title={post.title}
        content={formattedContent}
        tableOfContents={tableOfContents}
        relatedPosts={relatedPosts}
        shareLinks={shareLinks}
        post={{
          ...post,
          author: post.author || 'Yazar',
          readTime: post.readTime || 5,
          excerpt: post.excerpt || '',
          createdAt: formatDate(parseDate(post.createdAt))
        }}
      />
    </div>
  );
}

// Statik üretim için yolları oluştur
export async function generateStaticParams() {
  return blogPosts
    .filter(post => post.published)
    .map((post) => ({
      slug: post.slug,
    }));
}
