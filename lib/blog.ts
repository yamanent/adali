import { BlogPost } from './blog-models';
import { blogPosts } from '@/data/blogPosts';

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.filter(post => post.published);
}

export function getRecentPosts(limit: number = 3): BlogPost[] {
  return getAllBlogPosts()
    .sort((a, b) => {
      const dateA = new Date(a.createdAt as string | number | Date).getTime();
      const dateB = new Date(b.createdAt as string | number | Date).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllBlogPosts()
    .filter(post => post.category === category)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt as string | number | Date).getTime();
      const dateB = new Date(b.createdAt as string | number | Date).getTime();
      return dateB - dateA;
    });
}

export function getRelatedPosts(currentPostSlug: string, limit: number = 2): BlogPost[] {
  const currentPost = getBlogPostBySlug(currentPostSlug);
  if (!currentPost) return [];

  return getAllBlogPosts()
    .filter(post => 
      post.slug !== currentPost.slug && 
      post.category === currentPost.category
    )
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);
}
