# BarberAutomate API 💈

Backend REST API para la plataforma BarberAutomate. Construido con **Node.js + Express + SQLite**.

---

## 🚀 Arranque rápido

```bash
npm install
cp .env.example .env   # Edita el JWT_SECRET
npm run dev
```

API disponible en → **http://localhost:4000**

---

## 📡 Endpoints

### Auth (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar barbería + admin |
| POST | `/api/auth/login` | Iniciar sesión → devuelve JWT |
| GET | `/api/auth/me` | Perfil del usuario autenticado |

### Panel Admin (requiere `Authorization: Bearer <token>`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/dashboard` | Stats del día + ingresos semanales |
| GET / POST | `/api/reservations` | Listar / crear reservas |
| PATCH | `/api/reservations/:id/status` | Cambiar estado |
| DELETE | `/api/reservations/:id` | Eliminar reserva |
| GET / POST / PUT / DELETE | `/api/services` | CRUD servicios |
| GET / POST / PUT / DELETE | `/api/barbers` | CRUD barberos |
| GET / POST | `/api/clients` | Listar / crear clientes |
| GET / PATCH | `/api/automations` | Listar / activar automatizaciones |

### Portal Clientes (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/public/barbershops?q=madrid` | Buscar barberías |
| GET | `/api/public/barbershops/:id/services` | Servicios disponibles |
| GET | `/api/public/barbershops/:id/barbers` | Barberos disponibles |
| POST | `/api/public/bookings` | Crear reserva como cliente |

---

## 🗄️ Base de datos

SQLite — se crea automáticamente en `data/barberautomate.db` al arrancar.

Tablas: `barbershops`, `users`, `barbers`, `services`, `clients`, `reservations`, `automations`

---

## 🛡️ Seguridad
- Contraseñas con **bcrypt** (10 rounds)
- Sesiones con **JWT** (7 días)
- Multi-tenant: cada barbería solo accede a sus propios datos
