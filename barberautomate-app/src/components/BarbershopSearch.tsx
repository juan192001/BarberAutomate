import React from 'react';
import { Search, MapPin, Star, Scissors, Filter, ChevronRight } from 'lucide-react';
import { Card, CardContent, Button, Badge } from './UI';
import { publicApi } from '../lib/api';
import { Barbershop } from '../types';

interface BarbershopSearchProps {
  onSelectBarbershop: (shop: Barbershop) => void;
  onAdminClick: () => void;
}

export const BarbershopSearch = ({ onSelectBarbershop, onAdminClick }: BarbershopSearchProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [shops, setShops] = React.useState<Barbershop[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    publicApi.searchBarbershops()
      .then(data => setShops(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const data = await publicApi.searchBarbershops(query);
      setShops(data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <section className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">

          {/* Botón acceso barberías — visible y claro */}
          <div className="flex justify-end mb-8">
            <button
              onClick={onAdminClick}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 transition-colors border border-white/30 px-5 py-2.5 rounded-full"
            >
              Soy dueño de barbería
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Encuentra tu Barbero Ideal</h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">Reserva en las mejores barberías de tu zona con un solo clic.</p>
          </div>

          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center text-slate-400"><Search size={24} /></div>
            <input
              type="text"
              placeholder="Busca por nombre, calle o ciudad..."
              className="w-full pl-14 pr-6 py-5 bg-white text-slate-900 rounded-2xl shadow-2xl outline-none text-lg"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-16 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Barberías Disponibles</h2>
            <p className="text-slate-500 mt-1">{loading ? 'Cargando...' : `Mostrando ${shops.length} resultados`}</p>
          </div>
          <Button variant="outline" className="gap-2"><Filter size={18} /> Filtrar</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {shops.map((shop: any) => (
              <Card
                key={shop.id}
                className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
                onClick={() => onSelectBarbershop({ ...shop, id: String(shop.id) })}
              >
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-2/5 relative overflow-hidden bg-slate-200" style={{minHeight: 200}}>
                    {shop.image && <img src={shop.image} alt={shop.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />}
                    <div className="absolute top-4 left-4">
                      <Badge variant="success" className="bg-white/90 backdrop-blur-md text-slate-900 border-none shadow-lg">Abierto</Badge>
                    </div>
                  </div>
                  <CardContent className="md:w-3/5 p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-slate-900">{shop.name}</h3>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star size={18} fill="currentColor" /><span>{shop.rating}</span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-2">{shop.description}</p>
                      <div className="flex items-center gap-2 text-slate-400 text-sm"><MapPin size={16} /><span>{shop.address}</span></div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{shop.plan}</div>
                      <Button className="gap-2 group-hover:bg-slate-800 transition-colors">Reservar Ahora <Scissors size={16} /></Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
            {!loading && shops.length === 0 && (
              <div className="col-span-2 text-center py-20 space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400"><Search size={40} /></div>
                <h3 className="text-xl font-bold">No encontramos barberías</h3>
                <p className="text-slate-500">Regístrate para ser la primera barbería en la plataforma.</p>
                <Button variant="ghost" onClick={() => handleSearch('')}>Ver todas</Button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-lg"><Scissors size={20} /></div>
            <span className="font-bold text-xl">BarberAutomate</span>
          </div>
          <div className="text-slate-400 text-xs">© 2026 BarberAutomate Network. Todos los derechos reservados.</div>
        </div>
      </footer>
    </div>
  );
};
