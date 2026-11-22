import { validarFechas } from './_setup.js';

describe('R04 — validarFechas', () => {
  test('No lanza error si ambas fechas son nulas', () => {
    // 1) Preparación — ninguna fecha proporcionada

    // 2) Lógica & Assert
    expect(() => validarFechas(null, null)).not.toThrow();
  });
});
