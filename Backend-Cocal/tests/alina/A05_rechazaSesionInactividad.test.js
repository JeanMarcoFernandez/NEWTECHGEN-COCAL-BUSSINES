import { verificarToken, mockRes, jwt } from './_setup.js';
import { jest } from '@jest/globals';

describe('A05 — verificarToken', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Rechaza sesión expirada por inactividad (>120 min)', () => {
    // 1) Preparación
    const dosHorasAtras = Date.now() - 130 * 60 * 1000;
    const decoded = { id: 1, rol: 'ADMIN', ultimaActividad: dosHorasAtras };
    const req = { headers: { authorization: 'Bearer valid.token' } };
    const res = mockRes();
    const next = jest.fn();
    jwt.verify.mockReturnValue(decoded);

    // 2) Lógica
    verificarToken(req, res, next);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(440);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Sesión expirada por inactividad'),
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
