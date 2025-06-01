import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Wifi, Coffee, MapPin, Car, Tv, Waves, Calendar, User, ArrowRight } from "lucide-react"

export default function HomePage() {
  const services = [
    { icon: Wifi, title: "Free Wi-Fi", description: "Fast internet in all areas" },
    { icon: Coffee, title: "Breakfast Included", description: "Homemade delicacies" },
    { icon: Waves, title: "Explore Historical Sites", description: "Very close to history" },
    { icon: Car, title: "Free Parking", description: "Secure parking area" },
    { icon: Tv, title: "Television", description: "In all rooms" },
    { icon: MapPin, title: "Central Location", description: "Close to everything" },
  ]

  const testimonials = [
    {
      name: "Orhan G.",
      rating: 5,
      comment: "The room was very clean, breakfast was delicious. Great location, we walked everywhere.",
      location: "Istanbul",
    },
    {
      name: "Ayşe K.",
      rating: 5,
      comment: "Quiet, comfortable and much better than the price. I would come again!",
      location: "Ankara",
    },
    {
      name: "Martin S.",
      rating: 5,
      comment: "Very clean and cozy place. Great location and friendly staff!",
      location: "Izmir",
    },
  ]

  const blogPosts = [
    {
      id: 1,
      title: "Top 5 Historical Places in Edirne",
      excerpt: "Discover the 5 most impressive historical places that reflect Edirne's rich history. From Selimiye Mosque to Karaağaç...",
      date: "June 1, 2025",
      author: "Adalı Pension",
      image: "/selimiye.jpg",
      slug: "places-to-visit-in-edirne"
    },
    {
      id: 2,
      title: "Flavors from Edirne Cuisine",
      excerpt: "From Edirne's famous liver to pan liver, from almond paste to deva-i misk paste, flavors that must be tasted...",
      date: "May 25, 2025",
      author: "Adalı Pension",
      image: "/edirne-mutfagi.jpg",
      slug: "flavors-from-edirne-cuisine"
    },
    {
      id: 3,
      title: "Kakava Festival: Edirne's Colorful Spring Festival",
      excerpt: "What you need to know about the Kakava Festival, one of the most important events of Roman culture, held every year on May 5-6...",
      date: "May 10, 2025",
      author: "Adalı Pension",
      image: "/kakava.jpg",
      slug: "kakava-festival"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <Image
          src="/231232.png?height=1080&width=1920"
          alt="Pension Historical View"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Peaceful Accommodation
            <span className="block text-sage-200">In History</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-sage-100 max-w-2xl mx-auto">
            Experience a peaceful accommodation in the heart of history...
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 text-lg" asChild>
              <a href="/en/iletisim">Make a Reservation</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-white/20 hover:bg-white hover:text-sage-800 px-8 py-3 text-lg"
              asChild
            >
              <a href="/en/odalar">Explore Our Rooms</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-sage-800 mb-6">Welcome</h2>
            <p className="text-lg text-sage-600 leading-relaxed mb-8">
              To our pension that offers a warm and friendly accommodation experience in the heart of Edirne. While offering our guests comfort and peace together, we provide an ideal environment for you to explore the historical texture of the city.
            </p>
            <Badge variant="secondary" className="bg-sage-100 text-sage-800 px-4 py-2 text-base">
              25+ Years of Experience
            </Badge>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">Our Services</h2>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">
              Everything you need for a comfortable and enjoyable stay
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-sage-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <service.icon className="w-12 h-12 text-sage-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-sage-800 mb-2">{service.title}</h3>
                  <p className="text-sage-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-sage-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">Guest Reviews</h2>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">Experiences of our guests who stayed with us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-sage-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sage-700 mb-4 italic">"{testimonial.comment}"</p>
                  <div className="border-t border-sage-200 pt-4">
                    <p className="font-semibold text-sage-800">{testimonial.name}</p>
                    <p className="text-sm text-sage-600">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">Blog</h2>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">
              Our latest articles about Edirne's history, culture and flavors
            </p>
          </div>
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
                  <p className="text-sage-600">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-sage-600 hover:text-sage-800 p-0" asChild>
                    <Link href={`/en/blog/${post.slug}`} className="flex items-center">
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" className="border-sage-300 text-sage-600 hover:bg-sage-50" asChild>
              <Link href="/en/blog">View All Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sage-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Book Your Stay?</h2>
            <p className="text-xl mb-8 text-sage-100">
              Contact us now for the best rates and availability for your travel dates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-sage-700 hover:bg-sage-100" asChild>
                <a href="/en/iletisim">Contact Us</a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <a href="/en/odalar">View Rooms</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
