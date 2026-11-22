import { loginUsuario, mockRes, mockReq, getUsuarioPorCorreo } from './_setup.js';
import { jest } from '@jest/globals';

describe('E08 — loginUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Rechaza login si la cuenta está bloqueada', async () => {
    // 1) Preparación
    const futuro = new Date(Date.now() + 600000).toISOString();
    const req = mockReq({ correo: 'bloqueado@test.com', contrasena: '123456' });
    const res = mockRes();
    getUsuarioPorCorreo.mockResolvedValue({
      data: { id: 1, correo: 'bloqueado@test.com', bloqueado_hasta: futuro },
      error: null,
    });

    // 2) Lógica
    await loginUsuario(req, res);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
