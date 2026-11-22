import { registrarUsuario, mockRes, mockReq } from './_setup.js';

describe('E01 — registrarUsuario', () => {
  test('Rechaza registro si faltan campos obligatorios', async () => {
    // 1) Preparación
    const req = mockReq({ correo: 'test@test.com' }); // falta id_empresa, contrasena, nombre
    const res = mockRes();

    // 2) Lógica
    await registrarUsuario(req, res);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'id_empresa, correo, contrasena y nombre son obligatorios.',
      }),
    );
  });
});
