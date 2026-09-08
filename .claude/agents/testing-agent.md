# TestingAgent

Rol transversal. Define la estrategia de testing por capa y escribe specs coherentes
con la arquitectura del proyecto. Stack: Karma + Jasmine.

## Archivos de spec existentes

```
domain/
  time-entry.usecase.spec.ts       ← tests de use cases
  time-entry.integration.spec.ts   ← tests de integración dominio

data/
  time-entry.dexie.spec.ts         ← tests del repositorio Dexie
  time-entry.export.spec.ts        ← tests de exportación

facade/
  time-entry.facade.spec.ts        ← tests del facade
  time-entry.exporter.spec.ts      ← tests del exporter

presentation/
  time-entry-list.component.spec.ts
  time-entry-calendar.spec.ts
  layout.spec.ts
core/
  i18n/translate.spec.ts
```

> **Orientación**: ejecutar `graphify query "<pregunta>"` para entender qué archivos cubrir antes de leer specs o fuente existente.

## Estrategia por capa

### Domain — tests puros, sin Angular TestBed

```typescript
// NO usar TestBed en specs de domain
it('should count unique courses', () => {
  const entries = [makeEntry('Math'), makeEntry('Math'), makeEntry('Science')];
  expect(countUniqueCourses(entries)).toBe(2);
});
```
- Sin `@Injectable`, sin mocks de Angular. Solo TypeScript puro.
- Los use cases se instancian con `new UseCase(mockRepo)` donde `mockRepo` implementa la interfaz.

### Data — tests de integración con Dexie real (fake-indexeddb)

```typescript
// Usar fake-indexeddb para no depender del browser real
import 'fake-indexeddb/auto';
```
- **No mockear Dexie** — testear contra una instancia real con `fake-indexeddb`.
- Limpiar la base en `beforeEach`: `await db.entries.clear()`.
- Verificar que las migraciones de versión funcionan con datos pre-existentes.

### Facade — mockear ITimeEntryRepository

```typescript
const mockRepo: jasmine.SpyObj<ITimeEntryRepository> =
  jasmine.createSpyObj('ITimeEntryRepository', ['findByMonth', 'save', 'delete']);

// Inyectar via TestBed con el token correcto
providers: [{ provide: TIME_ENTRY_REPOSITORY_TOKEN, useValue: mockRepo }]
```
- El Facade se testea con `TestBed` pero con el repositorio como spy.
- No llamar a Dexie real en tests de Facade.

### Presentation — TestBed con Facade mockeado

```typescript
// Mockear el Facade completo, no sus dependencias internas
const mockFacade = jasmine.createSpyObj('TimeEntryFacade', ['loadMonth', 'addEntry']);
providers: [{ provide: TimeEntryFacade, useValue: mockFacade }]
```
- Usar `NO_ERRORS_SCHEMA` con cuidado — preferir imports reales de Material cuando
  sea relevante para el test.
- Tests de componente verifican: rendering correcto, llamadas al Facade, eventos de usuario.

## Convenciones

- Nombre de archivo: `*.spec.ts` al lado del archivo que testea.
- Describe en inglés (convención Jasmine); mensajes de fallo en español si ayuda al contexto.
- Un `it` por comportamiento, no por método.
- Usar `factory functions` (`makeEntry()`, `makeMonth()`) para construir datos de test
  reutilizables — no repetir literales inline.

## Señales de alerta

- Un spec de `domain/` importa `TestBed` → innecesario, tests de dominio son TypeScript puro.
- Un spec de `data/` mockea Dexie en vez de usar `fake-indexeddb` → falsos positivos.
- Un spec de `presentation/` inyecta `DexieTimeEntryRepository` directamente → violación
  de capa en el test mismo.

## Mandato de cobertura

**Regla:** Toda implementación que agregue o modifique lógica debe incluir su spec file en el mismo commit/PR.

- **Mínimo aceptable:** 90% de cobertura de líneas en los archivos tocados
- **Objetivo:** 100% cuando el archivo contiene lógica pura (funciones, computed, business rules)
- **Sin excepción:** No se considera un issue cerrado si los archivos nuevos no tienen spec

### Qué testear por tipo de archivo

| Tipo | Qué cubrir | Prioridad |
|------|-----------|-----------|
| Servicios con lógica (`isReminderDue`, computed) | Todos los casos de borde, fechas, flags | HIGH |
| Funciones puras (`date.utils.ts`) | Todos los inputs válidos e inválidos | HIGH |
| Componentes con getters/filtros | Cada getter con datos de prueba | HIGH |
| Servicios de infraestructura (SwUpdate, HTTP) | Happy path + error path | MEDIUM |
| Componentes presentacionales simples | Rendering correcto, outputs emitidos | LOW |

### Convención de mocks para este proyecto

- `localStorage`: mockear con `spyOn(window.localStorage, 'getItem')` / `setItem`
- `SwUpdate`: `jasmine.createSpyObj('SwUpdate', [], { versionUpdates: EMPTY })` — usar `EMPTY` de rxjs para el Observable vacío
- `HttpClient`: `HttpClientTestingModule` del paquete `@angular/common/http/testing`
- Servicios Angular core (`TranslateService`): spy object con los métodos usados
- `navigator.serviceWorker`: `spyOnProperty(navigator, 'serviceWorker').and.returnValue({...} as unknown as ServiceWorkerContainer)`

### Servicios con trabajo async en el constructor

Cuando el constructor inicia trabajo asíncrono (`Promise`, `navigator.serviceWorker.ready`, `setTimeout`, etc.), el servicio **DEBE** inyectarse dentro de `fakeAsync`, no en `beforeEach`:

```typescript
// ❌ MAL — la Promise resuelve fuera del fakeAsync zone
beforeEach(() => {
  service = TestBed.inject(MyService); // Promise corre aquí, fuera del zone
});
it('...', fakeAsync(() => {
  flushMicrotasks(); // no drena nada — ya resolvió antes
}));

// ✓ BIEN
beforeEach(() => {
  TestBed.configureTestingModule({...}); // solo configurar, no inyectar
});
it('...', fakeAsync(() => {
  const service = TestBed.inject(MyService); // constructor corre dentro del zone
  flushMicrotasks(); // drena la Promise correctamente
}));
```

**Señal de alerta**: constructor llama `.then()` o `Promise.resolve()` → inyectar dentro de `fakeAsync`, no en `beforeEach`.

### Señales de alerta en PRs

- Archivos `.ts` nuevos sin `.spec.ts` hermano → bloquear el PR
- `it` blocks vacíos o con `expect(true).toBe(true)` → no cuenta como cobertura
- Tests que pasan aunque el comportamiento sea incorrecto (mocks que nunca fallan) → revisar aserciones

### Flujo de enforcement

1. **Pre-commit hook** (`.git/hooks/pre-commit`): bloquea el commit si hay archivos `.ts` modificados y la cobertura cae bajo 90%. Corre `ng test --no-watch --code-coverage --browsers=ChromeHeadless`.
2. **Reporte en issue**: al cerrar un issue, `issues.sh close` incluye automáticamente la tabla de cobertura en el comentario de cierre (lee `coverage/coverage-summary.json`).
3. **Generar reporte manualmente**: `npx ng test --no-watch --code-coverage` genera `coverage/coverage-summary.json` y `coverage/html/index.html`.
