"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Anasayfa" },
    { href: "/odalar", label: "Odalar" },
    { href: "/galeri", label: "Galeri" },
    { href: "/iletisim", label: "İletişim" },
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-sage-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AP</span>
            </div>
            <span className="text-xl font-bold text-sage-800">Adalı Pansiyon</span>
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
            <Button variant="outline" size="sm" className="border-sage-300 text-sage-700">
              <Phone className="w-4 h-4 mr-2" />
              0(284) 213 5527
            </Button>
            <Button size="sm" className="bg-sage-600 hover:bg-sage-700 text-white">
              Rezervasyon
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
                <Button variant="outline" size="sm" className="border-sage-300 text-sage-700">
                  <Phone className="w-4 h-4 mr-2" />
                  0(284) 213 5527
                </Button>
                <Button size="sm" className="bg-sage-600 hover:bg-sage-700 text-white">
                  Rezervasyon
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
