import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Scissors, 
  Calendar, 
  Download, 
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardHeader, Button } from './UI';
import { REVENUE_DATA } from '../types';
import { cn } from '../lib/utils';

const PIE_DATA = [
  { name: 'Corte Premium', value: 45 },
  { name: 'Corte Clásico', value: 25 },
  { name: 'Barba', value: 20 },
  { name: 'Otros', value: 10 },
];

const COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8'];

export const Reports = () => {
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
            <p className="text-xs text-slate-500">Ingresos mensuales comparados con el año anterior</p>
          </CardHeader>
          <CardContent className="h-[350px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8'}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8'}}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0f172a" 
                  strokeWidth={3} 
                  dot={{r: 4, fill: '#0f172a', strokeWidth: 2, stroke: '#fff'}}
                  activeDot={{r: 6, strokeWidth: 0}}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="font-bold">Distribución de Servicios</h4>
            <p className="text-xs text-slate-500">Servicios más demandados este mes</p>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
              {PIE_DATA.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ticket Medio', value: '€28.50', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Retención', value: '74%', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Nuevos Clientes', value: '42', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Productividad', value: '92%', icon: Scissors, color: 'text-amber-600', bg: 'bg-amber-50' },
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
