import { loginUsuario, mockRes, mockReq, getUsuarioPorCorreo, bcrypt, resetearIntentos, enviarCodigo2FA } from './_setup.js';
import { jest } from '@jest/globals';

describe('E13 — loginUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Login exitoso retorna correo, usuario_id y nombre', async () => {
    // 1) Preparación
    const req = mockReq({ correo: 'full@test.com', contrasena: 'Pass123' });
    const res = mockRes();
    getUsuarioPorCorreo.mockResolvedValue({
      data: {
        id: 6, correo: 'full@test.com', nombre: 'Full', contrasena: '$2b$10$hash',
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
    const responseBody = res.json.mock.calls[0][0];
    expect(responseBody).toHaveProperty('correo', 'full@test.com');
    expect(responseBody).toHaveProperty('usuario_id', 6);
    expect(responseBody).toHaveProperty('nombre', 'Full');
  });
});
