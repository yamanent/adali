"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, Globe } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { getAlternateLocale } from "@/lib/translations"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  // Determine current locale
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'tr'
  const alternateLocale = getAlternateLocale(currentLocale)

  // Get the path without locale prefix for en
  const getPathWithoutLocale = () => {
    if (currentLocale === 'en') {
      return pathname.replace(/^\/en/, '') || '/'
    }
    return pathname
  }

  // Switch to the alternate locale
  const switchLocale = () => {
    const pathWithoutLocale = getPathWithoutLocale()
    if (alternateLocale === 'en') {
      router.push(`/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`)
    } else {
      router.push(pathWithoutLocale)
    }
  }

  // Define navigation items based on current locale
  const navItems = currentLocale === 'en' 
    ? [
        { href: "/en", label: "Home" },
        { href: "/en/odalar", label: "Rooms" },
        { href: "/en/organizasyon", label: "Organization" },
        { href: "/en/galeri", label: "Gallery" },
        { href: "/en/iletisim", label: "Contact" },
      ]
    : [
        { href: "/", label: "Anasayfa" },
        { href: "/odalar", label: "Odalar" },
        { href: "/organizasyon", label: "Organizasyon" },
        { href: "/galeri", label: "Galeri" },
        { href: "/iletisim", label: "İletişim" },
      ]

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-sage-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center py-2">
            <Image 
              src="/adali.svg" 
              alt="Adalı Pansiyon Logo" 
              width={310}
              height={100}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sage-700 hover:text-sage-900 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Contact Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sage-700 hover:text-sage-900"
              onClick={switchLocale}
            >
              <Globe className="w-4 h-4 mr-2" />
              {alternateLocale === 'en' ? 'English' : 'Türkçe'}
            </Button>
            <Button variant="outline" size="sm" className="border-sage-300 text-sage-700">
              <Phone className="w-4 h-4 mr-2" />
              0(284) 213 5527
            </Button>
            <Button size="sm" className="bg-sage-600 hover:bg-sage-700 text-white">
            <a href="https://wa.me/2842135527">{currentLocale === 'en' ? 'WhatsApp' : 'WhatsApp'}</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-sage-200">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sage-700 hover:text-sage-900 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-sage-200">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sage-700 hover:text-sage-900"
                  onClick={switchLocale}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {alternateLocale === 'en' ? 'English' : 'Türkçe'}
                </Button>
                <Button variant="outline" size="sm" className="border-sage-300 text-sage-700">
                  <Phone className="w-4 h-4 mr-2" />
                  0(284) 213 5527
                </Button>
                <Button size="sm" className="bg-sage-600 hover:bg-sage-700 text-white">
                  <a href="https://wa.me/2842135527">{currentLocale === 'en' ? 'WhatsApp Reservation' : 'WhatsApp ile Rezervasyon'}</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
