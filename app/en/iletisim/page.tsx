"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    // Form submission simulation
    // Instead of a real email submission, we're just showing success
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setSubmitStatus('success')
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
      setIsSubmitting(false)
      
      // Remove notification message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    }, 1500) // Show success after 1.5 seconds delay
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact</h1>
          <p className="text-xl text-sage-200 max-w-2xl mx-auto">
            Contact us for your questions. We are happy to help you.
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
                <h2 className="text-3xl font-bold text-sage-800 mb-6">Contact Information</h2>
                <p className="text-sage-600 mb-8">
                  You can contact us for reservations, information, or your suggestions.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-sage-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-sage-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-sage-800 mb-2">Address</h3>
                        <p className="text-sage-600">
                          Sarıcapaşa Mah.Şeyh Davut Sk. No:5
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
                        <h3 className="font-semibold text-sage-800 mb-2">Phone</h3>
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
                        <h3 className="font-semibold text-sage-800 mb-2">Email</h3>
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
                        <h3 className="font-semibold text-sage-800 mb-2">Working Hours</h3>
                        <p className="text-sage-600">
                          Reception: Open 24 hours
                          <br />
                          Phone: 08:00 - 22:00
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-semibold text-sage-800 mb-4">Social Media</h3>
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
                <CardTitle className="text-2xl text-sage-800">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {submitStatus === 'success' && (
                  <Alert className="mb-6 bg-green-50 border-green-500 text-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      Your message has been sent successfully. We will get back to you as soon as possible.
                    </AlertDescription>
                  </Alert>
                )}
                
                {submitStatus === 'error' && (
                  <Alert className="mb-6 bg-red-50 border-red-500 text-red-800">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>
                      An error occurred while sending your message. Please try again later or contact us directly by phone.
                    </AlertDescription>
                  </Alert>
                )}
                
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sage-700">
                        Full Name *
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
                        Phone
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
                      Email *
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
                      Subject
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
                      Your Message *
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

                  <Button 
                    type="submit" 
                    className="w-full bg-sage-600 hover:bg-sage-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
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
            <h2 className="text-3xl font-bold text-sage-800 mb-4">Our Location</h2>
            <p className="text-sage-600">Our central location in Edirne city center</p>
          </div>

          {/* Google Maps */}
          <div className="relative h-96 rounded-lg overflow-hidden">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d745.0215586338862!2d26.558295928569482!3d41.67548099989835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b32f764f9f189f%3A0x91d207f2184b6ac4!2sAdal%C4%B1%20Hostel%20%26%20Pansiyon!5e0!3m2!1str!2str!4v1748698430043!5m2!1str!2str" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
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
