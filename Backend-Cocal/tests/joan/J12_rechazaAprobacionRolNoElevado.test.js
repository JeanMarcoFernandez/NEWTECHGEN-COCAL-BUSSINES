import { aprobarReservaRecursoService } from './_setup.js';

describe('J12 — aprobarReservaRecursoService', () => {
  test('Rechaza aprobación si rol no es elevado', async () => {
    // 1) Preparación
    const usuario = { id: 5, rol: 'EMPLEADO' };

    // 2) Lógica & Assert
    await expect(
      aprobarReservaRecursoService(1, usuario, { aprobar: true }),
    ).rejects.toEqual(expect.objectContaining({ status: 403 }));
  });
});
