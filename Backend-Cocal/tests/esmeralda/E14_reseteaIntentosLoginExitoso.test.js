import { loginUsuario, mockRes, mockReq, getUsuarioPorCorreo, bcrypt, resetearIntentos, enviarCodigo2FA } from './_setup.js';
import { jest } from '@jest/globals';

describe('E14 — loginUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Resetea los intentos fallidos tras login exitoso', async () => {
    // 1) Preparación
    const req = mockReq({ correo: 'reset@test.com', contrasena: 'Pass123' });
    const res = mockRes();
    getUsuarioPorCorreo.mockResolvedValue({
      data: {
        id: 7, correo: 'reset@test.com', nombre: 'Reset', contrasena: '$2b$10$hash',
        bloqueado_hasta: null, intentos_fallidos: 3,
        primer_login: false, creado_por: null,
      },
      error: null,
    });
    bcrypt.compare.mockResolvedValue(true);
    resetearIntentos.mockResolvedValue({});
    enviarCodigo2FA.mockResolvedValue(true);

    // 2) Lógica
    await loginUsuario(req, res);

    // 3) Assert
    expect(resetearIntentos).toHaveBeenCalledWith(7);
  });
});
