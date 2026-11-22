import { checkinReservaRecursoService, mockObtenerReservaPorIdDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J13 — checkinReservaRecursoService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Rechaza check-in si no es el solicitante', async () => {
    // 1) Preparación
    const usuario = { id: 999 };
    mockObtenerReservaPorIdDB.mockResolvedValue({ id: 1, id_solicitante: 10, estado: 'APROBADA' });

    // 2) Lógica & Assert
    await expect(checkinReservaRecursoService(1, usuario)).rejects.toEqual(
      expect.objectContaining({ status: 403, message: 'Solo el solicitante puede hacer check-in.' }),
    );
  });
});
