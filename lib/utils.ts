import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tarih formatlamak için yardımcı fonksiyon
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(dateObj);
  } catch (error) {
    console.error("Tarih formatlanırken hata:", error);
    return typeof date === 'string' ? date : date.toString();
  }
}
