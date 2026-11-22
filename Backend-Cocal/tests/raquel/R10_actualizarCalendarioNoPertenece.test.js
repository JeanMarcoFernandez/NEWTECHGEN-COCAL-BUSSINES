import { actualizarCalendarioUsuarioService, mockObtenerCalendarioPorId } from './_setup.js';
import { jest } from '@jest/globals';

describe('R10 — actualizarCalendarioUsuarioService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Lanza error si calendario no pertenece al usuario', async () => {
    // 1) Preparación
    mockObtenerCalendarioPorId.mockResolvedValue({ id: 5, id_usuario: 99 });

    // 2) Lógica & Assert
    await expect(
      actualizarCalendarioUsuarioService(10, 5, { nombre: 'Nuevo' }),
    ).rejects.toThrow('No tienes permiso sobre este calendario');
  });
});
