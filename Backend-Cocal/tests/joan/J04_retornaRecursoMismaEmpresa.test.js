import { obtenerRecursoService, mockObtenerRecursoPorIdDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J04 — obtenerRecursoService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Retorna recurso si pertenece a la empresa', async () => {
    // 1) Preparación
    const usuario = { id_empresa: 2 };
    const recurso = { id: 5, nombre: 'Proyector', id_empresa: 2 };
    mockObtenerRecursoPorIdDB.mockResolvedValue(recurso);

    // 2) Lógica
    const result = await obtenerRecursoService(5, usuario);

    // 3) Assert
    expect(result).toEqual(recurso);
  });
});
