import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDB } from './database.js';
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors());app.use(express.json());

// Init DB
initDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/public', publicRoutes);
app.use('/api', apiRoutes);

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`🚀 BarberAutomate API running on http://localhost:${PORT}`);
});
