import { validarFechas } from './_setup.js';

describe('R01 — validarFechas', () => {
  test('Acepta un rango de fechas válido sin lanzar error', () => {
    // 1) Preparación
    const inicio = '2026-12-01T08:00:00Z';
    const fin = '2026-12-01T10:00:00Z';

    // 2) Lógica & Assert
    expect(() => validarFechas(inicio, fin)).not.toThrow();
  });
});
