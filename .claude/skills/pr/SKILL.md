# Skill: pr

Push de la rama actual y creación de Pull Request hacia `main`.
Script: `.claude/scripts/pr.sh`

Invoca con `/pr` cuando el usuario aprueba un cambio y quiere enviarlo a producción.

---

## Cuándo activar este skill

- El usuario dice "haz el PR", "envía a main", "push y PR", "crea el pull request".
- Después de cerrar un issue y el usuario confirma que el cambio está listo.
- **No crear PRs sin aprobación explícita del usuario.**

---

## Flujo completo

### 1. Verificar estado

```bash
git status
git log origin/main..HEAD --oneline
.claude/scripts/pr.sh commits
```

- Si hay cambios sin commitear → crear commit primero (o alertar al usuario).
- Si no hay commits nuevos respecto a `main` → no hay nada que enviar; informar.

### 2. Push

```bash
.claude/scripts/pr.sh push
```

### 3. Construir título y cuerpo del PR

**Título:** Una línea imperativa, ≤70 chars. Basarse en los commits de la rama.
Formato sugerido: `<tipo>(<scope>): <descripción> (#<issue>)`
Ejemplo: `feat(ux): sticky header + tiles compactos en iPhone SE (#20)`

**Cuerpo:** Seguir la estructura de `.github/PULL_REQUEST_TEMPLATE.md` — rellenar
cada sección con la información del diff real. No usar una estructura simplificada.

Secciones a completar (omitir solo las que genuinamente no aplican):

```markdown
# Summary
<1-2 frases: qué cambió y por qué>

## Type of change
- [x] feat / fix / refactor / docs / chore  ← marcar el que corresponde

## Related issues
- Closes #N  ← si hay issue asociado

## Implementation notes
- Qué capas tocó (domain / data / facade / presentation)
- Decisiones de diseño relevantes (Clean Architecture, patrones usados)
- Archivos clave modificados

## How to test
- npm run build
- npm run i18n:check  ← si se tocaron traducciones
- Pasos de QA manual para cambios de UI (golden path + casos edge)

## Release notes
- `<tipo>(<scope>): <descripción en una línea>`

## Checklist
- [x] Build pasa (`npm run build`)
- [x] i18n: claves añadidas/actualizadas y `npm run i18n:check` pasa  ← si aplica
- [x] Commits pequeños y enfocados con mensajes claros
```

Rellenar con información real de los commits — no dejar placeholders ni secciones vacías
que no aporten valor.

### 4. Crear PR

```bash
.claude/scripts/pr.sh create "<título>" "<cuerpo>"
```

Para PR en borrador (trabajo en progreso):
```bash
.claude/scripts/pr.sh draft "<título>" "<cuerpo>"
```

### 5. Mostrar URL

El script imprime la URL del PR. Presentarla al usuario.

---

## Verificaciones previas

- [ ] Build limpio (`npm run build`) antes de hacer push.
- [ ] Issue relacionado cerrado (o en estado correcto).
- [ ] Sin archivos sensibles en el diff (`.env`, credenciales, tokens).
- [ ] `public/assets/changelog.json` actualizado con los cambios de esta entrega
      (tipos: `feature` para funcionalidad nueva, `fix` para bugs corregidos,
      `ux` para mejoras de performance/visuales menores agrupadas).

---

## Reglas

- Siempre hacer push **antes** de crear el PR.
- La base siempre es `main`.
- Incluir `Closes #N` en el cuerpo si hay un issue relacionado.
- No hacer push a `main` directamente — solo PRs desde ramas de trabajo.
- Si el PR ya existe para la rama, usar `pr.sh status` para ver su URL en lugar de crear uno nuevo.
