import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Reservation } from "@/lib/firebase-models"; // Use model from firebase-models
import { formatDate } from "@/lib/utils"; // Assuming this handles ISO strings

// Define EnrichedReservation directly here or import from a central types file
export interface EnrichedReservation extends Reservation {
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  roomName?: string; // If room details are also enriched
  roomType?: string; // If room details are also enriched
}

interface ReservationListProps {
  reservations: EnrichedReservation[];
  onDelete: (id: string) => void;
  onEdit: (reservation: Reservation) => void; // Edit still takes the original Reservation
}

export default function ReservationList({ reservations, onDelete, onEdit }: ReservationListProps) {
  // Ödeme durumuna göre renk sınıfı belirle
  const getPaymentStatusClass = (status: Reservation['paymentStatus']) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  // Rezervasyon durumuna göre renk sınıfı belirle
  const getStatusClass = (status: Reservation['status']) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  if (reservations.length === 0) {
    return <div className="text-center py-8">Hiç rezervasyon bulunamadı.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Misafir</TableHead>
            <TableHead>İletişim</TableHead>
            <TableHead>Giriş-Çıkış</TableHead>
            <TableHead>Oda</TableHead> {/* Oda Adı/No - Tipi */}
            <TableHead>Kişi</TableHead> {/* Yetişkin+Çocuk */}
            <TableHead>Ücret</TableHead>
            <TableHead>Ödeme Durumu</TableHead>
            <TableHead>Rez. Durumu</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-medium">{reservation.guestName}</TableCell>
              <TableCell>
                {reservation.guestPhone}
                {reservation.guestEmail && (
                  <div className="text-xs text-gray-500">{reservation.guestEmail}</div>
                )}
              </TableCell>
              <TableCell>
                <div>{formatDate(reservation.checkInDate)}</div>
                <div>{formatDate(reservation.checkOutDate)}</div>
              </TableCell>
              <TableCell>
                {reservation.roomName || reservation.roomId} {/* Oda adı varsa göster, yoksa ID */}
                {reservation.roomType && <div className="text-xs text-gray-500">{reservation.roomType}</div>}
              </TableCell>
              <TableCell>{reservation.adults + (reservation.children || 0)}</TableCell>
              <TableCell>{reservation.totalPrice.toLocaleString('tr-TR')} ₺</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusClass(reservation.paymentStatus)}`}>
                  {reservation.paymentStatus === 'paid' ? 'Ödendi' : reservation.paymentStatus === 'partial' ? 'Kısmi Ödeme' : 'Ödenmedi'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(reservation.status)}`}>
                  {reservation.status === 'confirmed' ? 'Onaylandı' : reservation.status === 'pending' ? 'Beklemede' : reservation.status === 'cancelled' ? 'İptal' : 'Tamamlandı'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // onEdit'e orijinal (enrich edilmemiş) rezervasyon objesini göndermek daha iyi olabilir.
                      // Ancak parent component selectedReservation'ı zaten ham haliyle tutuyor.
                      // Bu yüzden direkt reservation.id veya tüm enrich edilmiş objeyi de gönderebiliriz.
                      // Şimdilik direkt `reservation` (EnrichedReservation) gönderiyoruz,
                      // parent component zaten `selectedReservation`'ı ham `Reservation` olarak set ediyor.
                      // En sağlıklısı onEdit'e sadece ID'yi veya ham objeyi yollamak.
                      // `onEdit` prop'u `Reservation` bekliyor, bu yüzden `reservation` objesinden
                      // `EnrichedReservation`'a özel alanları çıkarıp yollayalım veya `id` ile çağıralım.
                      // Parent component zaten `reservations` (ham liste) içinden bulup set edecektir.
                      const originalReservation = { // Geri dönüştür
                        id: reservation.id,
                        guestId: reservation.guestId,
                        roomId: reservation.roomId,
                        checkInDate: reservation.checkInDate,
                        checkOutDate: reservation.checkOutDate,
                        adults: reservation.adults,
                        children: reservation.children,
                        status: reservation.status,
                        totalPrice: reservation.totalPrice,
                        paymentStatus: reservation.paymentStatus,
                        notes: reservation.notes,
                        createdAt: reservation.createdAt,
                        updatedAt: reservation.updatedAt,
                        createdBy: reservation.createdBy,
                      };
                      onEdit(originalReservation);
                    }}
                  >
                    Düzenle
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(reservation.id)}
                  >
                    Sil
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
