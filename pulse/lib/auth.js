import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
const TOKEN_NAME = 'token';

export function signToken(payload, expiresIn = '8h'){
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token){
  try{
    return jwt.verify(token, JWT_SECRET);
  }catch(e){ return null }
}

export function setTokenCookie(res, token){
  const isProd = process.env.NODE_ENV === 'production';
  const cookie = serialize(TOKEN_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8 // 8 hours
  });
  res.setHeader('Set-Cookie', cookie);
}

export function clearTokenCookie(res){
  const cookie = serialize(TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
  res.setHeader('Set-Cookie', cookie);
}

export function parseTokenCookie(req){
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  return cookies[TOKEN_NAME] || null;
}
