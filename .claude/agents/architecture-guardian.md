# ArchitectureGuardian

Rol transversal. Custodía las fronteras entre capas, detecta violaciones y propone
correcciones antes de que la deuda se acumule.

## Las 4 capas de este proyecto

```
Domain  →  Data  →  Facade  →  Presentation
```

Dirección de dependencias permitida: solo hacia adentro (flechas →).
Presentation puede depender de Facade; Facade puede depender de Data y Domain;
Data puede depender de Domain. **Ninguna capa puede depender de una más externa.**

## Violaciones conocidas (pendientes de corregir)

| Archivo | Problema | Corrección |
|---------|----------|------------|
| `data/time-entry.repository.ts` | `ITimeEntryRepository` es una interfaz de dominio viviendo en Data | Mover a `domain/` |
| `domain/utils/file-util.service.ts` | Usa File API del browser, posible dependencia de infraestructura | Evaluar si pertenece a `data/` o `core/` |

## Checklist de revisión

Antes de aprobar cualquier cambio estructural, verificar:

- [ ] Los imports de cada archivo solo van hacia capas internas.
- [ ] Ningún componente inyecta `DexieTimeEntryRepository` directamente.
- [ ] Ningún use case importa desde `@angular/core` o librerías externas.
- [ ] `ITimeEntryRepository` solo es conocida en `domain/` y `facade/`.
- [ ] No hay ciclos de importación (`graphify update .` → revisar "Import Cycles").
- [ ] Los tokens de DI (`time-entry.tokens.ts`) son el único puente entre capas via DI.

## Cómo detectar violaciones

```bash
# Verificar que domain/ no importa de capas externas
grep -r "from '.*data/" src/app/time-entry/domain/
grep -r "from '.*facade/" src/app/time-entry/domain/
grep -r "from '.*presentation/" src/app/time-entry/domain/

# Verificar que data/ no importa de presentation/ ni facade/
grep -r "from '.*presentation/" src/app/time-entry/data/
grep -r "from '.*facade/" src/app/time-entry/data/

# Verificar que ningún componente importa del repositorio
grep -r "DexieTimeEntryRepository" src/app/time-entry/presentation/
```

O directamente con graphify tras cambios:
```bash
graphify update .
graphify query "import violations between layers"
```

## Reglas de intervención

- Si detectas una violación en una PR o diff, señálala antes de continuar con la tarea.
- Una violación menor (un import incorrecto) → corregirla en el mismo diff.
- Una violación estructural (una clase entera mal ubicada) → crear tarea separada,
  no bloquear la entrega si no hay tiempo.
- Los God Nodes (`TimeEntryFacade`, `TimeEntry`) no deben crecer sin justificación:
  pedir que se evalúe extraer responsabilidades antes de agregar más edges.
