import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blogPosts";
import { parseDate } from "@/lib/blog-models";

// Tarih formatlama yardımcı fonksiyonu
const formatDate = (date: Date | string | number) => {
  const parsedDate = parseDate(date);
  return parsedDate.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function BlogPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-sage-900 mb-4">Blog</h1>
        <p className="text-lg text-gray-600">Edirne ve konaklama hakkında güncel bilgiler ve ipuçları</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.filter(post => post.published).map((post) => (
          <Card key={post.slug} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
            <div className="relative h-48 w-full">
              <Image 
                src={post.imageUrl || '/images/placeholder.jpg'} 
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardHeader className="flex-grow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                <span className="text-sm text-gray-500">{post.readTime} dk</span>
              </div>
              <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="mt-auto">
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              <Button asChild variant="outline" className="border-sage-700 text-sage-700 hover:bg-sage-50 w-full">
                <Link href={`/blog/${post.slug}`}>Devamını Oku</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
