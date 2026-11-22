import { registrarUsuario, mockRes, mockReq, mockSupabaseFrom, bcrypt } from './_setup.js';
import { jest } from '@jest/globals';

describe('E04 — registrarUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Registra usuario exitosamente con hash de contraseña', async () => {
    // 1) Preparación
    const req = mockReq({
      id_empresa: 1, correo: 'nuevo@test.com', contrasena: 'SecurePass1', nombre: 'Nuevo',
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
      return { insert: jest.fn().mockResolvedValue({ error: null }) };
    });
    bcrypt.hash.mockResolvedValue('$2b$10$hashedValue');

    // 2) Lógica
    await registrarUsuario(req, res);

    // 3) Assert
    expect(bcrypt.hash).toHaveBeenCalledWith('SecurePass1', 10);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Usuario registrado correctamente' }),
    );
  });
});
