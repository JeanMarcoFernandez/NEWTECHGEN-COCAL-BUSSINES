import { loginUsuario, mockRes, mockReq } from './_setup.js';

describe('E06 — loginUsuario', () => {
  test('Rechaza login si falta correo o contraseña', async () => {
    // 1) Preparación
    const req = mockReq({ correo: '' });
    const res = mockRes();

    // 2) Lógica
    await loginUsuario(req, res);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Correo y contraseña son requeridos.' }),
    );
  });
});
