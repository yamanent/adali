import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tarih formatlamak için yardımcı fonksiyon
export function formatDate(
  date: string | Date | undefined | null,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }
): string {
  if (!date) return "";
  
  try {
    // Geçersiz tarih değerlerini kontrol et
    if (date instanceof Date && isNaN(date.getTime())) {
      return "";
    }
    
    // String tarih değerini Date nesnesine dönüştür
    let dateObj: Date;
    if (typeof date === 'string') {
      // ISO formatı kontrolü
      if (!/^\d{4}-\d{2}-\d{2}/.test(date) && date !== "") {
        return date; // ISO formatında değilse olduğu gibi döndür
      }
      dateObj = new Date(date);
      // Geçersiz tarih kontrolü
      if (isNaN(dateObj.getTime())) {
        return date;
      }
    } else {
      dateObj = date;
    }
    
    return new Intl.DateTimeFormat("tr-TR", options).format(dateObj);
  } catch (error) {
    console.error("Tarih formatlanırken hata:", error);
    return typeof date === 'string' ? date : "";
  }
}
