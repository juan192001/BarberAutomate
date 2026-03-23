import React from 'react';
import { 
  Scissors, 
  TrendingUp, 
  Users, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Smartphone,
  Star
} from 'lucide-react';
import { Button, Card, CardContent, Badge } from './UI';
import { cn } from '../lib/utils';

interface BarbershopLandingProps {
  onLogin: () => void;
  onSignUp: () => void;
  onBack?: () => void;
}

export const BarbershopLanding = ({ onLogin, onSignUp, onBack }: BarbershopLandingProps) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-100 py-4 px-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              <Scissors size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">BarberAutomate</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900">Funcionalidades</a>
          <a href="#pricing" className="hover:text-slate-900">Precios</a>
          <a href="#testimonials" className="hover:text-slate-900">Testimonios</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onLogin}>Iniciar Sesión</Button>
          <Button onClick={onSignUp}>Registrarse</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <Badge variant="info" className="px-4 py-1">Para Dueños de Barberías</Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Digitaliza tu barbería y <span className="text-slate-400">multiplica tus citas.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
            La plataforma todo-en-uno para gestionar tu agenda, clientes, equipo y marketing. Únete a la red de barberías más grande.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="h-14 px-8 text-lg gap-2" onClick={onSignUp}>
              Registrar mi Barbería <ArrowRight size={20} />
            </Button>
            <div className="flex items-center gap-4 px-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold">+500 barberías</p>
                <p className="text-slate-500">ya confían en nosotros</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-slate-100 rounded-[2rem] -rotate-2"></div>
          <Card className="relative border-none shadow-2xl overflow-hidden rounded-[2rem]">
            <img 
              src="https://images.unsplash.com/photo-1599351431247-f57933842922?w=1200&auto=format&fit=crop&q=80" 
              className="w-full h-[500px] object-cover" 
              alt="Dashboard Preview"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Crecimiento Promedio</p>
                  <p className="text-xl font-bold text-slate-900">+35% reservas/mes</p>
                </div>
              </div>
              <div className="h-12 w-px bg-slate-200"></div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase">Rating Red</p>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={16} fill="currentColor" /> 4.9
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight">Todo lo que necesitas para triunfar</h2>
            <p className="text-slate-500 text-lg">Olvídate del papel y boli. Pasa al siguiente nivel con herramientas profesionales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Calendar />, title: 'Agenda Inteligente', desc: 'Sincronización total y recordatorios automáticos por WhatsApp.' },
              { icon: <Users />, title: 'CRM de Clientes', desc: 'Historial de cortes, preferencias y fidelización automática.' },
              { icon: <BarChart3 />, title: 'Reportes en Vivo', desc: 'Controla tus ingresos, comisiones y stock en tiempo real.' },
              { icon: <Smartphone />, title: 'App para Barberos', desc: 'Cada barbero gestiona su propia agenda desde su móvil.' }
            ].map((f, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                    {f.icon}
                  </div>
                  <h4 className="text-xl font-bold">{f.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-4xl font-bold tracking-tight">¿Por qué unirte a la red BarberAutomate?</h2>
            <div className="space-y-6">
              {[
                { title: 'Visibilidad Inmediata', desc: 'Aparece en nuestro buscador y atrae nuevos clientes de tu zona.' },
                { title: 'Pagos Seguros', desc: 'Acepta pagos online y reduce las ausencias (no-shows) con depósitos.' },
                { title: 'Automatización', desc: 'Envía recordatorios, encuestas de satisfacción y promos sin mover un dedo.' }
              ].map((b, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 text-emerald-500">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg">{b.title}</h5>
                    <p className="text-slate-500">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="h-12 px-6" onClick={onLogin}>Quiero saber más</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=60" className="rounded-2xl h-64 w-full object-cover" alt="barber 1" referrerPolicy="no-referrer" />
              <img src="https://images.unsplash.com/photo-1621605815841-2dddb7a69e3d?w=600&auto=format&fit=crop&q=60" className="rounded-2xl h-48 w-full object-cover" alt="barber 2" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=60" className="rounded-2xl h-48 w-full object-cover" alt="barber 3" referrerPolicy="no-referrer" />
              <img src="https://images.unsplash.com/photo-1599351431247-f57933842922?w=600&auto=format&fit=crop&q=60" className="rounded-2xl h-64 w-full object-cover" alt="barber 4" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight">Planes de Suscripción</h2>
            <p className="text-slate-500 text-lg">Elige el plan que mejor se adapte al tamaño de tu negocio.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Básico', 
                price: '29', 
                features: ['Hasta 2 barberos', 'Agenda digital', 'Recordatorios SMS', 'Soporte por email'],
                recommended: false
              },
              { 
                name: 'Profesional', 
                price: '59', 
                features: ['Hasta 5 barberos', 'CRM avanzado', 'Marketing automatizado', 'Reportes detallados', 'Soporte prioritario'],
                recommended: true
              },
              { 
                name: 'Premium', 
                price: '99', 
                features: ['Barberos ilimitados', 'Múltiples sedes', 'API personalizada', 'Gestor de cuenta dedicado', 'Todo lo del plan Pro'],
                recommended: false
              }
            ].map((plan, i) => (
              <Card key={i} className={cn(
                "relative border-2 transition-all duration-300 hover:shadow-xl",
                plan.recommended ? "border-slate-900 scale-105 z-10" : "border-slate-100"
              )}>
                {plan.recommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-bold">
                    RECOMENDADO
                  </div>
                )}
                <CardContent className="p-8 space-y-8">
                  <div className="text-center space-y-2">
                    <h4 className="text-xl font-bold uppercase tracking-widest text-slate-400">{plan.name}</h4>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">€{plan.price}</span>
                      <span className="text-slate-500">/mes</span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={cn("w-full h-12", plan.recommended ? "" : "variant-outline")} 
                    variant={plan.recommended ? "primary" : "outline"}
                    onClick={onSignUp}
                  >
                    Seleccionar Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">¿Listo para transformar tu negocio?</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">Únete hoy a la red de barberías más avanzada.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-10 text-lg" onClick={onSignUp}>
                Registrar mi Barbería
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-10 text-lg">
                Ver Planes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-900 text-white rounded-lg">
                <Scissors size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">BarberAutomate</span>
            </div>
            <p className="text-slate-500 text-sm">Empoderando a las mejores barberías del mundo con tecnología de vanguardia.</p>
          </div>
          <div>
            <h6 className="font-bold mb-6">Producto</h6>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-slate-900">Agenda</a></li>
              <li><a href="#" className="hover:text-slate-900">CRM</a></li>
              <li><a href="#" className="hover:text-slate-900">Marketing</a></li>
              <li><a href="#" className="hover:text-slate-900">Pagos</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-6">Empresa</h6>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-slate-900">Sobre nosotros</a></li>
              <li><a href="#" className="hover:text-slate-900">Carreras</a></li>
              <li><a href="#" className="hover:text-slate-900">Blog</a></li>
              <li><a href="#" className="hover:text-slate-900">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-6">Legal</h6>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-slate-900">Privacidad</a></li>
              <li><a href="#" className="hover:text-slate-900">Términos</a></li>
              <li><a href="#" className="hover:text-slate-900">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          © 2026 BarberAutomate. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};
