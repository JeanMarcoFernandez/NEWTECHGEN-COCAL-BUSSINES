import { registrarUsuario, mockRes, mockReq, mockSupabaseFrom, bcrypt } from './_setup.js';
import { jest } from '@jest/globals';

describe('E05 — registrarUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Retorna 500 si Supabase lanza error en insert', async () => {
    // 1) Preparación
    const req = mockReq({
      id_empresa: 1, correo: 'error@test.com', contrasena: 'Pass123', nombre: 'Error',
    });
    const res = mockRes();
    let callCount = 0;
    mockSupabaseFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }) }) }) };
      }
      if (callCount === 2) {
        return { select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: null, error: null }) }) }) };
      }
      return { insert: jest.fn().mockResolvedValue({ error: new Error('DB crash') }) };
    });
    bcrypt.hash.mockResolvedValue('$2b$10$hashed');

    // 2) Lógica
    await registrarUsuario(req, res);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
