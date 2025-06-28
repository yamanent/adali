import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Reservation } from "@/lib/models";
import { formatDate } from "@/lib/utils";

interface ReservationListProps {
  reservations: Reservation[];
  onDelete: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
}

export default function ReservationList({ reservations, onDelete, onEdit }: ReservationListProps) {
  // Ödeme durumuna göre renk sınıfı belirle
  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case "Ödendi":
        return "bg-green-100 text-green-800";
      case "Kısmi":
        return "bg-yellow-100 text-yellow-800";
      case "Bekliyor":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  // Rezervasyon kanalına göre renk sınıfı belirle
  const getChannelClass = (channel: string) => {
    switch (channel) {
      case "Booking.com":
        return "bg-blue-100 text-blue-800";
      case "Airbnb":
        return "bg-red-100 text-red-800";
      case "Website":
        return "bg-purple-100 text-purple-800";
      case "Telefon":
        return "bg-green-100 text-green-800";
      case "WhatsApp":
        return "bg-emerald-100 text-emerald-800";
      case "Sosyal Medya":
        return "bg-pink-100 text-pink-800";
      case "Walk-in":
        return "bg-amber-100 text-amber-800";
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
            <TableHead>Oda</TableHead>
            <TableHead>Kişi</TableHead>
            <TableHead>Ücret</TableHead>
            <TableHead>Ödeme</TableHead>
            <TableHead>Kanal</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-medium">{reservation.guestName}</TableCell>
              <TableCell>
                {reservation.phone}
                {reservation.email && (
                  <div className="text-xs text-gray-500">{reservation.email}</div>
                )}
              </TableCell>
              <TableCell>
                <div>{formatDate(reservation.checkInDate)}</div>
                <div>{formatDate(reservation.checkOutDate)}</div>
              </TableCell>
              <TableCell>
                {reservation.roomNumber}
                <div className="text-xs text-gray-500">{reservation.roomType}</div>
              </TableCell>
              <TableCell>{reservation.guestCount}</TableCell>
              <TableCell>{reservation.totalPrice} ₺</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusClass(reservation.paymentStatus)}`}>
                  {reservation.paymentStatus}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getChannelClass(reservation.reservationChannel)}`}>
                  {reservation.reservationChannel}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(reservation)}
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
