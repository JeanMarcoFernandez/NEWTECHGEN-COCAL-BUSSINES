import { cancelarReservaRecursoService, mockObtenerReservaPorIdDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J10 — cancelarReservaRecursoService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Rechaza cancelación si no es solicitante ni rol elevado', async () => {
    // 1) Preparación
    const usuario = { id: 999, rol: 'EMPLEADO' };
    mockObtenerReservaPorIdDB.mockResolvedValue({
      id: 1, id_solicitante: 10, estado: 'PENDIENTE_APROBACION',
    });

    // 2) Lógica & Assert
    await expect(cancelarReservaRecursoService(1, usuario)).rejects.toEqual(
      expect.objectContaining({ status: 403, message: 'No tienes permisos para cancelar esta reserva.' }),
    );
  });
});
