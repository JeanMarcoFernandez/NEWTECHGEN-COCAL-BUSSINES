import { listarRecursosService, mockListarRecursosDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J02 — listarRecursosService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Aplica filtros y empresa del token', async () => {
    // 1) Preparación
    const filtros = { tipo: 'SALA' };
    const usuario = { id_empresa: 3 };
    mockListarRecursosDB.mockResolvedValue([{ id: 1, tipo: 'SALA', id_empresa: 3 }]);

    // 2) Lógica
    const result = await listarRecursosService(filtros, usuario);

    // 3) Assert
    expect(mockListarRecursosDB).toHaveBeenCalledWith(
      expect.objectContaining({ tipo: 'SALA', id_empresa: 3 }),
    );
    expect(result).toHaveLength(1);
  });
});
