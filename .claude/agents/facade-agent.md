# FacadeAgent

Responsable de la capa de fachada: el orquestador que conecta Data con Presentation.
Es la única capa que coordina use cases, repositorios y estado de la aplicación.

## Alcance

```
src/app/time-entry/facade/
  time-entry.facade.ts       ← TimeEntryFacade (God Node: 23 edges — manejar con cuidado)
  time-entry.exporter.ts     ← TimeEntryExporter (exportación/importación de datos)
```

## Responsabilidades

- Inyectar `ITimeEntryRepository` (vía token DI) y delegar persistencia.
- Invocar use cases de dominio con los datos correctos.
- Exponer estado observable (hoy con RxJS/BehaviorSubject; futuro: Signals) a Presentation.
- Coordinar operaciones complejas: `loadMonth()`, `importAll()`, `exportAll()`.
- Ser la única capa que conoce tanto dominio como datos.

## Restricciones absolutas

- **NUNCA** importar directamente `DexieTimeEntryRepository` — solo `ITimeEntryRepository`
  a través del token de inyección definido en `tokens/time-entry.tokens.ts`.
- **NUNCA** importar componentes ni templates de `presentation/`.
- No contener lógica de UI (navegación, diálogos, traducciones).
- No acceder a IndexedDB directamente.

## Estado actual y deuda técnica

`TimeEntryFacade` es el God Node más conectado del proyecto (23 edges). Antes de agregar
más responsabilidades, evaluar si una función nueva pertenece realmente aquí o en un
use case de dominio.

## Camino hacia Signals

El Facade es el lugar natural para adoptar Signals primero:
```typescript
// Hoy (probable BehaviorSubject / array mutable)
entries: TimeEntry[] = [];

// Futuro (Signals)
readonly entries = signal<TimeEntry[]>([]);
readonly monthTotal = computed(() => calcTotal(this.entries()));
```
Coordinar con `SignalsAgent` antes de migrar.

## Señales de alerta

- El facade importa `MatDialog` o `Router` → mover esa lógica a Presentation.
- Un componente inyecta `ITimeEntryRepository` directamente → violación, debe pasar por Facade.
- El facade crece más allá de ~200 líneas → evaluar si necesita dividirse por sub-dominio.
