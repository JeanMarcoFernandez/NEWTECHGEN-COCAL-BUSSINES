import { verificarToken, mockRes, jwt } from './_setup.js';
import { jest } from '@jest/globals';

describe('A02 — verificarToken', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Rechaza token expirado con mensaje específico', () => {
    // 1) Preparación
    const req = { headers: { authorization: 'Bearer expired.token.here' } };
    const res = mockRes();
    const next = jest.fn();
    const expiredError = new Error('jwt expired');
    expiredError.name = 'TokenExpiredError';
    jwt.verify.mockImplementation(() => { throw expiredError; });

    // 2) Lógica
    verificarToken(req, res, next);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'El token ha expirado. Inicia sesión nuevamente.' }),
    );
  });
});
