import { validarPermisoGranular, mockRes, mockTienePermiso } from './_setup.js';
import { jest } from '@jest/globals';

describe('A14 — validarPermisoGranular', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Permite acceso cuando el permiso existe', async () => {
    // 1) Preparación
    const req = {
      user: { id: 1, id_empresa: 1 }, body: {}, params: {},
      originalUrl: '/api/calendarios', method: 'GET',
      ip: '127.0.0.1', headers: { 'user-agent': 'jest' },
    };
    const res = mockRes();
    const next = jest.fn();
    mockTienePermiso.mockResolvedValue(true);
    const middleware = validarPermisoGranular('GESTION_CALENDARIO', 'EMPRESA');

    // 2) Lógica
    await middleware(req, res, next);

    // 3) Assert
    expect(next).toHaveBeenCalled();
  });
});
