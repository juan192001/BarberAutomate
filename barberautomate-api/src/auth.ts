import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'barberautomate-secret-dev-2024';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    barbershopId: number;
    email: string;
  };
}

export function generateToken(payload: { userId: number; barbershopId: number; email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      userId: decoded.userId,
      barbershopId: decoded.barbershopId,
      email: decoded.email,
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
