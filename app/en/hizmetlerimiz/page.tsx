"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wifi, Coffee, Car, Clock, Utensils, Snowflake, MapPin, Bed, Users, ShowerHead, Tv, Check } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "Free Wi-Fi",
      description: "High-speed internet in all our rooms and common areas",
      icon: <Wifi className="w-5 h-5 text-sage-600" />,
      category: "Accommodation"
    },
    {
      id: 2,
      title: "Air Conditioning",
      description: "Heating and cooling in all our rooms according to the season",
      icon: <Snowflake className="w-5 h-5 text-sage-600" />,
      category: "Accommodation"
    },
    {
      id: 3,
      title: "Comfortable Beds",
      description: "Specially selected beds for quality sleep",
      icon: <Bed className="w-5 h-5 text-sage-600" />,
      category: "Accommodation"
    },
    {
      id: 4,
      title: "Family Rooms",
      description: "Spacious rooms specially designed for families and groups",
      icon: <Users className="w-5 h-5 text-sage-600" />,
      category: "Accommodation"
    },
    {
      id: 5,
      title: "Clean Bathrooms",
      description: "Hygienic bathrooms and toilets cleaned daily",
      icon: <ShowerHead className="w-5 h-5 text-sage-600" />,
      category: "Accommodation"
    },
    {
      id: 6,
      title: "TV",
      description: "LCD television in all our rooms",
      icon: <Tv className="w-5 h-5 text-sage-600" />,
      category: "Accommodation"
    },
    {
      id: 7,
      title: "Breakfast",
      description: "Rich open buffet including traditional Edirne flavors",
      icon: <Coffee className="w-5 h-5 text-sage-600" />,
      category: "Food & Beverage"
    },
    {
      id: 8,
      title: "Restaurant Recommendations",
      description: "Information and support about the best restaurants in Edirne",
      icon: <Utensils className="w-5 h-5 text-sage-600" />,
      category: "Food & Beverage"
    },
    {
      id: 9,
      title: "City Center Location",
      description: "Located in the historic Edirne city center, close to all points",
      icon: <MapPin className="w-5 h-5 text-sage-600" />,
      category: "Location & Transportation"
    },
    {
      id: 10,
      title: "Free Parking",
      description: "Free parking near our guesthouse for our guests",
      icon: <Car className="w-5 h-5 text-sage-600" />,
      category: "Location & Transportation"
    },
    {
      id: 11,
      title: "24-Hour Reception",
      description: "We are at your service day and night. Our reception is open whenever you need",
      icon: <Clock className="w-5 h-5 text-sage-600" />,
      category: "Location & Transportation"
    }
  ];

  // Group services by categories
  const categories = [
    "Accommodation",
    "Food & Beverage",
    "Location & Transportation"
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-sage-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Services we offer at Adalı Guesthouse for your comfort and satisfaction
          </p>
        </div>
      </div>

      {/* Featured Services */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"></div>
          

        
        
        {/* Service Categories */}
        {categories.map((category) => (
          <div key={category} className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-sage-800 mb-2">{category}</h2>
              <div className="w-20 h-1 bg-sage-500 mx-auto"></div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services
                  .filter(service => service.category === category)
                  .map((service) => (
                    <div key={service.id} className="flex items-start p-4 hover:bg-sage-50 rounded-lg transition-colors">
                      <div className="bg-sage-100 p-2 rounded-full mr-4">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-sage-800 mb-1">{service.title}</h3>
                        <p className="text-sm text-sage-600">{service.description}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-sage-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-sage-800">Ready to Plan Your Stay?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-sage-700">
            Reserve your place at Adalı Guesthouse, offering historical atmosphere and modern comfort in the heart of Edirne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-sage-600 hover:bg-sage-700 text-white">
              <a href="https://wa.me/2842135527">Reservation via WhatsApp</a>
            </Button>
            <Button size="lg" variant="outline" className="border-sage-600 text-sage-700 hover:bg-sage-50">
              <Link href="/en/odalar">Explore Our Rooms</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
