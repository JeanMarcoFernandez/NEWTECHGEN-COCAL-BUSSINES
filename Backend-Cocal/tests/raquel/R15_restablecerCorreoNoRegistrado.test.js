import { mockRes, supabase } from './_setup.js';
import { jest } from '@jest/globals';

describe('R15 — solicitarRestablecimiento', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Retorna 404 si correo no está registrado', async () => {
    // 1) Preparación
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    });
    const { solicitarRestablecimiento } =
      await import('../../controllers/restablecerContrasenaController.js');

    const req = { body: { correo: 'noexiste@test.com' } };
    const res = mockRes();

    // 2) Lógica
    await solicitarRestablecimiento(req, res);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'El correo no está registrado.' }),
    );
  });
});
