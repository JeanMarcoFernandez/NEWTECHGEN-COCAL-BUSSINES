import { verificarToken, mockRes } from './_setup.js';
import { jest } from '@jest/globals';

describe('A01 — verificarToken', () => {
  test('Rechaza petición sin header Authorization', () => {
    // 1) Preparación
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    // 2) Lógica
    verificarToken(req, res, next);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Token no proporcionado.' }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
