import { validarFechas } from './_setup.js';

describe('R03 — validarFechas', () => {
  test('Lanza error con fechas inválidas (NaN)', () => {
    // 1) Preparación
    const inicio = 'no-es-fecha';
    const fin = 'tampoco';

    // 2) Lógica & Assert
    expect(() => validarFechas(inicio, fin)).toThrow('Fechas inválidas');
  });
});
