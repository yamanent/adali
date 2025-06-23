import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Log dosyası yolu
const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "admin_logs.json");

// Log dosyasının varlığını kontrol et
function ensureLogFileExists() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, JSON.stringify([]), "utf-8");
  }
}

export async function GET(request: NextRequest) {
  try {
    ensureLogFileExists();
    
    // Log dosyasını oku
    const logs = JSON.parse(fs.readFileSync(LOG_FILE, "utf-8"));
    
    return NextResponse.json({ success: true, logs }, { status: 200 });
  } catch (error) {
    console.error("Log okuma hatası:", error);
    return NextResponse.json({ success: false, message: "Loglar yüklenirken bir hata oluştu" }, { status: 500 });
  }
}
