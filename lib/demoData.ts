import { Reservation, Room, Expense } from './models';
import { UserRole } from '@/types/auth';

// Demo kullanıcı tipi
type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
};

// Demo kullanıcı verileri
export const demoUsers: DemoUser[] = [
  {
    id: "1",
    name: "Admin Kullanıcı",
    email: "admin@example.com",
    role: UserRole.ADMIN,
    permissions: [
      "view:dashboard", "view:statistics", "view:reservations", "create:reservation", 
      "edit:reservation", "delete:reservation", "view:expenses", "create:expense", 
      "edit:expense", "delete:expense", "view:rooms", "edit:rooms", 
      "view:customers", "edit:customers"
    ]
  },
  {
    id: "2",
    name: "Yönetici Kullanıcı",
    email: "manager@example.com",
    role: UserRole.MANAGER,
    permissions: [
      "view:dashboard", "view:statistics", "view:reservations", "create:reservation", 
      "edit:reservation", "view:expenses", "create:expense", "view:rooms", "view:customers"
    ]
  },
  {
    id: "3",
    name: "Personel Kullanıcı",
    email: "staff@example.com",
    role: UserRole.STAFF,
    permissions: ["view:dashboard", "view:reservations", "create:reservation"]
  },
  {
    id: "4",
    name: "Resepsiyon Görevlisi",
    email: "reception@example.com",
    role: UserRole.STAFF,
    permissions: ["view:dashboard", "view:reservations", "create:reservation", "view:rooms"]
  },
  {
    id: "5",
    name: "Muhasebe Görevlisi",
    email: "accounting@example.com",
    role: UserRole.STAFF,
    permissions: ["view:dashboard", "view:expenses", "create:expense", "edit:expense"]
  }
];

// Demo rezervasyon verileri
export const demoReservations: Reservation[] = [
  {
    id: 'res_1',
    guestName: 'Ahmet Yılmaz',
    phone: '+90 532 123 4567',
    email: 'ahmet.yilmaz@example.com',
    checkInDate: '2025-07-01',
    checkOutDate: '2025-07-05',
    roomNumber: '101',
    roomType: 'Standart Oda',
    guestCount: 2,
    totalPrice: 4000,
    paymentStatus: 'Ödendi',
    reservationChannel: 'Website',
    notes: 'Deniz manzaralı oda talep edildi.',
    createdAt: '2025-06-15T10:30:00Z',
    updatedAt: '2025-06-15T10:30:00Z'
  },
  {
    id: 'res_2',
    guestName: 'Ayşe Demir',
    phone: '+90 555 987 6543',
    email: 'ayse.demir@example.com',
    checkInDate: '2025-07-03',
    checkOutDate: '2025-07-10',
    roomNumber: '102',
    roomType: 'Aile Odası',
    guestCount: 4,
    totalPrice: 8400,
    paymentStatus: 'Kısmi',
    reservationChannel: 'Booking.com',
    notes: 'Çocuklar için ilave yatak gerekiyor.',
    createdAt: '2025-06-18T14:45:00Z',
    updatedAt: '2025-06-18T14:45:00Z'
  },
  {
    id: 'res_3',
    guestName: 'Mehmet Kaya',
    phone: '+90 533 456 7890',
    email: 'mehmet.kaya@example.com',
    checkInDate: '2025-07-05',
    checkOutDate: '2025-07-08',
    roomNumber: '103',
    roomType: 'Deluxe Oda',
    guestCount: 2,
    totalPrice: 4500,
    paymentStatus: 'Bekliyor',
    reservationChannel: 'Telefon',
    notes: 'Geç check-in yapacak, saat 22:00 civarı.',
    createdAt: '2025-06-20T09:15:00Z',
    updatedAt: '2025-06-20T09:15:00Z'
  },
  {
    id: 'res_4',
    guestName: 'Zeynep Şahin',
    phone: '+90 542 789 0123',
    email: 'zeynep.sahin@example.com',
    checkInDate: '2025-07-10',
    checkOutDate: '2025-07-15',
    roomNumber: '201',
    roomType: 'Süit',
    guestCount: 2,
    totalPrice: 7500,
    paymentStatus: 'Ödendi',
    reservationChannel: 'Airbnb',
    notes: 'Balayı çifti, özel karşılama hazırlanacak.',
    createdAt: '2025-06-22T16:30:00Z',
    updatedAt: '2025-06-22T16:30:00Z'
  },
  {
    id: 'res_5',
    guestName: 'Ali Öztürk',
    phone: '+90 536 234 5678',
    email: 'ali.ozturk@example.com',
    checkInDate: '2025-07-12',
    checkOutDate: '2025-07-14',
    roomNumber: '202',
    roomType: 'Standart Oda',
    guestCount: 1,
    totalPrice: 1800,
    paymentStatus: 'Ödendi',
    reservationChannel: 'Walk-in',
    notes: '',
    createdAt: '2025-06-25T11:20:00Z',
    updatedAt: '2025-06-25T11:20:00Z'
  },
  {
    id: 'res_6',
    guestName: 'Fatma Yıldız',
    phone: '+90 538 345 6789',
    email: 'fatma.yildiz@example.com',
    checkInDate: '2025-07-15',
    checkOutDate: '2025-07-20',
    roomNumber: '203',
    roomType: 'Aile Odası',
    guestCount: 3,
    totalPrice: 6000,
    paymentStatus: 'Kısmi',
    reservationChannel: 'WhatsApp',
    notes: 'Bebek için yatak istendi.',
    createdAt: '2025-06-28T13:40:00Z',
    updatedAt: '2025-06-28T13:40:00Z'
  },
  {
    id: 'res_7',
    guestName: 'Mustafa Aydın',
    phone: '+90 539 456 7890',
    email: 'mustafa.aydin@example.com',
    checkInDate: '2025-07-18',
    checkOutDate: '2025-07-25',
    roomNumber: '301',
    roomType: 'Deluxe Oda',
    guestCount: 2,
    totalPrice: 8400,
    paymentStatus: 'Bekliyor',
    reservationChannel: 'Booking.com',
    notes: 'Havaalanı transferi talep edildi.',
    createdAt: '2025-06-30T10:15:00Z',
    updatedAt: '2025-06-30T10:15:00Z'
  },
  {
    id: 'res_8',
    guestName: 'Selin Çelik',
    phone: '+90 531 567 8901',
    email: 'selin.celik@example.com',
    checkInDate: '2025-07-20',
    checkOutDate: '2025-07-27',
    roomNumber: '302',
    roomType: 'Süit',
    guestCount: 2,
    totalPrice: 10500,
    paymentStatus: 'Ödendi',
    reservationChannel: 'Website',
    notes: 'Doğum günü kutlaması için oda süslemesi istendi.',
    createdAt: '2025-07-01T15:30:00Z',
    updatedAt: '2025-07-01T15:30:00Z'
  },
  {
    id: 'res_9',
    guestName: 'Emre Koç',
    phone: '+90 534 678 9012',
    email: 'emre.koc@example.com',
    checkInDate: '2025-07-22',
    checkOutDate: '2025-07-24',
    roomNumber: '303',
    roomType: 'Standart Oda',
    guestCount: 2,
    totalPrice: 2400,
    paymentStatus: 'Bekliyor',
    reservationChannel: 'Telefon',
    notes: '',
    createdAt: '2025-07-05T09:45:00Z',
    updatedAt: '2025-07-05T09:45:00Z'
  },
  {
    id: 'res_10',
    guestName: 'Deniz Arslan',
    phone: '+90 537 789 0123',
    email: 'deniz.arslan@example.com',
    checkInDate: '2025-07-25',
    checkOutDate: '2025-08-01',
    roomNumber: '401',
    roomType: 'Aile Odası',
    guestCount: 4,
    totalPrice: 8400,
    paymentStatus: 'Kısmi',
    reservationChannel: 'Airbnb',
    notes: 'Köpekleri var, evcil hayvan kabul edilen oda verilecek.',
    createdAt: '2025-07-10T14:20:00Z',
    updatedAt: '2025-07-10T14:20:00Z'
  }
];

// Demo gider verileri
export const demoExpenses: Expense[] = [
  {
    id: 'exp_1',
    title: 'Personel Maaşları',
    amount: 15000,
    category: 'Personel',
    date: '2025-06-15',
    description: 'Haziran ayı personel maaşları',
    paymentMethod: 'Banka Transferi',
    receiptNumber: 'TR2025061500',
    createdAt: '2025-06-15T10:00:00Z',
    updatedAt: '2025-06-15T10:00:00Z'
  },
  {
    id: 'exp_2',
    title: 'Elektrik Faturası',
    amount: 3500,
    category: 'Elektrik',
    date: '2025-06-10',
    description: 'Haziran ayı elektrik faturası',
    paymentMethod: 'Banka Transferi',
    receiptNumber: 'ELK2025061001',
    createdAt: '2025-06-10T14:30:00Z',
    updatedAt: '2025-06-10T14:30:00Z'
  },
  {
    id: 'exp_3',
    title: 'Su Faturası',
    amount: 1200,
    category: 'Su',
    date: '2025-06-12',
    description: 'Haziran ayı su faturası',
    paymentMethod: 'Kredi Kartı',
    receiptNumber: 'SU2025061202',
    createdAt: '2025-06-12T09:15:00Z',
    updatedAt: '2025-06-12T09:15:00Z'
  },
  {
    id: 'exp_4',
    title: 'Temizlik Malzemeleri',
    amount: 2800,
    category: 'Temizlik',
    date: '2025-06-20',
    description: 'Aylık temizlik malzemeleri alımı',
    paymentMethod: 'Nakit',
    receiptNumber: 'TM2025062001',
    createdAt: '2025-06-20T11:45:00Z',
    updatedAt: '2025-06-20T11:45:00Z'
  },
  {
    id: 'exp_5',
    title: 'İnternet Faturası',
    amount: 750,
    category: 'İnternet',
    date: '2025-06-18',
    description: 'Haziran ayı internet faturası',
    paymentMethod: 'Kredi Kartı',
    receiptNumber: 'INT2025061801',
    createdAt: '2025-06-18T16:20:00Z',
    updatedAt: '2025-06-18T16:20:00Z'
  },
  {
    id: 'exp_6',
    title: 'Mutfak Alışverişi',
    amount: 4200,
    category: 'Gıda',
    date: '2025-06-22',
    description: 'Haftalık kahvaltı malzemeleri',
    paymentMethod: 'Nakit',
    receiptNumber: 'GD2025062201',
    createdAt: '2025-06-22T09:30:00Z',
    updatedAt: '2025-06-22T09:30:00Z'
  },
  {
    id: 'exp_7',
    title: 'Klima Bakımı',
    amount: 1800,
    category: 'Bakım',
    date: '2025-06-25',
    description: 'Tüm odaların klima bakımı',
    paymentMethod: 'Kredi Kartı',
    receiptNumber: 'BK2025062501',
    createdAt: '2025-06-25T14:15:00Z',
    updatedAt: '2025-06-25T14:15:00Z'
  },
  {
    id: 'exp_8',
    title: 'Doğalgaz Faturası',
    amount: 1500,
    category: 'Doğalgaz',
    date: '2025-06-15',
    description: 'Haziran ayı doğalgaz faturası',
    paymentMethod: 'Banka Transferi',
    receiptNumber: 'DG2025061501',
    createdAt: '2025-06-15T11:20:00Z',
    updatedAt: '2025-06-15T11:20:00Z'
  },
  {
    id: 'exp_9',
    title: 'Havuz Bakımı',
    amount: 2500,
    category: 'Bakım',
    date: '2025-06-28',
    description: 'Aylık havuz bakımı ve kimyasallar',
    paymentMethod: 'Nakit',
    receiptNumber: 'HB2025062801',
    createdAt: '2025-06-28T10:45:00Z',
    updatedAt: '2025-06-28T10:45:00Z'
  },
  {
    id: 'exp_10',
    title: 'Çarşaf ve Havlu Yıkama',
    amount: 1200,
    category: 'Temizlik',
    date: '2025-06-30',
    description: 'Haftalık çarşaf ve havlu yıkama hizmeti',
    paymentMethod: 'Banka Transferi',
    receiptNumber: 'TM2025063001',
    createdAt: '2025-06-30T15:30:00Z',
    updatedAt: '2025-06-30T15:30:00Z'
  }
];

// Demo oda verileri
export const demoRooms: Room[] = [
  {
    id: 'room_101',
    number: '101',
    type: 'Standart Oda',
    capacity: 2,
    price: 1000,
    status: 'Boş'
  },
  {
    id: 'room_102',
    number: '102',
    type: 'Aile Odası',
    capacity: 4,
    price: 1200,
    status: 'Dolu'
  },
  {
    id: 'room_103',
    number: '103',
    type: 'Deluxe Oda',
    capacity: 2,
    price: 1500,
    status: 'Boş'
  },
  {
    id: 'room_201',
    number: '201',
    type: 'Süit',
    capacity: 2,
    price: 1500,
    status: 'Temizlik'
  },
  {
    id: 'room_202',
    number: '202',
    type: 'Standart Oda',
    capacity: 2,
    price: 900,
    status: 'Boş'
  },
  {
    id: 'room_203',
    number: '203',
    type: 'Aile Odası',
    capacity: 4,
    price: 1200,
    status: 'Dolu'
  },
  {
    id: 'room_301',
    number: '301',
    type: 'Deluxe Oda',
    capacity: 2,
    price: 1200,
    status: 'Boş'
  },
  {
    id: 'room_302',
    number: '302',
    type: 'Süit',
    capacity: 2,
    price: 1500,
    status: 'Bakım'
  },
  {
    id: 'room_303',
    number: '303',
    type: 'Standart Oda',
    capacity: 2,
    price: 900,
    status: 'Boş'
  },
  {
    id: 'room_401',
    number: '401',
    type: 'Aile Odası',
    capacity: 4,
    price: 1200,
    status: 'Boş'
  }
];

// Demo istatistik verileri
export const demoStatistics = {
  // Aylık doluluk oranları (2025 yılı)
  occupancyRates: {
    '2025-01': 45, // Ocak
    '2025-02': 50, // Şubat
  },
  
  // Kanal bazlı rezervasyon dağılımı
  channelDistribution: {
    'Doğrudan': 35,
    'Booking.com': 25,
    'Airbnb': 20,
    'Expedia': 10,
    'Telefon': 5,
    'Diğer': 5
  },
  
  // Aylık gelir (2025 yılı, TL)
  monthlyRevenue: {
    '2025-01': 45000,
    '2025-02': 52000,
    '2025-03': 68000,
    '2025-04': 75000,
    '2025-05': 82000,
    '2025-06': 95000,
    '2025-07': 98000,
    '2025-08': 99000,
    '2025-09': 85000,
    '2025-10': 72000,
    '2025-11': 58000,
    '2025-12': 65000
  },
  
  // Aylık gider (2025 yılı, TL)
  monthlyExpenses: {
    '2025-01': 25000,
    '2025-02': 26000,
    '2025-03': 28000,
    '2025-04': 30000,
    '2025-05': 32000,
    '2025-06': 35000,
    '2025-07': 38000,
    '2025-08': 38000,
    '2025-09': 34000,
    '2025-10': 30000,
    '2025-11': 28000,
    '2025-12': 29000
  }
};
