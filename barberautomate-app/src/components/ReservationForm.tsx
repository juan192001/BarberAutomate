import React from 'react';
import { Modal, Button } from './UI';
import { Calendar, Clock, User, Scissors, Euro, Phone, Mail } from 'lucide-react';
import { Service } from '../types';
import { barbersApi, reservationsApi, clientsApi } from '../lib/api';

interface ReservationFormProps {
  services: Service[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reservation: any) => void;
}

const ALL_TIMES = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'];

export const ReservationForm = ({ services, isOpen, onClose, onSubmit }: ReservationFormProps) => {
  const [barbers, setBarbers] = React.useState<any[]>([]);
  const [clients, setClients] = React.useState<any[]>([]);
  const [bookedTimes, setBookedTimes] = React.useState<string[]>([]);
  const [formData, setFormData] = React.useState({
    clientName: '', clientEmail: '', clientPhone: '',
    service: '', barber: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM', price: 0
  });

  React.useEffect(() => {
    if (isOpen) {
      barbersApi.list().then(data => {
        setBarbers(data);
        if (data.length > 0 && !formData.barber) setFormData(prev => ({ ...prev, barber: data[0].name }));
      }).catch(console.error);
      
      // Cargar clientes para autocompletar
      clientsApi.list().then(setClients).catch(console.error);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (services.length > 0 && !formData.service) {
       setFormData(prev => ({ ...prev, service: services[0].name, price: services[0].price }));
    }
  }, [services]);

  React.useEffect(() => {
    if (isOpen && formData.date && formData.barber) {
      reservationsApi.list({ date: formData.date }).then(res => {
        const occupied = res.filter((r: any) => (r.barber_name === formData.barber || r.barber === formData.barber) && r.status !== 'cancelled').map((r: any) => r.time);
        setBookedTimes(occupied);
        if (occupied.includes(formData.time)) {
          const firstAvailable = ALL_TIMES.find(t => !occupied.includes(t));
          setFormData(prev => ({ ...prev, time: firstAvailable || '' }));
        }
      }).catch(console.error);
    }
  }, [formData.date, formData.barber, isOpen]);

  // Autocompletar por NOMBRE
  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const foundClient = clients.find(c => c.name === name);
    if (foundClient) {
      setFormData(prev => ({ ...prev, clientName: name, clientEmail: foundClient.email || '', clientPhone: foundClient.phone || '' }));
    } else {
      setFormData(prev => ({ ...prev, clientName: name }));
    }
  };

  // --- NUEVO: Autocompletar por TELÉFONO ---
  const handleClientPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    const foundClient = clients.find(c => c.phone === phone);
    if (foundClient) {
      setFormData(prev => ({ 
        ...prev, 
        clientPhone: phone, 
        clientName: foundClient.name || prev.clientName, 
        clientEmail: foundClient.email || prev.clientEmail 
      }));
    } else {
      setFormData(prev => ({ ...prev, clientPhone: phone }));
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceName = e.target.value;
    const service = services.find(s => s.name === serviceName);
    setFormData(prev => ({ ...prev, service: serviceName, price: service ? service.price : 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, status: 'confirmed' });
    setFormData(prev => ({ ...prev, clientName: '', clientEmail: '', clientPhone: '' }));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Reserva">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <User size={14} /> Cliente (Escribe o Selecciona)
            </label>
            <input 
              type="text" required list="clients-list" placeholder="Nombre del cliente..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200"
              value={formData.clientName} onChange={handleClientNameChange}
            />
            <datalist id="clients-list">
              {clients.map(c => <option key={c.id} value={c.name} />)}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Phone size={14} /> Teléfono</label>
                {/* Ahora el teléfono usa el nuevo onChange y tiene su propio datalist */}
                <input 
                  type="tel" list="phones-list" placeholder="Ej. 600 000 000" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" 
                  value={formData.clientPhone} onChange={handleClientPhoneChange} 
                />
                <datalist id="phones-list">
                  {clients.filter(c => c.phone).map(c => <option key={`phone-${c.id}`} value={c.phone} />)}
                </datalist>
             </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Mail size={14} /> Email</label>
                <input type="email" placeholder="Opcional" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={formData.clientEmail} onChange={(e) => setFormData(p => ({...p, clientEmail: e.target.value}))} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Scissors size={14} /> Servicio</label>
              <select required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={formData.service} onChange={handleServiceChange}>
                {services.map(s => <option key={s.id} value={s.name}>{s.name} (€{s.price})</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><User size={14} /> Barbero</label>
              <select required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={formData.barber} onChange={(e) => setFormData(p => ({...p, barber: e.target.value}))}>
                <option value="" disabled>Seleccionar...</option>
                {barbers.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Calendar size={14} /> Fecha</label>
              <input type="date" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={formData.date} onChange={(e) => setFormData(p => ({...p, date: e.target.value}))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Clock size={14} /> Hora</label>
              <select required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={formData.time} onChange={(e) => setFormData(p => ({...p, time: e.target.value}))}>
                {ALL_TIMES.map(t => {
                  const isBooked = bookedTimes.includes(t);
                  return <option key={t} value={t} disabled={isBooked}>{t} {isBooked ? '(Ocupado)' : ''}</option>;
                })}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900">
            <Euro size={16} className="text-slate-400" /><span className="text-lg font-bold">€{formData.price.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={!formData.time}>Confirmar Reserva</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};