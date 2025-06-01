"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Top 5 Historical Sites in Edirne",
      excerpt: "Discover the 5 most impressive historical sites that reflect Edirne's rich history. From Selimiye Mosque to Karaağaç...",
      date: "June 1, 2025",
      author: "Adalı Guesthouse",
      image: "/selimiye.jpg",
      slug: "places-to-visit-in-edirne"
    },
    {
      id: 2,
      title: "Flavors from Edirne Cuisine",
      excerpt: "From Edirne's famous liver to pan-fried liver, from almond paste to deva-i misk candy, flavors you must taste...",
      date: "May 25, 2025",
      author: "Adalı Guesthouse",
      image: "/edirne-mutfagi.jpg",
      slug: "flavors-from-edirne-cuisine"
    },
    {
      id: 3,
      title: "Kakava Festival: Edirne's Colorful Spring Festival",
      excerpt: "What you need to know about the Kakava Festival, one of the most important events of Roma culture, held annually on May 5-6...",
      date: "May 10, 2025",
      author: "Adalı Guesthouse",
      image: "/kakava.jpg",
      slug: "kakava-festival"
    },
    {
      id: 4,
      title: "Shopping Guide in Edirne",
      excerpt: "What to buy in Edirne? From brooms and soaps at Alipaşa Bazaar by the Meriç River to souvenirs and antiques...",
      date: "May 2, 2025",
      author: "Adalı Guesthouse",
      image: "/alisveris.jpg",
      slug: "shopping-guide-in-edirne"
    },
    {
      id: 5,
      title: "A Weekend in Edirne: Travel Plan",
      excerpt: "Ideal route and places to visit for those who want to explore Edirne in two days...",
      date: "April 15, 2025",
      author: "Adalı Guesthouse",
      image: "/edirne-gezi.jpg",
      slug: "a-weekend-in-edirne"
    },
    {
      id: 6,
      title: "Kırkpınar Oil Wrestling: A Centuries-Old Tradition",
      excerpt: "The story of Kırkpınar Oil Wrestling, the world's oldest sports organization with a history of over 650 years...",
      date: "April 1, 2025",
      author: "Adalı Guesthouse",
      image: "/kirkpinar.jpg",
      slug: "kirkpinar-oil-wrestling"
    }
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-sage-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Our articles about Edirne's history, culture, flavors, and more
          </p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sage-600 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                  <span className="mx-1">•</span>
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <CardTitle className="hover:text-sage-600 transition-colors">
                  <Link href={`/en/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{post.excerpt}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="text-sage-600 hover:text-sage-700 p-0 hover:bg-transparent">
                  <Link href={`/en/blog/${post.slug}`} className="flex items-center">
                    Read More <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-sage-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-sage-800">Subscribe to Our Newsletter</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-sage-700">
            Subscribe to our newsletter to stay informed about events in Edirne, special offers, and our blog posts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 flex-grow"
            />
            <Button className="bg-sage-600 hover:bg-sage-700 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
