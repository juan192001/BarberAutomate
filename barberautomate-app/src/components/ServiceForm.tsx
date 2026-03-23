import React from 'react';
import { Modal, Button } from './UI';
import { Service } from '../types';
import { Scissors, Clock, Euro, Type } from 'lucide-react';

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (service: Omit<Service, 'id'>) => void;
  initialData?: Service | null;
}

export const ServiceForm = ({ isOpen, onClose, onSubmit, initialData }: ServiceFormProps) => {
  const [formData, setFormData] = React.useState({
    name: '',
    duration: '30 min',
    price: 0,
    status: 'active' as 'active' | 'inactive'
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        duration: initialData.duration,
        price: initialData.price,
        status: initialData.status
      });
    } else {
      setFormData({
        name: '',
        duration: '30 min',
        price: 0,
        status: 'active'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Servicio" : "Nuevo Servicio"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Type size={14} />
              Nombre del Servicio
            </label>
            <input 
              type="text" 
              required
              placeholder="Ej. Corte Premium + Barba"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Duración */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Clock size={14} />
                Duración
              </label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              >
                {['15 min', '30 min', '45 min', '60 min', '90 min', '120 min'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Precio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Euro size={14} />
                Precio (€)
              </label>
              <input 
                type="number" 
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Estado</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  checked={formData.status === 'active'} 
                  onChange={() => setFormData({...formData, status: 'active'})}
                  className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                />
                <span className="text-sm">Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  checked={formData.status === 'inactive'} 
                  onChange={() => setFormData({...formData, status: 'inactive'})}
                  className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                />
                <span className="text-sm">Inactivo</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{initialData ? "Guardar Cambios" : "Crear Servicio"}</Button>
        </div>
      </form>
    </Modal>
  );
};
