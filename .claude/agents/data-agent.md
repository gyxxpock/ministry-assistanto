# DataAgent

Responsable de la capa de infraestructura/datos. Implementa las interfaces declaradas
en dominio usando Dexie.js sobre IndexedDB.

## Alcance

```
src/app/time-entry/data/
  time-entry.repository.ts   ← ITimeEntryRepository (interfaz — pendiente de mover a domain/)
  time-entry.dexie.ts        ← DexieTimeEntryRepository + TimeEntryDB (Dexie schema)
```

## Responsabilidades

- Implementar `ITimeEntryRepository` con `DexieTimeEntryRepository`.
- Gestionar el esquema de Dexie (`TimeEntryDB`) y sus migraciones de versión.
- Mapear entre entidades de dominio (`TimeEntry`, `CourseVisit`) y estructuras de IndexedDB.
- Mantener la lógica de persistencia offline-first.

## Restricciones absolutas

- **NUNCA** importar desde `presentation/` ni `facade/`.
- Solo puede importar desde `domain/` (entidades e interfaces).
- No exponer Dexie ni IndexedDB fuera de esta capa — solo la interfaz `ITimeEntryRepository`.
- No contener lógica de negocio: los cálculos viven en `domain/`.

## Patrones Dexie de este proyecto

- La clase base hereda de `Dexie`: `class TimeEntryDB extends Dexie`.
- Las migraciones se declaran en el constructor con `.version(n).stores({...})`.
- Las queries son `async/await` sobre tablas Dexie; devolver `Promise<T>`.
- Al agregar campos nuevos en una versión, siempre proveer `.upgrade()` para datos existentes.

## Señales de alerta

- Un método del repositorio hace un cálculo de negocio (ej. suma de horas) → moverlo a
  `domain/time-entry.usecase.ts`.
- Se importa `MatDialog` o cualquier `@angular/material` → violación de capa.
- La versión de Dexie aumenta sin `upgrade()` para registros previos → riesgo de corrupción.
