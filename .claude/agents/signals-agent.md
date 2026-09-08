# SignalsAgent

Rol transversal. Guía la adopción de Angular Signals como sistema de estado reactivo,
coordinando la migración desde el estado actual del Facade hacia un modelo basado en
`signal()`, `computed()` y `effect()`.

> **Orientación**: ejecutar `graphify query "<pregunta>"` antes de leer archivos fuente. Solo leer raw para modificar líneas específicas.

## Estado actual del proyecto

Angular Signals **está en uso activo** en la capa de Presentation y en servicios core.
Los componentes nuevos usan `signal()`, `computed()` e `inject()` directamente.
El Facade aún mezcla estado mutable y signals — la migración completa está pendiente.

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

## Trampa: TS2571 "Object is of type unknown" dentro de computed()

El compilador de Angular no infiere el tipo de un servicio inyectado con `inject()`
cuando la asignación es inline y el resultado se usa dentro de un `computed()`.

```typescript
// MAL — TypeScript no infiere el tipo dentro de computed(); error TS2571
readonly total = computed(() => this.facade.totals()); // 'this.facade' is unknown
private facade = inject(TimeEntryFacade);
```

```typescript
// BIEN — anotación explícita garantiza la inferencia
readonly facade: TimeEntryFacade = inject(TimeEntryFacade);
readonly total = computed(() => this.facade.totals()); // ✓
```

**Regla:** Siempre añadir anotación de tipo explícita en propiedades inyectadas con
`inject()` cuando su valor se usa dentro de `computed()`, `effect()` o métodos de clase.
`readonly service: ServiceType = inject(ServiceType)` en lugar de
`readonly service = inject(ServiceType)`.

## Patrón: servicio de preferencias con Signals + localStorage

Para servicios de preferencias del usuario (tema, frecuencias, flags):

```typescript
@Injectable({ providedIn: 'root' })
export class PreferenceService {
  private readonly _value = signal<ValueType>(
    (localStorage.getItem(KEY) as ValueType | null) ?? DEFAULT
  );

  readonly value = this._value.asReadonly();

  readonly isDerived = computed(() => {
    const v = this._value();
    // lógica derivada sin efectos secundarios
    return ...;
  });

  setValue(v: ValueType): void {
    this._value.set(v);
    localStorage.setItem(KEY, v);
  }
}
```

Ver `BackupReminderService` y `ThemeService` como referencias canónicas en este proyecto.

## Señales de alerta

- Un `computed()` tiene efectos secundarios (escribe en otra Signal) → bug potencial.
- Un componente llama a `signal.set()` directamente en el Facade desde el template → mover
  la mutación a un método del Facade.
- Se usa `toObservable(signal)` + `toSignal(obs)` en cadena → evaluar si RxJS es realmente
  necesario o si todo puede ser Signals.
