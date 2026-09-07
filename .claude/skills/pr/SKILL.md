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

**Cuerpo:** Sección `## Summary` con bullets de qué cambió, sección `## Test plan`
con checklist de qué verificar manualmente, y referencia al issue con `Closes #N`.

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

---

## Reglas

- Siempre hacer push **antes** de crear el PR.
- La base siempre es `main`.
- Incluir `Closes #N` en el cuerpo si hay un issue relacionado.
- No hacer push a `main` directamente — solo PRs desde ramas de trabajo.
- Si el PR ya existe para la rama, usar `pr.sh status` para ver su URL en lugar de crear uno nuevo.
