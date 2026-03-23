import { Router, Response } from 'express';
import { db } from '../database.js';
import { authMiddleware, AuthRequest } from '../auth.js';

const router = Router();

// All routes require auth
router.use(authMiddleware);

// GET /api/reservations
router.get('/', (req: AuthRequest, res: Response) => {
  const { date, status } = req.query;
  let query = 'SELECT * FROM reservations WHERE barbershop_id = ?';
  const params: any[] = [req.user!.barbershopId];

  if (date) { query += ' AND date = ?'; params.push(date); }
  if (status) { query += ' AND status = ?'; params.push(status); }
  query += ' ORDER BY date DESC, time ASC';

  const reservations = db.prepare(query).all(...params);
  res.json(reservations);
});

// POST /api/reservations
router.post('/', (req: AuthRequest, res: Response) => {
  const { clientName, clientEmail, clientPhone, serviceId, serviceName, barberId, barberName, date, time, price, notes } = req.body;

  if (!clientName || !serviceName || !barberName || !date || !time || price === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const result = db.prepare(`
    INSERT INTO reservations (barbershop_id, client_name, client_email, client_phone, service_id, service_name, barber_id, barber_name, date, time, price, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.user!.barbershopId, clientName, clientEmail || null, clientPhone || null, serviceId || null, serviceName, barberId || null, barberName, date, time, price, notes || null);

  const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(reservation);
});

// PATCH /api/reservations/:id/status
router.patch('/:id/status', (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  const result = db.prepare(`
    UPDATE reservations SET status = ? WHERE id = ? AND barbershop_id = ?
  `).run(status, req.params.id, req.user!.barbershopId);

  if (result.changes === 0) return res.status(404).json({ error: 'Reserva no encontrada' });
  const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id);
  res.json(reservation);
});

// DELETE /api/reservations/:id
router.delete('/:id', (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM reservations WHERE id = ? AND barbershop_id = ?')
    .run(req.params.id, req.user!.barbershopId);
  if (result.changes === 0) return res.status(404).json({ error: 'Reserva no encontrada' });
  res.json({ success: true });
});

export default router;
