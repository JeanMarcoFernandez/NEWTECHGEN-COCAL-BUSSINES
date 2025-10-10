# NEW TECH GEN  (PROYECTO COCAL BUSINESS)
## Equipo: New Tech Gen
| Rol       	| Nombre      	| Responsabilidades                                       	|
|---------------|-----------------|-------------------------------------------------------------|
| Scrum Master  | Raquel Osorio Mamani    	| Facilitar el proceso Scrum, eliminar obstáculos, etc.   	|
| Product Owner | Sergio Alejandro Arias Mayta   | Representar las necesidades del cliente y gestionar el Product Backlog. |
| Desarrolladores | Alina Mollinedo Davila, Jean Marco Fernandez Silva | Desarrollar y entregar incrementos de producto. |
| QAs | Jean Marco Fernandez Silva | Validar cada uno de los incrementos del producto |

## Proyecto
El proyecto COCAL BUSINESS tiene como objetivo es desarrollar un sistema web colaborativo para la gestión de calendarios y recursos en entornos empresariales, utilizando metodologías ágiles como Scrum y estándares de gestión de proyectos del PMBOK, para coordinar equipos y asignar recursos de manera eficiente.
## Normas del Equipo y Sanciones
Este documento establece las normas de comunicación, desarrollo, organización y responsabilidades dentro del equipo de trabajo, así como las sanciones aplicables según el nivel de falta.
### **REGLAS**
### Comunicación y Colaboración:
- **Uso adecuado de los canales de comunicación:** 
    - Intervenciones fuera de tema hasta 5 veces → leve.
    - Entre 6 y 10 veces → moderada
    - Más de 15 veces o reincidencia → grave

- **Lenguaje respetuoso y profesional** en todas las interacciones → leve
- **Escucha activa y participación equitativa** → leve
- **La líder del equipo** deberá enviar un saludo matutino (“Buenos días”) antes de las 11:59 a.m. → grave
- **Los integrantes deberán responder al saludo** de la líder en un plazo máximo de 5 horas → grave
### Gestión del Código:
**Convención de Nomenclatura**

***Detalle:***
    
- Variables y funciones → *lowerCamelCase* (e.g. *userName*, *calculateTotal()*)
- Clases y tipos de datos → *UpperCamelCase* (e.g. *UserProfile*, *InvoiceManager*)
- Archivos y módulos → *lowerCamelCase* (e.g. *userController.js*, *paymentService.py*)
- Constantes → MAYÚSCULAS_CON_GUIONES_BAJOS (e.g. *MAX_USERS*, *DEFAULT_TIMEOUT*)

***Regla:*** Todo archivo de código deberá seguir la convención de nomenclatura establecida por el equipo, utilizando inglés y CamelCase.
***Nivel de falta:*** leve.
### Estructura y Control de Cambios
- Mantener una estructura clara de carpetas y módulos, evitando duplicados. → moderada.
- Cada commit deberá incluir un mensaje descriptivo y claro. → leve
- Todo cambio importante deberá pasar por pull request y ser aprobado por al menos un compañero. → moderada.
- Las funciones deberán ser concisas y de responsabilidad única. → grave
- Los errores o bugs deberán registrarse con detalles claros y reproducibles. → leve.
- Evitar comentarios innecesarios, código muerto o duplicado. → moderada.
- Mantener compatibilidad con las versiones definidas de librerías y dependencias. → moderada.
- Modificaciones en entornos de producción deben ser autorizadas por la líder o supervisor. → grave.
### Estándares de Programación
- Seguir la guía de estilo del equipo: sangrías, nombres y formato uniforme. → leve
- Incluir comentarios claros y estructurados según la plantilla del equipo.

    **Detalle:**  Los comentarios deben explicar:
    - La funcionalidad de funciones y métodos.
    - El propósito de módulos.
    - Decisiones relevantes de diseño.

    **Objetivo:** Facilitar la comprensión y mantenimiento del código.
    Nivel de falta: grave.

- Todo módulo o funcionalidad deberá contar con pruebas unitarias básicas antes de su integración. → moderada.
- Evitar código duplicado o funciones innecesarias. → moderada.
### Responsabilidad y Organización
- Puntualidad en reuniones:
    - Retraso > 5 min → leve.
    - Retraso > 10 min → moderada.
    - Retraso > 15 min o ausencia sin justificación → grave.

- Cumplir plazos establecidos en tareas asignadas. → moderada.
- Comunicar anticipadamente cualquier inconveniente que impida una entrega. → moderada.
- Prohibida la asignación de tareas fuera del horario 8:00 a.m. - 6:00 p.m. → grave.
- La líder deberá enviar el saludo matutino antes de las 11:59 a.m. → grave.
- Los integrantes deberán responder al saludo en un máximo de 5 horas → grave.
- Cada integrante deberá organizar su espacio de trabajo y recursos digitales → leve.
### **FALTAS**
### Faltas Leves
- Aporte de 10 Bs destinado al té del equipo.
- Llamada de atención interna en caso de reincidencia.
### Faltas Moderadas 
- Aporte de 50 Bs destinado al equipo.
- Llamada de atención formal por parte de la Ing. supervisora.
### Faltas Graves 
- Invitar hamburguesas para todo el equipo 🍔
- Disculpa pública en el aula y en la página del “confesionario”.
## Herramientas de desarrollo y gestor de base de datos
### **Herramientas de desarrollo**
Las herramientas de desarrollo de las que dispondremos serán dependiendo las diferentes herramientas en diferentes contexto, para el desarrollo en frontend se empleará Vue.js, que es un framework progresivo que ayudará para la creación de interfaces más reactivas y modulares, Adicionalmente, su estructura se basa en componentes que permiten mantener un código limpio, reutilizable y manejable. Agregar que, se complementará con Vue Router para la navegación entre vistas y Axios para la comunicación entre el backend con peticiones HTTP. El diseño visual se trabajará con Tailwind CSS, dando la garantía que será una interfaz moderna , atractiva para el usuario y responsiva.

Mientras, en backend, se usará Node.js junto con el framework, Express.js, el cual nos permitirá construir una API REST eficiente y escalable para la gestión de datos, En cuanto a seguridad, se aplicará JWT para la autenticación, bcrypt para el cifrado de contraseñas y Helmet con CORS para la protección de las peticiones  HTTP.

El entorno de desarrollo estará conformado por Visual Code, como editor principal, GIT y Github para el control de versiones y de seguimiento de proyecto, para realizar pruebas sobre las rutas del backend. Este conjunto de herramientas permitirá un flujo de trabajo ágil, seguro y colaborativo, asegurando un desarrollo eficiente y una correcta integración entre el frontend y el backend-  

## Arquitectura del Sistema
Aqui se definira como se ira construyendo el proyecto, se lo hara con diferentes capas, ademas la estructura de los docuemntos en base de diagramas, como por ejemplo:

- DIAGRAMA DE CONTEXTO 

    El diagrama de contexto muestra una visión general del Sistema Empresarial Colaborativo, destacando cómo interactúan los distintos actores —Administrador del Sistema, Administrador de Grupo y Usuarios— con la plataforma central y los sistemas externos, como la base de datos, el almacenamiento de archivos y la autenticación. Permite entender de forma clara el alcance y las conexiones principales del sistema.

- DIAGRAMA DE DESPLIEGUE
    
    El diagrama de despliegue representa la arquitectura técnica del sistema, mostrando cómo se distribuyen los componentes entre los distintos entornos físicos y lógicos. El cliente accede al sistema desde un navegador web utilizando tecnologías frontend modernas como Vue.js o React, con soporte visual mediante TailwindCSS. El servidor de aplicaciones ejecuta la lógica central en Node.js con Express, manejando la autenticación mediante JWT o Supabase Auth, la comunicación en tiempo real con Socket.IO, el envío de correos mediante Nodemailer y SMTP, y la gestión de archivos a través de Supabase SDK o S3 SDK. Los datos estructurados —como usuarios, proyectos, reportes y eventos— se almacenan en una base de datos PostgreSQL, ubicada en el servidor de base de datos. Finalmente, los servicios externos complementan la infraestructura, incluyendo Supabase Storage o Amazon S3 para el almacenamiento de archivos, Supabase Auth para la gestión de sesiones seguras, y un servicio SMTP dedicado para la notificación y comunicación automatizada con los usuarios. Esta arquitectura garantiza escalabilidad, seguridad y eficiencia en la interacción entre los distintos módulos del sistema.

- DIAGRAMA DE CONTENEDORES


## Base de Datos
La base de datos del Collaborative Calendar “Business-Edition” (Cocal) constituye el núcleo estructurado de almacenamiento, gestión e integración de toda la información generada por la organización. Está diseñada bajo un modelo relacional, garantizando consistencia, integridad referencial y eficiencia en la recuperación de datos.

Este sistema de información almacena entidades fundamentales como usuarios, departamentos, proyectos, canales de comunicación, mensajes, eventos, reportes, penalizaciones y acciones administrativas, las cuales se encuentran interrelacionadas mediante claves primarias y foráneas que aseguran la coherencia de los datos.

El objetivo principal de la base de datos es centralizar toda la información operativa en un entorno seguro y de fácil acceso, permitiendo la interacción coordinada entre los distintos módulos del sistema (gestión de usuarios, comunicación interna, control de proyectos y reportes administrativos).
Entre sus características más relevantes se destacan:

- **Modelo Relacional**: basado en dependencias lógicas entre entidades, eliminando redundancias.

- **Integridad y Consistencia**: uso de restricciones, claves foráneas y tipos de datos específicos.

- **Escalabilidad**: capacidad para almacenar grandes volúmenes de información sin degradar el rendimiento.

- **Soporte a múltiples roles**: gestión de usuarios con distintos niveles de acceso (administrador, empleado, cliente).

- **Compatibilidad con herramientas modernas**: integrable con backends desarrollados en Node.js (Express), FastAPI u otros frameworks RESTful.

- **Persistencia segura**: todos los datos son almacenados de forma transaccional en el servidor de base de datos PostgreSQL, garantizando recuperación ante fallos.

Diagrama de la Base de Datos Relacional del Calendario Colaborativo - Colaborative Calendar “Business-Edition”

https://datamodeler.redgate-platform.com/doc/OQmNOnmr3uMqik20egh8ZMBvobSCBTFk
