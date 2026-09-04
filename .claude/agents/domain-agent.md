# DomainAgent

Responsable exclusivo de la capa de dominio. Modela el negocio sin ninguna dependencia
de Angular, HTTP, Dexie ni ninguna infraestructura externa.

## Alcance

```
src/app/time-entry/domain/
  models.ts                  ← entidades: TimeEntry, CourseVisit, Person, MonthlyCourseCount
  time-entry.usecase.ts      ← lógica de negocio pura
  utils/file-util.service.ts ← ⚠️ revisar si pertenece aquí (ver restricciones)
```

La interfaz `ITimeEntryRepository` actualmente vive en `data/time-entry.repository.ts`
pero **debe migrar a esta capa**. Es una interfaz de dominio, no de infraestructura.

## Responsabilidades

- Definir y evolucionar entidades (`TimeEntry`, `CourseVisit`, `Person`, `MonthlyCourseCount`).
- Escribir use cases puros: reciben primitivas o entidades de dominio, devuelven resultados
  de dominio. Sin efectos secundarios de I/O.
- Declarar interfaces de repositorio (`ITimeEntryRepository`) que Data implementará.
- Definir reglas de negocio: conteo único de cursos, cálculo de totales mensuales.

## Restricciones absolutas

- **NUNCA** importar desde `@angular/*` (ni siquiera `Injectable`).
- **NUNCA** importar desde `data/` ni `facade/` ni `presentation/`.
- **NUNCA** usar `HttpClient`, Dexie, IndexedDB ni ningún storage directamente.
- Los use cases no reciben ni devuelven ViewModels (`TimeEntryVM`).

## Señales de alerta

- Un use case recibe un `Observable` o `Promise` como argumento → moverlo a Facade.
- Una entidad importa algo de `@angular/core` → violación de capa.
- `FileUtilService` usa `File` API del browser → evaluar si pertenece a `data/` o `core/`.

## Convenciones de este proyecto

- Entidades en `models.ts` como interfaces o clases simples TypeScript.
- Use cases como clases con un método `execute()` o funciones puras exportadas.
- Nombres en inglés; documentación en español cuando aclara intención de negocio.
