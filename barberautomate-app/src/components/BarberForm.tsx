import React from 'react';
import { Modal, Button } from './UI';
import { User, Image, Clock, Award } from 'lucide-react';

interface BarberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (barber: any) => void;
  initialData?: any;
}

export const BarberForm = ({ isOpen, onClose, onSubmit, initialData }: BarberFormProps) => {
  const [formData, setFormData] = React.useState({
    name: '',
    specialty: '',
    availability: '9:00 - 19:00',
    image: ''
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        specialty: initialData.specialty || '',
        availability: initialData.availability || '9:00 - 19:00',
        image: initialData.image || ''
      });
    } else {
      setFormData({ name: '', specialty: '', availability: '9:00 - 19:00', image: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Barbero" : "Nuevo Barbero"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <User size={14} /> Nombre
            </label>
            <input 
              type="text" required placeholder="Ej. Marco Rossi"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900" 
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Award size={14} /> Especialidad
            </label>
            <input 
              type="text" placeholder="Ej. Degradados & Estilo"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900" 
              value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Clock size={14} /> Horario
            </label>
            <input 
              type="text" placeholder="9:00 - 19:00"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900" 
              value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})} 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Image size={14} /> URL de Foto (Opcional)
            </label>
            <input 
              type="url" placeholder="https://..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900" 
              value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} 
            />
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{initialData ? "Guardar Cambios" : "Crear Barbero"}</Button>
        </div>
      </form>
    </Modal>
  );
};