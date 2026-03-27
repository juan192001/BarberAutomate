import React from 'react';
import { Search, UserPlus, Mail, Phone, Calendar, MoreVertical, ExternalLink } from 'lucide-react';
import { Card, CardContent, Badge, Button } from './UI';
import { clientsApi } from '../lib/api';
import { cn } from '../lib/utils';
import { ClientForm } from './ClientForm'; // <-- Importamos nuestro nuevo formulario

export const Clients = ({ barbershopId }: { barbershopId?: number }) => {
  const [clients, setClients] = React.useState<any[]>([]);
  const [selectedClient, setSelectedClient] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false); // Estado para abrir/cerrar el modal

  const loadClients = () => {
    setLoading(true);
    clientsApi.list()
      .then(setClients)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    loadClients();
  }, [barbershopId]);

  // Función para guardar el cliente
  const handleAddClient = async (formData: any) => {
    try {
      await clientsApi.create(formData);
      setIsFormOpen(false);
      loadClients(); // Recargamos la lista para ver al nuevo cliente de inmediato
    } catch (err: any) {
      alert(err.message || "Error al crear el cliente");
    }
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  );

  const getStatus = (c: any) => {
    if (!c.last_visit) return 'new';
    const days = Math.floor((Date.now() - new Date(c.last_visit).getTime()) / 86400000);
    return days > 30 ? 'inactive' : 'active';
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Directorio de Clientes</h2>
          <p className="text-slate-500">Gestiona la base de datos de tus clientes y su historial.</p>
        </div>
        {/* Aquí le damos vida al botón */}
        <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
          <UserPlus size={18} /> Nuevo Cliente
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className={cn("flex-1 space-y-4", selectedClient ? "lg:w-2/3" : "w-full")}>
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Buscar por nombre, email o teléfono..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="font-medium">{search ? 'No se encontraron clientes.' : 'Aún no hay clientes registrados.'}</p>
              <p className="text-sm mt-1">Los clientes aparecen aquí cuando hacen una reserva online, o puedes añadirlos manualmente.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((client) => {
                const status = getStatus(client);
                return (
                  <Card key={client.id} className={cn("cursor-pointer transition-all hover:border-slate-400", selectedClient?.id === client.id ? "border-slate-900 ring-1 ring-slate-900" : "")} onClick={() => setSelectedClient(client)}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">{client.name.charAt(0)}</div>
                          <div>
                            <h4 className="font-bold text-slate-900">{client.name}</h4>
                            <Badge variant={status === 'active' ? 'success' : status === 'new' ? 'info' : 'neutral'}>{status}</Badge>
                          </div>
                        </div>
                        <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg"><MoreVertical size={18} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Última Visita</p>
                          <p className="text-xs font-medium text-slate-700">{client.last_visit || 'Sin visitas'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Total Citas</p>
                          <p className="text-xs font-medium text-slate-700">{client.total_appointments || 0} servicios</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {selectedClient && (
          <div className="lg:w-1/3">
            <Card className="sticky top-0">
              <CardContent className="p-6 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-3xl font-bold">{selectedClient.name.charAt(0)}</div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedClient(null)}>Cerrar</Button>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedClient.name}</h3>
                  <p className="text-slate-500 text-sm">Cliente registrado</p>
                </div>
                <div className="space-y-4">
                  {selectedClient.email && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm"><Mail size={16} /></div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Email</p>
                        <p className="text-sm font-medium">{selectedClient.email}</p>
                      </div>
                    </div>
                  )}
                  {selectedClient.phone && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm"><Phone size={16} /></div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Teléfono</p>
                        <p className="text-sm font-medium">{selectedClient.phone}</p>
                      </div>
                    </div>
                  )}
                  {selectedClient.notes && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm"><FileText size={16} /></div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Notas</p>
                        <p className="text-sm font-medium">{selectedClient.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <h5 className="text-sm font-bold mb-4">Estadísticas</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl text-center">
                      <p className="text-2xl font-bold">{selectedClient.total_appointments || 0}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Citas</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl text-center">
                      <p className="text-xl font-bold mt-1 truncate">{selectedClient.last_visit || '—'}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Última visita</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Renderizamos el modal al final */}
      <ClientForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleAddClient} 
      />
    </div>
  );
};