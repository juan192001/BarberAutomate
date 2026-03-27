import React from 'react';
import { Scissors, Calendar, Clock, ChevronRight, ChevronLeft, CheckCircle2, MapPin, Star } from 'lucide-react';
import { Button, Card, CardContent } from './UI';
import { publicApi } from '../lib/api';
import { cn } from '../lib/utils';

interface CustomerBookingProps {
  barbershop: any;
  onBackToSearch: () => void;
  onBackToAdmin?: () => void;
}

const times = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

export const CustomerBooking = ({ barbershop, onBackToSearch, onBackToAdmin }: CustomerBookingProps) => {
  const [step, setStep] = React.useState(1);
  const [services, setServices] = React.useState<any[]>([]);
  const [barbers, setBarbers] = React.useState<any[]>([]);
  const [bookedTimes, setBookedTimes] = React.useState<string[]>([]); // Estado para guardar las horas ocupadas
  const [loadingData, setLoadingData] = React.useState(true);

  const [selectedService, setSelectedService] = React.useState<any>(null);
  const [selectedBarber, setSelectedBarber] = React.useState<any>(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = React.useState('');
  const [customerInfo, setCustomerInfo] = React.useState({ name: '', email: '', phone: '' });
  const [isFinished, setIsFinished] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (barbershop?.id) {
      Promise.all([
        publicApi.getServices(barbershop.id),
        publicApi.getBarbers(barbershop.id)
      ])
      .then(([srvs, brbrs]) => {
        setServices(srvs);
        setBarbers(brbrs);
      })
      .catch(console.error)
      .finally(() => setLoadingData(false));
    }
  }, [barbershop]);

  // --- NUEVA LÓGICA: Consultar horas ocupadas cada que el cliente cambie de fecha ---
  React.useEffect(() => {
    if (step === 3 && selectedDate && selectedBarber) {
      publicApi.getBookedTimes(barbershop.id, selectedBarber.id, selectedBarber.name, selectedDate)
        .then(occupied => {
          setBookedTimes(occupied);
          // Si la hora que había clicado justo se ocupó, se la deseleccionamos
          if (occupied.includes(selectedTime)) setSelectedTime('');
        })
        .catch(console.error);
    }
  }, [step, selectedDate, selectedBarber]);
  // ---------------------------------------------------------------------------------

  const handleComplete = async () => {
    if (!selectedService || !selectedBarber) return;
    setError('');
    setIsSubmitting(true);
    try {
      await publicApi.book({
        barbershopId: barbershop.id,
        clientName: customerInfo.name,
        clientEmail: customerInfo.email,
        clientPhone: customerInfo.phone,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        barberId: selectedBarber.id,
        barberName: selectedBarber.name,
        date: selectedDate,
        time: selectedTime,
        price: selectedService.price
      });
      setIsFinished(true);
    } catch (err: any) {
      setError(err.message || 'Error al procesar la reserva. Puede que el horario ya esté ocupado.');
    } finally {
      setIsSubmitting(false);
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
            <p className="text-slate-500">Hemos guardado tu cita y avisado al barbero.</p>
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
      <header className="bg-slate-900 text-white py-12 px-4 text-center space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {barbershop.image && <img src={barbershop.image} className="w-full h-full object-cover" alt="bg" referrerPolicy="no-referrer" />}
        </div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <button onClick={onBackToSearch} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mx-auto text-sm font-medium mb-4">
            <ChevronLeft size={16} /> Volver al buscador
          </button>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto border border-white/20">
            <Scissors size={24} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{barbershop.name}</h1>
          <p className="text-slate-400 text-lg">{barbershop.description}</p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-300 pt-4">
            <div className="flex items-center gap-2"><MapPin size={16} /> {barbershop.address}</div>
            <div className="flex items-center gap-2"><Star size={16} className="text-amber-400" /> {barbershop.rating} ({barbershop.reviews || 0} reviews)</div>
          </div>
        </div>
        {onBackToAdmin && (
          <button onClick={onBackToAdmin} className="absolute top-4 right-4 text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors">
            Admin View
          </button>
        )}
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-300", step >= i ? "bg-slate-900 text-white shadow-lg" : "bg-white border-2 border-slate-100 text-slate-300")}>
              {i}
            </div>
          ))}
        </div>

        <div className="min-h-[400px]">
          {loadingData ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500">Cargando disponibilidad...</p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Selecciona un Servicio</h2>
                  </div>
                  {services.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">Esta barbería aún no ha publicado servicios.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <Card key={service.id} className={cn("cursor-pointer transition-all hover:scale-[1.02]", selectedService?.id === service.id ? "border-slate-900 ring-1 ring-slate-900" : "hover:border-slate-300")} onClick={() => { setSelectedService(service); setStep(2); }}>
                          <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-slate-50 rounded-xl text-slate-900"><Scissors size={20} /></div>
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
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Elige tu Barbero</h2>
                  </div>
                  {barbers.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">No hay barberos disponibles.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {barbers.map((barber) => (
                        <Card key={barber.id} className={cn("cursor-pointer transition-all hover:scale-[1.02] text-center", selectedBarber?.id === barber.id ? "border-slate-900 ring-1 ring-slate-900" : "hover:border-slate-300")} onClick={() => { setSelectedBarber(barber); setStep(3); }}>
                          <CardContent className="p-6 space-y-4">
                            <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden mx-auto border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-slate-400">
                              {barber.image ? <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => (e.currentTarget.style.display = 'none')} /> : barber.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold">{barber.name}</h4>
                              <p className="text-xs text-slate-500">{barber.specialty || 'Barbero'}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  <Button variant="ghost" className="mx-auto flex gap-2" onClick={() => setStep(1)}><ChevronLeft size={16} /> Volver a servicios</Button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2"><h2 className="text-2xl font-bold">Fecha y Hora</h2></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><Calendar size={14} /> Día</label>
                      <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><Clock size={14} /> Horas</label>
                      <div className="grid grid-cols-3 gap-2">
                        {/* --- AQUÍ REVISAMOS SI LA HORA ESTÁ OCUPADA PARA BLOQUEARLA --- */}
                        {times.map((t) => {
                          const isBooked = bookedTimes.includes(t);
                          return (
                            <button 
                              key={t} 
                              disabled={isBooked}
                              onClick={() => setSelectedTime(t)} 
                              className={cn(
                                "py-3 rounded-xl text-xs font-bold transition-all", 
                                selectedTime === t ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-600 hover:bg-slate-100",
                                isBooked && "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 hover:bg-slate-100"
                              )}
                            >
                              {t} {isBooked ? '(Ocupado)' : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-8">
                    <Button variant="outline" className="flex-1 gap-2" onClick={() => setStep(2)}><ChevronLeft size={16} /> Anterior</Button>
                    <Button className="flex-1" disabled={!selectedTime} onClick={() => setStep(4)}>Continuar</Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2"><h2 className="text-2xl font-bold">Tus Datos</h2></div>
                  <Card className="max-w-md mx-auto overflow-visible">
                    <CardContent className="p-8 space-y-6">
                      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">Nombre Completo</label>
                          <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                          <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900" value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">Teléfono</label>
                          <input type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                        </div>
                      </div>
                      <div className="pt-4 space-y-4">
                        <Button className="w-full py-4 rounded-2xl text-lg shadow-xl shadow-slate-200" disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone || isSubmitting} onClick={handleComplete}>
                          {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => setStep(3)}>Atrás</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};