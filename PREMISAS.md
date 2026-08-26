# 🎫 WUOLAH - Event Attendance Management API

## 🚀 Inicio Rápido
```bash
bash menu.sh
```
o
```bash
npm run menu
```
Para:

- Construir las imágenes Docker.
- Levantar el backend y MongoDB.
- Ejecutar los tests en modo watch.

La opción de levantar Docker expone la API en `http://localhost:3000` y MongoDB en `localhost:27017`.


## 📌 Premisas explícitas

- API REST.

- Existen eventos:
  - Contienen título, descripción, fecha y lugar.
  - Ejemplos de eventos: music festivals, conferences, fairs...
  - Podrían modelarse mediante una propiedad `type`, pero como no está especificado, asumiré que hace referencia al título o descripción del evento.

- Existen usuarios que pueden:
  - Consultar eventos.
  - Marcar que asistirán a un evento o cancelar su asistencia.
  - Actualizar su respuesta de si asistirán o cancelarán.

- Para cada evento, se pueden ver los usuarios que asistirán.

- El sistema debería enviar una notificación asíncrona una semana antes del evento.
  - Si una persona marca que asistirá y el evento empieza en menos de una semana, no recibirá esa notificación.
  - Si el email contiene información importante, como un QR de acceso al evento, el usuario podría no llegar a verla.

- El comportamiento debe ser especialmente:
  - Idempotente.
  - Testeable.
  - Escalable.
  - Desacoplado de infraestructura.

## 🤔 Asunciones

En estos casos, hablaría con el experto que corresponda o tendría en cuenta las decisiones que hayamos tomado como equipo.

Para simplicidad de la prueba, asumiré las siguientes premisas:

### Arquitectura inicial

Arquitectura síncrona (sin pensar en infra distribuida). 
Me he centrado en dominio.
De momento he ignorado la implementación de los controllers y repositorios. Lo podemos comentar en directo durante la prueba.

### Volumetría

Sería importante conocer:

- Número total de usuarios.
- Número de eventos.
- Número medio de usuarios que asisten a eventos.

A tener en cuenta por si hay que hacer paginación, filtros, caché, procesamiento asíncrono...


### Attendance como dominio

Parece ser una parte suficientemente importante del negocio como para contener lógica y reglas propias.

### Timezones

Ignoraré la gestión de timezones.

Afectaría a:
- Fecha y hora de los eventos.
- Usuarios en distintas zonas horarias.
- El cálculo de notificaciones.

### Invariantes

- Un usuario puede asistir como mucho una vez a cada evento.
- Un `Attendance` siempre pertenece a un usuario existente.
- Un `Attendance` siempre pertenece a un evento existente.

### Otras cosas que no tendré en cuenta (las discutiría antes)
- Lógica adicional del update. Por ejemplo, si un usuario marca que asiste y después cancela, ¿tendría que ocurrir algo?
- Si el evento ya ha pasado y el usuario marca que asistirá.
- Capacidades máximas y mínimas de los eventos.
- Mismo usuario en eventos distintos al mismo tiempo (conflicto de agendas)

## 📝 Notas de diseño

- Para las vistas, se podría usar projections, cqrs... pero lo haré simple usando siempre el patrón `Repository`.

- Revisaría cómo son vuestros estándares:
  - Gestión de errores
  - Logging
  - Códigos HTTP
  - Formato de respuestas
  - Errores de dominio


## 📚 Casos de Uso

### 1. Listar Eventos

**Como usuario, quiero ver una lista de eventos disponibles.**

```http
GET /api/events
```

### 2. Obtener Detalles del Evento

**Como usuario, quiero ver los detalles de un evento específico.**

```http
GET /api/events/:eventId
```

### 3. Confirmar Asistencia

**Como usuario, quiero confirmar que asistiré a un evento.**

```http
PUT /api/events/:eventId/attendance
```

Payload:

```json
{
  "userId": "user-123" // Por ejemplo. Depende de vuestro estándar
}
```
### 4. Cancelar Asistencia

**Como usuario, quiero cancelar mi asistencia a un evento.**

```http
DELETE /api/events/:eventId/attendance
```

Payload:

```json
{
  "userId": "user-123" 
}
```
### 5. Listar Asistentes Confirmados

**Como usuario, quiero ver quién asistirá a un evento.**

```http
GET /api/events/:eventId/attendees
```


## Notificaciones Asincrónicas

Para implementar notificaciones una semana antes del evento:

### Enfoque

1. Ejecutar un **Job Scheduler** cada madrugada (cuando hay menos actividad) a las 5am por ejemplo
2. Buscar eventos cuya fecha se encuentre aproximadamente a 7 días.
3. Obtener los asistentes confirmados de esos eventos.
4. Enviar las notificaciones (email, SMS).
5. Registrar las notificaciones como enviadas para evitar duplicados.

La lógica de envío podría ser una lambda, vivir dentro del core, de forma desacoplada con un NotificationService por ejemplo, o ser otra aplicación a parte.

### Idempotencia

Aquí sí que es importante que un usuario no reciba la misma notificación dos veces.

Por ejemplo, podría existir una clave única basada en:

```text
userId + eventId
```

### Caso límite

Si un usuario confirma su asistencia menos de siete días antes del evento, no entrará en el envío planificado exactamente una semana antes.

Algunas posibles estrategias serían:

- Enviar una notificación inmediata al confirmar la asistencia.
- Enviar un recordatorio un día antes.
