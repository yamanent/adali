"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBlogPosts, deleteBlogPost } from '@/lib/blog-service';
import { BlogPost } from '@/lib/blog-models';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogManagementPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Yetki kontrolleri
  const canManageBlogs = user?.role === 'admin';
  const canViewBlogs = user?.role === 'admin' || user?.role === 'blog';

  useEffect(() => {
    if (!user) {
      return;
    }

    // Sadece admin ve blog rolündekiler bu sayfayı görebilir
    if (!canViewBlogs) {
      toast.error('Bu sayfaya erişim yetkiniz yok.');
      router.push('/admin/dashboard');
      return;
    }

    const fetchPosts = async () => {
        try {
            const fetchedPosts = await getBlogPosts();
            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            toast.error('Blog yazıları yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };
    
    fetchPosts();
  }, [user, canViewBlogs, router]);

  const handleDelete = async (id: string) => {
    // Sadece admin silebilir
    if (!canManageBlogs) {
      toast.error('Bu işlemi yapma yetkiniz yok.');
      return;
    }
    if (window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteBlogPost(id);
        setPosts(posts.filter(p => p.id !== id));
        toast.success('Blog yazısı başarıyla silindi.');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('Yazı silinirken bir hata oluştu.');
      }
    }
  };

  if (loading || !user) {
    return <div className="flex justify-center items-center h-screen"><p>Yükleniyor...</p></div>;
  }
  
  // Yetkisiz erişim durumunda render etme (useEffect içinde zaten yönlendirme var)
  if (!canViewBlogs) {
      return null;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Blog Yönetimi</CardTitle>
          {/* Yeni yazı ekleme butonu sadece admin için görünür */}
          {canManageBlogs && (
            <Button onClick={() => router.push('/admin/blog/new')}>
              <PlusCircle className="mr-2 h-4 w-4" /> Yeni Yazı Ekle
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Yazar</TableHead>
                <TableHead>Yayınlanma Tarihi</TableHead>
                <TableHead>Durum</TableHead>
                {/* Eylemler sütunu sadece admin için görünür */}
                {canManageBlogs && <TableHead className="text-right">Eylemler</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length > 0 ? (
                posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('tr-TR') : 'Geçersiz Tarih'}</TableCell>
                    <TableCell>{post.published ? 'Yayınlandı' : 'Taslak'}</TableCell>
                    {/* Eylem butonları sadece admin için görünür */}
                    {canManageBlogs && (
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/blog/edit/${post.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={canManageBlogs ? 5 : 4} className="text-center">
                    Henüz blog yazısı yok.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
