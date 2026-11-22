import { getUserAgent } from './_setup.js';
import { jest } from '@jest/globals';

describe('A10 — getUserAgent', () => {
  test('Retorna user-agent del header', () => {
    // 1) Preparación
    const req = { get: jest.fn().mockReturnValue('Mozilla/5.0 Chrome') };

    // 2) Lógica
    const ua = getUserAgent(req);

    // 3) Assert
    expect(ua).toBe('Mozilla/5.0 Chrome');
  });
});
