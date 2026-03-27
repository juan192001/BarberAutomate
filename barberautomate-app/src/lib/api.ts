// Centralized API client for BarberAutomate frontend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function getToken(): string | null {
  return localStorage.getItem('ba_token');
}

function setToken(token: string) {
  localStorage.setItem('ba_token', token);
}

function clearToken() {
  localStorage.removeItem('ba_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error de red' }));
    throw new Error(err.error || `Error ${res.status}`);
  }
  return res.json();
}

// ── AUTH ──────────────────────────────────────────────
export const authApi = {
  register: (data: {
    barbershopName: string; address: string; ownerName: string;
    email: string; phone: string; password: string; plan?: string;
  }) => request<{ token: string; user: any; barbershop: any }>('/api/auth/register', {
    method: 'POST', body: JSON.stringify(data)
  }).then(r => { setToken(r.token); return r; }),

  login: (email: string, password: string) =>
    request<{ token: string; user: any; barbershop: any }>('/api/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password })
    }).then(r => { setToken(r.token); return r; }),

  me: () => request<{ user: any; barbershop: any }>('/api/auth/me'),

  logout: () => clearToken(),

  isLoggedIn: () => !!getToken(),
};

// ── RESERVATIONS ──────────────────────────────────────────────
export const reservationsApi = {
  list: (filters?: { date?: string; status?: string }) => {
    const params = new URLSearchParams(filters as any).toString();
    return request<any[]>(`/api/reservations${params ? '?' + params : ''}`);
  },
  create: (data: any) => request<any>('/api/reservations', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string | number, status: string) =>
    request<any>(`/api/reservations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id: string | number) => request<any>(`/api/reservations/${id}`, { method: 'DELETE' }),
};

// ── SERVICES ──────────────────────────────────────────────
export const servicesApi = {
  list: () => request<any[]>('/api/services'),
  create: (data: any) => request<any>('/api/services', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string | number, data: any) => request<any>(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string | number) => request<any>(`/api/services/${id}`, { method: 'DELETE' }),
};

// ── BARBERS ──────────────────────────────────────────────
export const barbersApi = {
  list: () => request<any[]>('/api/barbers'),
  create: (data: any) => request<any>('/api/barbers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string | number, data: any) => request<any>(`/api/barbers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string | number) => request<any>(`/api/barbers/${id}`, { method: 'DELETE' }),
};

// ── CLIENTS ──────────────────────────────────────────────
export const clientsApi = {
  list: () => request<any[]>('/api/clients'),
  create: (data: any) => request<any>('/api/clients', { method: 'POST', body: JSON.stringify(data) }),
};

// ── AUTOMATIONS ──────────────────────────────────────────────
export const automationsApi = {
  list: () => request<any[]>('/api/automations'),
  toggle: (id: string | number, enabled: boolean) =>
    request<any>(`/api/automations/${id}`, { method: 'PATCH', body: JSON.stringify({ enabled }) }),
};

// ── DASHBOARD ──────────────────────────────────────────────
export const dashboardApi = {
  get: () => request<any>('/api/dashboard'),
};
// ── SETTINGS ──────────────────────────────────────────────
export const settingsApi = {
  get: () => request<any>('/api/settings'),
  update: (data: any) => request<any>('/api/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// ── REPORTS ──────────────────────────────────────────────
export const reportsApi = {
  get: () => request<any>('/api/reports'),
};

// ── PUBLIC (no auth) ──────────────────────────────────────────────
export const publicApi = {
  searchBarbershops: (q?: string) => {
    const params = q ? `?q=${encodeURIComponent(q)}` : '';
    return request<any[]>(`/api/public/barbershops${params}`);
  },
  getServices: (barbershopId: string | number) => request<any[]>(`/api/public/barbershops/${barbershopId}/services`),
  getBarbers: (barbershopId: string | number) => request<any[]>(`/api/public/barbershops/${barbershopId}/barbers`),
  
  // NUEVA FUNCIÓN AÑADIDA: Obtiene las horas que ya están cogidas
  getBookedTimes: (barbershopId: string | number, barberId: string | number, barberName: string, date: string) => 
    request<string[]>(`/api/public/barbershops/${barbershopId}/booked-times?barberId=${barberId}&barberName=${encodeURIComponent(barberName)}&date=${date}`),
    
  book: (data: any) => request<any>('/api/public/bookings', { method: 'POST', body: JSON.stringify(data) }),
};
