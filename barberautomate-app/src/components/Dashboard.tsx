import React from 'react';
import { TrendingUp, Users, Calendar, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, Badge, Button } from './UI';
import { cn } from '../lib/utils';
import { dashboardApi } from '../lib/api';

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><Icon size={20} /></div>
        <div className={cn("flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

export const Dashboard = ({ reservations, onNewReservation }: { reservations: any[], onNewReservation: () => void }) => {
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    dashboardApi.get().then(setStats).catch(console.error);
  }, [reservations]);

  // Build weekly chart data from API or show empty
  const weeklyRevenue = stats?.weeklyRevenue?.map((d: any) => ({
    name: new Date(d.date).toLocaleDateString('es', { weekday: 'short' }),
    value: d.revenue
  })) || [];

  const weeklyAppointments = stats?.weeklyRevenue?.map((d: any) => ({
    name: new Date(d.date).toLocaleDateString('es', { weekday: 'short' }),
    value: d.appointments
  })) || [];

  // Recent reservations — normalize field names from API
  const recent = (stats?.recentReservations || reservations || []).slice(0, 4).map((r: any) => ({
    id: r.id,
    clientName: r.client_name || r.clientName || '—',
    service: r.service_name || r.service || '—',
    barber: r.barber_name || r.barber || '—',
    time: r.time,
    status: r.status,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Panel de Control</h2>
          <p className="text-slate-500">Resumen de hoy en tu barbería.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Descargar Reporte</Button>
          <Button onClick={onNewReservation}>Nueva Reserva</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Citas Hoy" value={stats?.today?.total_appointments ?? '—'} change="hoy" icon={Calendar} trend="up" />
        <StatCard title="Ingresos Hoy" value={stats ? `€${Number(stats.today?.revenue || 0).toFixed(2)}` : '—'} change="hoy" icon={TrendingUp} trend="up" />
        <StatCard title="Clientes Totales" value={stats?.totalClients ?? '—'} change="total" icon={Users} trend="up" />
        <StatCard title="Confirmadas" value={stats?.today?.confirmed ?? '—'} change="hoy" icon={Clock} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h4 className="font-bold">Ingresos Semanales</h4>
              <p className="text-xs text-slate-500">Últimos 7 días</p>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
            {weeklyRevenue.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">Sin datos todavía</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyRevenue}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="font-bold">Citas por Día</h4>
            <p className="text-xs text-slate-500">Últimos 7 días</p>
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
            {weeklyAppointments.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">Sin datos todavía</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <h4 className="font-bold">Reservas Recientes</h4>
            <Button variant="ghost" size="sm">Ver todas</Button>
          </CardHeader>
          {recent.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400 text-sm">No hay reservas todavía.<br />Crea la primera con "Nueva Reserva".</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider">
                    <th className="px-6 py-3 font-semibold">Cliente</th>
                    <th className="px-6 py-3 font-semibold">Servicio</th>
                    <th className="px-6 py-3 font-semibold">Barbero</th>
                    <th className="px-6 py-3 font-semibold">Hora</th>
                    <th className="px-6 py-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.map((res: any) => (
                    <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                            {res.clientName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium">{res.clientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{res.service}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{res.barber}</td>
                      <td className="px-6 py-4 text-sm font-mono">{res.time}</td>
                      <td className="px-6 py-4">
                        <Badge variant={res.status === 'confirmed' ? 'success' : res.status === 'pending' ? 'warning' : res.status === 'cancelled' ? 'error' : 'neutral'}>
                          {res.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader><h4 className="font-bold">Resumen de Hoy</h4></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Citas totales', value: stats?.today?.total_appointments ?? 0, icon: Calendar },
              { label: 'Confirmadas', value: stats?.today?.confirmed ?? 0, icon: TrendingUp },
              { label: 'Pendientes', value: stats?.today?.pending ?? 0, icon: Clock },
              { label: 'Clientes registrados', value: stats?.totalClients ?? 0, icon: Users },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm"><item.icon size={16} /></div>
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                </div>
                <span className="text-lg font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
