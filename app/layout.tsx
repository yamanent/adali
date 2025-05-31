import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import MobileQuickAccess from "@/components/mobile-quick-access"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Adalı Pansiyon - Deniz Kenarında Huzurlu Konaklama",
  description:
    "Edirne'de deniz kenarında yer alan pansiyonumuzda sıcak atmosfer ve konforlu odalarla unutulmaz bir tatil deneyimi yaşayın. Ücretsiz Wi-Fi, kahvaltı dahil, deniz manzarası.",
  keywords: "pansiyon, Edirne, deniz kenarı, tatil, konaklama, otel, pension, sea view",
  openGraph: {
    title: "Adalı Pansiyon - Deniz Kenarında Huzurlu Konaklama",
    description:
      "Edirne'de deniz kenarında yer alan pansiyonumuzda sıcak atmosfer ve konforlu odalarla unutulmaz bir tatil deneyimi yaşayın.",
    type: "website",
    locale: "tr_TR",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <Footer />
        <MobileQuickAccess />
      </body>
    </html>
  )
}
