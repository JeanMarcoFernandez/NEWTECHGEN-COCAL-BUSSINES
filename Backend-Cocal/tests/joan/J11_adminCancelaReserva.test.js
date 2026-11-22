import { cancelarReservaRecursoService, mockObtenerReservaPorIdDB, mockActualizarReservaRecursoDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J11 — cancelarReservaRecursoService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('ADMIN puede cancelar cualquier reserva', async () => {
    // 1) Preparación
    const usuario = { id: 20, rol: 'ADMIN' };
    mockObtenerReservaPorIdDB.mockResolvedValue({ id: 1, id_solicitante: 10, estado: 'APROBADA' });
    mockActualizarReservaRecursoDB.mockResolvedValue({ id: 1, estado: 'CANCELADA' });

    // 2) Lógica
    const result = await cancelarReservaRecursoService(1, usuario);

    // 3) Assert
    expect(result.estado).toBe('CANCELADA');
  });
});
