import React from 'react';
import { 
  Building2, 
  Clock, 
  Bell, 
  Palette, 
  ShieldCheck, 
  CreditCard,
  Save,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button } from './UI';

export const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración del Sistema</h2>
        <p className="text-slate-500">Personaliza tu espacio de trabajo y preferencias de negocio.</p>
      </div>

      <div className="space-y-6">
        {/* General Info */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Building2 size={20} className="text-slate-400" />
            <h4 className="font-bold">Información de la Barbería</h4>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
                    <img src="https://picsum.photos/seed/logo/200" alt="Logo" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera size={20} className="text-white" />
                    </div>
                  </div>
                  <p className="text-[10px] text-center mt-2 font-bold text-slate-400 uppercase">Logo</p>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nombre Comercial</label>
                  <input type="text" defaultValue="The Barber Club" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Teléfono de Contacto</label>
                  <input type="text" defaultValue="+34 600 000 000" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Dirección Física</label>
                  <input type="text" defaultValue="Calle de la Elegancia, 12, Madrid" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Clock size={20} className="text-slate-400" />
            <h4 className="font-bold">Horarios de Atención</h4>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                <div key={day} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm font-medium w-24">{day}</span>
                  <div className="flex items-center gap-4">
                    {day === 'Domingo' ? (
                      <span className="text-xs font-bold text-red-500 uppercase">Cerrado</span>
                    ) : (
                      <>
                        <input type="time" defaultValue="09:00" className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs" />
                        <span className="text-slate-300">-</span>
                        <input type="time" defaultValue="20:00" className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs" />
                      </>
                    )}
                  </div>
                  <div className="w-12 flex justify-end">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={day !== 'Domingo'} className="sr-only peer" />
                      <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-slate-900"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancelar Cambios</Button>
          <Button className="gap-2">
            <Save size={18} />
            Guardar Configuración
          </Button>
        </div>
      </div>
    </div>
  );
};
