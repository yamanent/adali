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
  const post = getBlogPostBySlug('edirne-aile-pansiyonu-adali-pansiyon-detay');
  
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
  return [{ slug: 'edirne-aile-pansiyonu-adali-pansiyon-detay' }];
}

export default function BlogPostPage() {
  const post = getBlogPostBySlug('edirne-aile-pansiyonu-adali-pansiyon-detay');
  
  if (!post) {
    notFound();
  }

  // İçindekiler tablosu
  const tableOfContents = [
    { text: 'Edirne Aile Pansiyonu Nedir?', level: 2, id: 'edirne-aile-pansiyonu-nedir' },
    { text: 'Adalı Pansiyon’un Tarihçesi ve Konsepti', level: 2, id: 'adali-pansiyon-tarihcesi' },
    { text: 'Edirne’de Aile Pansiyonu Kültürü', level: 2, id: 'edirne-pansiyon-kulturu' },
    { text: 'Edirne’de Aile Pansiyonu Seçerken Dikkat Edilmesi Gerekenler', level: 2, id: 'dikkat-edilmesi-gerekenler' },
    { text: 'Edirne’de Aile Pansiyonu | Adalı Pansiyon’un Konumu ve Ulaşım Avantajı', level: 2, id: 'konum-ve-ulasim' },
    { text: 'Edirne Aile Pansiyonu | Adalı Pansiyon’un Fiyat Politikası', level: 2, id: 'fiyat-politikasi' },
    { text: 'Edirne Aile Pansiyonu | Adalı Pansiyon’un Vizyonu ve Misyonu', level: 2, id: 'vizyon-ve-misyon' },
    { text: 'Edirne Aile Pansiyonu | Adalı Pansiyon’un Hizmet Standartları', level: 2, id: 'hizmet-standartlari' },
    { text: 'Edirne’deki Diğer Aile Pansiyonu Alternatifleri', level: 2, id: 'diger-alternatifler' },
    { text: 'Edirne Aile Pansiyonu | Adalı Pansiyon Hakkında Detaylı Bilgiler', level: 2, id: 'detayli-bilgiler' },
    { text: 'Odalar ve Konaklama Konforu', level: 2, id: 'odalar-ve-konaklama' },
    { text: 'Sosyal Alanlar ve Tesis İçi İmkanlar', level: 2, id: 'sosyal-alanlar' },
    { text: 'Güvenlik ve Hijyen Standartları', level: 2, id: 'guvenlik-ve-hijyen' },
    { text: 'Yeme-İçme ve Sosyal Alanlar', level: 2, id: 'yeme-icme' },
    { text: 'Kurumsal ve Grup Konaklama Özellikleri', level: 2, id: 'kurumsal-konaklama' },
    { text: 'Ulaşım ve Otopark Hizmetleri', level: 2, id: 'ulasim-ve-otopark' },
    { text: 'Çocuk ve Aile Dostu Hizmetler', level: 2, id: 'cocuk-ve-aile-dostu' },
    { text: 'Mimari ve Tasarımsal Özellikler', level: 2, id: 'mimari-ve-tasarim' },
    { text: 'Teknik ve Operasyonel Donanım', level: 2, id: 'teknik-donanim' },
  ];

  // İlgili yazılar
  const allPosts = getAllBlogPosts();
  const relatedPosts: RelatedPost[] = allPosts
    .filter((postItem) => postItem.slug !== post.slug && postItem.published)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)
    .map((postItem) => {
      const createdAt = postItem.createdAt instanceof Date ? postItem.createdAt : new Date();
      return {
        slug: postItem.slug,
        title: postItem.title,
        imageUrl: postItem.imageUrl,
        readTime: postItem.readTime || 5,
        createdAt: formatDate(createdAt)
      };
    });

  // Paylaşım bağlantıları
  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://adali-pansiyon.com'}/blog/edirne-aile-pansiyonu-adali-pansiyon-detay`;
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
          readTime: post.readTime || 12,
          excerpt: post.excerpt || '',
          createdAt: formatDate(parseDate(post.createdAt))
        }}
      />
    </div>
  );
}
