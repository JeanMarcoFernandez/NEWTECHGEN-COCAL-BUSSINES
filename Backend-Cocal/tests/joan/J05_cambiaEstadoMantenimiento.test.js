import { cambiarEstadoMantenimientoService, mockObtenerRecursoPorIdDB, mockActualizarRecursoDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('J05 — cambiarEstadoMantenimientoService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Actualiza el campo en_mantenimiento correctamente', async () => {
    // 1) Preparación
    const usuario = { id_empresa: 1 };
    mockObtenerRecursoPorIdDB.mockResolvedValue({ id: 3, id_empresa: 1, en_mantenimiento: false });
    mockActualizarRecursoDB.mockResolvedValue({ id: 3, en_mantenimiento: true });

    // 2) Lógica
    const result = await cambiarEstadoMantenimientoService(3, true, usuario);

    // 3) Assert
    expect(mockActualizarRecursoDB).toHaveBeenCalledWith(3, { en_mantenimiento: true });
    expect(result.en_mantenimiento).toBe(true);
  });
});
