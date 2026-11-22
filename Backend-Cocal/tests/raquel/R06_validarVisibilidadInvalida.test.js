import { validarVisibilidad } from './_setup.js';

describe('R06 — validarVisibilidad', () => {
  test('Lanza error con valor de visibilidad no permitido', () => {
    // 1) Preparación
    const valorInvalido = 'SECRETO';

    // 2) Lógica & Assert
    expect(() => validarVisibilidad(valorInvalido)).toThrow('Visibilidad inválida');
  });
});
