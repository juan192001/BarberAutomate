import React from 'react';
import { Modal, Button } from './UI';
import { MOCK_CLIENTS, MOCK_SERVICES, MOCK_BARBERS, Reservation, Service } from '../types';
import { Calendar, Clock, User, Scissors, Euro } from 'lucide-react';

interface ReservationFormProps {
  services: Service[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reservation: Omit<Reservation, 'id'>) => void;
}

export const ReservationForm = ({ services, isOpen, onClose, onSubmit }: ReservationFormProps) => {
  const [formData, setFormData] = React.useState({
    clientName: '',
    service: services[0]?.name || '',
    barber: MOCK_BARBERS[0].name,
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    price: services[0]?.price || 0
  });

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceName = e.target.value;
    const service = services.find(s => s.name === serviceName);
    setFormData({
      ...formData,
      service: serviceName,
      price: service ? service.price : 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'confirmed'
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Reserva">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Cliente */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <User size={14} />
              Cliente
            </label>
            <select 
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200"
              value={formData.clientName}
              onChange={(e) => setFormData({...formData, clientName: e.target.value})}
            >
              <option value="">Seleccionar cliente...</option>
              {MOCK_CLIENTS.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              <option value="Nuevo Cliente">+ Añadir nuevo cliente</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Servicio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Scissors size={14} />
                Servicio
              </label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={formData.service}
                onChange={handleServiceChange}
              >
                {services.map(s => <option key={s.id} value={s.name}>{s.name} (€{s.price})</option>)}
              </select>
            </div>

            {/* Barbero */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <User size={14} />
                Barbero
              </label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={formData.barber}
                onChange={(e) => setFormData({...formData, barber: e.target.value})}
              >
                {MOCK_BARBERS.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Fecha */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Calendar size={14} />
                Fecha
              </label>
              <input 
                type="date" 
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            {/* Hora */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Clock size={14} />
                Hora
              </label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              >
                {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900">
            <Euro size={16} className="text-slate-400" />
            <span className="text-lg font-bold">€{formData.price.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Confirmar Reserva</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
