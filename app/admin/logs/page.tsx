// app/admin/logs/page.tsx

import { getLogs } from '@/lib/log-service';
import { Log } from '@/lib/firebase-models';
import { format } from 'date-fns';

// Zaman damgasını okunabilir bir formata çeviren yardımcı fonksiyon
const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return 'N/A';
  // Firestore Timestamp nesnesini Date nesnesine çevir
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(date, 'dd/MM/yyyy HH:mm:ss');
};

export default async function LogsPage() {
  const logs = await getLogs();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sistem Log Kayıtları</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                <th className="py-3 px-5">Zaman</th>
                <th className="py-3 px-5">Seviye</th>
                <th className="py-3 px-5">Mesaj</th>
                <th className="py-3 px-5">Kullanıcı</th>
                <th className="py-3 px-5">Detaylar</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {logs.map((log: Log) => (
                <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-5 whitespace-nowrap">{formatTimestamp(log.timestamp)}</td>
                  <td className="py-4 px-5">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ 
                      log.level === 'info' ? 'bg-blue-200 text-blue-800' : 
                      log.level === 'warn' ? 'bg-yellow-200 text-yellow-800' : 
                      'bg-red-200 text-red-800' 
                    }`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="py-4 px-5">{log.message}</td>
                  <td className="py-4 px-5">{log.userEmail || 'system'}</td>
                  <td className="py-4 px-5">
                    {log.details && Object.keys(log.details).length > 0 ? (
                      <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(log.details, null, 2)}</pre>
                    ) : (
                      '--'
                    )}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    Görüntülenecek log kaydı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Revalidate data every 60 seconds to get fresh logs
export const revalidate = 60;
