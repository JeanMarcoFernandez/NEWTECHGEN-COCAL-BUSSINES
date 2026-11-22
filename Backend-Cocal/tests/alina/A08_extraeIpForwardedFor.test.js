import { getClientIp } from './_setup.js';

describe('A08 — getClientIp', () => {
  test('Extrae IP de x-forwarded-for', () => {
    // 1) Preparación
    const req = { headers: { 'x-forwarded-for': '192.168.1.100, 10.0.0.1' }, ip: '10.0.0.1' };

    // 2) Lógica
    const ip = getClientIp(req);

    // 3) Assert
    expect(ip).toBe('192.168.1.100');
  });
});
