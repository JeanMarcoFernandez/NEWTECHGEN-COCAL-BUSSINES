import { validarRol, mockRes } from './_setup.js';
import { jest } from '@jest/globals';

describe('A07 — validarRol', () => {
  test('Deniega acceso si el rol no está permitido', () => {
    // 1) Preparación
    const req = { user: { rol: 'EMPLEADO' } };
    const res = mockRes();
    const next = jest.fn();
    const middleware = validarRol('ADMIN', 'SUPERVISOR');

    // 2) Lógica
    middleware(req, res, next);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Acceso denegado') }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
