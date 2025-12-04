// services/calendarioCommon.js

export const VISIBILIDADES_VALIDAS = ['PRIVADO', 'INTERNO', 'PUBLICO'];

export function validarFechas(fecha_inicio, fecha_fin) {
  if (!fecha_inicio || !fecha_fin) return;
  const ini = new Date(fecha_inicio).getTime();
  const fin = new Date(fecha_fin).getTime();

  if (Number.isNaN(ini) || Number.isNaN(fin)) {
    throw new Error('Fechas inválidas');
  }
  if (ini >= fin) {
    throw new Error('La fecha de inicio debe ser menor a la fecha de fin');
  }
}

export function validarVisibilidad(visibilidad) {
  if (visibilidad && !VISIBILIDADES_VALIDAS.includes(visibilidad)) {
    throw new Error(`Visibilidad inválida. Permitidos: ${VISIBILIDADES_VALIDAS.join(', ')}`);
  }
}
