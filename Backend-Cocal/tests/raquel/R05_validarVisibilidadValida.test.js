import { validarVisibilidad } from './_setup.js';

describe('R05 — validarVisibilidad', () => {
  test('Acepta valores válidos (PRIVADO, INTERNO, PUBLICO)', () => {
    // 1) Preparación
    const valores = ['PRIVADO', 'INTERNO', 'PUBLICO'];

    // 2) Lógica & Assert
    for (const v of valores) {
      expect(() => validarVisibilidad(v)).not.toThrow();
    }
  });
});
