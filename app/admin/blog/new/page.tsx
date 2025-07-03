"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogForm } from '../_components/BlogForm';
import { addBlogPost } from '@/lib/blog-service';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';
import { BlogPost } from '@/lib/blog-models';

export default function NewBlogPostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManageBlogs = user?.role === 'admin' || user?.role === 'erisim';

  const handleSubmit = async (data: Omit<BlogPost, 'id' | 'createdAt' | 'slug'>) => {
    if (!canManageBlogs) {
        toast.error("Bu işlemi yapmaya yetkiniz yok.");
        return;
    }
    setIsSubmitting(true);
    try {
      await addBlogPost(data);
      toast.success('Blog yazısı başarıyla oluşturuldu.');
      router.push('/admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error('Blog yazısı oluşturulurken bir hata oluştu.');
      setIsSubmitting(false);
    }
  };
  
  if (!user || !canManageBlogs) {
    return <p>Bu sayfayı görüntüleme yetkiniz yok.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
