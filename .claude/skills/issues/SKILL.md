# Skill: issues

Gestión de GitHub Issues para Ministry Assistanto.
Script: `.claude/scripts/issues.sh`

Invoca con `/issues` o cuando el contexto lo requiera (inicio de sesión, reporte de bug, solicitud de feature).

---

## Cuándo activar este skill

- **Inicio de sesión** — Siempre. Antes de cualquier tarea, listar issues y preguntar al usuario cuál trabajar.
- **Reporte de bug o feedback** — El usuario describe un problema → crear issue y preguntar si trabajarlo ahora.
- **Solicitud de feature** — El usuario pide funcionalidad nueva → crear issue con historia de usuario.
- **Al terminar una implementación** — Cerrar el issue trabajado con resumen.

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

### 3. Implementar

Seguir el flujo normal de agentes (dispatcher → Explore/Plan → implementar → build).

### 4. Cerrar

```bash
.claude/scripts/issues.sh close <number> "<resumen de lo implementado>"
```

El resumen debe incluir: qué se cambió, archivos tocados, y si aplica, cómo verificar.

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

- Nunca cerrar un issue sin haber verificado el build.
- Si el issue tiene múltiples criterios de aceptación, verificar cada uno antes de cerrar.
- Si durante la implementación aparece trabajo adicional no previsto en el issue, crear un issue nuevo — no expandir el alcance del actual.
- El script usa `gh` que ya está autenticado; no necesita token adicional.
