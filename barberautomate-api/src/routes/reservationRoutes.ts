import { Router, Response } from 'express';
import { db } from '../database.js';
import { authMiddleware, AuthRequest } from '../auth.js';

const router = Router();

// URL de tu Webhook de n8n con tu IP pública
const N8N_WEBHOOK_URL = 'http://34.41.155.111:5678/webhook-test/2068a655-eb0a-47da-8cf8-61a811c62cbc';

// 🔒 Aplicar el candado de seguridad a todas las rutas de este archivo
router.use(authMiddleware);

// GET /api/reservations (Obtener todas las reservas)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;
    let query = 'SELECT * FROM reservations WHERE barbershop_id = ?';
    const args: any[] = [req.user!.barbershopId];

    if (date) {
      query += ' AND date = ?';
      args.push(date as string);
    }
    query += ' ORDER BY date DESC, time DESC';

    const result = await db.execute({ sql: query, args });
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error obteniendo reservas:', err);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// POST /api/reservations (Crear una nueva reserva desde el Panel Admin)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { clientName, clientEmail, clientPhone, serviceId, serviceName, barberId, barberName, date, time, price, notes } = req.body;

    // 1. Comprobar que no haya choques de horario
    const conflict = await db.execute({
      sql: `SELECT id FROM reservations WHERE barbershop_id = ? AND barber_name = ? AND date = ? AND time = ? AND status != 'cancelled'`,
      args: [req.user!.barbershopId, barberName || '', date || '', time || '']
    });

    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: 'El barbero ya tiene una cita asignada en ese horario.' });
    }

    // 2. Insertar la reserva en la base de datos
    const insertResult = await db.execute({
      sql: `INSERT INTO reservations (barbershop_id, client_name, client_email, client_phone, service_id, service_name, barber_id, barber_name, date, time, price, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        req.user!.barbershopId, 
        clientName || 'Sin Nombre', 
        clientEmail || null, 
        clientPhone || null, 
        serviceId || null, 
        serviceName || '', 
        barberId || null, 
        barberName || '', 
        date || '', 
        time || '', 
        price || 0, 
        notes || null
      ]
    });

    // 3. Crear el cliente automáticamente si no existe
    const existingClient = await db.execute({
      sql: 'SELECT id FROM clients WHERE barbershop_id = ? AND name = ?',
      args: [req.user!.barbershopId, clientName || 'Sin Nombre']
    });
    
    if (existingClient.rows.length === 0) {
      await db.execute({
        sql: 'INSERT INTO clients (barbershop_id, name, phone, email) VALUES (?, ?, ?, ?)',
        args: [req.user!.barbershopId, clientName || 'Sin Nombre', clientPhone || null, clientEmail || null]
      });
    }

    // 4. Obtener la reserva completa para mandarla a n8n
    const result = await db.execute({
      sql: 'SELECT * FROM reservations WHERE id = ?',
      args: [insertResult.lastInsertRowid!]
    });
    const newReservation = result.rows[0];

    // --- 🚀 PASO CLAVE: NOTIFICAR A N8N DESDE ADMIN ---
    fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReservation)
    }).catch(err => console.error('Error avisando a n8n desde Admin:', err));
    // --------------------------------------------------

    res.status(201).json(newReservation);
  } catch (err) {
    console.error('❌ Error creando reserva:', err);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
});

// PATCH /api/reservations/:id/status
router.patch('/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    await db.execute({
      sql: 'UPDATE reservations SET status = ? WHERE id = ? AND barbershop_id = ?',
      args: [status, req.params.id, req.user!.barbershopId]
    });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error actualizando reserva:', err);
    res.status(500).json({ error: 'Error al actualizar reserva' });
  }
});

export default router;