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
