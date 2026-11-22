import { loginUsuario, mockRes, mockReq, getUsuarioPorCorreo } from './_setup.js';
import { jest } from '@jest/globals';

describe('E07 — loginUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Rechaza login si el usuario no existe', async () => {
    // 1) Preparación
    const req = mockReq({ correo: 'noexiste@test.com', contrasena: '123456' });
    const res = mockRes();
    getUsuarioPorCorreo.mockResolvedValue({ data: null, error: { message: 'No rows' } });

    // 2) Lógica
    await loginUsuario(req, res);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Credenciales inválidas.' }),
    );
  });
});
