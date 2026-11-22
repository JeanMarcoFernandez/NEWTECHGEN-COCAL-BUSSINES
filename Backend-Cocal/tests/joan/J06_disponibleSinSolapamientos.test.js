import { verificarDisponibilidadRecursoService, mockBuscarReservasSolapadasDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J06 — verificarDisponibilidadRecursoService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Retorna disponible=true sin solapamientos', async () => {
    // 1) Preparación
    mockBuscarReservasSolapadasDB.mockResolvedValue([]);

    // 2) Lógica
    const result = await verificarDisponibilidadRecursoService({
      id_recurso: 1, fecha_inicio: '2026-12-01T08:00:00Z', fecha_fin: '2026-12-01T10:00:00Z',
    });

    // 3) Assert
    expect(result.disponible).toBe(true);
    expect(result.reservas_conflictivas).toHaveLength(0);
  });
});
