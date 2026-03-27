import { Router, Request, Response } from 'express';
import { db } from '../database.js';

const router = Router();

router.get('/barbershops', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    let query = 'SELECT id, name, address, description, image, rating, plan FROM barbershops';
    const args: any[] = [];

    if (q) {
      query += ' WHERE name LIKE ? OR address LIKE ?';
      args.push(`%${q}%`, `%${q}%`);
    }
    query += ' ORDER BY rating DESC';

    const result = await db.execute({ sql: query, args });
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar barberías' });
  }
});

router.get('/barbershops/:id/services', async (req: Request, res: Response) => {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM services WHERE barbershop_id = ? AND status = 'active' ORDER BY name",
      args: [req.params.id]
    });
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar servicios' });
  }
});

router.get('/barbershops/:id/barbers', async (req: Request, res: Response) => {
  try {
    const result = await db.execute({
      sql: "SELECT id, name, specialty, availability, image FROM barbers WHERE barbershop_id = ? AND active = 1 ORDER BY name",
      args: [req.params.id]
    });
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar barberos' });
  }
});

router.get('/barbershops/:id/booked-times', async (req: Request, res: Response) => {
  try {
    const { barberId, barberName, date } = req.query;
    if (!date || (!barberId && !barberName)) return res.json([]);
    
    const result = await db.execute({
      sql: `SELECT time FROM reservations 
            WHERE barbershop_id = ? AND (barber_id = ? OR barber_name = ?) 
            AND date = ? AND status != 'cancelled'`,
      // AQUÍ ESTÁ EL CAMBIO: Forzamos el tipo con "as string"
      args: [
        req.params.id as string, 
        (barberId as string) || null, 
        (barberName as string) || null, 
        date as string
      ]
    });
    
    res.json(result.rows.map((r: any) => r.time));
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar horarios' });
  }
});

router.post('/bookings', async (req: Request, res: Response) => {
  try {
    const { barbershopId, clientName, clientEmail, clientPhone, serviceId, serviceName, barberId, barberName, date, time, price } = req.body;

    if (!barbershopId || !clientName || !serviceName || !barberName || !date || !time || price === undefined) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const conflict = await db.execute({
      sql: `SELECT id FROM reservations 
            WHERE barbershop_id = ? AND (barber_id = ? OR barber_name = ?) AND date = ? AND time = ? AND status != 'cancelled'`,
      args: [barbershopId, barberId || null, barberName, date, time]
    });

    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: 'Este horario ya está reservado. Por favor elige otro.' });
    }

    const insertResult = await db.execute({
      sql: `INSERT INTO reservations (barbershop_id, client_name, client_email, client_phone, service_id, service_name, barber_id, barber_name, date, time, price, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      args: [barbershopId, clientName, clientEmail || null, clientPhone || null, serviceId || null, serviceName, barberId || null, barberName, date, time, price]
    });

    if (clientEmail) {
      const existing = await db.execute({
        sql: 'SELECT id FROM clients WHERE barbershop_id = ? AND email = ?',
        args: [barbershopId, clientEmail]
      });
      if (existing.rows.length === 0) {
        await db.execute({
          sql: 'INSERT INTO clients (barbershop_id, name, phone, email) VALUES (?, ?, ?, ?)',
          args: [barbershopId, clientName, clientPhone || null, clientEmail]
        });
      }
    }

   const reservation = await db.execute({
  sql: 'SELECT * FROM reservations WHERE id = ?',
  args: [Number(insertResult.lastInsertRowid)]
});

    res.status(201).json({ success: true, reservation: reservation.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error al procesar la reserva' });
  }
});

export default router;