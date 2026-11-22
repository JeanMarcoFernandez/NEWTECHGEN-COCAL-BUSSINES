import { listarCalendariosUsuarioService, mockObtenerCalendariosDeUsuario } from './_setup.js';
import { jest } from '@jest/globals';

describe('R08 — listarCalendariosUsuarioService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Retorna calendarios del usuario', async () => {
    // 1) Preparación
    const calendarios = [
      { id: 1, id_usuario: 5, nombre: 'Trabajo' },
      { id: 2, id_usuario: 5, nombre: 'Personal' },
    ];
    mockObtenerCalendariosDeUsuario.mockResolvedValue(calendarios);

    // 2) Lógica
    const result = await listarCalendariosUsuarioService(5);

    // 3) Assert
    expect(result).toHaveLength(2);
    expect(result[0].nombre).toBe('Trabajo');
  });
});
