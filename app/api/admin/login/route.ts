import { NextRequest, NextResponse } from "next/server";

// Sabit kullanıcı bilgileri (gerçek uygulamada bu bilgiler güvenli bir şekilde saklanmalıdır)
const ADMIN_USERNAME = "admin";
// Şifre: "admin123" (gerçek uygulamada hash kullanılmalıdır)
const ADMIN_PASSWORD = "admin123";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // IP adresi al (gerçek IP adresi veya varsayılan)
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    // Kullanıcı doğrulama
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Başarılı giriş
      console.log(`Başarılı giriş: ${username} (${ip})`);
      
      return NextResponse.json({ success: true, message: "Giriş başarılı" }, { status: 200 });
    } else {
      // Başarısız giriş
      console.log(`Başarısız giriş denemesi: ${username || "unknown"} (${ip})`);
      
      return NextResponse.json({ success: false, message: "Geçersiz kullanıcı adı veya şifre" }, { status: 401 });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Bir hata oluştu" }, { status: 500 });
  }
}
