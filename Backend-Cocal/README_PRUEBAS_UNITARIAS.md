# Pruebas Unitarias (TDD) — Backend Cocal Business

Repositorio de pruebas unitarias desarrolladas con **JavaScript (Node.js)** y el framework **Jest** para el backend del sistema **Cocal Business**, aplicando la metodología **Test-Driven Development (TDD)**.

## 1. Lenguaje de Programación

| Lenguaje | Versión | Uso |
| :--- | :--- | :--- |
| **JavaScript (ES Modules)** | Node.js 18+ | Backend API REST con Express.js v5 |

El backend de Cocal Business está desarrollado íntegramente en **JavaScript** utilizando **ECMAScript Modules (ESM)** con la directiva `"type": "module"` en `package.json`. Las principales tecnologías y librerías del stack son:

- **Express.js 5** — Framework web para la API REST
- **Supabase Client** — Conexión a la base de datos PostgreSQL
- **bcrypt** — Cifrado y comparación de contraseñas
- **jsonwebtoken (JWT)** — Autenticación basada en tokens
- **Joi** — Validación de esquemas de datos
- **Nodemailer** — Envío de correos electrónicos (2FA, recuperación de contraseña)

---

## 2. Archivos y Funciones Identificados para Pruebas Unitarias

### 🔐 Módulo de Autenticación (`controllers/authController.js`)
| Función | Descripción |
| :--- | :--- |
| `registrarUsuario(req, res)` | Registra un nuevo usuario validando empresa existente, correo único y hasheando la contraseña con bcrypt |
| `loginUsuario(req, res)` | Inicia sesión validando credenciales, gestionando intentos fallidos, bloqueo de cuenta y envío de código 2FA |

### 🛡️ Middleware de Seguridad
| Archivo | Función | Descripción |
| :--- | :--- | :--- |
| `middleware/verificarToken.js` | `verificarToken(req, res, next)` | Valida el JWT del header Authorization, verifica expiración y controla inactividad (120 min) |
| `middleware/validarRol.js` | `validarRol(...rolesPermitidos)` | Middleware factory que restringe acceso según el rol del usuario (ADMIN, SUPERVISOR, EMPLEADO, etc.) |
| `middleware/validarPermisoGranular.js` | `validarPermisoGranular(clave, ambito)` | Middleware de permisos granulares que verifica permisos específicos por ámbito (EMPRESA, DEPARTAMENTO, PROYECTO) y registra logs de seguridad |

### 🔑 Gestión de Contraseñas
| Archivo | Función | Descripción |
| :--- | :--- | :--- |
| `controllers/cambiarContrasenaController.js` | `cambiarContrasenaPrimerLogin(req, res)` | Permite al usuario cambiar su contraseña temporal en su primer inicio de sesión |
| `controllers/restablecerContrasenaController.js` | `solicitarRestablecimiento(req, res)` | Genera un token de recuperación y envía correo con enlace de restablecimiento |
| `controllers/restablecerContrasenaController.js` | `restablecerContrasena(req, res)` | Restablece la contraseña mediante un token válido y no expirado |

### 🏢 Gestión de Recursos y Reservas
| Archivo | Función | Descripción |
| :--- | :--- | :--- |
| `services/recursoService.js` | `crearRecursoService()` | Crea un recurso forzando la empresa del token JWT |
| `services/recursoService.js` | `listarRecursosService()` | Lista recursos con filtros y validación de empresa |
| `services/recursoService.js` | `obtenerRecursoService()` | Obtiene un recurso validando que pertenezca a la empresa del usuario |
| `services/recursoService.js` | `cambiarEstadoMantenimientoService()` | Marca o desmarca un recurso como en mantenimiento |
| `services/recursoService.js` | `verificarDisponibilidadRecursoService()` | Verifica si un recurso está disponible en un rango de fechas |
| `services/reservaRecursoService.js` | `crearReservaRecursoService()` | Crea reserva validando recurso, duración máxima y conflictos |
| `services/reservaRecursoService.js` | `cancelarReservaRecursoService()` | Cancela reserva verificando permisos (solicitante o rol elevado) |
| `services/reservaRecursoService.js` | `aprobarReservaRecursoService()` | Aprueba o rechaza reservas (solo ADMIN/SUPERVISOR/RRHH) |
| `services/reservaRecursoService.js` | `checkinReservaRecursoService()` | Registra check-in del solicitante en reserva aprobada |
| `services/reservaRecursoService.js` | `checkoutReservaRecursoService()` | Registra check-out del solicitante en reserva en uso |
| `services/reservaRecursoService.js` | `liberarReservasNoUsadasService()` | Libera reservas no utilizadas después de un tiempo de tolerancia |

### 📅 Gestión de Calendarios de Usuario
| Archivo | Función | Descripción |
| :--- | :--- | :--- |
| `services/calendarioUsuarioService.js` | `crearCalendarioUsuarioService()` | Crea un calendario personal para un usuario |
| `services/calendarioUsuarioService.js` | `listarCalendariosUsuarioService()` | Lista todos los calendarios de un usuario |
| `services/calendarioUsuarioService.js` | `actualizarCalendarioUsuarioService()` | Actualiza nombre/zona horaria verificando propiedad |
| `services/calendarioUsuarioService.js` | `eliminarCalendarioUsuarioService()` | Elimina un calendario verificando propiedad |
| `services/calendarioUsuarioService.js` | `crearEventoUsuarioService()` | Crea un evento en el calendario del usuario con validaciones |

### 🔧 Utilidades
| Archivo | Función | Descripción |
| :--- | :--- | :--- |
| `utils/generarToken.js` | `generarToken(payload, expiraEn)` | Genera un JWT con duración configurable desde variables de entorno |
| `utils/requestInfo.js` | `getClientIp(req)` | Extrae la IP del cliente desde x-forwarded-for, normalizando IPv6 |
| `utils/requestInfo.js` | `getUserAgent(req)` | Obtiene el User-Agent del request HTTP |
| `services/calendarioCommon.js` | `validarFechas(inicio, fin)` | Valida que las fechas sean válidas y que inicio < fin |
| `services/calendarioCommon.js` | `validarVisibilidad(visibilidad)` | Valida que la visibilidad sea PRIVADO, INTERNO o PUBLICO |

---

## 3. Objetivo / Función de cada Módulo

| Módulo | Objetivo |
| :--- | :--- |
| **Autenticación** (`authController`) | Gestionar el registro de usuarios y el flujo de inicio de sesión con seguridad multicapa: validación de credenciales, gestión de intentos fallidos con bloqueo temporal, detección de primer login para cambio obligatorio de contraseña, y envío de código de verificación 2FA. |
| **Middleware de Seguridad** (`verificarToken`, `validarRol`, `validarPermisoGranular`) | Proteger todas las rutas de la API asegurando que cada petición contenga un JWT válido, no expirado y con actividad reciente (< 120 min), que el usuario posea el rol adecuado (ADMIN, SUPERVISOR, EMPLEADO), y que cuente con los permisos granulares específicos para la acción solicitada, registrando intentos de acceso no autorizado. |
| **Gestión de Contraseñas** (`cambiarContrasena`, `restablecerContrasena`) | Administrar el ciclo de vida de las contraseñas: forzar el cambio en el primer login de usuarios creados por un administrador, y proporcionar un flujo seguro de recuperación mediante tokens de un solo uso con expiración de 30 minutos enviados por correo electrónico. |
| **Gestión de Recursos** (`recursoService`) | Administrar los recursos empresariales (salas, equipos, etc.) asegurando el aislamiento por empresa vía JWT, aplicando filtros de tipo, departamento y estado de mantenimiento, y verificando la disponibilidad temporal para evitar conflictos de reserva. |
| **Gestión de Reservas** (`reservaRecursoService`) | Implementar el flujo completo de reservas: solicitud con ajuste automático por tiempo máximo, detección de conflictos con sugerencia de alternativas, flujo de aprobación/rechazo por roles elevados, ciclo check-in/check-out, y liberación automática de reservas no utilizadas. |
| **Calendarios de Usuario** (`calendarioUsuarioService`) | Gestionar los calendarios personales de cada usuario con operaciones CRUD completas, validando propiedad del calendario, restricciones de fechas y visibilidad de eventos. |
| **Utilidades** (`generarToken`, `requestInfo`, `calendarioCommon`) | Proporcionar funciones reutilizables: generación centralizada de JWT con duración configurable, extracción normalizada de IP y User-Agent para auditoría, y validaciones comunes de fechas y visibilidad para los módulos de calendario. |

---

## 4. Framework de Pruebas Unitarias

### Jest v30+

| Aspecto | Detalle |
| :--- | :--- |
| **Framework** | [Jest](https://jestjs.io/) — Framework de testing para JavaScript |
| **Versión** | ^30.0.0 (última versión estable) |
| **Lenguaje de pruebas** | JavaScript (ES Modules) |
| **Ejecución** | `node --experimental-vm-modules` para soporte nativo de ESM |

#### ¿Por qué Jest?

1. **Todo-en-uno** — Incluye test runner, assertions, mocking y cobertura de código sin dependencias adicionales.
2. **Mocking nativo** — Permite mockear módulos completos con `jest.unstable_mockModule()` para ESM, ideal para aislar dependencias externas como Supabase y bcrypt.
3. **Sintaxis expresiva** — Matchers como `toHaveBeenCalledWith()`, `toEqual()`, `expect.objectContaining()` y `rejects.toThrow()` hacen las pruebas legibles y autoexplicativas.
4. **Paralelismo** — Ejecuta archivos de test en paralelo para mayor velocidad.
5. **Cobertura integrada** — Genera reportes de cobertura de código (líneas, funciones, ramas) sin herramientas externas.
6. **Amplia adopción** — Es el framework de testing más usado en el ecosistema Node.js/JavaScript.

#### Estructura de cada prueba (3 partes obligatorias):

```javascript
test('Descripción de la prueba', async () => {
  // 1) Preparación de la prueba — Configurar datos de entrada y mocks
  const req = { body: { correo: 'test@test.com', contrasena: '123456' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  mockFunction.mockResolvedValue({ data: null });

  // 2) Lógica de la prueba — Ejecutar la función bajo test
  await loginUsuario(req, res);

  // 3) Verificación del resultado esperado (Assert)
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Credenciales inválidas.' })
  );
});
```

---

## 5. Distribución de Pruebas por Integrante (60 pruebas totales)

Cada integrante tiene su **carpeta propia** dentro de `tests/` con **15 archivos de prueba individuales** y un archivo `_setup.js` compartido que configura los mocks.

| Integrante | Módulo | Nro. Pruebas | Carpeta |
| :--- | :--- | :---: | :--- |
| **Esmeralda Medina** | Autenticación (registrarUsuario + loginUsuario) | 15 | `tests/esmeralda/` |
| **Alina Mollinedo** | Middleware (verificarToken, validarRol, validarPermisoGranular) + Utilidades + cambiarContrasena | 15 | `tests/alina/` |
| **Joan Riveros** | Gestión de Recursos y Reservas (recursoService + reservaRecursoService) | 15 | `tests/joan/` |
| **Raquel Osorio** | Calendarios de Usuario + calendarioCommon + restablecerContrasena | 15 | `tests/raquel/` |
| **Total** | | **60** | |

### Archivos por Integrante

<details>
<summary><b>📁 Esmeralda — tests/esmeralda/ (15 archivos)</b></summary>

| Archivo | Función bajo test | Qué valida |
| :--- | :--- | :--- |
| `E01_rechazaRegistroSinCampos.test.js` | `registrarUsuario` | HTTP 400 sin campos obligatorios |
| `E02_rechazaRegistroEmpresaInexistente.test.js` | `registrarUsuario` | HTTP 400 si empresa no existe |
| `E03_rechazaRegistroCorreoDuplicado.test.js` | `registrarUsuario` | HTTP 400 con correo duplicado |
| `E04_registraUsuarioExitoso.test.js` | `registrarUsuario` | HTTP 201, hash con bcrypt |
| `E05_error500EnInsert.test.js` | `registrarUsuario` | HTTP 500 en error de BD |
| `E06_rechazaLoginSinCredenciales.test.js` | `loginUsuario` | HTTP 400 sin correo/contraseña |
| `E07_rechazaLoginUsuarioInexistente.test.js` | `loginUsuario` | HTTP 400 usuario no existe |
| `E08_rechazaLoginCuentaBloqueada.test.js` | `loginUsuario` | HTTP 403 cuenta bloqueada |
| `E09_incrementaIntentosFallidos.test.js` | `loginUsuario` | HTTP 401, intentos incrementados |
| `E10_bloqueaCuentaMaxIntentos.test.js` | `loginUsuario` | Bloqueo al alcanzar MAX_INTENTOS |
| `E11_redirigeCambioContrasenaPrimerLogin.test.js` | `loginUsuario` | `requerirCambio: true` |
| `E12_loginExitosoEnvia2FA.test.js` | `loginUsuario` | Envía código 2FA |
| `E13_loginRetornaDatosUsuario.test.js` | `loginUsuario` | Retorna correo, usuario_id, nombre |
| `E14_reseteaIntentosLoginExitoso.test.js` | `loginUsuario` | resetearIntentos invocado |
| `E15_error500Inesperado.test.js` | `loginUsuario` | HTTP 500 en error inesperado |

</details>

<details>
<summary><b>📁 Alina — tests/alina/ (15 archivos)</b></summary>

| Archivo | Función bajo test | Qué valida |
| :--- | :--- | :--- |
| `A01_rechazaSinAuthorization.test.js` | `verificarToken` | HTTP 401 sin header |
| `A02_rechazaTokenExpirado.test.js` | `verificarToken` | HTTP 401 token expirado |
| `A03_rechazaTokenInvalido.test.js` | `verificarToken` | HTTP 401 firma inválida |
| `A04_permiteAccesoTokenValido.test.js` | `verificarToken` | next() invocado |
| `A05_rechazaSesionInactividad.test.js` | `verificarToken` | HTTP 440 inactividad >120 min |
| `A06_permiteAccesoRolCorrecto.test.js` | `validarRol` | next() invocado |
| `A07_denegaAccesoRolIncorrecto.test.js` | `validarRol` | HTTP 403 |
| `A08_extraeIpForwardedFor.test.js` | `getClientIp` | Primera IP de la lista |
| `A09_normalizaIPv6Localhost.test.js` | `getClientIp` | Convierte ::1 a 127.0.0.1 |
| `A10_retornaUserAgent.test.js` | `getUserAgent` | Retorna user-agent |
| `A11_retornaUnknownSinUserAgent.test.js` | `getUserAgent` | Retorna "unknown" |
| `A12_rechazaUsuarioNoAutenticado.test.js` | `validarPermisoGranular` | HTTP 401 |
| `A13_denegaAccesoRegistraLog.test.js` | `validarPermisoGranular` | HTTP 403, log registrado |
| `A14_permiteAccesoConPermiso.test.js` | `validarPermisoGranular` | next() invocado |
| `A15_rechazaCambioSiNoPrimerLogin.test.js` | `cambiarContrasenaPrimerLogin` | HTTP 400 |

</details>

<details>
<summary><b>📁 Joan — tests/joan/ (15 archivos)</b></summary>

| Archivo | Función bajo test | Qué valida |
| :--- | :--- | :--- |
| `J01_crearRecursoForzaEmpresa.test.js` | `crearRecursoService` | id_empresa del token |
| `J02_listarRecursosConFiltros.test.js` | `listarRecursosService` | Filtros aplicados |
| `J03_errorRecursoOtraEmpresa.test.js` | `obtenerRecursoService` | Error 404 |
| `J04_retornaRecursoMismaEmpresa.test.js` | `obtenerRecursoService` | Recurso retornado |
| `J05_cambiaEstadoMantenimiento.test.js` | `cambiarEstadoMantenimientoService` | en_mantenimiento: true |
| `J06_disponibleSinSolapamientos.test.js` | `verificarDisponibilidadRecursoService` | disponible: true |
| `J07_noDisponibleConSolapamientos.test.js` | `verificarDisponibilidadRecursoService` | disponible: false |
| `J08_rechazaRecursoEnMantenimiento.test.js` | `crearReservaRecursoService` | Error 400 |
| `J09_ajustaFechaFinPorMaximo.test.js` | `crearReservaRecursoService` | fueAjustadoPorMaximo: true |
| `J10_rechazaCancelacionSinPermisos.test.js` | `cancelarReservaRecursoService` | Error 403 |
| `J11_adminCancelaReserva.test.js` | `cancelarReservaRecursoService` | estado: CANCELADA |
| `J12_rechazaAprobacionRolNoElevado.test.js` | `aprobarReservaRecursoService` | Error 403 |
| `J13_rechazaCheckinNoSolicitante.test.js` | `checkinReservaRecursoService` | Error 403 |
| `J14_rechazaCheckoutNoEnUso.test.js` | `checkoutReservaRecursoService` | Error 400 |
| `J15_liberaReservasNoUsadas.test.js` | `liberarReservasNoUsadasService` | 2 reservas EXPIRADA |

</details>

<details>
<summary><b>📁 Raquel — tests/raquel/ (15 archivos)</b></summary>

| Archivo | Función bajo test | Qué valida |
| :--- | :--- | :--- |
| `R01_validarFechasRangoValido.test.js` | `validarFechas` | No lanza error |
| `R02_validarFechasInicioMayorFin.test.js` | `validarFechas` | Error lanzado |
| `R03_validarFechasInvalidas.test.js` | `validarFechas` | "Fechas inválidas" |
| `R04_validarFechasNulas.test.js` | `validarFechas` | No lanza error |
| `R05_validarVisibilidadValida.test.js` | `validarVisibilidad` | No lanza error |
| `R06_validarVisibilidadInvalida.test.js` | `validarVisibilidad` | "Visibilidad inválida" |
| `R07_crearCalendarioUsuario.test.js` | `crearCalendarioUsuarioService` | Calendario creado |
| `R08_listarCalendariosUsuario.test.js` | `listarCalendariosUsuarioService` | 2 calendarios |
| `R09_actualizarCalendarioNoExiste.test.js` | `actualizarCalendarioUsuarioService` | Error lanzado |
| `R10_actualizarCalendarioNoPertenece.test.js` | `actualizarCalendarioUsuarioService` | Error lanzado |
| `R11_actualizarCalendarioSinCambios.test.js` | `actualizarCalendarioUsuarioService` | Calendario original |
| `R12_eliminarCalendarioPropio.test.js` | `eliminarCalendarioUsuarioService` | Modelo invocado |
| `R13_crearEventoFechasInvalidas.test.js` | `crearEventoUsuarioService` | Error lanzado |
| `R14_crearEventoExitoso.test.js` | `crearEventoUsuarioService` | Evento creado |
| `R15_restablecerCorreoNoRegistrado.test.js` | `solicitarRestablecimiento` | HTTP 404 |

</details>

---

## Requisitos Previos

1. Tener instalado **Node.js 18+** y **npm**
2. Clonar el repositorio e instalar dependencias:

```bash
cd Backend-Cocal
npm install
```

## Comandos de Ejecución

### 🚀 Ejecutar TODAS las pruebas (60 tests)

```bash
npm test
```

### 📊 Ejecutar con reporte de cobertura

```bash
npm run test:coverage
```

### 👤 Ejecutar las 15 pruebas de UN integrante

```bash
# Esmeralda — Autenticación (15 pruebas)
npm test -- tests/esmeralda/

# Alina — Middleware y Utilidades (15 pruebas)
npm test -- tests/alina/

# Joan — Recursos y Reservas (15 pruebas)
npm test -- tests/joan/

# Raquel — Calendarios y Restablecimiento (15 pruebas)
npm test -- tests/raquel/
```

### 🔍 Ejecutar UNA prueba individual

```bash
# Ejemplo: solo la prueba E01 de Esmeralda
npm test -- tests/esmeralda/E01_rechazaRegistroSinCampos.test.js

# Ejemplo: solo la prueba J08 de Joan
npm test -- tests/joan/J08_rechazaRecursoEnMantenimiento.test.js

# Ejemplo: solo la prueba A05 de Alina
npm test -- tests/alina/A05_rechazaSesionInactividad.test.js

# Ejemplo: solo la prueba R14 de Raquel
npm test -- tests/raquel/R14_crearEventoExitoso.test.js
```

## Estructura del Proyecto (Pruebas)

```
Backend-Cocal/
├── tests/
│   ├── esmeralda/                           ← 📁 Esmeralda Medina
│   │   ├── _setup.js                        ←     Configuración de mocks compartida
│   │   ├── E01_rechazaRegistroSinCampos.test.js
│   │   ├── E02_rechazaRegistroEmpresaInexistente.test.js
│   │   ├── E03_rechazaRegistroCorreoDuplicado.test.js
│   │   ├── E04_registraUsuarioExitoso.test.js
│   │   ├── E05_error500EnInsert.test.js
│   │   ├── E06_rechazaLoginSinCredenciales.test.js
│   │   ├── E07_rechazaLoginUsuarioInexistente.test.js
│   │   ├── E08_rechazaLoginCuentaBloqueada.test.js
│   │   ├── E09_incrementaIntentosFallidos.test.js
│   │   ├── E10_bloqueaCuentaMaxIntentos.test.js
│   │   ├── E11_redirigeCambioContrasenaPrimerLogin.test.js
│   │   ├── E12_loginExitosoEnvia2FA.test.js
│   │   ├── E13_loginRetornaDatosUsuario.test.js
│   │   ├── E14_reseteaIntentosLoginExitoso.test.js
│   │   └── E15_error500Inesperado.test.js
│   ├── alina/                               ← 📁 Alina Mollinedo
│   │   ├── _setup.js
│   │   ├── A01_rechazaSinAuthorization.test.js
│   │   ├── A02_rechazaTokenExpirado.test.js
│   │   ├── ...
│   │   └── A15_rechazaCambioSiNoPrimerLogin.test.js
│   ├── joan/                                ← 📁 Joan Riveros
│   │   ├── _setup.js
│   │   ├── J01_crearRecursoForzaEmpresa.test.js
│   │   ├── J02_listarRecursosConFiltros.test.js
│   │   ├── ...
│   │   └── J15_liberaReservasNoUsadas.test.js
│   └── raquel/                              ← 📁 Raquel Osorio
│       ├── _setup.js
│       ├── R01_validarFechasRangoValido.test.js
│       ├── R02_validarFechasInicioMayorFin.test.js
│       ├── ...
│       └── R15_restablecerCorreoNoRegistrado.test.js
├── jest.config.js                           ← Configuración de Jest
├── controllers/                             ← Código fuente bajo prueba
├── services/
├── middleware/
├── utils/
└── package.json
```
