import { getClientIp } from './_setup.js';

describe('A09 — getClientIp', () => {
  test('Normaliza IPv6 localhost (::1) a 127.0.0.1', () => {
    // 1) Preparación
    const req = { headers: {}, ip: '::1' };

    // 2) Lógica
    const ip = getClientIp(req);

    // 3) Assert
    expect(ip).toBe('127.0.0.1');
  });
});
