import { eliminarCalendarioUsuarioService, mockObtenerCalendarioPorId, mockEliminarCalendarioModel } from './_setup.js';
import { jest } from '@jest/globals';

describe('R12 — eliminarCalendarioUsuarioService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Elimina calendario propio correctamente', async () => {
    // 1) Preparación
    mockObtenerCalendarioPorId.mockResolvedValue({ id: 7, id_usuario: 10 });
    mockEliminarCalendarioModel.mockResolvedValue(true);

    // 2) Lógica
    await eliminarCalendarioUsuarioService(10, 7);

    // 3) Assert
    expect(mockEliminarCalendarioModel).toHaveBeenCalledWith(7);
  });
});
