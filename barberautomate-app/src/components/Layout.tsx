import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Scissors, 
  UserRound, 
  Zap, 
  BarChart3, 
  Settings,
  Search,
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  X,
  CreditCard
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
      active 
        ? "bg-slate-900 text-white shadow-md" 
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
    )}
  >
    <Icon size={18} />
    <span>{label}</span>
    {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  barbershopName?: string;  // <-- AÑADIDO
  barbershopImage?: string; // <-- AÑADIDO
}

export const Layout = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  onLogout,
  barbershopName,  // <-- RECIBIDO
  barbershopImage  // <-- RECIBIDO
}: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reservations', label: 'Reservas', icon: CalendarDays },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'services', label: 'Servicios', icon: Scissors },
    { id: 'barbers', label: 'Barberos', icon: UserRound },
    { id: 'automations', label: 'Automatizaciones', icon: Zap },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'subscription', label: 'Suscripción', icon: CreditCard },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 px-2 mb-8">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold italic">
              IQ
            </div>
            <h1 className="text-lg font-bold tracking-tight">BarberAutomate</h1>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
              />
            ))}
          </nav>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar reservas, clientes..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-slate-200 rounded-lg text-sm transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-slate-900 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                {/* <-- APLICADO EL NOMBRE DINÁMICO --> */}
                <p className="text-sm font-semibold leading-none">{barbershopName || 'Cargando...'}</p>
                <p className="text-xs text-slate-500 mt-1">Admin Panel</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 overflow-hidden border border-slate-300">
                {/* <-- APLICADA LA IMAGEN DINÁMICA --> */}
                {barbershopImage ? (
                  <img src={barbershopImage} alt="Barbería" referrerPolicy="no-referrer" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                ) : (
                  <span>{barbershopName ? barbershopName.charAt(0).toUpperCase() : '?'}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};