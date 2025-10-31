export function getClientIp(req) {
    
  const xfwd = req.headers['x-forwarded-for'];
  if (xfwd && typeof xfwd === 'string') {
    return xfwd.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || '0.0.0.0';
}

export function getUserAgent(req) {
  return req.get('user-agent') || 'unknown';
}
