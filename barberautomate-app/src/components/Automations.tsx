import React from 'react';
import { Zap, Bell, MessageSquare, Mail, Gift, ChevronRight, Settings2 } from 'lucide-react';
import { Card, CardContent, Badge, Button } from './UI';
import { automationsApi } from '../lib/api';
import { cn } from '../lib/utils';

export const Automations = ({ barbershopId }: { barbershopId?: number }) => {
  const [automations, setAutomations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    automationsApi.list()
      .then(setAutomations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [barbershopId]);

  const handleToggle = async (auto: any) => {
    try {
      const updated = await automationsApi.toggle(auto.id, !auto.enabled);
      setAutomations(prev => prev.map(a => a.id === auto.id ? { ...a, enabled: updated.enabled } : a));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Automatizaciones Inteligentes</h2>
          <p className="text-slate-500">Optimiza tu tiempo con flujos de trabajo automáticos.</p>
        </div>
        <Button className="gap-2"><Zap size={18} /> Crear Automatización</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {automations.map((auto) => (
            <Card key={auto.id} className={cn("group transition-all", !auto.enabled && "opacity-75 grayscale-[0.5]")}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("p-3 rounded-2xl shadow-lg",
                    auto.type === 'reminder' ? "bg-blue-500 text-white" :
                    auto.type === 'confirmation' ? "bg-emerald-500 text-white" :
                    auto.type === 'follow-up' ? "bg-amber-500 text-white" :
                    "bg-purple-500 text-white"
                  )}>
                    {auto.type === 'reminder' && <Bell size={24} />}
                    {auto.type === 'confirmation' && <Mail size={24} />}
                    {auto.type === 'follow-up' && <MessageSquare size={24} />}
                    {auto.type === 'promo' && <Gift size={24} />}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={auto.enabled ? 'success' : 'neutral'}>{auto.enabled ? 'Activa' : 'Pausada'}</Badge>
                    <label className="relative inline-flex items-center cursor-pointer" onClick={() => handleToggle(auto)}>
                      <input type="checkbox" checked={!!auto.enabled} className="sr-only peer" readOnly />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-900">{auto.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{auto.description}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {auto.enabled ? 'En ejecución' : 'Desactivada'}
                  </span>
                  <Button variant="ghost" size="sm" className="gap-1">Configurar <ChevronRight size={14} /></Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="border-dashed border-2 flex items-center justify-center bg-slate-50/50">
            <CardContent className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-slate-300"><Settings2 size={32} /></div>
              <div>
                <h5 className="font-bold text-slate-900">¿Necesitas algo más?</h5>
                <p className="text-sm text-slate-500 mt-1">Podemos crear flujos personalizados para tu negocio.</p>
              </div>
              <Button variant="outline" size="sm">Explorar Marketplace</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
