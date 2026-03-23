import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, authMiddleware, AuthRequest } from '../auth.js';
import { db } from '../database.js';
const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { barbershopName, address, ownerName, email, phone, password, plan } = req.body;

  if (!barbershopName || !address || !ownerName || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Check email not in use
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Este email ya está registrado' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Transaction: create barbershop + user together
  const create = db.transaction(() => {
    const shopResult = db.prepare(`
      INSERT INTO barbershops (name, address, phone, email, plan)
      VALUES (?, ?, ?, ?, ?)
    `).run(barbershopName, address, phone || null, email, plan || 'Básico');

    const barbershopId = shopResult.lastInsertRowid as number;

    const userResult = db.prepare(`
      INSERT INTO users (barbershop_id, owner_name, email, phone, password_hash)
      VALUES (?, ?, ?, ?, ?)
    `).run(barbershopId, ownerName, email, phone || null, passwordHash);

    // Insert default automations
    const defaultAutomations = [
      { title: 'Recordatorio 24h', description: 'Envía un SMS y WhatsApp 24 horas antes de la cita.', type: 'reminder', enabled: 1 },
      { title: 'Confirmación Inmediata', description: 'Envía un correo al momento de realizar la reserva.', type: 'confirmation', enabled: 1 },
      { title: 'Seguimiento Post-Visita', description: 'Mensaje 2 días después para pedir feedback.', type: 'follow-up', enabled: 0 },
      { title: 'Promo Reactivación', description: 'Cupón de descuento para clientes con +30 días sin venir.', type: 'promo', enabled: 1 },
    ];
    const insertAuto = db.prepare(`INSERT INTO automations (barbershop_id, title, description, type, enabled) VALUES (?, ?, ?, ?, ?)`);
    for (const a of defaultAutomations) {
      insertAuto.run(barbershopId, a.title, a.description, a.type, a.enabled);
    }

    return { barbershopId, userId: userResult.lastInsertRowid as number };
  });

  try {
    const { barbershopId, userId } = create();
    const token = generateToken({ userId, barbershopId, email });
    const barbershop = db.prepare('SELECT * FROM barbershops WHERE id = ?').get(barbershopId);
    res.status(201).json({ token, user: { id: userId, ownerName, email }, barbershop });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la cuenta' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const barbershop = db.prepare('SELECT * FROM barbershops WHERE id = ?').get(user.barbershop_id) as any;
  const token = generateToken({ userId: user.id, barbershopId: user.barbershop_id, email });
  res.json({ token, user: { id: user.id, ownerName: user.owner_name, email }, barbershop });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  const user = db.prepare('SELECT id, owner_name, email, phone FROM users WHERE id = ?').get(req.user!.userId) as any;
  const barbershop = db.prepare('SELECT * FROM barbershops WHERE id = ?').get(req.user!.barbershopId);
  res.json({ user, barbershop });
});

export default router;
