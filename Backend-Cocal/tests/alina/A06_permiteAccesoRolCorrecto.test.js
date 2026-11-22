import { validarRol, mockRes } from './_setup.js';
import { jest } from '@jest/globals';

describe('A06 — validarRol', () => {
  test('Permite acceso si el rol coincide', () => {
    // 1) Preparación
    const req = { user: { rol: 'ADMIN' } };
    const res = mockRes();
    const next = jest.fn();
    const middleware = validarRol('ADMIN', 'SUPERVISOR');

    // 2) Lógica
    middleware(req, res, next);

    // 3) Assert
    expect(next).toHaveBeenCalled();
  });
});
