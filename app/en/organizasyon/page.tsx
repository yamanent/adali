import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cake, PartyPopper, Users, CalendarDays, Music, Utensils, Camera, Gift, HeartHandshake } from "lucide-react"

export default function OrganizasyonPage() {
  const events = [
    {
      id: 1,
      name: "Birthday Celebration",
      price: "Contact Us for Price Quote",
      capacity: "10-50 people",
      icon: Cake,
      features: ["Special Decoration", "Birthday Cake", "Refreshments", "Music System", "Photography"],
      description: "Our specially prepared package for an unforgettable birthday celebration with your loved ones. Celebrate your birthday in our warm atmosphere with a city view in our salon.",
      images: ["/2123132.png"],
    },
    {
      id: 2,
      name: "Special Events",
      price: "Contact Us for Price Quote",
      capacity: "20-80 people",
      icon: PartyPopper,
      features: ["Professional Organization", "Catering Options", "Decoration", "Sound and Light System", "Photo and Video Recording"],
      description: "Customized organization packages for your special days such as engagement, graduation, anniversary. Collect unforgettable memories in the historical texture of Edirne.",
      images: ["/22222222222222.png"],
    },
  ]

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "Special Decoration":
        return <PartyPopper className="w-4 h-4" />
      case "Birthday Cake":
        return <Cake className="w-4 h-4" />
      case "Refreshments":
      case "Catering Options":
        return <Utensils className="w-4 h-4" />
      case "Music System":
      case "Sound and Light System":
        return <Music className="w-4 h-4" />
      case "Photography":
      case "Photo and Video Recording":
        return <Camera className="w-4 h-4" />
      case "Professional Organization":
        return <HeartHandshake className="w-4 h-4" />
      case "Decoration":
        return <Gift className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-sage-800 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/texture-bg.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Organizations</h1>
          <div className="h-1 w-20 bg-cream-400 mx-auto mb-6"></div>
          <p className="text-xl text-sage-200 max-w-2xl mx-auto leading-relaxed">
            Discover our organization options that will make your special days unforgettable
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 xl:gap-10">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden border border-sage-200/60 rounded-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden bg-sage-100 flex items-center justify-center">
                  {event.images[0] ? (
                    <Image 
                      src={event.images[0]} 
                      alt={event.name} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <event.icon className="w-24 h-24 text-sage-300" />
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-sage-700/90 text-white font-medium px-3 py-1 text-sm shadow-md">{event.price}</Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl text-sage-800 font-bold flex items-center gap-2">
                    <event.icon className="w-5 h-5" />
                    {event.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sage-600 leading-relaxed">{event.description}</p>

                  <div className="grid grid-cols-1 gap-4 text-sm bg-sage-50/50 p-3 rounded-md">
                    <div className="flex items-center gap-2 text-sage-700">
                      <Users className="w-4 h-4 text-sage-600" />
                      <span className="font-medium">Capacity: {event.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sage-700">
                      <CalendarDays className="w-4 h-4 text-sage-600" />
                      <span className="font-medium">Reservation required in advance</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                        <span className="flex items-center gap-1.5">
                          {getFeatureIcon(feature)}
                          <span className="font-medium">{feature}</span>
                        </span>
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-sage-200/70">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="bg-sage-50/70 px-4 py-2 rounded-md mb-3 sm:mb-0 inline-flex">
                        <span className="text-sage-800">{event.price}</span>
                      </div>
                      <Button className="w-full sm:w-auto bg-sage-600 hover:bg-sage-700 text-white font-medium px-5 rounded-md shadow-sm">
                      <a href="/iletisim">Get a Quote</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-sage-800 mb-6 text-center">Organization Details</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-sage-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-sage-700 mb-4 flex items-center gap-2">
                  <Cake className="w-5 h-5" /> Birthday Packages
                </h3>
                <ul className="space-y-3 text-sage-600">
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Themed decoration options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Custom designed cake (optional)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Various catering menus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Music and entertainment activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Professional photography</span>
                  </li>
                </ul>
              </div>
              <div className="bg-sage-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-sage-700 mb-4 flex items-center gap-2">
                  <PartyPopper className="w-5 h-5" /> Special Event Packages
                </h3>
                <ul className="space-y-3 text-sage-600">
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Engagement, promise, graduation organizations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Corporate meetings and events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Anniversary celebrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Special menu options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 font-bold">•</span>
                    <span>Professional organization support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sage-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Make Your Reservation</h2>
          <p className="text-xl mb-8 text-sage-200 max-w-2xl mx-auto">
            Book today for an unforgettable stay in history. Call us for early booking discounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-cream-600 hover:bg-cream-700 text-sage-800 px-8 py-3 text-lg" asChild>
              <a href="/en/iletisim">Reservation</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-white/20 hover:bg-white hover:text-sage-800 px-8 py-3 text-lg"
              asChild
            >
              <a href="tel:02842135527">Call Us: 0 (284) 213 5527</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
