# SignalsAgent

Rol transversal. Guía la adopción de Angular Signals como sistema de estado reactivo,
coordinando la migración desde el estado actual del Facade hacia un modelo basado en
`signal()`, `computed()` y `effect()`.

## Estado actual del proyecto

Angular Signals está declarado como objetivo en las instrucciones del proyecto
(`.github/copilot-instructions.md`) pero **no está implementado en código aún**.
El Facade probablemente usa patrones RxJS o estado mutable directo.

## Cuándo adoptar Signals

Empezar siempre desde la capa de Facade hacia Presentation — nunca al revés.

### Orden recomendado de migración

1. **FacadeAgent primero:** convertir el estado del `TimeEntryFacade` a Signals.
2. **UIAgent segundo:** los componentes consumen las Signals expuestas por el Facade.
3. Evitar `effect()` en componentes a menos que sea para sincronizar con DOM o APIs externas.

## Patrones para este proyecto

```typescript
// En TimeEntryFacade — estado primario
readonly currentMonth = signal<Date>(new Date());
readonly entries = signal<TimeEntry[]>([]);

// Estado derivado — computed es lazy y se memoiza
readonly monthlyTotal = computed(() => computeMonthlyTotals(this.entries()));
readonly hasEntries = computed(() => this.entries().length > 0);

// En componente — lectura directa, sin async pipe
{{ facade.monthlyTotal().totalHours }}
@if (facade.hasEntries()) { ... }
```

## Signals vs RxJS — regla de decisión

| Usar Signal | Usar Observable (RxJS) |
|-------------|----------------------|
| Estado de UI sincrónico | Streams de eventos asíncronos |
| Valores derivados (computed) | HTTP requests |
| Estado local del componente | WebSockets / SSE |
| Estado del Facade | Dexie promises convertidas a stream |

Para Dexie: las operaciones async devuelven `Promise` — resolverlas en el Facade
con `async/await` y luego escribir el resultado en la Signal.

```typescript
async loadMonth(date: Date): Promise<void> {
  const result = await this.repository.findByMonth(date);
  this.entries.set(result);  // Signal.set() — sincrónico tras await
}
```

## Restricciones

- **NUNCA** usar `effect()` para sincronizar dos Signals entre sí → usar `computed()`.
- **NUNCA** crear Signals en componentes para estado que vive en el Facade.
- No migrar RxJS Observables que cruzan límites de módulos — mantener como Observable
  hasta que el consumidor también migre.

## Señales de alerta

- Un `computed()` tiene efectos secundarios (escribe en otra Signal) → bug potencial.
- Un componente llama a `signal.set()` directamente en el Facade desde el template → mover
  la mutación a un método del Facade.
- Se usa `toObservable(signal)` + `toSignal(obs)` en cadena → evaluar si RxJS es realmente
  necesario o si todo puede ser Signals.
