"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BlogPost } from '@/lib/blog-models';
import { useAuth } from '@/context/auth-context';
import { storage } from '@/lib/firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Başlık en az 3 karakter olmalıdır.' }),
  excerpt: z.string().min(10, { message: 'Özet en az 10 karakter olmalıdır.' }).max(300, { message: 'Özet en fazla 300 karakter olabilir.' }),
  content: z.string().min(10, { message: 'İçerik en az 10 karakter olmalıdır.' }),
  imageUrl: z.string().url({ message: 'Lütfen geçerli bir URL girin.' }).optional().or(z.literal('')),
  coverImageUrl: z.string().url({ message: 'Lütfen geçerli bir URL girin.' }).optional().or(z.literal('')),
  tagsInput: z.string().optional(),
  category: z.string().optional(),
  readTime: z.union([z.string(), z.number()]).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  published: z.boolean().default(false),
});

type BlogFormValues = z.infer<typeof formSchema>;

type BlogFormSubmitData = {
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  coverImageUrl?: string;
  tags?: string[];
  category?: string;
  readTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  published: boolean;
  author: string;
};

interface BlogFormProps {
  onSubmit: (data: BlogFormSubmitData) => Promise<void>;
  initialData?: BlogPost | null;
  isSubmitting: boolean;
}

export default function BlogForm({ onSubmit, initialData, isSubmitting }: BlogFormProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{cover: number, main: number}>({cover: 0, main: 0});
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm<BlogFormValues>({ 
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      imageUrl: initialData?.imageUrl || '',
      coverImageUrl: initialData?.coverImageUrl || '',
      tagsInput: initialData?.tags ? initialData.tags.join(', ') : '',
      category: initialData?.category || '',
      readTime: initialData?.readTime ? String(initialData.readTime) : '',
      seoTitle: initialData?.seoTitle || '',
      seoDescription: initialData?.seoDescription || '',
      seoKeywords: initialData?.seoKeywords || '',
      published: initialData?.published || false,
    },
  });

  // Görsel yükleme işlemi
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'main') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Firebase Storage'a yükleme
      const storageRef = ref(storage, `blog-images/${Date.now()}_${file.name}`);
      
      // Yükleme işlemi
      const uploadTask = uploadBytes(storageRef, file);
      
      // Yükleme ilerlemesini takip et (Firebase v9'da doğrudan ilerleme takibi yok, simüle ediyoruz)
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 90) {
          setUploadProgress(prev => ({
            ...prev,
            [type]: progress
          }));
        }
      }, 200);
      
      // Yükleme tamamlandığında
      await uploadTask;
      clearInterval(interval);
      setUploadProgress(prev => ({
        ...prev,
        [type]: 100
      }));
      
      // URL'i al
      const downloadURL = await getDownloadURL(storageRef);
      
      // Form değerini güncelle
      if (type === 'cover') {
        setValue('coverImageUrl', downloadURL);
      } else {
        setValue('imageUrl', downloadURL);
      }
      
      // Temizle
      setTimeout(() => {
        setUploadProgress(prev => ({
          ...prev,
          [type]: 0
        }));
        setIsUploading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      setIsUploading(false);
    }
  };

  const handleFormSubmit = (data: BlogFormValues) => {
    if (!user?.displayName) {
        toast.error("Yazar bilgisi bulunamadı, lütfen tekrar giriş yapın.");
        return;
    }
    
    // Etiketleri diziye dönüştür
    const tags = data.tagsInput ? 
      data.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : 
      undefined;
    
    // readTime değerini sayıya dönüştür
    let readTime: number | undefined = undefined;
    if (typeof data.readTime === 'string' && data.readTime) {
      readTime = parseInt(data.readTime, 10);
    } else if (typeof data.readTime === 'number') {
      readTime = data.readTime;
    }
    
    const postData: BlogFormSubmitData = { 
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      imageUrl: data.imageUrl,
      coverImageUrl: data.coverImageUrl,
      tags,
      category: data.category,
      readTime,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords,
      published: data.published,
      author: user.displayName 
    };
    
    onSubmit(postData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Yazıyı Düzenle' : 'Yeni Yazı Oluştur'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => handleFormSubmit(data as unknown as BlogFormValues))} className="space-y-6">
          {/* Temel Bilgiler */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Temel Bilgiler</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Başlık</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Özet</Label>
              <Textarea id="excerpt" {...register('excerpt')} rows={3} placeholder="Yazı için kısa bir özet girin..." />
              {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input id="category" {...register('category')} placeholder="Örn: Seyahat, Yemek, Kültür" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagsInput">Etiketler (virgülle ayırın)</Label>
              <Input id="tagsInput" {...register('tagsInput')} placeholder="Örn: pansiyon, tatil, doğa" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="readTime">Okuma Süresi (dakika)</Label>
              <Input id="readTime" type="number" {...register('readTime')} placeholder="Örn: 5" />
            </div>
          </div>

          {/* Görseller */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Görseller</h3>
            
            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">Kapak Görseli URL</Label>
              <div className="flex gap-2">
                <Input id="coverImageUrl" {...register('coverImageUrl')} placeholder="https://example.com/cover.jpg" className="flex-1" />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="shrink-0" 
                  onClick={() => coverImageInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path><rect x="16" y="2" width="6" height="6" rx="1"></rect><path d="m22 13-4-4-4 4"></path><path d="M18 13v9"></path></svg>
                  {isUploading && uploadProgress.cover > 0 ? `${uploadProgress.cover}%` : 'Yükle'}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="file" 
                  id="coverImageUpload" 
                  className="hidden" 
                  accept="image/*" 
                  ref={coverImageInputRef}
                  onChange={(e) => handleImageUpload(e, 'cover')} 
                />
                <Label 
                  htmlFor="coverImageUpload" 
                  className="cursor-pointer text-xs text-blue-600 hover:underline"
                  onClick={() => coverImageInputRef.current?.click()}
                >
                  Bilgisayardan seç
                </Label>
                <p className="text-xs text-gray-500">veya URL girin</p>
              </div>
              <p className="text-xs text-gray-500">Blog listesinde görünecek büyük kapak görseli</p>
              {errors.coverImageUrl && <p className="text-sm text-red-500">{errors.coverImageUrl.message}</p>}
              {watch('coverImageUrl') && (
                <div className="mt-2 border rounded-md p-2">
                  <p className="text-xs font-medium mb-1">Önizleme:</p>
                  <img src={watch('coverImageUrl')} alt="Kapak görseli önizleme" className="max-h-40 object-cover rounded" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Ana İçerik Görseli URL</Label>
              <div className="flex gap-2">
                <Input id="imageUrl" {...register('imageUrl')} placeholder="https://example.com/image.jpg" className="flex-1" />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="shrink-0" 
                  onClick={() => mainImageInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path><rect x="16" y="2" width="6" height="6" rx="1"></rect><path d="m22 13-4-4-4 4"></path><path d="M18 13v9"></path></svg>
                  {isUploading && uploadProgress.main > 0 ? `${uploadProgress.main}%` : 'Yükle'}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="file" 
                  id="mainImageUpload" 
                  className="hidden" 
                  accept="image/*" 
                  ref={mainImageInputRef}
                  onChange={(e) => handleImageUpload(e, 'main')} 
                />
                <Label 
                  htmlFor="mainImageUpload" 
                  className="cursor-pointer text-xs text-blue-600 hover:underline"
                  onClick={() => mainImageInputRef.current?.click()}
                >
                  Bilgisayardan seç
                </Label>
                <p className="text-xs text-gray-500">veya URL girin</p>
              </div>
              <p className="text-xs text-gray-500">Blog detay sayfasında görünecek ana görsel</p>
              {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl.message}</p>}
              {watch('imageUrl') && (
                <div className="mt-2 border rounded-md p-2">
                  <p className="text-xs font-medium mb-1">Önizleme:</p>
                  <img src={watch('imageUrl')} alt="Ana görsel önizleme" className="max-h-40 object-cover rounded" />
                </div>
              )}
            </div>
          </div>

          {/* İçerik */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Blog İçeriği</h3>
            
            <div className="space-y-2">
              <Label htmlFor="content">İçerik (HTML destekler)</Label>
              <Textarea id="content" {...register('content')} rows={15} placeholder="Yazının tam içeriğini buraya yazın..." className="font-mono text-sm" />
              <p className="text-xs text-gray-500">HTML etiketleri kullanabilirsiniz (örn: &lt;h2&gt;, &lt;p&gt;, &lt;img&gt;, &lt;a&gt;)</p>
              {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
            </div>
          </div>

          {/* SEO Ayarları */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">SEO Ayarları</h3>
            
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Başlığı</Label>
              <Input id="seoTitle" {...register('seoTitle')} placeholder="Arama motorlarında görünecek başlık" />
              <p className="text-xs text-gray-500">Boş bırakılırsa normal başlık kullanılır</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Açıklaması</Label>
              <Textarea id="seoDescription" {...register('seoDescription')} rows={2} placeholder="Arama motorlarında görünecek açıklama" />
              <p className="text-xs text-gray-500">Boş bırakılırsa özet kullanılır</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoKeywords">SEO Anahtar Kelimeleri</Label>
              <Input id="seoKeywords" {...register('seoKeywords')} placeholder="anahtar1, anahtar2, anahtar3" />
            </div>
          </div>

          {/* Yayın Durumu */}
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch id="published" onCheckedChange={(checked) => setValue('published', checked)} defaultChecked={initialData?.published || false} />
              <Label htmlFor="published">Yayınla</Label>
              <p className="text-xs text-gray-500 ml-2">{initialData?.published ? 'Bu yazı şu anda yayında' : 'Bu yazı taslak olarak kaydedilecek'}</p>
            </div>
          </div>

          <div className="pt-6">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Kaydediliyor...' : (initialData ? 'Yazıyı Güncelle' : 'Yazıyı Oluştur')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
