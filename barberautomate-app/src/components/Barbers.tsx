import React from 'react';
import { UserPlus, Star, Clock, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { Card, CardContent, Button } from './UI';
import { barbersApi } from '../lib/api';

export const Barbers = ({ barbershopId }: { barbershopId?: number }) => {
  const [barbers, setBarbers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    barbersApi.list()
      .then(setBarbers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [barbershopId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Equipo de Barberos</h2>
          <p className="text-slate-500">Gestiona el personal, sus horarios y especialidades.</p>
        </div>
        <Button className="gap-2"><UserPlus size={18} /> Añadir Barbero</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /></div>
      ) : barbers.length === 0 ? (
        <div className="text-center py-20 space-y-3 text-slate-500">
          <UserPlus size={40} className="mx-auto text-slate-300" />
          <p className="font-medium">No hay barberos registrados todavía.</p>
          <Button variant="outline">Añadir el primero</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {barbers.map((barber) => (
            <Card key={barber.id} className="overflow-visible">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative shrink-0">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400">
                      {barber.image
                        ? <img
                            src={barber.image}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        : barber.name.charAt(0)
                      }
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-1.5 rounded-lg shadow-lg"><Star size={14} fill="currentColor" /></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900">{barber.name}</h4>
                        <p className="text-sm text-slate-500 font-medium">{barber.specialty || 'Barbero profesional'}</p>
                      </div>
                      <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg"><MoreHorizontal size={20} /></button>
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
    </div>
  );
};