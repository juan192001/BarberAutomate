import { Router, Response } from 'express';
import { db } from '../database.js';
import { authMiddleware, AuthRequest } from '../auth.js';

const router = Router();
router.use(authMiddleware);

// ── SERVICES ──────────────────────────────────────────────

// GET /api/services
router.get('/services', (req: AuthRequest, res: Response) => {
  const services = db.prepare('SELECT * FROM services WHERE barbershop_id = ? ORDER BY name').all(req.user!.barbershopId);
  res.json(services);
});

// POST /api/services
router.post('/services', (req: AuthRequest, res: Response) => {
  const { name, duration, price, status } = req.body;
  if (!name || !duration || price === undefined) return res.status(400).json({ error: 'Faltan campos' });

  const result = db.prepare(`
    INSERT INTO services (barbershop_id, name, duration, price, status) VALUES (?, ?, ?, ?, ?)
  `).run(req.user!.barbershopId, name, duration, price, status || 'active');

  res.status(201).json(db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid));
});

// PUT /api/services/:id
router.put('/services/:id', (req: AuthRequest, res: Response) => {
  const { name, duration, price, status } = req.body;
  const result = db.prepare(`
    UPDATE services SET name = ?, duration = ?, price = ?, status = ? WHERE id = ? AND barbershop_id = ?
  `).run(name, duration, price, status, req.params.id, req.user!.barbershopId);

  if (result.changes === 0) return res.status(404).json({ error: 'Servicio no encontrado' });
  res.json(db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id));
});

// DELETE /api/services/:id
router.delete('/services/:id', (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM services WHERE id = ? AND barbershop_id = ?').run(req.params.id, req.user!.barbershopId);
  if (result.changes === 0) return res.status(404).json({ error: 'Servicio no encontrado' });
  res.json({ success: true });
});

// ── BARBERS ──────────────────────────────────────────────

// GET /api/barbers
router.get('/barbers', (req: AuthRequest, res: Response) => {
  const barbers = db.prepare('SELECT * FROM barbers WHERE barbershop_id = ? AND active = 1 ORDER BY name').all(req.user!.barbershopId);
  res.json(barbers);
});

// POST /api/barbers
router.post('/barbers', (req: AuthRequest, res: Response) => {
  const { name, specialty, availability, image } = req.body;
  if (!name) return res.status(400).json({ error: 'Nombre requerido' });

  const result = db.prepare(`
    INSERT INTO barbers (barbershop_id, name, specialty, availability, image) VALUES (?, ?, ?, ?, ?)
  `).run(req.user!.barbershopId, name, specialty || null, availability || '9:00 - 19:00', image || null);

  res.status(201).json(db.prepare('SELECT * FROM barbers WHERE id = ?').get(result.lastInsertRowid));
});

// PUT /api/barbers/:id
router.put('/barbers/:id', (req: AuthRequest, res: Response) => {
  const { name, specialty, availability, image } = req.body;
  const result = db.prepare(`
    UPDATE barbers SET name = ?, specialty = ?, availability = ?, image = ? WHERE id = ? AND barbershop_id = ?
  `).run(name, specialty, availability, image, req.params.id, req.user!.barbershopId);

  if (result.changes === 0) return res.status(404).json({ error: 'Barbero no encontrado' });
  res.json(db.prepare('SELECT * FROM barbers WHERE id = ?').get(req.params.id));
});

// DELETE /api/barbers/:id
router.delete('/barbers/:id', (req: AuthRequest, res: Response) => {
  db.prepare('UPDATE barbers SET active = 0 WHERE id = ? AND barbershop_id = ?').run(req.params.id, req.user!.barbershopId);
  res.json({ success: true });
});

// ── CLIENTS ──────────────────────────────────────────────

// GET /api/clients
router.get('/clients', (req: AuthRequest, res: Response) => {
  const clients = db.prepare(`
    SELECT c.*, 
      COUNT(r.id) as total_appointments,
      MAX(r.date) as last_visit
    FROM clients c
    LEFT JOIN reservations r ON r.client_email = c.email AND r.barbershop_id = c.barbershop_id
    WHERE c.barbershop_id = ?
    GROUP BY c.id
    ORDER BY c.name
  `).all(req.user!.barbershopId);
  res.json(clients);
});

// POST /api/clients
router.post('/clients', (req: AuthRequest, res: Response) => {
  const { name, phone, email, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'Nombre requerido' });

  const result = db.prepare(`
    INSERT INTO clients (barbershop_id, name, phone, email, notes) VALUES (?, ?, ?, ?, ?)
  `).run(req.user!.barbershopId, name, phone || null, email || null, notes || null);

  res.status(201).json(db.prepare('SELECT * FROM clients WHERE id = ?').get(result.lastInsertRowid));
});

// ── AUTOMATIONS ──────────────────────────────────────────────

// GET /api/automations
router.get('/automations', (req: AuthRequest, res: Response) => {
  const automations = db.prepare('SELECT * FROM automations WHERE barbershop_id = ? ORDER BY id').all(req.user!.barbershopId);
  res.json(automations);
});

// PATCH /api/automations/:id
router.patch('/automations/:id', (req: AuthRequest, res: Response) => {
  const { enabled } = req.body;
  const result = db.prepare('UPDATE automations SET enabled = ? WHERE id = ? AND barbershop_id = ?')
    .run(enabled ? 1 : 0, req.params.id, req.user!.barbershopId);

  if (result.changes === 0) return res.status(404).json({ error: 'Automatización no encontrada' });
  res.json(db.prepare('SELECT * FROM automations WHERE id = ?').get(req.params.id));
});

// ── DASHBOARD (stats) ──────────────────────────────────────────────

// GET /api/dashboard
router.get('/dashboard', (req: AuthRequest, res: Response) => {
  const bsId = req.user!.barbershopId;
  const today = new Date().toISOString().split('T')[0];

  const todayStats = db.prepare(`
    SELECT 
      COUNT(*) as total_appointments,
      COALESCE(SUM(CASE WHEN status != 'cancelled' THEN price ELSE 0 END), 0) as revenue,
      COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
    FROM reservations WHERE barbershop_id = ? AND date = ?
  `).get(bsId, today) as any;

  const totalClients = db.prepare('SELECT COUNT(*) as count FROM clients WHERE barbershop_id = ?').get(bsId) as any;

  const weeklyRevenue = db.prepare(`
    SELECT date, 
      COALESCE(SUM(CASE WHEN status != 'cancelled' THEN price ELSE 0 END), 0) as revenue,
      COUNT(*) as appointments
    FROM reservations 
    WHERE barbershop_id = ? AND date >= date('now', '-7 days')
    GROUP BY date ORDER BY date
  `).all(bsId);

  const recentReservations = db.prepare(`
    SELECT * FROM reservations WHERE barbershop_id = ? ORDER BY created_at DESC LIMIT 5
  `).all(bsId);

  res.json({
    today: todayStats,
    totalClients: totalClients.count,
    weeklyRevenue,
    recentReservations,
  });
});

// ── PUBLIC: Barbershops search (no auth) ──────────────────────────────────────────────

export default router;
