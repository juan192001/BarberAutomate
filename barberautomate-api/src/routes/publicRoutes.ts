import { Router, Request, Response } from 'express';
import { db } from '../database.js';

const router = Router();

// GET /api/public/barbershops - search barbershops
router.get('/barbershops', (req: Request, res: Response) => {
  const { q } = req.query;
  let query = 'SELECT id, name, address, description, image, rating, plan FROM barbershops';
  const params: any[] = [];

  if (q) {
    query += ' WHERE name LIKE ? OR address LIKE ?';
    params.push(`%${q}%`, `%${q}%`);
  }
  query += ' ORDER BY rating DESC';

  const barbershops = db.prepare(query).all(...params);
  res.json(barbershops);
});

// GET /api/public/barbershops/:id/services
router.get('/barbershops/:id/services', (req: Request, res: Response) => {
  const services = db.prepare(`
    SELECT * FROM services WHERE barbershop_id = ? AND status = 'active' ORDER BY name
  `).all(req.params.id);
  res.json(services);
});

// GET /api/public/barbershops/:id/barbers
router.get('/barbershops/:id/barbers', (req: Request, res: Response) => {
  const barbers = db.prepare(`
    SELECT id, name, specialty, availability, image FROM barbers WHERE barbershop_id = ? AND active = 1 ORDER BY name
  `).all(req.params.id);
  res.json(barbers);
});

// POST /api/public/bookings - customer booking (no auth needed)
router.post('/bookings', (req: Request, res: Response) => {
  const { barbershopId, clientName, clientEmail, clientPhone, serviceId, serviceName, barberId, barberName, date, time, price } = req.body;

  if (!barbershopId || !clientName || !serviceName || !barberName || !date || !time || price === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Check slot not already taken
  const conflict = db.prepare(`
    SELECT id FROM reservations 
    WHERE barbershop_id = ? AND barber_id = ? AND date = ? AND time = ? AND status != 'cancelled'
  `).get(barbershopId, barberId, date, time);

  if (conflict) {
    return res.status(409).json({ error: 'Este horario ya está reservado. Por favor elige otro.' });
  }

  const result = db.prepare(`
    INSERT INTO reservations (barbershop_id, client_name, client_email, client_phone, service_id, service_name, barber_id, barber_name, date, time, price, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
  `).run(barbershopId, clientName, clientEmail || null, clientPhone || null, serviceId || null, serviceName, barberId || null, barberName, date, time, price);

  // Auto-create client record if email provided
  if (clientEmail) {
    const existing = db.prepare('SELECT id FROM clients WHERE barbershop_id = ? AND email = ?').get(barbershopId, clientEmail);
    if (!existing) {
      db.prepare('INSERT INTO clients (barbershop_id, name, phone, email) VALUES (?, ?, ?, ?)').run(barbershopId, clientName, clientPhone || null, clientEmail);
    }
  }

  const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, reservation });
});

export default router;
