import { liberarReservasNoUsadasService, mockListarReservasParaLiberarDB, mockActualizarReservaRecursoDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J15 — liberarReservasNoUsadasService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Marca candidatas como EXPIRADA', async () => {
    // 1) Preparación
    mockListarReservasParaLiberarDB.mockResolvedValue([
      { id: 100, estado: 'APROBADA' },
      { id: 101, estado: 'APROBADA' },
    ]);
    mockActualizarReservaRecursoDB.mockImplementation((id, data) =>
      Promise.resolve({ id, ...data }),
    );

    // 2) Lógica
    const result = await liberarReservasNoUsadasService(15);

    // 3) Assert
    expect(result).toHaveLength(2);
    expect(result[0].estado).toBe('EXPIRADA');
    expect(result[1].estado).toBe('EXPIRADA');
    expect(mockActualizarReservaRecursoDB).toHaveBeenCalledTimes(2);
  });
});
