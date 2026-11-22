import { crearReservaRecursoService, mockObtenerRecursoPorIdDB, mockBuscarReservasSolapadasDB, mockCrearReservaRecursoDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J09 — crearReservaRecursoService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Ajusta fecha_fin si excede tiempo_max_reserva', async () => {
    // 1) Preparación
    const payload = {
      id_recurso: 2, fecha_inicio: '2026-12-01T08:00:00Z',
      fecha_fin: '2026-12-01T14:00:00Z', motivo: 'Presentación',
    };
    const usuario = { id: 10, id_empresa: 1 };
    mockObtenerRecursoPorIdDB.mockResolvedValue({
      id: 2, id_empresa: 1, en_mantenimiento: false, tiempo_max_reserva: 120, tipo: 'SALA',
    });
    mockBuscarReservasSolapadasDB.mockResolvedValue([]);
    mockCrearReservaRecursoDB.mockResolvedValue({ id: 50, estado: 'PENDIENTE_APROBACION' });

    // 2) Lógica
    const result = await crearReservaRecursoService(payload, usuario);

    // 3) Assert
    expect(result.fueAjustadoPorMaximo).toBe(true);
  });
});
