import React from 'react';
import { BarChart3, TrendingUp, Users, Scissors, Calendar, Download, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, Button } from './UI';
import { reportsApi } from '../lib/api';
import { cn } from '../lib/utils';

const COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1'];

export const Reports = () => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    reportsApi.get()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Procesar los datos para los gráficos
  const revenueData = (data?.revenueChart || []).map((d: any) => ({
    name: new Date(d.name).toLocaleDateString('es', { weekday: 'short' }),
    value: d.value
  }));

  const pieData = data?.servicesPie || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Análisis & Reportes</h2>
          <p className="text-slate-500">Visualiza el rendimiento y crecimiento de tu negocio.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Periodo
          </Button>
          <Button className="gap-2">
            <Download size={16} />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h4 className="font-bold">Crecimiento de Ingresos</h4>
            <p className="text-xs text-slate-500">Ingresos de los últimos 7 días</p>
          </CardHeader>
          <CardContent className="h-[350px] mt-4">
            {revenueData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">Sin datos para graficar</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={3} dot={{r: 4, fill: '#0f172a', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6, strokeWidth: 0}} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="font-bold">Distribución de Servicios</h4>
            <p className="text-xs text-slate-500">Servicios más demandados históricamente</p>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col items-center justify-center">
            {pieData.length === 0 ? (
              <div className="text-slate-400 text-sm">Sin datos para graficar</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 w-full px-4">
                  {pieData.slice(0, 4).map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor: COLORS[i]}}></div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ticket Medio', value: `€${(data?.stats?.averageTicket || 0).toFixed(2)}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Clientes', value: data?.stats?.totalClients || '0', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Citas', value: data?.stats?.totalAppointments || '0', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Productividad', value: data?.stats?.totalAppointments > 0 ? 'Activo' : 'Sin datos', icon: Scissors, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h4 className="text-xl font-bold text-slate-900">{stat.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};