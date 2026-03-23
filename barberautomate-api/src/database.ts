import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../data/barberautomate.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    -- Barbershops (tenants of the SaaS)
    CREATE TABLE IF NOT EXISTS barbershops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      description TEXT,
      image TEXT,
      rating REAL DEFAULT 5.0,
      plan TEXT DEFAULT 'Básico' CHECK(plan IN ('Básico', 'Profesional', 'Premium')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Admin users (owners of barbershops)
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barbershop_id INTEGER NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
      owner_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Barbers (employees)
    CREATE TABLE IF NOT EXISTS barbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barbershop_id INTEGER NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      specialty TEXT,
      availability TEXT DEFAULT '9:00 - 19:00',
      image TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Services offered
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barbershop_id INTEGER NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      duration TEXT NOT NULL,
      price REAL NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Clients (customers)
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barbershop_id INTEGER NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Reservations / Appointments
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barbershop_id INTEGER NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
      client_name TEXT NOT NULL,
      client_email TEXT,
      client_phone TEXT,
      service_id INTEGER REFERENCES services(id),
      service_name TEXT NOT NULL,
      barber_id INTEGER REFERENCES barbers(id),
      barber_name TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
      price REAL NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Automations config per barbershop
    CREATE TABLE IF NOT EXISTS automations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barbershop_id INTEGER NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL CHECK(type IN ('reminder', 'confirmation', 'follow-up', 'promo')),
      enabled INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  console.log('✅ Database initialized at', DB_PATH);
}
