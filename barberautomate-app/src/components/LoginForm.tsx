import React from 'react';
import { Scissors, ArrowRight, ArrowLeft, Mail, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button, Card, CardContent } from './UI';
import { motion } from 'motion/react';

interface LoginFormProps {
  onLogin: (data: { email: string; password: string }) => Promise<void>;
  onBackToLanding: () => void;
  onSwitchToSignUp: () => void;
}

export const LoginForm = ({ onLogin, onBackToLanding, onSwitchToSignUp }: LoginFormProps) => {
  const [formData, setFormData] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(formData);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
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
          <CardContent className="p-8 md:p-12">
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Bienvenido</h2>
              <p className="text-slate-500">Inicia sesión para gestionar tu barbería.</p>
            </div>
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><Mail size={14} /> Email</label>
                <input required type="email" placeholder="tu@email.com" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><Lock size={14} /> Contraseña</label>
                <input required type="password" placeholder="••••••••" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" value={formData.password} onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))} />
              </div>
              <Button type="submit" className="w-full h-14 text-lg gap-2" disabled={loading}>
                {loading ? 'Entrando...' : <> Entrar <ArrowRight size={20} /> </>}
              </Button>
            </form>
            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">¿No tienes una cuenta?{' '}
                <button onClick={onSwitchToSignUp} className="text-slate-900 font-bold hover:underline">Regístrate gratis</button>
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 flex items-center justify-center gap-8 text-slate-400">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><ShieldCheck size={16} /> Acceso Seguro</div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><CheckCircle2 size={16} /> Soporte 24/7</div>
        </div>
      </motion.div>
    </div>
  );
};
