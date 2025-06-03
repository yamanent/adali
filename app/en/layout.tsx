import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Adalı Guesthouse - Peaceful Accommodation Near Historical Center",
  description:
    "Experience an unforgettable holiday with a warm atmosphere and comfortable rooms at our guesthouse located in the historical center of Edirne. Free Wi-Fi, breakfast included, close to historical sites.",
  keywords: "guesthouse, Edirne, historical center, holiday, accommodation, hotel, pension, historical sites",
  openGraph: {
    title: "Adalı Guesthouse - Peaceful Accommodation Near Historical Center",
    description:
      "Experience an unforgettable holiday with a warm atmosphere and comfortable rooms at our guesthouse located in the historical center of Edirne.",
    type: "website",
    locale: "en_US",
  },
  generator: 'v0.dev'
}

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
