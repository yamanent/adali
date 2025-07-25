import { Metadata } from 'next';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/blog';
import { parseDate, formatDate } from '@/lib/blog-models';
import BlogPostClient from '@/app/blog/[slug]/BlogPostClient';
import { notFound } from 'next/navigation';

interface RelatedPost {
  slug: string;
  title: string;
  imageUrl?: string;
  readTime: number;
  createdAt: string;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPostBySlug('edirne-aile-pansiyonu-adali-pansiyon');
  
  if (!post) {
    return {
      title: 'Sayfa Bulunamadı',
    };
  }

  return {
    title: post.title + ' | Adalı Pansiyon',
    description: post.excerpt,
    openGraph: {
      title: post.title + ' | Adalı Pansiyon',
      description: post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : [],
      type: 'article',
      publishedTime: post.createdAt instanceof Date ? post.createdAt.toISOString() : '',
    },
  };
}

export async function generateStaticParams() {
  return [{ slug: 'edirne-aile-pansiyonu-adali-pansiyon' }];
}

export default function BlogPostPage() {
  const post = getBlogPostBySlug('edirne-aile-pansiyonu-adali-pansiyon');
  
  if (!post) {
    notFound();
  }

  // İçindekiler tablosu oluştur
  const tableOfContents = [
    { text: 'Edirne Aile Pansiyonu Nedir?', level: 2, id: 'edirne-aile-pansiyonu-nedir' },
    { text: 'Adalı Pansiyon’un Tarihçesi ve Konsepti', level: 2, id: 'adali-pansiyon-tarihcesi' },
    { text: 'Edirne’de Aile Pansiyonu Kültürü', level: 2, id: 'edirne-pansiyon-kulturu' },
    { text: 'Odalar ve Konaklama Konforu', level: 2, id: 'odalar-ve-konaklama' },
    { text: 'Sosyal Alanlar ve Tesis İçi İmkanlar', level: 2, id: 'sosyal-alanlar' },
    { text: 'Güvenlik ve Hijyen Standartları', level: 2, id: 'guvenlik-ve-hijyen' },
    { text: 'Fiyat Politikası ve Rezervasyon', level: 2, id: 'fiyat-ve-rezervasyon' },
    { text: 'Konum ve Ulaşım', level: 2, id: 'konum-ve-ulasim' },
  ];

  // İlgili yazıları al (aynı kategoriden rastgele 2 yazı)
  const allPosts = getAllBlogPosts();
  const relatedPosts: RelatedPost[] = allPosts
    .filter((postItem: { slug: string; published: boolean }) => postItem.slug !== post.slug && postItem.published)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)
    .map((postItem: { slug: string; title: string; imageUrl?: string; readTime?: number; createdAt: string | number | Date }) => ({
      slug: postItem.slug,
      title: postItem.title,
      imageUrl: postItem.imageUrl,
      readTime: postItem.readTime || 5,
      createdAt: formatDate(postItem.createdAt)
    }));

  // Paylaşım bağlantıları
  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://adali-pansiyon.com'}/blog/${post.slug}`;
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    copy: currentUrl
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BlogPostClient 
        title={post.title}
        content={post.content}
        tableOfContents={tableOfContents}
        relatedPosts={relatedPosts}
        shareLinks={shareLinks}
        post={{
          ...post,
          author: post.author || 'Adalı Pansiyon',
          readTime: post.readTime || 8,
          excerpt: post.excerpt || '',
          createdAt: formatDate(parseDate(post.createdAt))
        }}
      />
    </div>
  );
}
