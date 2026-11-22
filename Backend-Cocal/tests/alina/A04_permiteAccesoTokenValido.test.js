import { verificarToken, mockRes, jwt } from './_setup.js';
import { jest } from '@jest/globals';

describe('A04 — verificarToken', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Permite acceso y agrega user al request con token válido', () => {
    // 1) Preparación
    const decoded = { id: 1, rol: 'ADMIN', correo: 'admin@test.com', ultimaActividad: Date.now() };
    const req = { headers: { authorization: 'Bearer valid.token.here' } };
    const res = mockRes();
    const next = jest.fn();
    jwt.verify.mockReturnValue(decoded);

    // 2) Lógica
    verificarToken(req, res, next);

    // 3) Assert
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(1);
  });
});
