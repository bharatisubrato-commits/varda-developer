import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vadradeveloper.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'VadraAdmin@2026';
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || randomBytes(32).toString('hex');
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

interface TokenPayload {
  email: string;
  role: 'admin';
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  adminUser?: {
    email: string;
    role: 'admin';
  };
}

function signPayload(payload: TokenPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
  const sig = createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyToken(token: string): TokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  const expectedSig = createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8')) as TokenPayload;
    if (!payload.exp || Date.now() > payload.exp) return null;
    if (payload.role !== 'admin') return null;
    return payload;
  } catch {
    return null;
  }
}

export function validateAdminCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}

export function issueAdminToken(email: string): { token: string; expiresAt: string } {
  const exp = Date.now() + TOKEN_TTL_MS;
  const token = signPayload({ email, role: 'admin', exp });
  return { token, expiresAt: new Date(exp).toISOString() };
}

export function requireAdminAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    return;
  }

  req.adminUser = { email: payload.email, role: payload.role };
  next();
}
