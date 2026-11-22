import { jest } from '@jest/globals';

// ─── Mocks globales ────────────────────────────────────────
export const mockSupabaseFrom = jest.fn();
jest.unstable_mockModule('../../db.js', () => ({
  supabase: { from: mockSupabaseFrom },
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
    genSalt: jest.fn(),
  },
}));

jest.unstable_mockModule('../../services/auditoriaService.js', () => ({
  registrarAuditoria: jest.fn(),
}));

jest.unstable_mockModule('../../services/authAttemptsService.js', () => ({
  incrementarIntentoFallido: jest.fn(),
  resetearIntentos: jest.fn(),
  getUsuarioPorCorreo: jest.fn(),
}));

jest.unstable_mockModule('../../controllers/twoFactorController.js', () => ({
  enviarCodigo2FA: jest.fn(),
}));

jest.unstable_mockModule('../../services/ipCheckService.js', () => ({
  verificarCambioIP: jest.fn(),
}));

jest.unstable_mockModule('../../utils/requestInfo.js', () => ({
  getClientIp: jest.fn().mockReturnValue('127.0.0.1'),
  getUserAgent: jest.fn().mockReturnValue('jest-test'),
}));

// ─── Importaciones dinámicas ───────────────────────────────
export const { registrarUsuario, loginUsuario } =
  await import('../../controllers/authController.js');
export const bcrypt = (await import('bcrypt')).default;
export const { getUsuarioPorCorreo, incrementarIntentoFallido, resetearIntentos } =
  await import('../../services/authAttemptsService.js');
export const { enviarCodigo2FA } =
  await import('../../controllers/twoFactorController.js');

// ─── Helpers ───────────────────────────────────────────────
export function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

export function mockReq(body = {}, headers = {}) {
  return {
    body,
    headers: { 'x-forwarded-for': '127.0.0.1', ...headers },
    get: jest.fn().mockReturnValue('jest-test'),
    ip: '127.0.0.1',
    connection: { remoteAddress: '127.0.0.1' },
  };
}
