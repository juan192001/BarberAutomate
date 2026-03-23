import React from 'react';
import { 
  Scissors, 
  User, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Star
} from 'lucide-react';
import { Button, Card, CardContent, Badge } from './UI';
import { MOCK_SERVICES, MOCK_BARBERS, Service, Barber, Reservation, Barbershop } from '../types';
import { cn } from '../lib/utils';

interface CustomerBookingProps {
  barbershop: Barbershop;
  services: Service[];
  onBookingComplete: (reservation: Omit<Reservation, 'id'>) => void;
  onBackToSearch: () => void;
  onBackToAdmin?: () => void;
}

export const CustomerBooking = ({ barbershop, services, onBookingComplete, onBackToSearch, onBackToAdmin }: CustomerBookingProps) => {
  const [step, setStep] = React.useState(1);
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = React.useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = React.useState('');
  const [customerInfo, setCustomerInfo] = React.useState({ name: '', email: '', phone: '' });
  const [isFinished, setIsFinished] = React.useState(false);

  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  const handleComplete = () => {
    if (selectedService && selectedBarber) {
      onBookingComplete({
        clientName: customerInfo.name,
        service: selectedService.name,
        barber: selectedBarber.name,
        date: selectedDate,
        time: selectedTime,
        status: 'pending',
        price: selectedService.price
      });
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <Card className="max-w-md w-full text-center p-8 space-y-6 border-none shadow-2xl">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">¡Reserva Confirmada!</h2>
            <p className="text-slate-500">Hemos enviado los detalles a tu correo y WhatsApp.</p>
          </div>
          <Card className="bg-slate-50 border-none p-4 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Barbería:</span>
              <span className="font-bold">{barbershop.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Servicio:</span>
              <span className="font-bold">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Barbero:</span>
              <span className="font-bold">{selectedBarber?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Fecha:</span>
              <span className="font-bold">{selectedDate} a las {selectedTime}</span>
            </div>
          </Card>
          <Button className="w-full" onClick={onBackToSearch}>Hacer otra reserva</Button>
          {onBackToAdmin && (
            <Button variant="ghost" className="w-full text-xs" onClick={onBackToAdmin}>
              Volver al Panel Admin
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero Header */}
      <header className="bg-slate-900 text-white py-12 px-4 text-center space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={barbershop.image} className="w-full h-full object-cover" alt="bg" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <button 
            onClick={onBackToSearch}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mx-auto text-sm font-medium mb-4"
          >
            <ChevronLeft size={16} /> Volver al buscador
          </button>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto border border-white/20">
            <Scissors size={24} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{barbershop.name}</h1>
          <p className="text-slate-400 text-lg">{barbershop.description}</p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-300 pt-4">
            <div className="flex items-center gap-2"><MapPin size={16} /> {barbershop.address}</div>
            <div className="flex items-center gap-2"><Star size={16} className="text-amber-400" /> {barbershop.rating} ({barbershop.reviews} reviews)</div>
          </div>
        </div>
        {onBackToAdmin && (
          <button 
            onClick={onBackToAdmin}
            className="absolute top-4 right-4 text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors"
          >
            Admin View
          </button>
        )}
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-300",
                step >= i ? "bg-slate-900 text-white shadow-lg" : "bg-white border-2 border-slate-100 text-slate-300"
              )}
            >
              {i}
            </div>
          ))}
        </div>

        <div className="min-h-[400px]">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Selecciona un Servicio</h2>
                <p className="text-slate-500">Elige el tratamiento que deseas recibir.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.filter(s => s.status === 'active').map((service) => (
                  <Card 
                    key={service.id}
                    className={cn(
                      "cursor-pointer transition-all hover:scale-[1.02]",
                      selectedService?.id === service.id ? "border-slate-900 ring-1 ring-slate-900" : "hover:border-slate-300"
                    )}
                    onClick={() => {
                      setSelectedService(service);
                      setStep(2);
                    }}
                  >
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl text-slate-900">
                          <Scissors size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold">{service.name}</h4>
                          <p className="text-xs text-slate-500">{service.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">€{service.price}</p>
                        <ChevronRight size={16} className="ml-auto mt-1 text-slate-300" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Barber */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Elige tu Barbero</h2>
                <p className="text-slate-500">Contamos con profesionales expertos para cada estilo.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_BARBERS.map((barber) => (
                  <Card 
                    key={barber.id}
                    className={cn(
                      "cursor-pointer transition-all hover:scale-[1.02] text-center",
                      selectedBarber?.id === barber.id ? "border-slate-900 ring-1 ring-slate-900" : "hover:border-slate-300"
                    )}
                    onClick={() => {
                      setSelectedBarber(barber);
                      setStep(3);
                    }}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto border-4 border-white shadow-lg">
                        <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-bold">{barber.name}</h4>
                        <p className="text-xs text-slate-500">{barber.specialty}</p>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-amber-400">
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="ghost" className="mx-auto flex gap-2" onClick={() => setStep(1)}>
                <ChevronLeft size={16} /> Volver a servicios
              </Button>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Fecha y Hora</h2>
                <p className="text-slate-500">¿Cuándo te gustaría venir?</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Selecciona el día
                  </label>
                  <input 
                    type="date" 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> Horas disponibles
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {times.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={cn(
                          "py-3 rounded-xl text-xs font-bold transition-all",
                          selectedTime === t 
                            ? "bg-slate-900 text-white shadow-lg" 
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button variant="outline" className="flex-1 gap-2" onClick={() => setStep(2)}>
                  <ChevronLeft size={16} /> Anterior
                </Button>
                <Button 
                  className="flex-1" 
                  disabled={!selectedTime} 
                  onClick={() => setStep(4)}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Contact Info */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Tus Datos</h2>
                <p className="text-slate-500">Para enviarte la confirmación de tu cita.</p>
              </div>

              <Card className="max-w-md mx-auto overflow-visible">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Nombre Completo</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Juan Pérez"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                      <input 
                        type="email" 
                        placeholder="tu@email.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Teléfono</label>
                      <input 
                        type="tel" 
                        placeholder="+34 600 000 000"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Resumen:</span>
                        <span className="font-bold">{selectedService?.name} con {selectedBarber?.name}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Total:</span>
                        <span className="font-bold text-slate-900">€{selectedService?.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full py-4 rounded-2xl text-lg shadow-xl shadow-slate-200" 
                      disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone}
                      onClick={handleComplete}
                    >
                      Confirmar Reserva
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => setStep(3)}>Atrás</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 px-4 border-t border-slate-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-4">
            <h5 className="font-bold">The Barber Club</h5>
            <p className="text-sm text-slate-500">El arte de la barbería clásica con un toque moderno.</p>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold">Contacto</h5>
            <div className="space-y-2 text-sm text-slate-500">
              <p className="flex items-center justify-center md:justify-start gap-2"><Phone size={14} /> +34 600 000 000</p>
              <p className="flex items-center justify-center md:justify-start gap-2"><Mail size={14} /> hola@thebarberclub.com</p>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold">Horario</h5>
            <p className="text-sm text-slate-500">Lun - Sáb: 09:00 - 20:00</p>
            <p className="text-sm text-slate-500">Dom: Cerrado</p>
          </div>
        </div>
        <div className="mt-12 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Powered by BarberAutomate
        </div>
      </footer>
    </div>
  );
};
