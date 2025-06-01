import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center">
      <div className="relative w-40 h-40 mb-6">
        <Image
          src="/adali.svg"
          alt="Adalı Pansiyon Logo"
          fill
          className="object-contain animate-pulse"
        />
      </div>
      
      <div className="flex items-center justify-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-sage-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-3 h-3 rounded-full bg-sage-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-3 h-3 rounded-full bg-sage-600 animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
      
      <p className="text-sage-600 mt-4 text-lg">Yükleniyor...</p>
    </div>
  );
}
