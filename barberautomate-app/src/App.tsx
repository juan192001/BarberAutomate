import React from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Reservations } from './components/Reservations';
import { Clients } from './components/Clients';
import { Services } from './components/Services';
import { Barbers } from './components/Barbers';
import { Automations } from './components/Automations';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Subscription } from './components/Subscription';
import { ReservationForm } from './components/ReservationForm';
import { ServiceForm } from './components/ServiceForm';
import { CustomerBooking } from './components/CustomerBooking';
import { BarbershopSearch } from './components/BarbershopSearch';
import { BarbershopLanding } from './components/BarbershopLanding';
import { SignUpForm } from './components/SignUpForm';
import { LoginForm } from './components/LoginForm';
import { motion, AnimatePresence } from 'motion/react';
import { authApi, reservationsApi, servicesApi, settingsApi } from './lib/api';
import { Reservation, Service, Barbershop } from './types';

export default function App() {
  const [viewMode, setViewMode] = React.useState<'admin' | 'customer'>('customer');
  const [authView, setAuthView] = React.useState<'landing' | 'login' | 'signup'>('landing');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState(false);
  
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [currentBarbershop, setCurrentBarbershop] = React.useState<any>(null);
  const [selectedBarbershop, setSelectedBarbershop] = React.useState<Barbershop | null>(null);
  const [profileData, setProfileData] = React.useState<any>(null);

  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [reservations, setReservations] = React.useState<Reservation[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Función para cargar los datos públicos de la barbería (Settings)
  const loadProfileData = React.useCallback(async () => {
    if (authApi.isLoggedIn()) {
      try {
        const data = await settingsApi.get();
        setProfileData(data);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    }
  }, []);

  // Al montar la app: restaurar sesión si hay token
  React.useEffect(() => {
    if (authApi.isLoggedIn()) {
      authApi.me()
        .then(({ user, barbershop }) => {
          setCurrentUser(user);
          setCurrentBarbershop(barbershop);
          setIsAdminLoggedIn(true);
          setViewMode('admin');
          loadProfileData(); // Cargar la info del Layout
        })
        .catch(() => authApi.logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [loadProfileData]);

  // Cargar reservas y servicios cuando el admin entra
  React.useEffect(() => {
    if (!isAdminLoggedIn) return;
    
    reservationsApi.list()
      .then(data => setReservations(data.map((r: any) => ({ 
        id: String(r.id), 
        clientName: r.client_name, 
        service: r.service_name, 
        barber: r.barber_name, 
        date: r.date, 
        time: r.time, 
        status: r.status, 
        price: r.price 
      }))))
      .catch(console.error);
      
    servicesApi.list()
      .then(data => setServices(data.map((s: any) => ({ ...s, id: String(s.id) }))))
      .catch(console.error);
  }, [isAdminLoggedIn]);

  const handleLogin = async (formData: { email: string; password: string }) => {
    const { user, barbershop } = await authApi.login(formData.email, formData.password);
    setCurrentUser(user);
    setCurrentBarbershop(barbershop);
    setIsAdminLoggedIn(true);
    setViewMode('admin');
    loadProfileData();
  };

  const handleSignUp = async (formData: any) => {
    const { user, barbershop } = await authApi.register(formData);
    setCurrentUser(user);
    setCurrentBarbershop(barbershop);
    setIsAdminLoggedIn(true);
    setViewMode('admin');
    loadProfileData();
  };

  const handleLogout = () => {
    authApi.logout();
    setIsAdminLoggedIn(false);
    setCurrentUser(null);
    setCurrentBarbershop(null);
    setProfileData(null);
    setReservations([]);
    setServices([]);
    setAuthView('landing');
    setViewMode('customer');
  };

  const handleAddReservation = async (newRes: any) => {
    try {
      const created = await reservationsApi.create({
        clientName: newRes.clientName,
        clientEmail: newRes.clientEmail,   
        clientPhone: newRes.clientPhone,   
        serviceName: newRes.service,
        barberName: newRes.barber,
        date: newRes.date,
        time: newRes.time,
        price: newRes.price,
      });
      
      const formattedRes = {
        id: String(created.id),
        clientName: created.client_name,
        service: created.service_name,
        barber: created.barber_name,
        date: created.date,
        time: created.time,
        status: created.status,
        price: created.price
      };

      setReservations(prev => [formattedRes, ...prev]);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddService = async (newService: Omit<Service, 'id'>) => {
    try {
      if (editingService) {
        const updated = await servicesApi.update(editingService.id, newService);
        setServices(prev => prev.map(s => s.id === editingService.id ? { ...updated, id: String(updated.id) } : s));
      } else {
        const created = await servicesApi.create(newService);
        setServices(prev => [...prev, { ...created, id: String(created.id) }]);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await servicesApi.delete(id);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Cargando BarberAutomate...</p>
        </div>
      </div>
    );
  }

  // ── Customer Flow ──
  if (viewMode === 'customer') {
    if (!selectedBarbershop) {
      return <BarbershopSearch onSelectBarbershop={setSelectedBarbershop} onAdminClick={() => setViewMode('admin')} />;
    }
    return (
      <CustomerBooking
        barbershop={selectedBarbershop}
        onBackToSearch={() => setSelectedBarbershop(null)}
        onBackToAdmin={() => setViewMode('admin')}
      />
    );
  }

  // ── Admin Flow ──
  if (!isAdminLoggedIn) {
    if (authView === 'login') return <LoginForm onLogin={handleLogin} onBackToLanding={() => setAuthView('landing')} onSwitchToSignUp={() => setAuthView('signup')} />;
    if (authView === 'signup') return <SignUpForm onSignUp={handleSignUp} onBackToLanding={() => setAuthView('landing')} onSwitchToLogin={() => setAuthView('login')} />;
    return <BarbershopLanding onLogin={() => setAuthView('login')} onSignUp={() => setAuthView('signup')} onBack={() => setViewMode('customer')} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard reservations={reservations} onNewReservation={() => setIsModalOpen(true)} />;
      case 'reservations': 
        return (
          <Reservations
            reservations={reservations}
            onNewReservation={() => setIsModalOpen(true)}
            onStatusChange={async (id, status) => {
              const updated = await reservationsApi.updateStatus(id, status);
              setReservations(prev => prev.map(r => r.id === String(id) ? { ...r, status: updated.status } : r));
            }}
          />
        );
      case 'clients': 
        return <Clients barbershopId={currentBarbershop?.id} />;
      case 'services': 
        return (
          <Services
            services={services}
            onAddService={() => { setEditingService(null); setIsServiceModalOpen(true); }}
            onEditService={(s) => { setEditingService(s); setIsServiceModalOpen(true); }}
            onDeleteService={handleDeleteService}
          />
        );
      case 'barbers': 
        return <Barbers barbershopId={currentBarbershop?.id} />;
      case 'automations': 
        return <Automations barbershopId={currentBarbershop?.id} />;
      case 'reports': 
        return <Reports />;
      case 'subscription': 
        return <Subscription />;
      case 'settings': 
        return <Settings onSettingsUpdated={loadProfileData} />; // <-- Aquí pasamos la función para refrescar
      default: 
        return <Dashboard reservations={reservations} onNewReservation={() => setIsModalOpen(true)} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
      barbershopName={profileData?.name}   // <-- Se pasa al layout
      barbershopImage={profileData?.image} // <-- Se pasa al layout
    >
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Admin: {profileData?.name || 'Cargando...'}
          </span>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }}>
          {renderContent()}
        </motion.div>
      </AnimatePresence>
      
      <ReservationForm services={services} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddReservation} />
      <ServiceForm isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} onSubmit={handleAddService} initialData={editingService} />
    </Layout>
  );
}