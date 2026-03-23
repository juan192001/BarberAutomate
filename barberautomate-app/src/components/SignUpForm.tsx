import React from 'react';
import { Scissors, ArrowRight, ArrowLeft, CheckCircle2, Building2, User, Mail, Lock, Phone, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent } from './UI';
import { motion } from 'motion/react';

interface SignUpFormProps {
  onSignUp: (data: any) => Promise<void>;
  onBackToLanding: () => void;
  onSwitchToLogin: () => void;
}

export const SignUpForm = ({ onSignUp, onBackToLanding, onSwitchToLogin }: SignUpFormProps) => {
  const [step, setStep] = React.useState(1);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    barbershopName: '', address: '', ownerName: '', email: '', phone: '', password: '', plan: 'Profesional'
  });

  const updateFormData = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) { setStep(2); return; }
    setError('');
    setLoading(true);
    try {
      await onSignUp(formData);
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-200/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-200/50 rounded-full blur-3xl"></div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBackToLanding} className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-900 transition-colors">
            <ArrowLeft size={16} /> Volver
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToLanding}>
            <div className="p-2 bg-slate-900 text-white rounded-lg"><Scissors size={24} /></div>
            <span className="font-bold text-2xl tracking-tight">BarberAutomate</span>
          </div>
          <div className="w-16" />
        </div>
        <Card className="border-none shadow-2xl overflow-hidden">
          <div className="h-2 bg-slate-100 w-full">
            <motion.div className="h-full bg-slate-900" initial={{ width: '50%' }} animate={{ width: step === 1 ? '50%' : '100%' }} />
          </div>
          <CardContent className="p-8 md:p-12">
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold tracking-tight">{step === 1 ? 'Tu Barbería' : 'Tus Datos'}</h2>
              <p className="text-slate-500">{step === 1 ? 'Cuéntanos sobre tu negocio para empezar.' : 'Crea tu cuenta de administrador.'}</p>
            </div>
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><Building2 size={14} /> Nombre de la Barbería</label>
                    <input required type="text" placeholder="Ej: Classic Cuts" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" value={formData.barbershopName} onChange={(e) => updateFormData('barbershopName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Dirección</label>
                    <input required type="text" placeholder="Calle, Ciudad, CP" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" value={formData.address} onChange={(e) => updateFormData('address', e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full h-14 text-lg gap-2">Siguiente Paso <ArrowRight size={20} /></Button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><User size={14} /> Nombre Completo</label>
                      <input required type="text" placeholder="Juan Pérez" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" value={formData.ownerName} onChange={(e) => updateFormData('ownerName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><Phone size={14} /> Teléfono</label>
                      <input required type="tel" placeholder="+34 600 000 000" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" value={formData.phone} onChange={(e) => updateFormData('phone', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><Mail size={14} /> Email Profesional</label>
                    <input required type="email" placeholder="juan@tu-barberia.com" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" value={formData.email} onChange={(e) => updateFormData('email', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><Lock size={14} /> Contraseña</label>
                    <input required type="password" placeholder="••••••••" minLength={6} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" value={formData.password} onChange={(e) => updateFormData('password', e.target.value)} />
                  </div>
                  <div className="pt-4 flex gap-4">
                    <Button type="button" variant="outline" className="h-14 px-6" onClick={() => setStep(1)}>Atrás</Button>
                    <Button type="submit" className="flex-1 h-14 text-lg gap-2" disabled={loading}>
                      {loading ? 'Creando cuenta...' : <> Crear mi Cuenta <CheckCircle2 size={20} /> </>}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>
            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">¿Ya tienes una cuenta?{' '}
                <button onClick={onSwitchToLogin} className="text-slate-900 font-bold hover:underline">Inicia Sesión</button>
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 flex items-center justify-center gap-8 text-slate-400">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><ShieldCheck size={16} /> Pago Seguro</div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><CheckCircle2 size={16} /> Sin Permanencia</div>
        </div>
      </motion.div>
    </div>
  );
};
