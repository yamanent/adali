"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Users, Bed, Eye, Wifi, Coffee, Tv, Wind, Scissors, Droplet, ShowerHead, KeyRound, Refrigerator } from "lucide-react";
import { useState } from "react";
import { ImageLightbox } from "@/components/image-lightbox";

export default function RoomsPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    setLightboxOpen(true);
  };
  
  // Helper function to slugify text
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^a-z0-9-]/g, '')     // Remove all non-alphanumeric characters
      .replace(/-+/g, '-')            // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  };

  const rooms = [
    {
      name: "Group Room",
      slug: "group-room",
      capacity: 3,
      bedType: "Single Beds",
      view: "City View",
      features: ["Private Bathroom", "WiFi", "TV"],
      description: "Comfortable group room with private bathroom.",
      images: ["/253421065.jpg?height=400&width=600"],
    },
    {
      name: "Double and Twin Rooms",
      slug: "double-and-twin-rooms",
      capacity: 2,
      bedType: "Double Bed",
      view: "City View",
      features: ["Shared Bathroom", "WiFi", "TV"],
      description: "Ideal rooms for couples or friends.",
      images: ["/227666993.jpg?height=400&width=600"],
    },
    {
      name: "Economy Room",
      slug: "economy-room",
      capacity: 2,
      bedType: "Double Bed",
      view: "City View",
      features: ["Shared Bathroom", "WiFi", "TV"],
      description: "Budget-friendly accommodation option.",
      images: ["/227667008.jpg?height=400&width=600"],
    }
  ]

  const getFeatureIcon = (feature: string) => {
    switch (feature) {

      case "TV":
        return <Tv className="w-4 h-4" />
      case "WiFi":
        return <Wifi className="w-4 h-4" />
      case "Economic":
        return <KeyRound className="w-4 h-4" />
      case "Towels & Slippers":
        return <Wind className="w-4 h-4" />
      case "Hair Dryer":
        return <Wind className="w-4 h-4" />
      case "Shampoo":
        return <Droplet className="w-4 h-4" />
      case "Heater":
        return <Wind className="w-4 h-4" />
      case "Safe":
        return <KeyRound className="w-4 h-4" />
      case "Minibar":
        return <Refrigerator className="w-4 h-4" />
      case "Balcony":
        return <Eye className="w-4 h-4" />
      case "Seating Area":
        return <Users className="w-4 h-4" />
      case "Private Bathroom":
        return <ShowerHead className="w-4 h-4" />
      case "Shared Bathroom":
        return <ShowerHead className="w-4 h-4" />
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Our Rooms</h1>
          <div className="h-1 w-20 bg-cream-400 mx-auto mb-6"></div>
          <p className="text-xl text-sage-200 max-w-2xl mx-auto leading-relaxed">
            Experience an unforgettable stay in our rooms where comfort and tranquility meet
          </p>
        </div>
      </section>

      {/* Rooms Categories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* Group Room */}
            <Card className="overflow-hidden border border-sage-200/60 rounded-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={rooms.find(room => room.slug === "group-room")?.images[0] || "/253421065.jpg"} 
                  alt="Group Room" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" 
                  onClick={() => openLightbox(rooms.find(room => room.slug === "group-room")?.images[0] || "/253421065.jpg")}
                />
                <Badge className="absolute top-3 right-3 bg-sage-700 text-white py-1 px-3 z-10">
                  Private Bathroom
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-sage-800 font-bold">Group Rooms (3-6 People)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sage-600 leading-relaxed">Suitable rooms for large groups of friends and families. Available with private or shared bathroom options. Private bathroom rooms: 201, 202, 302. Shared bathroom rooms: 203, 301, 303, 403.</p>

                <div className="grid grid-cols-2 gap-4 text-sm bg-sage-50/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-sage-700">
                    <Users className="w-4 h-4 text-sage-600" />
                    <span className="font-medium">3-6 People</span>
                  </div>
                  <div className="flex items-center gap-2 text-sage-700">
                    <Bed className="w-4 h-4 text-sage-600" />
                    <span className="font-medium">Multiple Beds</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Private Bathroom")}
                      <span className="font-medium">Private Bathroom</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Shared Bathroom")}
                      <span className="font-medium">Shared Bathroom</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("WiFi")}
                      <span className="font-medium">Wi-Fi</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("TV")}
                      <span className="font-medium">TV</span>
                    </span>
                  </Badge>
                </div>

                <div className="mt-6 pt-5 border-t border-sage-200/70">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                      <Link href="/en/odalar/group-room" className="w-full">
                        <Button variant="outline" className="w-full border-sage-600 text-sage-600 hover:bg-sage-50 hover:border-sage-700 font-medium px-5 rounded-md">
                          <Eye className="w-4 h-4 mr-2" /> View Room
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Double and Twin Room */}
            <Card className="overflow-hidden border border-sage-200/60 rounded-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={rooms.find(room => room.slug === "double-and-twin-rooms")?.images[0] || "/227666993.jpg"} 
                  alt="Double and Twin Room" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" 
                  onClick={() => openLightbox(rooms.find(room => room.slug === "double-and-twin-rooms")?.images[0] || "/227666993.jpg")}
                />
                <Badge className="absolute top-3 right-3 bg-sage-700 text-white py-1 px-3 z-10">
                  Private Bathroom
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-sage-800 font-bold">Double and Twin Rooms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sage-600 leading-relaxed">Rooms for 2 guests (couples or twin accommodations). Available with private or shared bathroom options. Private bathroom rooms: 205, 305, 405. Shared bathroom rooms: 204, 304, 404.</p>

                <div className="grid grid-cols-2 gap-4 text-sm bg-sage-50/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-sage-700">
                    <Users className="w-4 h-4 text-sage-600" />
                    <span className="font-medium">2 People</span>
                  </div>
                  <div className="flex items-center gap-2 text-sage-700">
                    <Bed className="w-4 h-4 text-sage-600" />
                    <span className="font-medium">Double Bed</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Private Bathroom")}
                      <span className="font-medium">Private Bathroom</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Shared Bathroom")}
                      <span className="font-medium">Shared Bathroom</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("WiFi")}
                      <span className="font-medium">Wi-Fi</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("TV")}
                      <span className="font-medium">TV</span>
                    </span>
                  </Badge>
                </div>

                <div className="mt-6 pt-5 border-t border-sage-200/70">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                      <Link href={`/en/odalar/double-and-twin-rooms`} className="w-full">
                        <Button variant="outline" className="w-full border-sage-600 text-sage-600 hover:bg-sage-50 hover:border-sage-700 font-medium px-5 rounded-md">
                          <Eye className="w-4 h-4 mr-2" /> View Room
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Economy Shared Room */}
            <Card className="overflow-hidden border border-sage-200/60 rounded-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={rooms.find(room => room.slug === "economy-room")?.images[0] || "/227667008.jpg"} 
                  alt="Economy Shared Room" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" 
                  onClick={() => openLightbox(rooms.find(room => room.slug === "economy-room")?.images[0] || "/227667008.jpg")}
                />
                <Badge className="absolute top-3 right-3 bg-amber-600 text-white py-1 px-3 z-10">
                  Economy
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-sage-800 font-bold">Economy Shared Rooms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sage-600 leading-relaxed">Shared bathroom, simple and affordable rooms. Room numbers (with shared bathrooms): 203, 204, 301, 303, 304, 403, 404. These rooms are offered as economical options.</p>

                <div className="grid grid-cols-2 gap-4 text-sm bg-sage-50/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-sage-700">
                    <Users className="w-4 h-4 text-sage-600" />
                    <span className="font-medium">2 People</span>
                  </div>
                  <div className="flex items-center gap-2 text-sage-700">
                    <Bed className="w-4 h-4 text-sage-600" />
                    <span className="font-medium">Single Beds</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Shared Bathroom")}
                      <span className="font-medium">Shared Bathroom</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("Economic")}
                      <span className="font-medium">Economic</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("WiFi")}
                      <span className="font-medium">Wi-Fi</span>
                    </span>
                  </Badge>
                  <Badge variant="secondary" className="bg-sage-100 text-sage-700 py-1.5 px-3 rounded-full border border-sage-200/50">
                    <span className="flex items-center gap-1.5">
                      {getFeatureIcon("TV")}
                      <span className="font-medium">TV</span>
                    </span>
                  </Badge>
                </div>

                <div className="mt-6 pt-5 border-t border-sage-200/70">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                      <Link href="/en/odalar/economy-room" className="w-full">
                        <Button variant="outline" className="w-full border-sage-600 text-sage-600 hover:bg-sage-50 hover:border-sage-700 font-medium px-5 rounded-md">
                          <Eye className="w-4 h-4 mr-2" /> View Room
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
      {/* Lightbox */}
      <ImageLightbox 
        isOpen={lightboxOpen} 
        imageUrl={lightboxImage} 
        onClose={() => setLightboxOpen(false)} 
      />
    </div>
  )
}
