import { crearEventoUsuarioService, mockObtenerCalendarioPorId, mockCrearEventoModel } from './_setup.js';
import { jest } from '@jest/globals';

describe('R14 — crearEventoUsuarioService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Crea evento con datos válidos', async () => {
    // 1) Preparación
    mockObtenerCalendarioPorId.mockResolvedValue({ id: 1, id_usuario: 10 });
    mockCrearEventoModel.mockResolvedValue({
      id: 50, id_calendario: 1, titulo: 'Sprint Review',
    });

    // 2) Lógica
    const result = await crearEventoUsuarioService(10, 1, {
      titulo: 'Sprint Review', descripcion: 'Demo del sprint 5',
      tipo: 'REUNION', fecha_inicio: '2026-12-10T14:00:00Z', fecha_fin: '2026-12-10T15:00:00Z',
    });

    // 3) Assert
    expect(result.titulo).toBe('Sprint Review');
    expect(mockCrearEventoModel).toHaveBeenCalledWith(
      expect.objectContaining({ id_calendario: 1, titulo: 'Sprint Review' }),
    );
  });
});
