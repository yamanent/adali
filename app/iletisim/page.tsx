"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic here
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-sage-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">İletişim</h1>
          <p className="text-xl text-sage-200 max-w-2xl mx-auto">
            Sorularınız için bize ulaşın. Size yardımcı olmaktan mutluluk duyarız.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-sage-800 mb-6">İletişim Bilgileri</h2>
                <p className="text-sage-600 mb-8">
                  Rezervasyon, bilgi almak veya önerileriniz için bizimle iletişime geçebilirsiniz.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-sage-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-sage-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-sage-800 mb-2">Adres</h3>
                        <p className="text-sage-600">
                          Yancıkçı Şahin, Şeyh Davut Sk. No:5
                          <br />
                          22100 Edirne Merkez/Edirne
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-sage-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-sage-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-sage-800 mb-2">Telefon</h3>
                        <p className="text-sage-600">
                          0(284) 213 5527
                          <br />
                          0(284) 213 5527 (WhatsApp)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-sage-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-sage-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-sage-800 mb-2">E-posta</h3>
                        <p className="text-sage-600">
                          bilgi@adalipansiyonedirne.com
                          <br />
                          bilgi@adalipansiyonedirne.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-sage-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Clock className="w-6 h-6 text-sage-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-sage-800 mb-2">Çalışma Saatleri</h3>
                        <p className="text-sage-600">
                          Resepsiyon: 24 saat açık
                          <br />
                          Telefon: 08:00 - 22:00
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-semibold text-sage-800 mb-4">Sosyal Medya</h3>
                <div className="flex gap-4">
                  <Button size="icon" variant="outline" className="border-sage-300 text-sage-600 hover:bg-sage-50">
                    <Facebook className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="border-sage-300 text-sage-600 hover:bg-sage-50">
                    <Instagram className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="border-sage-300 text-sage-600 hover:bg-sage-50">
                    <Twitter className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="border-sage-200">
              <CardHeader>
                <CardTitle className="text-2xl text-sage-800">Bize Mesaj Gönderin</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sage-700">
                        Ad Soyad *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="border-sage-300 focus:border-sage-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sage-700">
                        Telefon
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border-sage-300 focus:border-sage-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sage-700">
                      E-posta *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-sage-300 focus:border-sage-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sage-700">
                      Konu
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="border-sage-300 focus:border-sage-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sage-700">
                      Mesajınız *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="border-sage-300 focus:border-sage-500"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-sage-600 hover:bg-sage-700 text-white">
                    Mesajı Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-sage-800 mb-4">Konumumuz</h2>
            <p className="text-sage-600">Edirne şehir merkezinde, merkezi konumumuz</p>
          </div>

          {/* Google Maps */}
          <div className="relative h-96 rounded-lg overflow-hidden">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d745.0215586338862!2d26.558295928569482!3d41.67548099989835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b32f764f9f189f%3A0x91d207f2184b6ac4!2sAdal%C4%B1%20Hostel%20%26%20Pansiyon!5e0!3m2!1str!2str!4v1748698430043!5m2!1str!2str" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-16 bg-sage-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Hızlı İletişim</h2>
          <p className="text-sage-200 mb-6">Acil durumlar ve rezervasyon için direkt bizi arayabilirsiniz</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-cream-600 hover:bg-cream-700 text-sage-800">
              Hemen Ara: 0(284) 213 5527
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white bg-white/20 hover:bg-white hover:text-sage-800">
              Adalı Pansiyon WhatsApp: (0532) 123 45 67
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
