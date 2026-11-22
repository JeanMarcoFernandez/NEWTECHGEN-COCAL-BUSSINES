import { registrarUsuario, mockRes, mockReq, mockSupabaseFrom } from './_setup.js';
import { jest } from '@jest/globals';

describe('E02 — registrarUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Rechaza registro si la empresa no existe', async () => {
    // 1) Preparación
    const req = mockReq({
      id_empresa: 999, correo: 'nuevo@test.com', contrasena: 'Pass123', nombre: 'Nuevo',
    });
    const res = mockRes();
    mockSupabaseFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
        }),
      }),
    });

    // 2) Lógica
    await registrarUsuario(req, res);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'La empresa indicada no existe.' }),
    );
  });
});
