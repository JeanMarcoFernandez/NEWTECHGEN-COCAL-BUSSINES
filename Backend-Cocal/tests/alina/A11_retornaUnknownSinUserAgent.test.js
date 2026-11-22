import { getUserAgent } from './_setup.js';
import { jest } from '@jest/globals';

describe('A11 — getUserAgent', () => {
  test('Retorna "unknown" si no hay header user-agent', () => {
    // 1) Preparación
    const req = { get: jest.fn().mockReturnValue(undefined) };

    // 2) Lógica
    const ua = getUserAgent(req);

    // 3) Assert
    expect(ua).toBe('unknown');
  });
});
