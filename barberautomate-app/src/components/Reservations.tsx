import React from 'react';
import { Search, Filter, MoreHorizontal, Calendar, Clock, User, Scissors } from 'lucide-react';
import { Card, CardHeader, CardContent, Badge, Button } from './UI';
import { Reservation } from '../types';

export const Reservations = ({ reservations, onNewReservation }: { reservations: Reservation[], onNewReservation: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Reservas</h2>
          <p className="text-slate-500">Administra y organiza todas las citas de tu barbería.</p>
        </div>
        <Button onClick={onNewReservation}>Nueva Reserva</Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por cliente o barbero..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter size={14} />
              Filtros
            </Button>
            <Button variant="outline" size="sm">Hoy</Button>
            <Button variant="outline" size="sm">Esta Semana</Button>
          </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Servicio</th>
                <th className="px-6 py-4 font-semibold">Barbero</th>
                <th className="px-6 py-4 font-semibold">Fecha & Hora</th>
                <th className="px-6 py-4 font-semibold">Precio</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {res.clientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{res.clientName}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-tight">ID: #{res.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Scissors size={14} className="text-slate-400" />
                      {res.service}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User size={14} className="text-slate-400" />
                      {res.barber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        {res.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock size={14} className="text-slate-400" />
                        {res.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    €{res.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      res.status === 'confirmed' ? 'success' : 
                      res.status === 'pending' ? 'warning' : 
                      res.status === 'cancelled' ? 'error' : 'neutral'
                    }>
                      {res.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">Mostrando 5 de 128 reservas</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm">Siguiente</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
