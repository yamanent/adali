// Loglama işlemleri için soyutlama katmanı

import { logService, NewData, Log, Timestamp, orderBy, limit } from './firebase-service';
import { auth } from './firebase'; // Kullanıcı bilgisi için

/**
 * Sisteme yeni bir log kaydı ekler.
 *
 * @param level - Logun seviyesi ('info', 'warn', 'error').
 * @param message - Yapılan işlemi özetleyen ana mesaj.
 * @param details - (Opsiyonel) İşlemle ilgili ek verileri içeren bir nesne.
 */
export const createLog = async (
  level: Log['level'],
  message: string,
  details?: Record<string, any>,
  // auth.currentUser'ın mevcut olmadığı (örn. mock login) durumlar için opsiyonel kullanıcı parametresi
  user?: { uid: string; email: string | null }
): Promise<void> => {
  try {
    // Öncelik dışarıdan gelen kullanıcıda, yoksa Firebase'den al
    const logUser = user || auth.currentUser;

    const logData: NewData<Log> = {
      timestamp: Timestamp.now(), // Sunucu zaman damgası daha güvenilir ama anlık kullanım için bu da uygun
      level,
      message,
      details: details || {},
      userId: logUser?.uid || 'system',
      userEmail: logUser?.email || 'system',
    };

    await logService.add(logData);
  } catch (error) {
    console.error('Log Service: Failed to create log.', {
      originalMessage: message,
      error,
    });
    // Bu hatanın uygulamanın akışını durdurmaması önemlidir.
  }
};

/**
 * Tüm log kayıtlarını getirir.
 * Sadece admin yetkisine sahip kullanıcılar tarafından çağrılmalıdır.
 */
export const getLogs = async (): Promise<Log[]> => {
  try {
    // Varsayılan olarak en yeni loglar en üstte olacak şekilde sıralanır.
    return await logService.getAll();
  } catch (error) {
    console.error('Log Service: Failed to get logs.', error);
    return []; // Hata durumunda boş bir dizi döndür.
  }
};

/**
 * Belirtilen sayıda en son log kaydını getirir.
 * @param count Getirilecek log sayısı.
 */
export const getLatestLogs = async (count: number): Promise<Log[]> => {
  try {
    // En yeni logları getirmek için sorgu kısıtlamaları
    const constraints = [
      orderBy("timestamp", "desc"),
      limit(count)
    ];
    return await logService.getAll(constraints);
  } catch (error) {
    console.error(`Log Service: Failed to get latest ${count} logs.`, error);
    return []; // Hata durumunda boş bir dizi döndür.
  }
};
