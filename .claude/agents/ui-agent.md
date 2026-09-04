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

## Señales de alerta

- Un componente llama a `usecase.execute()` directamente → mover la llamada al Facade.
- `TimeEntryListComponent` crece más → considerar sub-componentes.
- Un template contiene lógica condicional compleja → moverla a un `computed()` o getter del VM.
