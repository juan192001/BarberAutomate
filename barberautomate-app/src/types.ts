export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  clientName: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  status: ReservationStatus;
  price: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
  totalAppointments: number;
  status: 'active' | 'inactive' | 'new';
}

export interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  status: 'active' | 'inactive';
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  availability: string;
  image: string;
  appointmentsToday: number;
}

export interface Automation {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  type: 'reminder' | 'confirmation' | 'follow-up' | 'promo';
}

export const MOCK_RESERVATIONS: Reservation[] = [
  { id: '1', clientName: 'Alex Rivera', service: 'Corte Premium', barber: 'Marco', date: '2024-03-12', time: '10:00 AM', status: 'confirmed', price: 25 },
  { id: '2', clientName: 'Julian Castro', service: 'Barba & Toalla', barber: 'Santi', date: '2024-03-12', time: '11:30 AM', status: 'pending', price: 15 },
  { id: '3', clientName: 'Mateo Lopez', service: 'Corte & Barba', barber: 'Marco', date: '2024-03-12', time: '01:00 PM', status: 'completed', price: 35 },
  { id: '4', clientName: 'Daniel Ruiz', service: 'Corte Clásico', barber: 'Enzo', date: '2024-03-12', time: '02:30 PM', status: 'confirmed', price: 20 },
  { id: '5', clientName: 'Carlos Mesa', service: 'Corte Premium', barber: 'Santi', date: '2024-03-12', time: '04:00 PM', status: 'cancelled', price: 25 },
];

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Alex Rivera', phone: '+34 612 345 678', email: 'alex@example.com', lastVisit: '2024-03-01', totalAppointments: 12, status: 'active' },
  { id: '2', name: 'Julian Castro', phone: '+34 622 111 222', email: 'julian@example.com', lastVisit: '2024-02-15', totalAppointments: 5, status: 'active' },
  { id: '3', name: 'Mateo Lopez', phone: '+34 633 444 555', email: 'mateo@example.com', lastVisit: '2024-03-10', totalAppointments: 1, status: 'new' },
  { id: '4', name: 'Daniel Ruiz', phone: '+34 644 777 888', email: 'daniel@example.com', lastVisit: '2023-12-20', totalAppointments: 8, status: 'inactive' },
];

export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Corte Premium', duration: '45 min', price: 25, status: 'active' },
  { id: '2', name: 'Corte Clásico', duration: '30 min', price: 20, status: 'active' },
  { id: '3', name: 'Barba & Toalla', duration: '20 min', price: 15, status: 'active' },
  { id: '4', name: 'Corte & Barba', duration: '60 min', price: 35, status: 'active' },
  { id: '5', name: 'Coloración', duration: '90 min', price: 50, status: 'inactive' },
];

export const MOCK_BARBERS: Barber[] = [
  { id: '1', name: 'Marco Rossi', specialty: 'Degradados & Estilo', availability: '9:00 - 19:00', image: 'https://picsum.photos/seed/marco/200', appointmentsToday: 8 },
  { id: '2', name: 'Santi Gomez', specialty: 'Barba & Clásico', availability: '10:00 - 20:00', image: 'https://picsum.photos/seed/santi/200', appointmentsToday: 6 },
  { id: '3', name: 'Enzo Ferrari', specialty: 'Tijera & Textura', availability: '9:00 - 18:00', image: 'https://picsum.photos/seed/enzo/200', appointmentsToday: 5 },
];

export const MOCK_AUTOMATIONS: Automation[] = [
  { id: '1', title: 'Recordatorio 24h', description: 'Envía un SMS y WhatsApp 24 horas antes de la cita.', enabled: true, type: 'reminder' },
  { id: '2', title: 'Confirmación Inmediata', description: 'Envía un correo al momento de realizar la reserva.', enabled: true, type: 'confirmation' },
  { id: '3', title: 'Seguimiento Post-Visita', description: 'Mensaje 2 días después para pedir feedback.', enabled: false, type: 'follow-up' },
  { id: '4', title: 'Promo Reactivación', description: 'Cupón de descuento para clientes con +30 días sin venir.', enabled: true, type: 'promo' },
];

export interface Barbershop {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  distance?: string;
}

export const MOCK_BARBERSHOPS: Barbershop[] = [
  {
    id: '1',
    name: 'The Barber Club',
    address: 'Calle Mayor 12, Madrid',
    rating: 4.9,
    reviews: 1240,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=60',
    description: 'El arte de la barbería clásica con un toque moderno.',
    distance: '0.5 km'
  },
  {
    id: '2',
    name: 'Vintage Cuts',
    address: 'Paseo de la Castellana 45, Madrid',
    rating: 4.7,
    reviews: 850,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=60',
    description: 'Especialistas en cortes retro y afeitado tradicional.',
    distance: '1.2 km'
  },
  {
    id: '3',
    name: 'Urban Style Studio',
    address: 'Calle de Fuencarral 88, Madrid',
    rating: 4.8,
    reviews: 2100,
    image: 'https://images.unsplash.com/photo-1621605815841-2dddb7a69e3d?w=800&auto=format&fit=crop&q=60',
    description: 'Tendencias urbanas y degradados perfectos.',
    distance: '2.0 km'
  },
  {
    id: '4',
    name: 'Gentleman\'s Lounge',
    address: 'Calle de Serrano 10, Madrid',
    rating: 5.0,
    reviews: 450,
    image: 'https://images.unsplash.com/photo-1599351431247-f57933842922?w=800&auto=format&fit=crop&q=60',
    description: 'Lujo y exclusividad para el hombre moderno.',
    distance: '3.5 km'
  }
];

export const REVENUE_DATA = [
  { name: 'Lun', value: 400 },
  { name: 'Mar', value: 300 },
  { name: 'Mie', value: 600 },
  { name: 'Jue', value: 800 },
  { name: 'Vie', value: 1200 },
  { name: 'Sab', value: 1500 },
  { name: 'Dom', value: 500 },
];

export const APPOINTMENTS_DATA = [
  { name: 'Lun', value: 12 },
  { name: 'Mar', value: 10 },
  { name: 'Mie', value: 18 },
  { name: 'Jue', value: 22 },
  { name: 'Vie', value: 30 },
  { name: 'Sab', value: 35 },
  { name: 'Dom', value: 15 },
];
