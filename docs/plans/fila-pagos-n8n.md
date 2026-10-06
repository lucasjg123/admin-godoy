# Plan: fila de pagos en el recibo (opción 2 — Sheets + n8n)

## Contexto
Hoy el front no sabe qué meses ya están pagos: se entera recién al enviar, cuando n8n (`registrar-pago`) responde 409. Queremos:
- **Ver la fila de pagos** del depto en el modal del recibo.
- **Bloquear meses pagos** en la UI y validarlo también por código.
- Que n8n **siga validando al registrar** (red de seguridad).

Decisión: los **Sheets siguen siendo la fuente de verdad** (opción más simple ahora). La base (MySQL) no se toca.

## Flujo
```
Abrir recibo / cambiar año
  front → GET /recibos/pagos/:id_depto?anio=2026 → back → n8n (estado-pagos) → Sheet
  ← { anio, mesesPagos: ['Enero', 'Febrero'] }

Enviar recibo (igual que hoy)
  front → POST /recibos/send → back → n8n (registrar-pago: valida + registra) → mail
```
El front **no llama directo a n8n**: no se expone el webhook, no hay CORS, y el `sheetId` / clave del depto ya se arman en el back.

## Pasos

### 1. n8n — nuevo workflow `cobranza/estado-pagos`
- Webhook POST, recibe `{ sheetId, anio, depto }` (mismo formato que `registrar-pago`).
- Reutiliza los nodos de búsqueda de fila de `registrar-pago` (hoja del año + depto), sin escritura.
- Responde `{ mesesPagos: [...] }` con los meses cuya celda = `PAGO`.
- Si no encuentra la fila → 404 `{ error: 'Depto no encontrado en la planilla' }`.
- `registrar-pago` queda igual.

### 2. Backend — `backend/src/recibos/recibos.service.ts`
- Extraer helpers privados de lo que hoy está en `sendPaymentNotificationToN8n`:
  - `getSheetId(depto)`
  - `buildDeptoKey(depto)` → `${piso} "${letra}"` (clave idéntica para ambos webhooks).
  - `callN8n(path, payload)` → fetch + manejo de errores existente.
- Nuevo `getEstadoPagos(id_depto, anio)` → busca depto con edificio, llama `callN8n('estado-pagos', …)`, devuelve `{ anio, mesesPagos }`.
- `sendReciboByEmail`: si `dto.useCustomPeriodo` → **no llamar a n8n**, solo mail.
- Env: reemplazar `N8N_WEBHOOK_URL` por `N8N_BASE_URL` (ej: `http://n8n:5678/webhook/cobranza`); actualizar `.env` y compose.

### 3. Backend — `backend/src/recibos/recibos.controller.ts`
- `@Get('pagos/:id_depto')` con `@Query('anio')`, ambos con `ParseIntPipe`.

### 4. Front — API y hook
- `frontend/lib/api/recibo.api.ts`: `getEstadoPagos(id_depto, anio)`.
- `frontend/hooks/use-recibo.tsx`: `useEstadoPagos(id_depto, anio)` → `{ mesesPagos, loading, error, refetch }`, refetch al cambiar `anio` (mismo patrón `useState` que los hooks existentes).

### 5. Front — vista
- `frontend/app/components/recibo/recibo.tsx`: `methods.watch('anio')` → `useEstadoPagos(...)` → pasar `mesesPagos` y `loading` a `ReciboContent` → `MesSelector`.
- `frontend/app/components/recibo/content/mes-selector.tsx` (la "fila de pagos"):
  - Mes pago: checkbox deshabilitado + badge "PAGO" (verde/tachado).
  - Cargando: indicador simple, checkboxes habilitados.
  - Error al consultar: aviso "No se pudo consultar la planilla", sin bloquear (n8n valida igual).
- Mes por defecto: si el `defaultMonth` está pago, quitarlo de `meses` al llegar los datos.

### 6. Front — validación por código
- `onSubmit` en `recibo.tsx`: si algún mes seleccionado está en `mesesPagos` (y no es período personalizado) → `methods.setError('meses', { message: 'Ya pagos: …' })` y cortar.
- `handleSend` exitoso → `refetch()` (o nada, si se cierra el modal).

## Riesgos aceptados
- Abrir el modal tarda lo que tarde n8n + Google (~1–3 s).
- Carrera entre dos envíos simultáneos → posible doble registro; aceptable por volumen, el 409 de n8n cubre la mayoría.

## Verificación
1. `curl` a `/recibos/pagos/:id?anio=…` de un depto con meses pagos en el Sheet → devuelve esos meses.
2. Abrir el recibo de ese depto → meses pagos bloqueados; cambiar año → la fila se actualiza.
3. `curl` a `/recibos/send` con un mes ya pago → 409 de n8n, no se manda el mail.
4. Período personalizado → el Sheet no se toca.
5. n8n apagado → el modal abre igual y muestra el aviso.
