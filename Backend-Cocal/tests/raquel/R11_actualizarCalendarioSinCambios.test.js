import { actualizarCalendarioUsuarioService, mockObtenerCalendarioPorId, mockActualizarCalendarioModelBase } from './_setup.js';
import { jest } from '@jest/globals';

describe('R11 — actualizarCalendarioUsuarioService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Retorna calendario original si no hay cambios', async () => {
    // 1) Preparación
    const calOriginal = { id: 3, id_usuario: 10, nombre: 'Original', zona_horaria: 'UTC' };
    mockObtenerCalendarioPorId.mockResolvedValue(calOriginal);

    // 2) Lógica
    const result = await actualizarCalendarioUsuarioService(10, 3, {});

    // 3) Assert
    expect(result).toEqual(calOriginal);
    expect(mockActualizarCalendarioModelBase).not.toHaveBeenCalled();
  });
});
