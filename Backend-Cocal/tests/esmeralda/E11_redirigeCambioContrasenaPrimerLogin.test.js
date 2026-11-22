import { loginUsuario, mockRes, mockReq, getUsuarioPorCorreo, bcrypt, resetearIntentos } from './_setup.js';
import { jest } from '@jest/globals';

describe('E11 — loginUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Redirige a cambiar contraseña en primer login', async () => {
    // 1) Preparación
    const req = mockReq({ correo: 'primero@test.com', contrasena: 'Pass123' });
    const res = mockRes();
    getUsuarioPorCorreo.mockResolvedValue({
      data: {
        id: 4, correo: 'primero@test.com', contrasena: '$2b$10$hash',
        bloqueado_hasta: null, intentos_fallidos: 0,
        primer_login: true, creado_por: 1,
      },
      error: null,
    });
    bcrypt.compare.mockResolvedValue(true);
    resetearIntentos.mockResolvedValue({});

    // 2) Lógica
    await loginUsuario(req, res);

    // 3) Assert
    expect(resetearIntentos).toHaveBeenCalledWith(4);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ requerirCambio: true }),
    );
  });
});
