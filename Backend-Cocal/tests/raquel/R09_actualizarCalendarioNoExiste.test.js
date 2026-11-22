import { actualizarCalendarioUsuarioService, mockObtenerCalendarioPorId } from './_setup.js';
import { jest } from '@jest/globals';

describe('R09 — actualizarCalendarioUsuarioService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Lanza error si calendario no existe', async () => {
    // 1) Preparación
    mockObtenerCalendarioPorId.mockResolvedValue(null);

    // 2) Lógica & Assert
    await expect(
      actualizarCalendarioUsuarioService(10, 999, { nombre: 'Nuevo' }),
    ).rejects.toThrow('Calendario no encontrado');
  });
});
