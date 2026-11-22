import { jest } from '@jest/globals';

// ─── Mocks globales ────────────────────────────────────────
export const mockCrearRecursoDB = jest.fn();
export const mockListarRecursosDB = jest.fn();
export const mockObtenerRecursoPorIdDB = jest.fn();
export const mockActualizarRecursoDB = jest.fn();
export const mockBuscarReservasSolapadasDB = jest.fn();
export const mockCrearReservaRecursoDB = jest.fn();
export const mockObtenerReservaPorIdDB = jest.fn();
export const mockActualizarReservaRecursoDB = jest.fn();
export const mockListarHistorialReservasDB = jest.fn();
export const mockListarReservasParaLiberarDB = jest.fn();

jest.unstable_mockModule('../../models/recursoModel.js', () => ({
  crearRecursoDB: mockCrearRecursoDB,
  listarRecursosDB: mockListarRecursosDB,
  obtenerRecursoPorIdDB: mockObtenerRecursoPorIdDB,
  actualizarRecursoDB: mockActualizarRecursoDB,
}));

jest.unstable_mockModule('../../models/reservaRecursoModel.js', () => ({
  buscarReservasSolapadasDB: mockBuscarReservasSolapadasDB,
  crearReservaRecursoDB: mockCrearReservaRecursoDB,
  obtenerReservaPorIdDB: mockObtenerReservaPorIdDB,
  actualizarReservaRecursoDB: mockActualizarReservaRecursoDB,
  listarHistorialReservasDB: mockListarHistorialReservasDB,
  listarReservasParaLiberarDB: mockListarReservasParaLiberarDB,
}));

// ─── Importaciones dinámicas ───────────────────────────────
export const {
  crearRecursoService,
  listarRecursosService,
  obtenerRecursoService,
  cambiarEstadoMantenimientoService,
  verificarDisponibilidadRecursoService,
} = await import('../../services/recursoService.js');

export const {
  crearReservaRecursoService,
  cancelarReservaRecursoService,
  aprobarReservaRecursoService,
  checkinReservaRecursoService,
  checkoutReservaRecursoService,
  liberarReservasNoUsadasService,
} = await import('../../services/reservaRecursoService.js');
