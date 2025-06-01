import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Adalı Guesthouse - Peaceful Accommodation by the Sea",
  description:
    "Experience an unforgettable holiday with a warm atmosphere and comfortable rooms at our guesthouse located by the sea in Edirne. Free Wi-Fi, breakfast included, sea view.",
  keywords: "guesthouse, Edirne, seaside, holiday, accommodation, hotel, pension, sea view",
  openGraph: {
    title: "Adalı Guesthouse - Peaceful Accommodation by the Sea",
    description:
      "Experience an unforgettable holiday with a warm atmosphere and comfortable rooms at our guesthouse located by the sea in Edirne.",
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
