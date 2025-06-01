"use client"

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function LanguageProvider() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Set the HTML lang attribute based on the pathname
    const isEnglish = pathname.startsWith('/en')
    document.documentElement.lang = isEnglish ? 'en' : 'tr'
  }, [pathname])
  
  return null
}
