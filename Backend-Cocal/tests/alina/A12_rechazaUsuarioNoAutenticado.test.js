import { validarPermisoGranular, mockRes } from './_setup.js';
import { jest } from '@jest/globals';

describe('A12 — validarPermisoGranular', () => {
  test('Rechaza usuario no autenticado (sin req.user)', async () => {
    // 1) Preparación
    const req = { headers: {}, body: {}, params: {} };
    const res = mockRes();
    const next = jest.fn();
    const middleware = validarPermisoGranular('GESTION_CALENDARIO', 'EMPRESA');

    // 2) Lógica
    await middleware(req, res, next);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
