import Link from "next/link"
import { Phone, MessageCircle, Mail } from "lucide-react"

export default function MobileQuickAccess() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 md:hidden z-50">
      <div className="flex justify-between items-center">
        <Link href="tel:02842135527" className="flex flex-col items-center text-sage-800">
          <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center mb-1">
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-xs">Ara</span>
        </Link>
        
        <Link href="https://wa.me/02842135527" className="flex flex-col items-center text-sage-800">
          <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center mb-1">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-xs">WhatsApp</span>
        </Link>
        
        <Link href="mailto:bilgi@adalipansiyonedirne.com" className="flex flex-col items-center text-sage-800">
          <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center mb-1">
            <Mail className="w-5 h-5" />
          </div>
          <span className="text-xs">E-posta</span>
        </Link>
      </div>
    </div>
  )
}
