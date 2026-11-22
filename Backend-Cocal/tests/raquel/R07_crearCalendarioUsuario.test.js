import { crearCalendarioUsuarioService, mockCrearCalendarioUsuarioModel } from './_setup.js';
import { jest } from '@jest/globals';

describe('R07 — crearCalendarioUsuarioService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Invoca al modelo con datos correctos', async () => {
    // 1) Preparación
    mockCrearCalendarioUsuarioModel.mockResolvedValue({
      id: 1, id_usuario: 10, nombre: 'Mi Calendario', zona_horaria: 'America/La_Paz',
    });

    // 2) Lógica
    const result = await crearCalendarioUsuarioService(10, {
      nombre: 'Mi Calendario', zona_horaria: 'America/La_Paz',
    });

    // 3) Assert
    expect(mockCrearCalendarioUsuarioModel).toHaveBeenCalledWith({
      id_usuario: 10, nombre: 'Mi Calendario', zona_horaria: 'America/La_Paz',
    });
    expect(result.id_usuario).toBe(10);
  });
});
