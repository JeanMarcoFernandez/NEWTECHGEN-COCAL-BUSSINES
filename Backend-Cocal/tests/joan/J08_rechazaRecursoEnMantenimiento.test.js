import { crearReservaRecursoService, mockObtenerRecursoPorIdDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J08 — crearReservaRecursoService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Rechaza recurso en mantenimiento', async () => {
    // 1) Preparación
    const payload = {
      id_recurso: 1, fecha_inicio: '2026-12-01T08:00:00Z',
      fecha_fin: '2026-12-01T10:00:00Z', motivo: 'Reunión',
    };
    const usuario = { id: 10, id_empresa: 1 };
    mockObtenerRecursoPorIdDB.mockResolvedValue({
      id: 1, id_empresa: 1, en_mantenimiento: true, tiempo_max_reserva: 120,
    });

    // 2) Lógica & Assert
    await expect(crearReservaRecursoService(payload, usuario)).rejects.toEqual(
      expect.objectContaining({ status: 400, message: 'El recurso está en mantenimiento.' }),
    );
  });
});
