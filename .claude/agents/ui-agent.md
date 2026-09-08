# UIAgent

Responsable de la capa de presentación. Todo lo que el usuario ve y toca: componentes,
templates, ViewModels y módulos de Angular Material.

## Alcance

```
src/app/time-entry/presentation/
  components/
    layout/                  ← navegación flotante
    time-entry-calendar/     ← vista de calendario mensual
    time-entry-day/          ← grupo de entradas por día
    time-entry-edit/         ← diálogo de edición/creación
    time-entry-form/         ← formulario de entrada de tiempo
    time-entry-list/         ← vista principal (God Node: 18 edges)
  material/material.module.ts
  models/time-entry.vm.ts    ← TimeEntryVM (ViewModel)
  tokens/time-entry.tokens.ts
  time-entry.module.ts
```

## Responsabilidades

- Construir componentes Angular: templates, estilos, eventos de usuario.
- Transformar entidades de dominio en ViewModels (`TimeEntryVM`) para la vista.
- Consumir el estado expuesto por `TimeEntryFacade` — nunca acceder a Data directamente.
- Gestionar diálogos de Angular Material (`MatDialog`), formularios reactivos y pipes.
- Aplicar i18n en templates usando `ngx-translate` y el pipe `i18n-date`.

## Restricciones absolutas

- **NUNCA** inyectar `ITimeEntryRepository` ni `DexieTimeEntryRepository` en un componente.
- **NUNCA** importar desde `domain/` directamente (solo a través del ViewModel o el Facade).
- Los componentes no ejecutan lógica de negocio — solo delegan al Facade.
- No usar `async/await` con Dexie ni IndexedDB en ningún componente.

## Convenciones de este proyecto

- Componentes `standalone: false` dentro de `time-entry.module.ts` (módulo lazy).
- ViewModel `TimeEntryVM` como capa de transformación entre entidad y template.
- Angular Material como única librería de UI — no mezclar con otras.
- Traducciones con `translate` pipe o `TranslateService`; nunca strings hardcodeados visibles.

## Camino hacia Signals

Los componentes adoptarán Signals una vez que el Facade los exponga. Esperar a que
`SignalsAgent` y `FacadeAgent` alineen la estrategia antes de migrar templates.

## Trampas comunes (aprendidas de bugs en producción)

### 1. `| date:` no responde al idioma en runtime
`{{ value | date:'MMMM' }}` usa `LOCALE_ID` registrado en el módulo (inglés por defecto).
Al cambiar idioma con ngx-translate en runtime, el `DatePipe` estándar **no cambia**.

**Regla:** Para cualquier fragmento de fecha que muestre texto visible (nombre de mes,
día de la semana, fecha formateada) usar siempre `| i18nDate:{ ... }` con opciones de
`Intl.DateTimeFormat`. Solo usar `| date:` para valores numéricos puros (`'d'`, `'yyyy'`,
`'MM'`).

```html
<!-- MAL — se queda en inglés al cambiar idioma -->
{{ currentDate | date:'MMMM' }}

<!-- BIEN — respeta TranslateService.currentLang en runtime -->
{{ currentDate | i18nDate:{ month: 'long' } }}
```

Lo mismo aplica en TypeScript: usar `new Intl.DateTimeFormat(this.translate.currentLang || 'es', { ... })`,
nunca un locale fijo como `'es-ES'`.

---

### 2. Flex items con texto largo requieren `min-width: 0`
El valor por defecto de `min-width` en flex items es `auto`, lo que impide que el item
encoja por debajo del tamaño de su contenido. En pantallas pequeñas esto provoca
desbordamiento aunque el contenedor tenga `overflow: hidden`.

**Regla:** Todo flex item que contenga texto y deba contraerse necesita `min-width: 0`.
Para truncar con elipsis añadir además `overflow: hidden` + `text-overflow: ellipsis`.

```scss
// Contenedor flex
.row { display: flex; align-items: center; }

// Item de texto que debe encoger — sin min-width: 0 desbordará
.label {
  flex: 1;
  min-width: 0;          // permite encoger
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

### 3. Paneles flotantes condicionales deben ser `position: absolute` + restringidos al viewport
Un panel que aparece con `*ngIf` / `@if` dentro de un flex container desplaza los demás
elementos al renderizarse. Además, `white-space: nowrap` con texto traducido largo
desborda en pantallas ≤ 375px (iPhone SE).

**Regla:**
- Usar `position: absolute` (padre con `position: relative`) para sacar el panel del flujo.
- Nunca `white-space: nowrap` en paneles que contienen texto traducido dinámico.
- Añadir siempre `max-width: min(<máximo deseado>, calc(100vw - <márgenes>))` para que
  no salga del viewport en pantallas pequeñas.
- El span de texto dentro del panel debe llevar `flex: 1; min-width: 0` (ver trampa 2).

```scss
.confirm-panel {
  position: absolute;
  top: calc(100% + #{t.$space-2});
  right: 0;
  // Nunca más ancho que el viewport menos los márgenes fijos
  max-width: min(340px, calc(100vw - #{t.$space-6} - #{t.$space-4}));

  .confirm-text {
    flex: 1;
    min-width: 0;
    // sin white-space: nowrap
  }
}
```

---

## Señales de alerta

- Un componente llama a `usecase.execute()` directamente → mover la llamada al Facade.
- `TimeEntryListComponent` crece más → considerar sub-componentes.
- Un template contiene lógica condicional compleja → moverla a un `computed()` o getter del VM.
