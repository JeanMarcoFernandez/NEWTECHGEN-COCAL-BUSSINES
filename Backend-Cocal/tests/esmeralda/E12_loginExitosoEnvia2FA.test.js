import { loginUsuario, mockRes, mockReq, getUsuarioPorCorreo, bcrypt, resetearIntentos, enviarCodigo2FA } from './_setup.js';
import { jest } from '@jest/globals';

describe('E12 — loginUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Login exitoso envía código 2FA', async () => {
    // 1) Preparación
    const req = mockReq({ correo: 'valido@test.com', contrasena: 'Pass123' });
    const res = mockRes();
    getUsuarioPorCorreo.mockResolvedValue({
      data: {
        id: 5, correo: 'valido@test.com', nombre: 'Válido', contrasena: '$2b$10$hash',
        bloqueado_hasta: null, intentos_fallidos: 0,
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
    expect(enviarCodigo2FA).toHaveBeenCalledWith(5, 'valido@test.com', 'Válido');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ requiere2FA: true }),
    );
  });
});
