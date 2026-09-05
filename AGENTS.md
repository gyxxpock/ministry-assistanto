# AGENTS — Ministry Assistanto

Roles contextuales para sesiones de CLI con Claude Code. Cada agente tiene reglas de capa,
rutas de responsabilidad y restricciones específicas al proyecto.

## Modo de activación

### Auto-dispatch (modo por defecto)

Describe la tarea en lenguaje natural. Claude analiza el contenido, identifica los
agentes relevantes y los aplica automáticamente. Al inicio de cada respuesta verás:

```
> Agentes: DomainAgent · ArchitectureGuardian
```

Ejemplos de tareas que activan agentes automáticamente:
```
quiero agregar un resumen semanal de horas trabajadas
el componente de calendario necesita mostrar días festivos
migra el esquema de Dexie a versión 3
convierte el estado del facade a Angular Signals
escribe specs para el use case de horas semanales
```

### Override manual (cuando quieres forzar un agente específico)

Prefija tu mensaje con el nombre del agente para ignorar el dispatcher:

```
DomainAgent: revisa si este modelo tiene sentido antes de implementarlo
TestingAgent: escribe specs solo para el facade, sin tocar las otras capas
```

## Índice de agentes

| Agente | Archivo | Capa / Alcance |
|--------|---------|----------------|
| [DomainAgent](.claude/agents/domain-agent.md) | `domain-agent.md` | `src/app/**/domain/` |
| [DataAgent](.claude/agents/data-agent.md) | `data-agent.md` | `src/app/**/data/` |
| [FacadeAgent](.claude/agents/facade-agent.md) | `facade-agent.md` | `src/app/**/facade/` |
| [UIAgent](.claude/agents/ui-agent.md) | `ui-agent.md` | `src/app/**/presentation/` |
| [UXAgent](.claude/agents/ux-agent.md) | `ux-agent.md` | `src/app/**/presentation/` (UX + iOS) |
| [ArchitectureGuardian](.claude/agents/architecture-guardian.md) | `architecture-guardian.md` | Transversal |
| [SignalsAgent](.claude/agents/signals-agent.md) | `signals-agent.md` | Transversal (estado) |
| [TestingAgent](.claude/agents/testing-agent.md) | `testing-agent.md` | Transversal (specs) |

## Reglas del sistema

- **Auto-dispatch activa múltiples agentes simultáneamente** cuando la tarea lo requiere.
- El orden de ejecución sigue las capas: Domain → Data → Facade → UI → Tests.
- `ArchitectureGuardian` está siempre activo en modo silencioso — solo interviene si
  detecta una violación de capa en el código que se está escribiendo.
- La lógica de routing completa vive en `.claude/agents/_dispatcher.md`.
- **Tareas no triviales requieren subagentes reales**: usar el `Agent` tool para lanzar
  `Explore`/fork (orientación de codebase) y `Plan` (arquitectura) en paralelo antes de
  implementar. Leer los `.md` de agentes define las reglas; no reemplaza delegar trabajo
  real con subagentes.
