import { jest } from '@jest/globals';

// ─── Mocks globales ────────────────────────────────────────
export const mockCrearCalendarioUsuarioModel = jest.fn();
export const mockObtenerCalendariosDeUsuario = jest.fn();
export const mockObtenerCalendarioPorId = jest.fn();
export const mockActualizarCalendarioModelBase = jest.fn();
export const mockEliminarCalendarioModel = jest.fn();

jest.unstable_mockModule('../../models/calendarioModel.js', () => ({
  crearCalendarioUsuarioModel: mockCrearCalendarioUsuarioModel,
  obtenerCalendariosDeUsuario: mockObtenerCalendariosDeUsuario,
  obtenerCalendarioPorId: mockObtenerCalendarioPorId,
  actualizarCalendarioModelBase: mockActualizarCalendarioModelBase,
  eliminarCalendarioModel: mockEliminarCalendarioModel,
}));

export const mockCrearEventoModel = jest.fn();
export const mockObtenerEventosPorCalendario = jest.fn();
export const mockObtenerEventoPorId = jest.fn();
export const mockActualizarEventoModelBase = jest.fn();
export const mockEliminarEventoModel = jest.fn();

jest.unstable_mockModule('../../models/eventoModel.js', () => ({
  crearEventoModel: mockCrearEventoModel,
  obtenerEventosPorCalendario: mockObtenerEventosPorCalendario,
  obtenerEventoPorId: mockObtenerEventoPorId,
  actualizarEventoModelBase: mockActualizarEventoModelBase,
  eliminarEventoModel: mockEliminarEventoModel,
}));

jest.unstable_mockModule('../../models/participacionEventoModel.js', () => ({
  agregarParticipanteEventoModel: jest.fn(),
  agregarParticipantesEventoLoteModel: jest.fn(),
  actualizarEstadoParticipacionModel: jest.fn(),
}));

jest.unstable_mockModule('../../services/usuarioService.js', () => ({
  verificarUsuarioExiste: jest.fn(),
  obtenerUsuarioPorId: jest.fn(),
}));

jest.unstable_mockModule('../../db.js', () => ({
  supabase: { from: jest.fn() },
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: { hash: jest.fn(), genSalt: jest.fn() },
}));

jest.unstable_mockModule('../../services/emailService.js', () => ({
  sendEmail: jest.fn(),
}));

// ─── Importaciones dinámicas ───────────────────────────────
export const {
  crearCalendarioUsuarioService,
  listarCalendariosUsuarioService,
  actualizarCalendarioUsuarioService,
  eliminarCalendarioUsuarioService,
  crearEventoUsuarioService,
} = await import('../../services/calendarioUsuarioService.js');

export const { validarFechas, validarVisibilidad, VISIBILIDADES_VALIDAS } =
  await import('../../services/calendarioCommon.js');

export const { supabase } = await import('../../db.js');

// ─── Helpers ───────────────────────────────────────────────
export function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}
