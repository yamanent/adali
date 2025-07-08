import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Toaster } from "sonner"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import MobileQuickAccess from "@/components/mobile-quick-access"
import { AuthProvider } from "@/context/auth-context"
import LanguageProvider from "@/components/language-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Adalı Pansiyon - Tarihi Merkeze Yakın Huzurlu Konaklama",
  description:
    "Edirne'nin tarihi merkezinde yer alan pansiyonumuzda sıcak atmosfer ve konforlu odalarla unutulmaz bir tatil deneyimi yaşayın. Ücretsiz Wi-Fi, kahvaltı dahil, tarihi yerlere yakın konum.",
  keywords: "pansiyon, Edirne, tarihi merkez, tatil, konaklama, otel, pension, historical center",
  openGraph: {
    title: "Adalı Pansiyon - Tarihi Merkeze Yakın Huzurlu Konaklama",
    description:
      "Edirne'nin tarihi merkezinde yer alan pansiyonumuzda sıcak atmosfer ve konforlu odalarla unutulmaz bir tatil deneyimi yaşayın.",
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
      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17304527646"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17304527646');
        `}
      </Script>
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider />
          <Toaster position="top-center" richColors />
          <Navigation />
          <main>{children}</main>
          <Footer />
          <MobileQuickAccess />
        </AuthProvider>
      </body>
    </html>
  )
}
