import { db } from './firebase/firebase-config';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { BlogPost } from './blog-models';

const blogsCollection = collection(db, 'blogs');

// Slug oluşturma fonksiyonu
const createSlug = (title: string) => {
  // Türkçe karakterleri değiştir
  let slug = title
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/İ/g, 'I')
    .replace(/Ğ/g, 'G')
    .replace(/Ü/g, 'U')
    .replace(/Ş/g, 'S')
    .replace(/Ö/g, 'O')
    .replace(/Ç/g, 'C');
    
  // Tüm özel karakterleri ve boşlukları tire ile değiştir
  slug = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Alfanumerik ve boşluk dışındaki her şeyi kaldır
    .replace(/\s+/g, '-')        // Boşlukları tire ile değiştir
    .replace(/-+/g, '-')         // Birden fazla tireyi tek tireye indir
    .replace(/^-+/, '')          // Baştaki tireleri kaldır
    .replace(/-+$/, '');         // Sondaki tireleri kaldır
    
  return slug;
};

// Tüm blog yazılarını getir
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const q = query(blogsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
};

// ID ile tek bir blog yazısı getir
export const getBlogPost = async (id: string): Promise<BlogPost | null> => {
  const docRef = doc(db, 'blogs', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as BlogPost;
  }
  return null;
};

// Slug ile tek bir blog yazısı getir
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    const q = query(blogsCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as BlogPost;
    }
    return null;
};


// Yeni blog yazısı ekle
export const createBlogPost = async (data: Omit<BlogPost, 'id' | 'createdAt' | 'slug'>) => {
  try {
    const slug = createSlug(data.title);
    const createdAt = Timestamp.now();
    
    // Veriyi hazırla
    const blogData = {
      ...data,
      slug,
      createdAt,
      // Eğer readTime sayı değilse ve bir string ise, sayıya dönüştür
      readTime: typeof data.readTime === 'string' ? parseInt(data.readTime, 10) : data.readTime,
    };
    
    const docRef = await addDoc(collection(db, 'blog'), blogData);

    return { id: docRef.id, slug };
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

// Blog yazısını güncelle
export const updateBlogPost = async (id: string, data: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'slug'>>) => {
  try {
    const docRef = doc(db, 'blog', id);
    
    // Veriyi hazırla
    const updateData = {
      ...data,
      // Eğer readTime sayı değilse ve bir string ise, sayıya dönüştür
      readTime: typeof data.readTime === 'string' ? parseInt(data.readTime, 10) : data.readTime,
    };
    
    await updateDoc(docRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

// Blog yazısını sil
export const deleteBlogPost = async (id: string) => {
  const docRef = doc(db, 'blogs', id);
  return await deleteDoc(docRef);
};
