import { checkoutReservaRecursoService, mockObtenerReservaPorIdDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J14 — checkoutReservaRecursoService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Rechaza check-out si reserva no está EN_USO', async () => {
    // 1) Preparación
    const usuario = { id: 10 };
    mockObtenerReservaPorIdDB.mockResolvedValue({ id: 1, id_solicitante: 10, estado: 'APROBADA' });

    // 2) Lógica & Assert
    await expect(checkoutReservaRecursoService(1, usuario)).rejects.toEqual(
      expect.objectContaining({ status: 400, message: 'Solo reservas en uso pueden hacer check-out.' }),
    );
  });
});
