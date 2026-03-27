import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../database.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export interface AuthRequest extends Request {
  user?: { barbershopId: number };
}

// Middleware para proteger las rutas
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { barbershopId: number };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    // 1. Extraemos los datos siendo flexibles con los nombres que envíe el frontend
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name || req.body.fullName || req.body.barbershopName || req.body.ownerName || 'Barbería';
    const phone = req.body.phone || null;

    // 2. Solo exigimos obligatoriamente el email y el password
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (email o contraseña)' });
    }

    // 3. Comprobar si el email ya existe
    const existing = await db.execute({
      sql: 'SELECT id FROM barbershops WHERE email = ?',
      args: [email]
    });

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // 4. Crear la barbería / administrador (Añadimos el teléfono a la consulta)
    const result = await db.execute({
      sql: 'INSERT INTO barbershops (name, email, password, phone) VALUES (?, ?, ?, ?)',
      args: [name, email, password, phone]
    });

    const barbershopId = Number(result.lastInsertRowid);
    const token = jwt.sign({ barbershopId }, JWT_SECRET);
    
    res.status(201).json({ token, barbershop: { id: barbershopId, name, email } });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const result = await db.execute({
      sql: 'SELECT * FROM barbershops WHERE email = ? AND password = ?',
      args: [email, password]
    });

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const barbershop = result.rows[0];
    const token = jwt.sign({ barbershopId: Number(barbershop.id) }, JWT_SECRET);
    
    res.json({ token, barbershop: { id: Number(barbershop.id), name: barbershop.name, email: barbershop.email } });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;