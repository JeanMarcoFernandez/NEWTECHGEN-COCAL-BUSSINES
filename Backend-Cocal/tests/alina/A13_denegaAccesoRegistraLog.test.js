import { validarPermisoGranular, mockRes, mockTienePermiso, registrarLogSeguridadDB } from './_setup.js';
import { jest } from '@jest/globals';

describe('A13 — validarPermisoGranular', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Deniega acceso y registra log cuando falta permiso', async () => {
    // 1) Preparación
    const req = {
      user: { id: 1, id_empresa: 1 }, body: {}, params: {},
      originalUrl: '/api/calendarios', method: 'POST',
      ip: '127.0.0.1', headers: { 'user-agent': 'jest' },
    };
    const res = mockRes();
    const next = jest.fn();
    mockTienePermiso.mockResolvedValue(false);
    registrarLogSeguridadDB.mockResolvedValue({});
    const middleware = validarPermisoGranular('GESTION_CALENDARIO', 'EMPRESA');

    // 2) Lógica
    await middleware(req, res, next);

    // 3) Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(registrarLogSeguridadDB).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
