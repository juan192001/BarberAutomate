import React from 'react';
import { UserPlus, Star, Clock, Mail, Phone, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, Button } from './UI';
import { barbersApi } from '../lib/api';
import { BarberForm } from './BarberForm';

export const Barbers = ({ barbershopId }: { barbershopId?: number }) => {
  const [barbers, setBarbers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingBarber, setEditingBarber] = React.useState<any>(null);

  // Cargar barberos de la base de datos
  const loadBarbers = () => {
    setLoading(true);
    barbersApi.list()
      .then(setBarbers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    if (barbershopId) loadBarbers();
  }, [barbershopId]);

  // Manejar creación y edición
  const handleSubmit = async (formData: any) => {
    try {
      if (editingBarber) {
        await barbersApi.update(editingBarber.id, formData);
      } else {
        await barbersApi.create(formData);
      }
      loadBarbers(); // Recargar la lista
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Manejar borrado
  const handleDelete = async (id: number) => {
    if (confirm('¿Seguro que deseas eliminar este barbero?')) {
      try {
        await barbersApi.delete(id);
        loadBarbers();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Equipo de Barberos</h2>
          <p className="text-slate-500">Gestiona el personal, sus horarios y especialidades.</p>
        </div>
        <Button className="gap-2" onClick={() => { setEditingBarber(null); setIsFormOpen(true); }}>
          <UserPlus size={18} /> Añadir Barbero
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /></div>
      ) : barbers.length === 0 ? (
        <div className="text-center py-20 space-y-3 text-slate-500">
          <UserPlus size={40} className="mx-auto text-slate-300" />
          <p className="font-medium">No hay barberos registrados todavía.</p>
          <Button variant="outline" onClick={() => { setEditingBarber(null); setIsFormOpen(true); }}>Añadir el primero</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {barbers.map((barber) => (
            <Card key={barber.id} className="overflow-visible group relative">
              <CardContent className="p-6">
                
                {/* Botones de Editar y Borrar (aparecen al pasar el mouse) */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button onClick={() => { setEditingBarber(barber); setIsFormOpen(true); }} className="p-1.5 bg-white text-slate-400 hover:text-slate-900 rounded-lg shadow-sm border border-slate-100"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(barber.id)} className="p-1.5 bg-white text-red-400 hover:text-red-600 rounded-lg shadow-sm border border-slate-100"><Trash2 size={16} /></button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative shrink-0">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400">
                      {barber.image 
                        ? <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => (e.currentTarget.style.display = 'none')} /> 
                        : barber.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-1.5 rounded-lg shadow-lg"><Star size={14} fill="currentColor" /></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 pr-16">{barber.name}</h4>
                      <p className="text-sm text-slate-500 font-medium">{barber.specialty || 'Barbero profesional'}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600"><Clock size={14} className="text-slate-400" /><span>{barber.availability}</span></div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-2"><Mail size={14} /> Mensaje</Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-2"><Phone size={14} /> Llamar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Renderizamos el formulario */}
      <BarberForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleSubmit} 
        initialData={editingBarber} 
      />
    </div>
  );
};