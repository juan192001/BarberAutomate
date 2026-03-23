# BarberAutomate App 💈

Frontend de la plataforma BarberAutomate. Construido con **React + TypeScript + Vite + Tailwind CSS**.

---

## 🚀 Arranque rápido

```bash
npm install
cp .env.example .env   # Apunta a tu API backend
npm run dev
```

App disponible en → **http://localhost:3000**

> ⚠️ Necesitas tener el backend (`barberautomate-api`) corriendo en `http://localhost:4000`

---

## 🔌 Conexión con la API

Todas las llamadas a la API están centralizadas en **`src/lib/api.ts`**.

```typescript
import { authApi, reservationsApi, servicesApi } from './lib/api';

// Login
const { token, barbershop } = await authApi.login(email, password);

// Reservas
const reservas = await reservationsApi.list();

// Crear servicio
await servicesApi.create({ name: 'Corte Premium', duration: '45 min', price: 25 });
```

---

## 🏗️ Estructura

```
src/
├── components/       # Pantallas y componentes UI
│   ├── Dashboard.tsx
│   ├── Reservations.tsx
│   ├── Clients.tsx
│   ├── Services.tsx
│   ├── Barbers.tsx
│   ├── LoginForm.tsx
│   ├── SignUpForm.tsx
│   ├── CustomerBooking.tsx
│   ├── BarbershopSearch.tsx
│   └── ...
├── lib/
│   ├── api.ts        # ← Cliente API centralizado
│   └── utils.ts
├── App.tsx           # Router principal
└── types.ts          # Tipos TypeScript
```

---

## ⚡ Próximos pasos

Conectar los componentes al backend usando `api.ts`:

1. `LoginForm` → `authApi.login()`
2. `SignUpForm` → `authApi.register()`
3. `Dashboard` → `dashboardApi.get()`
4. `Reservations` → `reservationsApi.list()`
5. `BarbershopSearch` → `publicApi.searchBarbershops()`
