export function getClientIp(req) {
  const xfwd = req.headers['x-forwarded-for'];
  if (xfwd && typeof xfwd === 'string') {
    return xfwd.split(',')[0].trim();
  }

  // Normalizar IPv6 localhost (::1) a IPv4 (127.0.0.1)
  const ip = req.ip || req.connection?.remoteAddress || '0.0.0.0';
  if (ip.includes('::1')) return '127.0.0.1';
  return ip.replace('::ffff:', '');
}

export function getUserAgent(req) {
  return req.get('user-agent') || 'unknown';
}
