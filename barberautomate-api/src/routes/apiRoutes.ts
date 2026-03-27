import { Router, Response } from 'express';
import { db } from '../database.js';
import { authMiddleware, AuthRequest } from '../auth.js';

const router = Router();
router.use(authMiddleware);

// ── SERVICES ──────────────────────────────────────────────

// GET /api/services
router.get('/services', async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM services WHERE barbershop_id = ? ORDER BY name',
      args: [req.user!.barbershopId]
    });
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
});

// POST /api/services
router.post('/services', async (req: AuthRequest, res: Response) => {
  try {
    const { name, duration, price, status } = req.body;
    if (!name || !duration || price === undefined) return res.status(400).json({ error: 'Faltan campos' });

    const result = await db.execute({
      sql: 'INSERT INTO services (barbershop_id, name, duration, price, status) VALUES (?, ?, ?, ?, ?)',
      args: [req.user!.barbershopId, name, duration, price, status || 'active']
    });

    const newService = await db.execute({
      sql: 'SELECT * FROM services WHERE id = ?',
      args: [result.lastInsertRowid!]
    });
    res.status(201).json(newService.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear servicio' });
  }
});

// PUT /api/services/:id
router.put('/services/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { name, duration, price, status } = req.body;
    const result = await db.execute({
      sql: 'UPDATE services SET name = ?, duration = ?, price = ?, status = ? WHERE id = ? AND barbershop_id = ?',
      args: [name, duration, price, status, req.params.id, req.user!.barbershopId]
    });

    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Servicio no encontrado' });
    
    const updatedService = await db.execute({
      sql: 'SELECT * FROM services WHERE id = ?',
      args: [req.params.id]
    });
    res.json(updatedService.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
});

// DELETE /api/services/:id
router.delete('/services/:id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.execute({
      sql: 'DELETE FROM services WHERE id = ? AND barbershop_id = ?',
      args: [req.params.id, req.user!.barbershopId]
    });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Servicio no encontrado' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
});

// ── BARBERS ──────────────────────────────────────────────

// GET /api/barbers
router.get('/barbers', async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM barbers WHERE barbershop_id = ? AND active = 1 ORDER BY name',
      args: [req.user!.barbershopId]
    });
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener barberos' });
  }
});

// POST /api/barbers
router.post('/barbers', async (req: AuthRequest, res: Response) => {
  try {
    const { name, specialty, availability, image } = req.body;
    if (!name) return res.status(400).json({ error: 'Nombre requerido' });

    const result = await db.execute({
      sql: 'INSERT INTO barbers (barbershop_id, name, specialty, availability, image) VALUES (?, ?, ?, ?, ?)',
      args: [req.user!.barbershopId, name, specialty || null, availability || '9:00 - 19:00', image || null]
    });

    const newBarber = await db.execute({
      sql: 'SELECT * FROM barbers WHERE id = ?',
      args: [result.lastInsertRowid!]
    });
    res.status(201).json(newBarber.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear barbero' });
  }
});

// PUT /api/barbers/:id
router.put('/barbers/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { name, specialty, availability, image } = req.body;
    const result = await db.execute({
      sql: 'UPDATE barbers SET name = ?, specialty = ?, availability = ?, image = ? WHERE id = ? AND barbershop_id = ?',
      args: [name, specialty, availability, image, req.params.id, req.user!.barbershopId]
    });

    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Barbero no encontrado' });
    
    const updatedBarber = await db.execute({
      sql: 'SELECT * FROM barbers WHERE id = ?',
      args: [req.params.id]
    });
    res.json(updatedBarber.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar barbero' });
  }
});

// DELETE /api/barbers/:id
router.delete('/barbers/:id', async (req: AuthRequest, res: Response) => {
  try {
    await db.execute({
      sql: 'UPDATE barbers SET active = 0 WHERE id = ? AND barbershop_id = ?',
      args: [req.params.id, req.user!.barbershopId]
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar barbero' });
  }
});

// ── CLIENTS ──────────────────────────────────────────────

// GET /api/clients
router.get('/clients', async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.execute({
      sql: `SELECT c.*, 
            COUNT(r.id) as total_appointments,
            MAX(r.date) as last_visit
            FROM clients c
            LEFT JOIN reservations r ON r.client_email = c.email AND r.barbershop_id = c.barbershop_id
            WHERE c.barbershop_id = ?
            GROUP BY c.id
            ORDER BY c.name`,
      args: [req.user!.barbershopId]
    });
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// POST /api/clients
router.post('/clients', async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, email, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'Nombre requerido' });

    const result = await db.execute({
      sql: 'INSERT INTO clients (barbershop_id, name, phone, email, notes) VALUES (?, ?, ?, ?, ?)',
      args: [req.user!.barbershopId, name, phone || null, email || null, notes || null]
    });

    const newClient = await db.execute({
      sql: 'SELECT * FROM clients WHERE id = ?',
      args: [result.lastInsertRowid!]
    });
    res.status(201).json(newClient.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// ── AUTOMATIONS ──────────────────────────────────────────────

// GET /api/automations
router.get('/automations', async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM automations WHERE barbershop_id = ? ORDER BY id',
      args: [req.user!.barbershopId]
    });
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener automatizaciones' });
  }
});

// PATCH /api/automations/:id
router.patch('/automations/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { enabled } = req.body;
    const result = await db.execute({
      sql: 'UPDATE automations SET enabled = ? WHERE id = ? AND barbershop_id = ?',
      args: [enabled ? 1 : 0, req.params.id, req.user!.barbershopId]
    });

    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Automatización no encontrada' });
    
    const updatedAuto = await db.execute({
      sql: 'SELECT * FROM automations WHERE id = ?',
      args: [req.params.id]
    });
    res.json(updatedAuto.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar automatización' });
  }
});

// ── DASHBOARD (stats) ──────────────────────────────────────────────

// GET /api/dashboard
router.get('/dashboard', async (req: AuthRequest, res: Response) => {
  try {
    const bsId = req.user!.barbershopId;
    const today = new Date().toISOString().split('T')[0];

    const todayStats = await db.execute({
      sql: `SELECT 
            COUNT(*) as total_appointments,
            COALESCE(SUM(CASE WHEN status != 'cancelled' THEN price ELSE 0 END), 0) as revenue,
            COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
            FROM reservations WHERE barbershop_id = ? AND date = ?`,
      args: [bsId, today]
    });

    const totalClients = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM clients WHERE barbershop_id = ?',
      args: [bsId]
    });

    const weeklyRevenue = await db.execute({
      sql: `SELECT date, 
            COALESCE(SUM(CASE WHEN status != 'cancelled' THEN price ELSE 0 END), 0) as revenue,
            COUNT(*) as appointments
            FROM reservations 
            WHERE barbershop_id = ? AND date >= date('now', '-7 days')
            GROUP BY date ORDER BY date`,
      args: [bsId]
    });

    const recentReservations = await db.execute({
      sql: 'SELECT * FROM reservations WHERE barbershop_id = ? ORDER BY created_at DESC LIMIT 5',
      args: [bsId]
    });

    res.json({
      today: todayStats.rows[0],
      totalClients: totalClients.rows[0].count,
      weeklyRevenue: weeklyRevenue.rows,
      recentReservations: recentReservations.rows,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar el dashboard' });
  }
});

// ── REPORTS ──────────────────────────────────────────────

// GET /api/reports
router.get('/reports', async (req: AuthRequest, res: Response) => {
  try {
    const bsId = req.user!.barbershopId;

    const revenueChart = await db.execute({
      sql: `SELECT date as name, 
            COALESCE(SUM(CASE WHEN status != 'cancelled' THEN price ELSE 0 END), 0) as value
            FROM reservations 
            WHERE barbershop_id = ? AND date >= date('now', '-7 days')
            GROUP BY date ORDER BY date`,
      args: [bsId]
    });

    const servicesPie = await db.execute({
      sql: `SELECT service_name as name, COUNT(*) as value 
            FROM reservations 
            WHERE barbershop_id = ? AND status != 'cancelled'
            GROUP BY service_name
            ORDER BY value DESC`,
      args: [bsId]
    });

    const statsRow = await db.execute({
      sql: `SELECT 
            COALESCE(AVG(CASE WHEN status != 'cancelled' THEN price END), 0) as average_ticket,
            COUNT(DISTINCT client_name) as total_clients,
            COUNT(*) as total_appointments
            FROM reservations
            WHERE barbershop_id = ?`,
      args: [bsId]
    });

    res.json({
      revenueChart: revenueChart.rows,
      servicesPie: servicesPie.rows,
      stats: {
        averageTicket: statsRow.rows[0].average_ticket,
        totalClients: statsRow.rows[0].total_clients,
        totalAppointments: statsRow.rows[0].total_appointments
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar los reportes' });
  }
});
// ── SETTINGS (PROFILE) ──────────────────────────────────────────────

// GET /api/settings (Obtener los datos de la barbería)
router.get('/settings', async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.execute({
      sql: 'SELECT name, email, phone, address, description, image FROM barbershops WHERE id = ?',
      args: [req.user!.barbershopId]
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Barbería no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la configuración' });
  }
});

// PUT /api/settings (Guardar los cambios)
router.put('/settings', async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, address, description, image } = req.body;
    
    await db.execute({
      sql: 'UPDATE barbershops SET name = ?, phone = ?, address = ?, description = ?, image = ? WHERE id = ?',
      args: [name, phone || null, address || null, description || null, image || null, req.user!.barbershopId]
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la configuración' });
  }
});
export default router;