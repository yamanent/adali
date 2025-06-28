import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tarih formatlamak için yardımcı fonksiyon
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  } catch (error) {
    console.error("Tarih formatlanırken hata:", error);
    return dateString;
  }
}
