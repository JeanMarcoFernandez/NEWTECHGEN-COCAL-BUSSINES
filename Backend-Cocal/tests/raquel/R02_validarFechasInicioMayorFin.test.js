import { validarFechas } from './_setup.js';

describe('R02 — validarFechas', () => {
  test('Lanza error si fecha_inicio >= fecha_fin', () => {
    // 1) Preparación
    const inicio = '2026-12-01T12:00:00Z';
    const fin = '2026-12-01T08:00:00Z';

    // 2) Lógica & Assert
    expect(() => validarFechas(inicio, fin)).toThrow(
      'La fecha de inicio debe ser menor a la fecha de fin',
    );
  });
});
