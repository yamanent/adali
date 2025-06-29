// Telegram API için yardımcı fonksiyonlar - Sadece iletişim formu için
export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

// Varsayılan Telegram yapılandırması
// NOT: Gerçek uygulamada bu değerleri .env dosyasından almalısınız
const defaultConfig: TelegramConfig = {
  botToken: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || "YOUR_BOT_TOKEN", // BotFather'dan aldığınız token
  chatId: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || "YOUR_CHAT_ID", // Mesajların gönderileceği chat ID
};

/**
 * Telegram'a mesaj gönderir
 * @param message Gönderilecek mesaj
 * @param config Telegram yapılandırması (opsiyonel)
 */
export async function sendTelegramMessage(
  message: string,
  config: TelegramConfig = defaultConfig
): Promise<boolean> {
  // Client-side'da çalışıyorsa, API çağrısı yapmadan başarılı döndür
  if (typeof window !== 'undefined') {
    console.log('Client-side Telegram mesajı (gönderilmedi):', message);
    return true;
  }
  
  try {
    const { botToken, chatId } = config;
    
    // Bot token veya chat ID yoksa, hata vermeden çık
    if (botToken === "YOUR_BOT_TOKEN" || chatId === "YOUR_CHAT_ID") {
      console.warn("Telegram yapılandırması eksik. Mesaj gönderilmedi.");
      return false;
    }
    
    // Telegram API URL
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // API isteği
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML", // HTML formatında mesaj gönder
      }),
      // Zaman aşımı ekle
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Telegram API hatası:", data);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Telegram mesaj gönderme hatası:", error);
    return false;
  }
}

/**
 * İletişim formundan gönderilen mesajları Telegram'a gönderir
 * @param formData İletişim formu verileri
 * @param ip IP adresi
 */
export async function sendContactMessage(
  formData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  },
  ip: string
): Promise<boolean> {
  const timestamp = new Date().toLocaleString("tr-TR");
  
  const message = `
<b>📬 Yeni İletişim Mesajı</b>
<b>Ad Soyad:</b> ${formData.name}
<b>E-posta:</b> ${formData.email}
<b>Telefon:</b> ${formData.phone || "Belirtilmemiş"}
<b>Konu:</b> ${formData.subject || "Belirtilmemiş"}
<b>IP:</b> ${ip}
<b>Tarih:</b> ${timestamp}

<b>Mesaj:</b>
${formData.message}
`;

  return await sendTelegramMessage(message);
}
