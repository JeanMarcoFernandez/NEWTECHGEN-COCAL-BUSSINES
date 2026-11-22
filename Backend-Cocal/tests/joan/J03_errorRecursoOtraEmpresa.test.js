import { obtenerRecursoService, mockObtenerRecursoPorIdDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J03 — obtenerRecursoService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Lanza error si recurso es de otra empresa', async () => {
    // 1) Preparación
    const usuario = { id_empresa: 1 };
    mockObtenerRecursoPorIdDB.mockResolvedValue({ id: 10, id_empresa: 999 });

    // 2) Lógica & Assert
    await expect(obtenerRecursoService(10, usuario)).rejects.toEqual(
      expect.objectContaining({ status: 404, message: 'Recurso no encontrado en tu empresa.' }),
    );
  });
});
