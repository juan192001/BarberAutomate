import React from 'react';
import { Save, Store, MapPin, Phone, Mail, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, Button } from './UI';
import { settingsApi } from '../lib/api';

interface SettingsProps {
  onSettingsUpdated?: () => void;
}

export const Settings = ({ onSettingsUpdated }: SettingsProps) => {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    image: ''
  });

  React.useEffect(() => {
    settingsApi.get()
      .then(data => {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          description: data.description || '',
          image: data.image || ''
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await settingsApi.update({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        description: formData.description,
        image: formData.image
      });
      setMessage({ type: 'success', text: '¡Configuración guardada correctamente!' });
      
      // Avisar a la App principal que recargue el nombre y la foto
      if (onSettingsUpdated) {
        onSettingsUpdated();
      }
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al guardar' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración del Negocio</h2>
        <p className="text-slate-500">Actualiza la información pública de tu barbería.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h4 className="font-bold">Perfil Público</h4>
            <p className="text-xs text-slate-500">Así es como los clientes verán tu barbería en el buscador.</p>
          </CardHeader>
          <CardContent className="space-y-6 mt-4">
            
            {message.text && (
              <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Store size={14} /> Nombre de la Barbería
                </label>
                <input type="text" name="name" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900" value={formData.name} onChange={handleChange} />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Mail size={14} /> Email (Solo lectura)
                </label>
                <input type="email" name="email" disabled className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" value={formData.email} onChange={handleChange} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Phone size={14} /> Teléfono Público
                </label>
                <input type="tel" name="phone" placeholder="Ej. +34 600 000 000" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <MapPin size={14} /> Dirección Completa
                </label>
                <input type="text" name="address" placeholder="Ej. Calle Principal 123, Madrid" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900" value={formData.address} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <ImageIcon size={14} /> URL de la Imagen de Portada
              </label>
              <input type="url" name="image" placeholder="https://ejemplo.com/mifoto.jpg" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900" value={formData.image} onChange={handleChange} />
              {formData.image && (
                <div className="mt-4 h-40 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-sm">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Descripción de la Barbería</label>
              <textarea name="description" rows={4} placeholder="Cuenta un poco sobre tu barbería para atraer clientes..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900 resize-none" value={formData.description} onChange={handleChange} />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" className="gap-2" disabled={saving}>
                <Save size={16} />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};