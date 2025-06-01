"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Car, Train, Plane, Bus, Navigation, ExternalLink, CornerDownRight, ArrowRight } from "lucide-react"

export default function TransportationPage() {
  // Detailed directions from different entry points
  const detailedDirections = [
    {
      title: "From Istanbul (D-100 and O-3 Highway)",
      steps: [
        "Follow the D-100 or O-3 (TEM) highway to reach Edirne",
        "Follow the Kapıkule-Center signs at the entrance of Edirne",
        "Cross the Sarayiçi Bridge and proceed towards the city center",
        "Enter Talat Paşa Street and continue straight",
        "You will see Selimiye Mosque on your right",
        "Turn right onto Şeyh Davut Street behind the mosque",
        "You will see the Adalı Guesthouse sign on the right side towards the end of the street"
      ]
    },
    {
      title: "From Kapıkule Border Gate",
      steps: [
        "Follow the D-100 highway from Kapıkule Border Gate towards Edirne center",
        "Enter the city following the Edirne center signs",
        "Continue on Londra Asfaltı Street",
        "Cross the Talatpaşa Bridge and enter Talatpaşa Boulevard",
        "You will see Selimiye Mosque on your left",
        "Turn left onto Şeyh Davut Street behind the mosque",
        "You will see the Adalı Guesthouse sign on the right side towards the end of the street"
      ]
    },
    {
      title: "From Bus Terminal",
      steps: [
        "At the exit of Edirne Intercity Bus Terminal, take the city center minibuses",
        "Get off at the 'Selimiye Mosque' stop",
        "Walk towards the main entrance of Selimiye Mosque",
        "Go around the right side of the mosque to the back",
        "Enter Şeyh Davut Street",
        "You will see Adalı Guesthouse on the right after about 50 meters"
      ]
    },
    {
      title: "From Train Station",
      steps: [
        "At the exit of Edirne Train Station, take a taxi and say 'Selimiye Mosque' (approximately 10-15 minutes)",
        "Alternatively, take the Karaağaç-Center minibuses and get off at the 'Selimiye' stop",
        "Walk towards the main entrance of Selimiye Mosque",
        "Go around the right side of the mosque to the back",
        "Enter Şeyh Davut Street",
        "You will see Adalı Guesthouse on the right after about 50 meters"
      ]
    },
    {
      title: "From City Center (On Foot)",
      steps: [
        "Start from Saraçlar Street (pedestrian zone) in Edirne city center",
        "You will see Eski Mosque at the end of the street",
        "Turn left from Eski Mosque and walk towards Selimiye Mosque (about 5 minutes)",
        "When you reach Selimiye Mosque, go around the right side of the mosque to the back",
        "Enter Şeyh Davut Street",
        "You will see Adalı Guesthouse on the right after about 50 meters"
      ]
    }
  ];

  const transportOptions = [
    {
      icon: Car,
      title: "By Private Vehicle",
      description: "After reaching Edirne center with your private vehicle, you can easily reach our guesthouse by proceeding towards Selimiye Mosque.",
      details: [
        "Approximately 2.5 hours from Istanbul (220 km)",
        "Approximately 7 hours from Ankara (650 km)",
        "Approximately 8 hours from Izmir (700 km)",
        "Approximately 1.5 hours from Tekirdağ (140 km)",
        "Approximately 3 hours from Çanakkale (220 km)"
      ]
    },
    {
      icon: Bus,
      title: "By Bus",
      description: "There are regular bus services to Edirne from many cities in Turkey.",
      details: [
        "Approximately 3 hours from Istanbul",
        "Approximately 8 hours from Ankara",
        "Approximately 10 hours from Izmir",
        "You can reach the city center from the bus terminal by minibuses",
        "Our guesthouse is a 10-minute walk from the city center"
      ]
    },
    {
      icon: Train,
      title: "By Train",
      description: "There are train services from Istanbul to Edirne.",
      details: [
        "Marmaray and connecting trains from Istanbul Halkalı to Edirne",
        "International train services continuing to Kapıkule border station",
        "Transportation from the train station to the city center by minibus or taxi",
        "Our guesthouse is a 10-15 minute walk from the city center"
      ]
    },
    {
      icon: Plane,
      title: "By Plane",
      description: "The nearest airports are in Istanbul.",
      details: [
        "Approximately 2.5 hours from Istanbul Airport to Edirne",
        "Approximately 3.5 hours from Sabiha Gökçen Airport to Edirne",
        "Transportation from airports to Edirne is possible by bus, shuttle service, or private vehicle",
        "Shuttle services are available from airports to Edirne"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-sage-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Transportation</h1>
          <p className="text-xl text-sage-200 max-w-2xl mx-auto">
            Detailed information about how to reach Adalı Guesthouse
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-sage-800 mb-6">Accommodation in the Heart of Edirne</h2>
            <p className="text-lg text-sage-600 leading-relaxed mb-8">
              Adalı Guesthouse is located in the historical center of Edirne, within walking distance of Selimiye Mosque. 
              We are in a central location where you can easily reach all important historical and tourist places of the city.
            </p>
            <div className="flex items-center justify-center gap-2 text-sage-700">
              <MapPin className="h-5 w-5" />
              <p className="font-medium">Sarıcapaşa Mah.Şeyh Davut Sk. No:5, 22100 Edirne Merkez/Edirne</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.5!2d26.5565!3d41.6785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b32f95a7d1e631%3A0x7c2c1a5c6cd5bac!2sAdalı%20Pansiyon!5e0!3m2!1str!2str!4v1622222222222!5m2!1str!2str" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" className="text-sage-700 border-sage-300" asChild>
                <a href="https://goo.gl/maps/YOUR_GOOGLE_MAPS_LINK" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Google Maps
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Directions Section */}
      <section className="py-16 bg-cream-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">Step-by-Step Directions</h2>
              <p className="text-lg text-sage-600 max-w-2xl mx-auto">
                Learn in detail how to reach Adalı Guesthouse from different points
              </p>
            </div>

            <Tabs defaultValue={detailedDirections[0].title} className="w-full">
              <TabsList className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 h-auto p-0 bg-transparent gap-2">
                {detailedDirections.map((direction, index) => (
                  <TabsTrigger 
                    key={index} 
                    value={direction.title}
                    className="bg-white border border-sage-200 text-sage-700 hover:bg-sage-50 data-[state=active]:bg-sage-700 data-[state=active]:text-white data-[state=active]:shadow py-3"
                  >
                    {direction.title.split(' ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {detailedDirections.map((direction, index) => (
                <TabsContent key={index} value={direction.title} className="mt-6">
                  <Card className="border-sage-200">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-sage-800 mb-4">{direction.title}</h3>
                      <ol className="space-y-4">
                        {direction.steps.map((step, stepIdx) => (
                          <li key={stepIdx} className="flex items-start gap-3">
                            <div className="bg-sage-100 text-sage-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {stepIdx + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sage-700">{step}</p>
                              {stepIdx < direction.steps.length - 1 && (
                                <div className="ml-3 mt-2 pl-3 border-l-2 border-dashed border-sage-300">
                                  <ArrowRight className="w-4 h-4 text-sage-400 -rotate-90 ml-[-10px] my-1" />
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                      <div className="mt-6 pt-4 border-t border-sage-200">
                        <p className="flex items-center text-sage-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>Destination: <strong>Adalı Guesthouse, Şeyh Davut Sk. No:5, Edirne</strong></span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-8 bg-white p-6 rounded-lg border border-sage-200 shadow-sm">
              <h3 className="text-xl font-semibold text-sage-800 mb-3 flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-sage-600" /> Important Reference Points
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CornerDownRight className="w-4 h-4 text-sage-500 mt-1" />
                  <p className="text-sage-700">
                    <span className="font-medium">Selimiye Mosque:</span> Our guesthouse is located right behind Selimiye Mosque. If you get lost in the city, find Selimiye Mosque and go to the back of the mosque.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <CornerDownRight className="w-4 h-4 text-sage-500 mt-1" />
                  <p className="text-sage-700">
                    <span className="font-medium">Eski Mosque:</span> You can reach Selimiye Mosque in 5 minutes by walking from this historical mosque in the city center.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <CornerDownRight className="w-4 h-4 text-sage-500 mt-1" />
                  <p className="text-sage-700">
                    <span className="font-medium">Saraçlar Street:</span> It is the main pedestrian zone and shopping street of Edirne. You can easily reach Selimiye Mosque from this street.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <CornerDownRight className="w-4 h-4 text-sage-500 mt-1" />
                  <p className="text-sage-700">
                    <span className="font-medium">Ali Paşa Bazaar:</span> The historical covered bazaar is about 7-8 minutes walking distance from our guesthouse.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transportation Options */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">Transportation Options</h2>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">
              Learn how you can reach Adalı Guesthouse by different means of transportation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {transportOptions.map((option, index) => (
              <Card key={index} className="border-sage-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-sage-100 p-3 rounded-full">
                      <option.icon className="w-6 h-6 text-sage-700" />
                    </div>
                    <h3 className="text-xl font-semibold text-sage-800">{option.title}</h3>
                  </div>
                  <p className="text-sage-600 mb-4">{option.description}</p>
                  <ul className="space-y-2">
                    {option.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-sage-500 mt-1">•</span>
                        <span className="text-sage-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Local Transportation */}
      <section className="py-16 bg-sage-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-sage-800 mb-4">Local Transportation</h2>
              <p className="text-lg text-sage-600">
                Transportation options within Edirne city center
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-sage-200">
                <h3 className="text-xl font-semibold text-sage-800 mb-3 flex items-center">
                  <Bus className="w-5 h-5 mr-2 text-sage-600" /> Minibuses and Buses
                </h3>
                <p className="text-sage-700 mb-2">
                  You can easily travel around Edirne city center with municipal buses and minibuses. 
                  The closest stop to our guesthouse is the Selimiye Mosque stop.
                </p>
                <div className="mt-3 pl-7">
                  <h4 className="font-medium text-sage-800 mb-2">Important Bus Routes:</h4>
                  <ul className="space-y-1">
                    <li className="text-sage-700 text-sm">• <span className="font-medium">Route 1:</span> Bus Terminal - Selimiye - Karaağaç</li>
                    <li className="text-sage-700 text-sm">• <span className="font-medium">Route 3:</span> Yeni Mahalle - Selimiye - Kıyık</li>
                    <li className="text-sage-700 text-sm">• <span className="font-medium">Route 5:</span> Şükrüpaşa - Selimiye - Ayşekadın</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-sage-200">
                <h3 className="text-xl font-semibold text-sage-800 mb-3 flex items-center">
                  <Car className="w-5 h-5 mr-2 text-sage-600" /> Taxi
                </h3>
                <p className="text-sage-700 mb-2">
                  Taxi service is widely available in the city. You can easily reach our guesthouse by taxi from the bus terminal, 
                  train station, or any point in the city.
                </p>
                <p className="text-sage-700 mb-3">
                  <span className="font-medium">Taxi Stand Phone:</span> 0(284) 212 XX XX
                </p>
                <div className="bg-sage-50 p-3 rounded-md text-sm">
                  <p className="text-sage-700 font-medium">You can describe it to the taxi driver as follows:</p>
                  <p className="text-sage-600 italic mt-1">"We're going to Adalı Guesthouse on Şeyh Davut Street, behind Selimiye Mosque, please."</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-sage-200">
                <h3 className="text-xl font-semibold text-sage-800 mb-3 flex items-center">
                  <Navigation className="w-5 h-5 mr-2 text-sage-600" /> On Foot
                </h3>
                <p className="text-sage-700 mb-3">
                  The historical center of Edirne is ideal for exploring on foot. Selimiye Mosque, Eski Mosque, Üç Şerefeli Mosque, 
                  Covered Bazaar, and other historical structures are within walking distance of our guesthouse.
                </p>
                <div className="space-y-2 pl-2">
                  <p className="text-sage-700 text-sm flex items-start">
                    <span className="text-sage-500 mr-2">•</span>
                    <span><span className="font-medium">From Saraçlar Street:</span> 8-10 minutes walking</span>
                  </p>
                  <p className="text-sage-700 text-sm flex items-start">
                    <span className="text-sage-500 mr-2">•</span>
                    <span><span className="font-medium">From Eski Mosque:</span> 5 minutes walking</span>
                  </p>
                  <p className="text-sage-700 text-sm flex items-start">
                    <span className="text-sage-500 mr-2">•</span>
                    <span><span className="font-medium">From Üç Şerefeli Mosque:</span> 6-7 minutes walking</span>
                  </p>
                  <p className="text-sage-700 text-sm flex items-start">
                    <span className="text-sage-500 mr-2">•</span>
                    <span><span className="font-medium">From Ali Paşa Bazaar:</span> 7-8 minutes walking</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-cream-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-sage-800 mb-4">Travel Tips</h2>
              <p className="text-lg text-sage-600">
                Things to consider when planning your trip to Edirne
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border border-sage-200">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-sage-600 font-bold text-lg">1.</span>
                  <p className="text-sage-700">
                    <span className="font-medium">Busy Periods:</span> Edirne can be very crowded during events such as the Kırkpınar Oil Wrestling and Kakava Festivals. 
                    If you are traveling during these periods, we recommend making a reservation in advance.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-600 font-bold text-lg">2.</span>
                  <p className="text-sage-700">
                    <span className="font-medium">Weather:</span> Winters in Edirne are cold and rainy, while summers are hot and dry. 
                    Consider seasonal conditions when making your travel plans.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-600 font-bold text-lg">3.</span>
                  <p className="text-sage-700">
                    <span className="font-medium">Border Crossings:</span> If you are planning to cross to Greece or Bulgaria from Edirne, which is close to the border, 
                    handle your necessary visa and passport procedures in advance.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-600 font-bold text-lg">4.</span>
                  <p className="text-sage-700">
                    <span className="font-medium">Local Transportation Card:</span> If you are staying in Edirne for a few days, 
                    it will be economical to get a transportation card that you can use on public transportation.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-sage-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Have Questions?</h2>
          <p className="text-xl mb-8 text-sage-200 max-w-2xl mx-auto">
            You can contact us for detailed information about transportation or to make a reservation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-cream-600 hover:bg-cream-700 text-sage-800 px-8 py-3 text-lg" asChild>
              <a href="/en/iletisim">Contact Us</a>
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
