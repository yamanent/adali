"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BlogForm } from '../../_components/BlogForm';
import { getBlogPost, updateBlogPost } from '@/lib/blog-service';
import { BlogPost } from '@/lib/blog-models';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const id = params.id as string;
  const canManageBlogs = user?.role === 'admin' || user?.role === 'erisim';

  useEffect(() => {
    if (!id || !canManageBlogs) return;

    const fetchPost = async () => {
      try {
        const fetchedPost = await getBlogPost(id);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          toast.error('Blog yazısı bulunamadı.');
          router.push('/admin/blog');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast.error('Yazı yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, router, canManageBlogs]);

    const handleSubmit = async (data: Omit<BlogPost, 'id' | 'createdAt' | 'slug'>) => {
    if (!canManageBlogs) {
        toast.error("Bu işlemi yapmaya yetkiniz yok.");
        return;
    }
    setIsSubmitting(true);
    try {
      await updateBlogPost(id, data);
      toast.success('Blog yazısı başarıyla güncellendi.');
      router.push('/admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error('Blog yazısı güncellenirken bir hata oluştu.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }
  
  if (!user || !canManageBlogs) {
    return <p>Bu sayfayı görüntüleme yetkiniz yok.</p>;
  }

  if (!post) {
    return <div>Yazı bulunamadı.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <BlogForm onSubmit={handleSubmit} initialData={post} isSubmitting={isSubmitting} />
    </div>
  );
}
