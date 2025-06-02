"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Bed, Eye, Wifi, Coffee, ArrowLeft, Phone, Mail, Tv, Wind, Droplet, KeyRound, ShowerHead } from "lucide-react";
import { RoomImageSlider } from "@/components/room-image-slider";
import React from "react";
const { use } = React;

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

// Room data (in a real application, this would come from a database)
const rooms = [
  {
    name: "Group Room (Private Bathroom)",
    slug: "group-room",
    capacity: 3,
    bedType: "Single Beds",
    view: "City View",
    features: ["Private Bathroom", "Wi-Fi", "TV"],
    description: "Comfortable group room with private bathroom for 3 people.",
    longDescription: "Our group room with private bathroom is perfect for small groups of 3 people looking for comfort and privacy. The room features three single beds and a private bathroom for your convenience. Designed with your comfort in mind, this room offers all the essential amenities for a pleasant stay in the heart of the city.",
    images: [
      "/227667008.jpg?height=600&width=800",
      "/227668163.jpg?height=600&width=800&text=City+View",
      "/253588689.jpg?height=600&width=800&text=Room",
      "/253588829.jpg?height=600&width=800&text=Room",
      "/253588949.jpg?height=600&width=800&text=Room",
      "/253587577.jpg?height=600&width=800&text=Room"
    ],
    amenities: ["Free Wi-Fi", "LCD TV", "Hair Dryer", "Towels", "Private Bathroom", "City View", "Satellite TV"]
  },
  {
    name: "Economy Room",
    slug: "economy-room",
    capacity: 2,
    bedType: "Double Bed",
    view: "City View",
    features: ["Shared Bathroom", "Wi-Fi", "TV"],
    description: "Double room with shared bathroom, economical option.",
    longDescription: "Our economy room with shared bathroom is perfect for couples looking for an affordable stay. The room features a comfortable double bed and access to a shared bathroom in the hallway. Despite the economical price, the room still offers all the essential amenities for a comfortable stay in the heart of the city.",
    images: [
      "/227667320.jpg?height=600&width=800",
      "/227668163.jpg?height=600&width=800&text=City+View",
      "/253588689.jpg?height=600&width=800&text=Room",
      "/253588829.jpg?height=600&width=800&text=Room",
      "/253588949.jpg?height=600&width=800&text=Room",
      "/253587577.jpg?height=600&width=800&text=Room"
    ],
    amenities: ["Free Wi-Fi", "LCD TV", "Hair Dryer", "Towels", "Shared Bathroom", "City View", "Satellite TV"]
  },
  {
    name: "Double and Twin Rooms",
    slug: "double-and-twin-rooms",
    capacity: 2,
    bedType: "Double Bed",
    view: "City View",
    features: ["Shared Bathroom", "Wi-Fi", "TV"],
    description: "Economy group room with shared bathroom for 3 people.",
    longDescription: "Our double and twin rooms are perfect for couples or friends traveling together. The rooms feature comfortable beds and access to a shared bathroom in the hallway. These rooms offer all the essential amenities for a comfortable stay in the heart of the city.",
    images: [
      "/227667320.jpg?height=600&width=800",
      "/227668163.jpg?height=600&width=800&text=City+View",
      "/253588689.jpg?height=600&width=800&text=Room",
      "/253588829.jpg?height=600&width=800&text=Room",
      "/253588949.jpg?height=600&width=800&text=Room",
      "/253587577.jpg?height=600&width=800&text=Room"
    ],
    amenities: ["Free Wi-Fi", "LCD TV", "Hair Dryer", "Towels", "Shared Bathroom", "City View", "Satellite TV"]
  }
];

// Helper function to get feature icon
const getFeatureIcon = (feature: string) => {
  switch (feature) {
    case "Wi-Fi":
      return <Wifi className="w-4 h-4" />;
    case "TV":
      return <Tv className="w-4 h-4" />;
    case "Private Bathroom":
      return <ShowerHead className="w-4 h-4" />;
    case "Shared Bathroom":
      return <ShowerHead className="w-4 h-4" />;
    case "Towels":
      return <Droplet className="w-4 h-4" />;
    case "Towels & Slippers":
      return <Droplet className="w-4 h-4" />;
    case "Hair Dryer":
      return <Wind className="w-4 h-4" />;
    case "Shampoo":
      return <Droplet className="w-4 h-4" />;
    case "Heater":
      return <Coffee className="w-4 h-4" />;
    case "Key Card Access":
      return <KeyRound className="w-4 h-4" />;
    default:
      return <Coffee className="w-4 h-4" />;
  }
};

export default function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params with React.use()
  const resolvedParams = use(params);
  
  // Find the room with the matching slug
  const roomSlug = resolvedParams.slug;
  const room = rooms.find((r) => r.slug === roomSlug);

  // If room not found, return 404
  if (!room) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-sage-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link href="/en/odalar" className="flex items-center text-sage-200 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>All Rooms</span>
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{room.name}</h1>
          {/* Price information removed */}
        </div>
      </section>

      {/* Room Gallery and Price Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Room Gallery */}
            <div className="lg:col-span-2">
              <RoomImageSlider images={room.images} roomName={room.name} />
            </div>
            
            {/* Right Column - Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md border border-sage-100 sticky top-4">
                <h3 className="text-2xl font-bold text-sage-800 mb-4">Contact Information</h3>
                
                <div className="space-y-4 mb-6 border-t border-sage-200 pt-4">
                  <div className="flex items-center gap-3 text-sage-700">
                    <Phone className="w-5 h-5 text-sage-600" />
                    <a href="tel:02842135527" className="hover:text-sage-800 transition-colors">
                      0(284) 213 5527
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sage-700">
                    <Mail className="w-5 h-5 text-sage-600" />
                    <a href="mailto:bilgi@adalipansiyonedirne.com" className="hover:text-sage-800 transition-colors">
                    bilgi@adalipansiyonedirne.com
                    </a>
                  </div>
                </div>
                
                <Link href="/en/iletisim" passHref>
                  <Button className="w-full bg-sage-600 hover:bg-sage-700 text-white text-lg py-6">
                    Contact Us
                  </Button>
                </Link>

                <p className="text-center text-sage-500 text-sm mt-4">
                  * Please contact us for reservation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Details */}
      <section className="py-12 bg-sage-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Room Details */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md border border-sage-100 mb-8">
                <h3 className="text-2xl font-bold text-sage-800 mb-4">Room Details</h3>
                <p className="text-sage-600 leading-relaxed mb-6">{room.longDescription}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-sage-50 p-4 rounded-md border border-sage-100">
                    <h4 className="font-semibold text-sage-800 mb-2">Room Information</h4>
                    <ul className="space-y-2 text-sage-600">
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-sage-500" />
                        <span>Capacity: {room.capacity} people</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-sage-500" />
                        <span>Bed Type: {room.bedType}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-sage-500" />
                        <span>View: {room.view}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-sage-50 p-4 rounded-md border border-sage-100">
                    <h4 className="font-semibold text-sage-800 mb-2">Room Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="bg-sage-100 text-sage-700 py-1 px-2 rounded-full border border-sage-200/50">
                          <span className="flex items-center gap-1.5">
                            {getFeatureIcon(feature)}
                            <span>{feature}</span>
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-sage-100">
                <h3 className="text-2xl font-bold text-sage-800 mb-4">Room Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {room.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sage-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-sage-500"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Other Rooms */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md border border-sage-100 sticky top-4">
                <h3 className="text-2xl font-bold text-sage-800 mb-4">Other Rooms</h3>
                <div className="space-y-4">
                  {rooms
                    .filter(r => r.slug !== room.slug)
                    .slice(0, 3)
                    .map((otherRoom) => (
                      <Link key={otherRoom.slug} href={`/en/odalar/${otherRoom.slug}`}>
                        <div className="group flex gap-3 p-2 rounded-md hover:bg-sage-50 transition-colors">
                          <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                            <Image 
                              src={otherRoom.images[0]} 
                              alt={otherRoom.name} 
                              fill 
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-sage-800 group-hover:text-sage-600 transition-colors">{otherRoom.name}</h4>
                            <p className="text-sm text-sage-600">For {otherRoom.capacity} people</p>
                            <div className="flex items-center gap-1 text-xs text-sage-500 mt-1">
                              <span className="flex items-center gap-0.5">
                                <Users className="w-3 h-3" />
                                {otherRoom.capacity}
                              </span>
                              <span>•</span>
                              <span>{otherRoom.features.includes("Private Bathroom") ? "Private Bathroom" : "Shared Bathroom"}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-sage-200">
                  <Link href="/en/odalar">
                    <Button variant="outline" className="w-full border-sage-600 text-sage-600 hover:bg-sage-50 hover:text-sage-700">
                      View All Rooms
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
