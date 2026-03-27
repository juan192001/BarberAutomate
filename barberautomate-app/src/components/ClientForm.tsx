import React from 'react';
import { Modal, Button } from './UI';
import { User, Phone, Mail, FileText } from 'lucide-react';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: any) => void;
}

export const ClientForm = ({ isOpen, onClose, onSubmit }: ClientFormProps) => {
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  // Limpiar el formulario cada vez que se abre
  React.useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', phone: '', email: '', notes: '' });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Cliente">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <User size={14} /> Nombre Completo
            </label>
            <input
              type="text" required placeholder="Ej. Alex Rivera"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Phone size={14} /> Teléfono
              </label>
              <input
                type="tel" placeholder="Opcional"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Mail size={14} /> Email
              </label>
              <input
                type="email" placeholder="Opcional"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <FileText size={14} /> Notas / Preferencias
            </label>
            <textarea
              placeholder="Ej. Prefiere degradado alto y corte a tijera arriba..." rows={3}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all resize-none"
              value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Guardar Cliente</Button>
        </div>
      </form>
    </Modal>
  );
};