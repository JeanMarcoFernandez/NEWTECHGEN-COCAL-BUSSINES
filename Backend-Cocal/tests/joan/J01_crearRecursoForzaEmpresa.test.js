import { crearRecursoService, mockCrearRecursoDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J01 — crearRecursoService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Crea recurso forzando id_empresa del token', async () => {
    // 1) Preparación
    const payload = { nombre: 'Sala A', tipo: 'SALA', capacidad: 10 };
    const usuario = { id_empresa: 5 };
    mockCrearRecursoDB.mockResolvedValue({ id: 1, ...payload, id_empresa: 5 });

    // 2) Lógica
    const result = await crearRecursoService(payload, usuario);

    // 3) Assert
    expect(mockCrearRecursoDB).toHaveBeenCalledWith(expect.objectContaining({ id_empresa: 5 }));
    expect(result.id_empresa).toBe(5);
  });
});
