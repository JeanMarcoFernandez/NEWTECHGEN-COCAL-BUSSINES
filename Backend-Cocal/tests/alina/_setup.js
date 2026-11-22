import { jest } from '@jest/globals';

// ─── Mocks globales ────────────────────────────────────────
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { verify: jest.fn(), sign: jest.fn() },
}));

jest.unstable_mockModule('../../db.js', () => ({
  supabase: { from: jest.fn() },
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: { hash: jest.fn(), genSalt: jest.fn() },
}));

jest.unstable_mockModule('../../models/permisoModel.js', () => ({
  tienePermisoGranular: jest.fn(),
  registrarLogSeguridadDB: jest.fn(),
}));

// ─── Importaciones dinámicas ───────────────────────────────
export const jwt = (await import('jsonwebtoken')).default;
export const { verificarToken } = await import('../../middleware/verificarToken.js');
export const { validarRol } = await import('../../middleware/validarRol.js');
export const { validarPermisoGranular } = await import('../../middleware/validarPermisoGranular.js');
export const { getClientIp, getUserAgent } = await import('../../utils/requestInfo.js');
export const {
  tienePermisoGranular: mockTienePermiso,
  registrarLogSeguridadDB,
} = await import('../../models/permisoModel.js');
export const bcrypt = (await import('bcrypt')).default;
export const { supabase } = await import('../../db.js');
export const { cambiarContrasenaPrimerLogin } =
  await import('../../controllers/cambiarContrasenaController.js');

// ─── Helpers ───────────────────────────────────────────────
export function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}
