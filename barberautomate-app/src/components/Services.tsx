import React from 'react';
import { Plus, Scissors, Clock, Euro, MoreVertical, ToggleLeft, ToggleRight, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, Badge, Button } from './UI';
import { Service } from '../types';

export const Services = ({ 
  services, 
  onAddService, 
  onEditService, 
  onDeleteService 
}: { 
  services: Service[], 
  onAddService: () => void,
  onEditService: (s: Service) => void,
  onDeleteService: (id: string) => void
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Servicios & Precios</h2>
          <p className="text-slate-500">Configura el menú de servicios que ofreces a tus clientes.</p>
        </div>
        <Button className="gap-2" onClick={onAddService}>
          <Plus size={18} />
          Nuevo Servicio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="group hover:border-slate-300 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-200">
                  <Scissors size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={service.status === 'active' ? 'success' : 'neutral'}>
                    {service.status}
                  </Badge>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEditService(service)} className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDeleteService(service.id)} className="p-1.5 text-red-400 hover:text-red-600 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900">{service.name}</h4>
                <p className="text-sm text-slate-500">Servicio profesional de alta calidad.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={16} className="text-slate-400" />
                  <span className="text-sm font-medium">{service.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-900">
                  <Euro size={16} className="text-slate-400" />
                  <span className="text-sm font-bold">{service.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="flex-1" size="sm" onClick={() => onEditService(service)}>Editar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add New Placeholder */}
        <button 
          onClick={onAddService}
          className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all group"
        >
          <div className="p-3 bg-slate-50 rounded-full group-hover:bg-white transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-sm font-bold">Añadir nuevo servicio</span>
        </button>
      </div>
    </div>
  );
};
