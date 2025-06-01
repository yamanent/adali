"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Users, Bed, Eye, Snowflake, Wifi, Coffee, Tv, Wind, Scissors, Droplet, ShowerHead, KeyRound, Refrigerator } from "lucide-react";
import { useState } from "react";
import { ImageLightbox } from "@/components/image-lightbox";

export default function RoomsPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    setLightboxOpen(true);
  };
  const rooms = [
    {
      id: 201,
      name: "Room 201",

      capacity: 6,
      bedType: "Bunk Beds",
      view: "City View",
      features: ["Air Conditioning", "TV", "WiFi", "Private Bathroom", "Towels & Slippers", "Hair Dryer", "Shampoo", "Heater"],
      description: "Spacious room with bunk beds, private bathroom, suitable for large groups of 6 people.",
      images: ["/227667008.jpg?height=400&width=600"],
    },
    {
      id: 202,
      name: "Room 202",

      capacity: 6,
      bedType: "Bunk Beds",
      view: "Garden View",
      features: ["Air Conditioning", "TV", "WiFi", "Private Bathroom", "Towels & Slippers", "Hair Dryer", "Shampoo", "Heater"],
      description: "Spacious room with bunk beds, private bathroom, suitable for large groups of 6 people.",
      images: ["/253575921.jpg?height=400&width=600"],
    },
    {
      id: 203,
      name: "Room 203",

      capacity: 3,
      bedType: "Single Beds",
      view: "City View",
      features: ["Air Conditioning", "TV", "WiFi", "Shared Bathroom", "Towels & Slippers", "Hair Dryer", "Shampoo", "Heater"],
      description: "3-person room sharing a bathroom with Room 204, an economical accommodation option.",
      images: ["/227667320.jpg?height=400&width=600"],
    },
    {
      id: 204,
      name: "Room 204",

      capacity: 2,
      bedType: "Double Bed",
      view: "Garden View",
      features: ["Air Conditioning", "TV", "WiFi", "Shared Bathroom", "Towels & Slippers", "Hair Dryer", "Shampoo", "Heater"],
      description: "2-person room sharing a bathroom with Room 203, an economical accommodation option.",
      images: ["/253582329.jpg?height=400&width=600"],
    },
    {
      id: 205,
      name: "Room 205",

      capacity: 2,
      bedType: "Double Bed",
      view: "City View",
      features: ["Air Conditioning", "TV", "WiFi", "Private Bathroom", "Towels & Slippers", "Hair Dryer", "Shampoo", "Heater"],
      description: "Comfortable, simple and spacious room with private bathroom for couples.",
      images: ["/253582329.jpg?height=400&width=600"],
    },
    {
      id: 301,
      name: "Room 301",

      capacity: 4,
      bedType: "Single Beds",
      view: "City View",
      features: ["Air Conditioning", "TV", "WiFi", "Shared Bathroom", "Towels & Slippers", "Hair Dryer", "Shampoo", "Heater"],
      description: "4-person room with shared bathroom; ideal for groups of friends.",
      images: ["/227667008.jpg?height=400&width=600"],
    },
    {
      id: 302,
      name: "Room 302",

      capacity: 3,
      bedType: "Single Beds",
      view: "Garden View",
      features: ["Air Conditioning", "TV", "WiFi", "Private Bathroom", "Towels & Slippers", "Hair Dryer", "Shampoo", "Heater"],
      description: "3-person room with private bathroom, offering a comfortable and friendly environment.",
      images: ["/253575921.jpg?height=400&width=600"],
    },
    {
      id: 303,
      name: "Room 303",

      capacity: 3,
      bedType: "Single Beds",
      view: "City View",
      features: ["Air Conditioning", "TV", "WiFi", "Shared Bathroom", "Towels & Slippers", "Hair Dryer", "Shampoo", "Heater"],
      description: "3-person room with shared bathroom, simple decoration and economical accommodation option.",
      images: ["/227667320.jpg?height=400&width=600"],
    },
    {
      id: 304,
      name: "Room 304",

      capacity: 2,
      bedType: "Double Bed",
      view: "Garden View",
      features: ["Air Conditioning", "TV", "WiFi", "Shared Bathroom", "Towels & Slippers", "Hair Dryer", "Shampoo", "Heater"],
      description: "2-person room with shared bathroom, simple and relaxing.",
      images: ["/253582329.jpg?height=400&width=600"],
    },
    {
      id: 305,
      name: "Room 305",

      capacity: 2,
      bedType: "Double Bed",
      view: "City View",
      features: ["Air Conditioning", "TV", "WiFi", "Private Bathroom", "Towels & Slippers", "Hair Dryer", "Shampoo", "Heater"],
      description: "Comfortable, simple and spacious room with private bathroom for couples.",
      images: ["/227667008.jpg?height=400&width=600"],
    },
    {
      id: 403,
      name: "Room 403",

      capacity: 3,
      bedType: "Single Beds",
      view: "City View",
      features: ["Air Conditioning", "TV", "WiFi", "Shared Bathroom", "Towels & Slippers", "Hair Dryer", "Shampoo", "Heater"],
      description: "3-person room with shared bathroom, simple decoration and economical accommodation option.",
      images: ["/253575921.jpg?height=400&width=600"],
    },
    {
      id: 404,
      name: "Room 404",

      capacity: 2,
      bedType: "Double Bed",
      view: "Garden View",
      features: ["Air Conditioning", "TV", "WiFi", "Shared Bathroom", "Towels & Slippers", "Hair Dryer", "Shampoo", "Heater"],
      description: "2-person room with shared bathroom, simple and relaxing.",
      images: ["/227667320.jpg?height=400&width=600"],
    },
    {
      id: 405,
      name: "Room 405",

      capacity: 2,
      bedType: "Double Bed",
      view: "City View",
      features: ["Air Conditioning", "TV", "WiFi", "Private Bathroom", "Towels & Slippers", "Hair Dryer", "Shampoo", "Heater"],
      description: "Comfortable, simple and spacious room with private bathroom for couples.",
      images: ["/253582329.jpg?height=400&width=600"],
    },
  ]

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "Air Conditioning":
        return <Snowflake className="w-4 h-4" />
      case "TV":
        return <Tv className="w-4 h-4" />
      case "WiFi":
        return <Wifi className="w-4 h-4" />
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

      {/* Rooms Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 xl:gap-10">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden border border-sage-200/60 rounded-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={room.images[0] || "/placeholder.svg"} 
                    alt={room.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" 
                    onClick={() => openLightbox(room.images[0] || "/placeholder.svg")}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl text-sage-800 font-bold">{room.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sage-600 leading-relaxed">{room.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm bg-sage-50/50 p-3 rounded-md">
                    <div className="flex items-center gap-2 text-sage-700">
                      <Users className="w-4 h-4 text-sage-600" />
                      <span className="font-medium">{room.capacity} People</span>
                    </div>
                    <div className="flex items-center gap-2 text-sage-700">
                      <Bed className="w-4 h-4 text-sage-600" />
                      <span className="font-medium">{room.bedType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sage-700 col-span-2">
                      <Eye className="w-4 h-4 text-sage-600" />
                      <span className="font-medium">{room.view}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {room.features.map((feature, index) => (
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

                      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                        <Link href={`/en/odalar/${room.id}`} className="w-full sm:w-auto">
                          <Button variant="outline" className="w-full sm:w-auto border-sage-600 text-sage-600 hover:bg-sage-50 hover:border-sage-700 font-medium px-5 rounded-md">
                            <Eye className="w-4 h-4 mr-2" /> View Room
                          </Button>
                        </Link>
                        <Button className="w-full sm:w-auto bg-sage-600 hover:bg-sage-700 text-white font-medium px-5 rounded-md shadow-sm">
                          <a href="/en/iletisim">Book Now</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
