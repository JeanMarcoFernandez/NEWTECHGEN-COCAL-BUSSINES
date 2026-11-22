import { cambiarContrasenaPrimerLogin, mockRes, supabase } from './_setup.js';
import { jest } from '@jest/globals';

describe('A15 — cambiarContrasenaPrimerLogin', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Rechaza cambio si el usuario no está en primer_login', async () => {
    // 1) Preparación
    const req = { body: { correo: 'normal@test.com', nuevaContrasena: 'NewPass123' } };
    const res = mockRes();
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 1, primer_login: false, correo: 'normal@test.com' },
            error: null,
          }),
        }),
      }),
    });

    // 2) Lógica
    await cambiarContrasenaPrimerLogin(req, res);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Este usuario ya actualizó su contraseña.' }),
    );
  });
});
