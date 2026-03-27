import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error("Faltan las variables de entorno de Turso (TURSO_DATABASE_URL o TURSO_AUTH_TOKEN)");
}

// Conectarse a la nube de Turso
export const db = createClient({
  url: url,
  authToken: authToken,
});

// Crear las tablas si no existen (ahora usamos executeMultiple para Turso)
export async function initDB() {
  try {
    await db.executeMultiple(`
      CREATE TABLE IF NOT EXISTS barbershops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        description TEXT,
        image TEXT,
        rating REAL DEFAULT 5.0,
        reviews INTEGER DEFAULT 0,
        plan TEXT DEFAULT 'basic',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barbershop_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        duration TEXT NOT NULL,
        price REAL NOT NULL,
        status TEXT DEFAULT 'active',
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id)
      );

      CREATE TABLE IF NOT EXISTS barbers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barbershop_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        specialty TEXT,
        availability TEXT,
        image TEXT,
        active BOOLEAN DEFAULT 1,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id)
      );

      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barbershop_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        notes TEXT,
        last_visit DATETIME,
        total_appointments INTEGER DEFAULT 0,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id)
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barbershop_id INTEGER NOT NULL,
        client_name TEXT NOT NULL,
        client_email TEXT,
        client_phone TEXT,
        service_id INTEGER,
        service_name TEXT NOT NULL,
        barber_id INTEGER,
        barber_name TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        price REAL NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id),
        FOREIGN KEY (service_id) REFERENCES services (id),
        FOREIGN KEY (barber_id) REFERENCES barbers (id)
      );
    `);
    console.log('✅ Base de datos conectada a Turso y tablas inicializadas');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos en Turso:', error);
  }
}