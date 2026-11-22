import { crearEventoUsuarioService, mockObtenerCalendarioPorId } from './_setup.js';
import { jest } from '@jest/globals';

describe('R13 — crearEventoUsuarioService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Lanza error con fechas inválidas (fin antes que inicio)', async () => {
    // 1) Preparación
    mockObtenerCalendarioPorId.mockResolvedValue({ id: 1, id_usuario: 10 });

    // 2) Lógica & Assert
    await expect(
      crearEventoUsuarioService(10, 1, {
        titulo: 'Reunión',
        fecha_inicio: '2026-12-05T14:00:00Z',
        fecha_fin: '2026-12-05T10:00:00Z',
      }),
    ).rejects.toThrow('La fecha de inicio debe ser menor a la fecha de fin');
  });
});
