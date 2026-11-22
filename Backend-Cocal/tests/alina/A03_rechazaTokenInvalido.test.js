import { verificarToken, mockRes, jwt } from './_setup.js';
import { jest } from '@jest/globals';

describe('A03 — verificarToken', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Rechaza token con firma inválida', () => {
    // 1) Preparación
    const req = { headers: { authorization: 'Bearer invalid.token' } };
    const res = mockRes();
    const next = jest.fn();
    jwt.verify.mockImplementation(() => { throw new Error('invalid signature'); });

    // 2) Lógica
    verificarToken(req, res, next);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Token inválido o ausente.' }),
    );
  });
});
