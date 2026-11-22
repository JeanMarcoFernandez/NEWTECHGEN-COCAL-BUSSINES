import { registrarUsuario, mockRes, mockReq, mockSupabaseFrom } from './_setup.js';
import { jest } from '@jest/globals';

describe('E03 — registrarUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Rechaza registro si el correo ya está registrado', async () => {
    // 1) Preparación
    const req = mockReq({
      id_empresa: 1, correo: 'existe@test.com', contrasena: 'Pass123', nombre: 'Duplicado',
    });
    const res = mockRes();
    let callCount = 0;
    mockSupabaseFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
            }),
          }),
        };
      }
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { id: 5 }, error: null }),
          }),
        }),
      };
    });

    // 2) Lógica
    await registrarUsuario(req, res);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'El correo ya está registrado.' }),
    );
  });
});
