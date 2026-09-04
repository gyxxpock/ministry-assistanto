# Dispatcher — Auto-Dispatch de Agentes

Este archivo define la lógica de routing que Claude ejecuta automáticamente antes de
responder cualquier tarea. No es invocado por el usuario; es leído por Claude al inicio
de cada respuesta.

---

## Paso 1 — Analizar la tarea

Lee el mensaje del usuario e identifica:
- ¿Qué capas del proyecto están involucradas? (Domain, Data, Facade, Presentation)
- ¿Es una tarea de una sola capa o cruza múltiples capas?
- ¿Hay palabras clave que apunten a agentes específicos?

---

## Paso 2 — Aplicar la matriz de routing

Activa **todos** los agentes cuyas señales estén presentes. Si hay duda, activa más
agentes, no menos. ArchitectureGuardian está siempre activo en modo silencioso.

| Señales detectadas en la tarea | Agentes a activar |
|-------------------------------|-------------------|
| "entidad", "modelo", "use case", "regla de negocio", "ITimeEntryRepository", "TimeEntry", "CourseVisit" | **DomainAgent** |
| "Dexie", "IndexedDB", "repositorio", "persistencia", "migración", "schema", "DexieTimeEntryRepository" | **DataAgent** |
| "facade", "estado", "orquestación", "exponer al componente", "importar", "exportar", "BehaviorSubject", "loadMonth" | **FacadeAgent** |
| "componente", "template", "SCSS", "estilo", "vista", "pantalla", "UI", "Material", "Angular Material", "ViewModel", "TimeEntryVM" | **UIAgent** |
| "signal", "computed", "effect", "reactivo", "migrar RxJS", "signals", "estado reactivo" | **SignalsAgent** |
| "test", "spec", "prueba", "cobertura", "jasmine", "karma", "*.spec.ts" | **TestingAgent** |
| "revisar capa", "violación", "Clean Architecture", "importa desde", "¿esta clase pertenece?" | **ArchitectureGuardian** (exclusivo) |

### Regla de feature completa
Si la tarea describe una **nueva funcionalidad** que involucra lógica de negocio + datos +
UI (palabras como "quiero", "necesito agregar", "nueva función", "nuevo módulo"), activa:
→ DomainAgent + DataAgent + FacadeAgent + UIAgent + ArchitectureGuardian

### ArchitectureGuardian — modo silencioso permanente
Está activo en todas las tareas. Solo interviene (interrumpe la respuesta) si detecta
una violación de capa en el código que estás a punto de escribir o revisar. No genera
output propio cuando no hay violaciones.

---

## Paso 3 — Leer los archivos de agentes activos

Para cada agente identificado, lee su archivo antes de generar la respuesta:

```
DomainAgent       → .claude/agents/domain-agent.md
DataAgent         → .claude/agents/data-agent.md
FacadeAgent       → .claude/agents/facade-agent.md
UIAgent           → .claude/agents/ui-agent.md
ArchitectureGuardian → .claude/agents/architecture-guardian.md
SignalsAgent      → .claude/agents/signals-agent.md
TestingAgent      → .claude/agents/testing-agent.md
```

---

## Paso 4 — Anunciar y responder

**Para tareas no triviales**: lanzar subagentes (`Agent` tool) para exploración y
planificación antes de responder con código. El anuncio de agentes activos va primero;
los subagentes se lanzan en paralelo justo después.

Al inicio de la respuesta, incluye una línea de anuncio breve:

```
> Agentes: DomainAgent · FacadeAgent · ArchitectureGuardian
```

Si solo está activo ArchitectureGuardian en modo silencioso (sin agentes de capa), omite
el anuncio. Luego responde aplicando las reglas combinadas de todos los agentes activos.

---

## Paso 5 — Orden de ejecución para tareas multi-capa

Cuando varios agentes están activos, ejecutar en orden de dependencia de capas:

1. **DomainAgent** — modelar primero (entidades, interfaces, use cases)
2. **DataAgent** — implementar persistencia sobre lo modelado
3. **FacadeAgent** — orquestar usando lo que Domain y Data definen
4. **UIAgent** — construir la UI que consume el Facade
5. **TestingAgent** — escribir specs de todas las capas tocadas
6. **SignalsAgent** — aplicar si hay estado nuevo que modelar con Signals

---

## Override manual

Si el mensaje del usuario empieza con un nombre de agente seguido de dos puntos
(ej. `DomainAgent: ...`), ignorar este dispatcher y activar únicamente ese agente.
