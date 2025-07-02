'use client';

import { addDocument, getCollection } from '@/lib/firebase-service';
import { useState } from 'react';

export default function TestFirebasePage() {
  const [message, setMessage] = useState('Firebase bağlantısı kontrol ediliyor...');
  const [data, setData] = useState<any[]>([]);

  const handleAddData = async () => {
    try {
      setMessage('Veri ekleniyor...');
      const docId = await addDocument('test', { 
        message: 'Firebase bağlantısı başarılı!', 
        timestamp: new Date(),
        source: 'Test Sayfası (Kimlik Doğrulamasız)'
      });
      setMessage(`Veri başarıyla eklendi! Belge ID: ${docId}`);
      console.log('Veri başarıyla eklendi! Belge ID:', docId);
    } catch (error: any) {
      setMessage(`Hata: ${error.message}. Güvenlik kurallarınızı ve Firebase yapılandırmanızı kontrol edin.`);
      console.error('Veri ekleme hatası:', error);
    }
  };

  const handleReadData = async () => {
    try {
      setMessage('Veri okunuyor...');
      const readData = await getCollection('test');
      setData(readData);
      setMessage(`${readData.length} adet belge bulundu.`);
      console.log('Okunan veriler:', readData);
    } catch (error: any) {
      setMessage(`Veri okuma hatası: ${error.message}`);
      console.error('Veri okuma hatası:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#333' }}>
      <h1>Firebase Bağlantı Testi (Kimlik Doğrulamasız)</h1>
      <p><b>Durum:</b> {message}</p>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleAddData} style={{ marginRight: '1rem', padding: '10px 15px', cursor: 'pointer' }}>
          Test Verisi Ekle
        </button>
        <button onClick={handleReadData} style={{ padding: '10px 15px', cursor: 'pointer' }}>
          Test Verisi Oku
        </button>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h3>Okunan Veriler:</h3>
        {data.length > 0 ? (
          <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '5px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <p>Okunacak veri yok.</p>
        )}
      </div>
      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        <b>Önemli:</b> Güvenlik kuralınız şu anda herkese açık. Bu sadece test amaçlıdır. Uygulamanızı canlıya almadan önce güvenli kurallar yazdığınızdan emin olun.
      </p>
    </div>
  );
}
