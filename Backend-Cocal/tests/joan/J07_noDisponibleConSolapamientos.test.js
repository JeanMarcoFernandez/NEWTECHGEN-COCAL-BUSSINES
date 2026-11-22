import { verificarDisponibilidadRecursoService, mockBuscarReservasSolapadasDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J07 — verificarDisponibilidadRecursoService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Retorna disponible=false con solapamientos', async () => {
    // 1) Preparación
    mockBuscarReservasSolapadasDB.mockResolvedValue([{ id: 100, estado: 'APROBADA' }]);

    // 2) Lógica
    const result = await verificarDisponibilidadRecursoService({
      id_recurso: 1, fecha_inicio: '2026-12-01T08:00:00Z', fecha_fin: '2026-12-01T10:00:00Z',
    });

    // 3) Assert
    expect(result.disponible).toBe(false);
    expect(result.reservas_conflictivas).toHaveLength(1);
  });
});
