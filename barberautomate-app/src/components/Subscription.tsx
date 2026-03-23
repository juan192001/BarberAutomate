import React from 'react';
import { CreditCard, CheckCircle2, Zap, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, Button, Badge } from './UI';
import { cn } from '../lib/utils';

export const Subscription = () => {
  const currentPlan = 'Profesional';
  
  const plans = [
    { 
      name: 'Básico', 
      price: '29', 
      features: ['Hasta 2 barberos', 'Agenda digital', 'Recordatorios SMS', 'Soporte por email'],
      current: false
    },
    { 
      name: 'Profesional', 
      price: '59', 
      features: ['Hasta 5 barberos', 'CRM avanzado', 'Marketing automatizado', 'Reportes detallados', 'Soporte prioritario'],
      current: true
    },
    { 
      name: 'Premium', 
      price: '99', 
      features: ['Barberos ilimitados', 'Múltiples sedes', 'API personalizada', 'Gestor de cuenta dedicado', 'Todo lo del plan Pro'],
      current: false
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suscripción</h2>
          <p className="text-slate-500 mt-1">Gestiona tu plan y métodos de pago.</p>
        </div>
        <Badge variant="success" className="w-fit px-4 py-1 text-sm">
          Plan Activo: {currentPlan}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Summary */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <CardContent className="p-8 relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                <Zap size={28} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Plan {currentPlan}</h3>
                <p className="text-slate-400 text-sm">Tu suscripción se renovará el 15 de Abril, 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Precio Mensual</p>
                <p className="text-2xl font-bold">€59.00</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Método de Pago</p>
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-slate-400" />
                  <p className="font-bold">•••• 4242</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</p>
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck size={18} />
                  <p className="font-bold">Al día</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button className="bg-white text-slate-900 hover:bg-slate-100">Cambiar Plan</Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Actualizar Pago</Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card className="border-none shadow-xl bg-white">
          <CardContent className="p-8 space-y-6">
            <h4 className="font-bold text-lg flex items-center gap-2">
              <Clock size={20} className="text-slate-400" /> Uso del Mes
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Barberos</span>
                  <span className="font-bold">3 / 5</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 w-[60%]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">SMS Enviados</span>
                  <span className="font-bold">450 / 1000</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 w-[45%]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Almacenamiento</span>
                  <span className="font-bold">1.2 GB / 5 GB</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 w-[24%]"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center pt-4">
              Tu plan se reinicia en 25 días.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold">Planes Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <Card key={i} className={cn(
              "border-2 transition-all duration-300",
              plan.current ? "border-slate-900 bg-slate-50" : "border-slate-100 bg-white"
            )}>
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-lg">{plan.name}</h5>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">€{plan.price}</span>
                      <span className="text-slate-500 text-sm">/mes</span>
                    </div>
                  </div>
                  {plan.current && (
                    <Badge variant="info">Actual</Badge>
                  )}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {!plan.current && (
                  <Button className="w-full gap-2" variant="outline">
                    Mejorar Plan <ArrowRight size={16} />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
