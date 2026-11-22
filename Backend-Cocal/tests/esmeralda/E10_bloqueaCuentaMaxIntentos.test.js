import { loginUsuario, mockRes, mockReq, getUsuarioPorCorreo, bcrypt, incrementarIntentoFallido } from './_setup.js';
import { jest } from '@jest/globals';

describe('E10 — loginUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Bloquea la cuenta al alcanzar MAX_INTENTOS', async () => {
    // 1) Preparación
    const req = mockReq({ correo: 'user@test.com', contrasena: 'wrongPass' });
    const res = mockRes();
    getUsuarioPorCorreo.mockResolvedValue({
      data: {
        id: 3, correo: 'user@test.com', contrasena: '$2b$10$hash',
        bloqueado_hasta: null, intentos_fallidos: 4,
      },
      error: null,
    });
    bcrypt.compare.mockResolvedValue(false);
    incrementarIntentoFallido.mockResolvedValue({});

    // 2) Lógica
    await loginUsuario(req, res);

    // 3) Assert
    expect(incrementarIntentoFallido).toHaveBeenCalledWith(3, 5, expect.any(Date));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Demasiados intentos fallidos'),
      }),
    );
  });
});
