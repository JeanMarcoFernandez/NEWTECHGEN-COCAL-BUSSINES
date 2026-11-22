import { loginUsuario, mockRes, mockReq, getUsuarioPorCorreo } from './_setup.js';
import { jest } from '@jest/globals';

describe('E15 — loginUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Retorna 500 si ocurre un error inesperado', async () => {
    // 1) Preparación
    const req = mockReq({ correo: 'crash@test.com', contrasena: 'Pass123' });
    const res = mockRes();
    getUsuarioPorCorreo.mockRejectedValue(new Error('DB connection lost'));

    // 2) Lógica
    await loginUsuario(req, res);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Error al iniciar sesión' }),
    );
  });
});
