# Skill: issues

Gestión de GitHub Issues para Ministry Assistanto.
Script: `.claude/scripts/issues.sh`

Invoca con `/issues` o cuando el contexto lo requiera (inicio de sesión, reporte de bug, solicitud de feature).

---

## Cuándo activar este skill

- **Inicio de sesión** — Siempre. Antes de cualquier tarea, listar issues y preguntar al usuario cuál trabajar.
- **Reporte de bug o feedback** — El usuario describe un problema → crear issue y preguntar si trabajarlo ahora.
- **Solicitud de feature** — El usuario pide funcionalidad nueva → crear issue con historia de usuario.
- **Al terminar una implementación** — Documentar en el issue lo realizado y esperar confirmación del usuario antes de cerrar.

---

## Flujo de sesión

### 1. Inicio — listar y elegir

```bash
.claude/scripts/issues.sh list
```

Presentar la lista al usuario. Proponer el de mayor prioridad (orden: `bug` > `ux` > `feature` > `tech-debt`). Esperar confirmación.

### 2. Arrancar un issue

```bash
.claude/scripts/issues.sh start <number>
.claude/scripts/issues.sh view <number>
```

Leer el cuerpo completo del issue para entender los criterios de aceptación antes de tocar código.

### 3. Implementar e iterar

Seguir el flujo normal de agentes (dispatcher → Explore/Plan → forks → build). La
implementación puede requerir múltiples iteraciones: re-revisiones, correcciones de
tests, ajustes. Todo el re-trabajo es parte del ciclo normal — no saltarse ningún paso.

### 4. Verificar criterios de aceptación

Antes de considerar el issue listo, revisar uno a uno los criterios del cuerpo del issue:
- Tests pasando y cobertura ≥90%
- Cada criterio de aceptación marcado como cumplido
- Re-revisión con agentes si hubo cambios tras la primera implementación

### 5. Documentar en el issue

**Siempre antes de cerrar**, añadir un comentario en el issue con todo lo realizado en
la sesión, incluyendo re-trabajo:

```bash
gh issue comment <number> --body "<resumen completo>"
```

El resumen debe incluir:
- Qué se implementó (archivos tocados, decisiones de diseño)
- Qué re-trabajo hubo y por qué (bugs encontrados en re-revisión, ajustes de tests)
- Issues derivados creados, si aplica
- Resultado final de tests y cobertura

### 6. Confirmar con el usuario y cerrar

**Nunca cerrar sin confirmación explícita del usuario.** Presentar el resumen de lo
realizado y preguntar: "¿Cerramos el issue #N?"

Solo cuando el usuario confirme:

```bash
npx ng test --no-watch --code-coverage
.claude/scripts/check-coverage.sh  # verifica que ≥90%
.claude/scripts/issues.sh close <number> "<resumen de lo implementado>"
```

El script `issues.sh close` incluye automáticamente la tabla de cobertura en el
comentario de cierre si `coverage/coverage-summary.json` existe.

---

## Crear un issue nuevo

Cuando el usuario reporta un bug o solicita un feature:

```bash
.claude/scripts/issues.sh create \
  "<título conciso>" \
  "<labels: bug|feature|ux|ios|enhancement|tech-debt>" \
  "<cuerpo con contexto, criterios de aceptación y archivos relevantes>"
```

### Formato del cuerpo (bug)

```
## Descripción
<qué ocurre vs qué debería ocurrir>

## Pasos para reproducir
1. ...

## Contexto técnico
- Archivo: ...
- Dispositivo/condición: ...

## Criterios de aceptación
- [ ] ...
```

### Formato del cuerpo (feature)

```
## Historia de usuario
Como <rol>, quiero <qué>, para <por qué>.

## Criterios de aceptación
- [ ] ...

## Archivos involucrados
- ...

## Notas de diseño (UXAgent)
...
```

---

## Etiquetas disponibles

| Label | Uso |
|-------|-----|
| `bug` | Algo no funciona |
| `feature` | Nueva funcionalidad |
| `ux` | Experiencia de usuario / diseño |
| `ios` | Comportamiento específico iOS |
| `enhancement` | Mejora a funcionalidad existente |
| `tech-debt` | Refactor / deuda técnica |

---

## Reglas

- **Nunca cerrar un issue sin confirmación explícita del usuario** — aunque la implementación parezca completa.
- **Nunca cerrar sin documentar en el issue** — todo el trabajo de la sesión (incluyendo re-trabajo, bugs encontrados en re-revisión, issues derivados) debe quedar en un comentario antes del cierre.
- Nunca cerrar sin haber verificado el build y cobertura ≥90%.
- Si el issue tiene múltiples criterios de aceptación, verificar cada uno antes de proponer el cierre.
- Si durante la implementación aparece trabajo adicional no previsto, crear un issue nuevo — no expandir el alcance del actual.
- El script usa `gh` que ya está autenticado; no necesita token adicional.
