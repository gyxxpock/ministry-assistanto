---
doc_type: adr
module: goals
adr_number: 2
status: proposed
date: 2026-09-17
supersedes: null
superseded_by: null
generated_by: human-docs-agent
sources: []
---

# ADR-0002: Granularidad de prorrateo mensual vs. diario en el cálculo de progreso de metas (goal progress)

## Status

Proposed

## Context

El feature de Metas (`src/app/goals/domain/goal.usecase.ts`) calcula el progreso a la
fecha (`progress-to-date`) y una insignia de estado (`on-track` / `behind-in-margin` /
`out-of-margin`) tanto para metas de tipo `regular` (precursor regular, meta de 600h/año)
como `auxiliary` (precursor auxiliar). El cálculo se basa en conteo de meses de
calendario completos, no en prorrateo a nivel de día:

- `monthsElapsedInServiceYear(sy, currentDate)` (líneas 22-28): calcula
  `elapsed = (cy*12+cm) - (sy.startYear*12 + sy.startMonth) + 1`, acotado a `[0,12]`.
  Esto cuenta el mes calendario EN CURSO como transcurrido al 100% desde su primer día.
- `countActiveMonths(...)` (líneas 55-81) deriva `activeMonthsElapsed` a partir de ese
  mismo conteo de meses completos — siempre es un entero, nunca fraccionado por día.
- `computeRegularGoalProgress` / `computeAuxiliaryGoalProgress` (líneas 126-203) derivan
  `targetToDate = round2(targetHours * activeMonthsElapsed / totalActiveMonths)` y
  `projection = (accumulated/activeMonthsElapsed) * totalActiveMonths` directamente de
  ese valor de mes completo.
- `computeStatus` (líneas 87-97) clasifica `on-track` si `projection >= target`,
  `behind-in-margin` si `projection >= margin` (margin = target * 560/600), o de lo
  contrario `out-of-margin`.

**Reproducción concreta** (precursor regular, año de servicio que inicia en
septiembre 2026 (año de servicio '2027', etiquetado por el año en que termina),
fecha actual = 17-sep-2026, 33h registradas):

- Comportamiento actual (con el bug): `activeMonthsElapsed=1` (todo septiembre se
  cuenta como transcurrido aunque solo han pasado 17 de 30 días), `totalActiveMonths=12`,
  `targetHours=600`, `targetToDate=50`, `hoursDifference = 33 - 50 = -17`,
  `projection = (33/1)*12 = 396`, `margin = 560` → como `396 < 560`,
  `status = 'out-of-margin'`.
- Alternativa con prorrateo diario (prorratear el mes en curso por día del mes en vez
  de tratarlo como 100% transcurrido): `targetToDate ≈ 50 * (17/30) ≈ 28.33`,
  `hoursDifference ≈ 33 - 28.33 ≈ +4.67` — esto mostraría al usuario adelantado respecto
  al ritmo esperado, no "fuera de margen".
- Esto produce un falso negativo de insignia "out-of-margin" y un `hoursDifference`
  negativo engañoso durante los primeros días de cualquier mes, para cualquier meta.

**Alcance**: afecta a AMBOS tipos de meta, `regular` y `auxiliary`, y se repite al
INICIO DE CADA mes calendario (no está limitado a los casos de inscripción a mitad de
año / `startMonth`, que fue un bug distinto y ya corregido). Las funciones raíz del
problema son `monthsElapsedInServiceYear`, `countActiveMonths`,
`computeRegularGoalProgress` y `computeAuxiliaryGoalProgress`, todas en
`src/app/goals/domain/goal.usecase.ts`. Es un problema de cálculo puramente de la capa
Domain — no hay involucramiento de Data/Facade/Presentation en la causa raíz.

Esta es una decisión sobre granularidad de cálculo, no sobre un límite estructural de
capas de Clean Architecture; por lo tanto, según la regla de ADR de
`references/graphify-integration.md`, no se requirió confirmación estructural vía
`graphify path` para este ADR.

## Decision

Se acepta, por ahora, la brecha identificada — granularidad de mes completo que causa
un falso negativo de estado al inicio de cada mes — como una limitación conocida y
documentada, a corregirse en una sesión de implementación futura y separada
(explícitamente NO corregida por este ADR). La dirección de corrección que se registra
como decisión prevista es: los cálculos de progreso a la fecha deben prorratear el mes
calendario en curso por días transcurridos (día-del-mes / días-en-el-mes) en lugar de
contarlo como 100% transcurrido, aplicado de manera uniforme tanto al tipo `regular`
como al `auxiliary` en la capa Domain (`goal.usecase.ts`), preservando el comportamiento
de mes completo existente para todos los meses previos ya completados en su totalidad.

## Consequences

- Se vuelve más fácil: las insignias de estado visibles al usuario serán precisas en
  los primeros días de un mes; se elimina una falsa alarma recurrente de
  "out-of-margin"; el prorrateo a nivel de día es un cambio pequeño y localizado,
  confinado a la capa Domain (no se anticipan cambios en Data/Facade/Presentation,
  consistente con cómo `targetToDate`/`hoursDifference` ya fueron centralizados en la
  capa Domain por una corrección previa).
- Se vuelve más difícil / trade-offs: el prorrateo por día cambia las salidas numéricas
  exactas de estado/target/proyección durante meses en curso para TODAS las metas
  existentes (regular y auxiliary) — deberá re-verificarse contra los fixtures de
  pruebas existentes en `goal.usecase.spec.ts`; introduce una dependencia de
  día-del-mes/días-en-el-mes sobre el `currentDate` exacto recibido (deben considerarse
  casos límite de zona horaria/límite de día); hasta que se corrija, los usuarios pueden
  ver insignias de estado confusas o desalentadoras en los primeros días de cada mes.

## Alternatives considered

- **No hacer nada / aceptar la granularidad de mes completo de forma permanente** —
  rechazado porque produce una señal falsa negativa recurrente y predecible cada mes,
  socavando la confianza en la insignia.
- **Prorratear solo para el tipo `regular`** (replicando cómo se acotó la corrección de
  inicio a mitad de año) — rechazado porque el bug está demostrablemente presente
  también para metas `auxiliary` (mismo camino de código en
  `countActiveMonths`/`monthsElapsedInServiceYear`), así que una corrección acotada por
  tipo dejaría roto el caso auxiliary.
- **Ocultar/suprimir la insignia de estado durante los primeros N días de un mes en
  lugar de calcularla con precisión** — rechazado como una solución alternativa que
  reduce la información disponible para el usuario en lugar de corregir el cálculo
  subyacente.

## Implementation

**2026-09-18** — La corrección descrita en la sección "Decision" fue implementada tal
como estaba prevista, en `src/app/goals/domain/goal.usecase.ts`, bajo el issue de
GitHub #70. Aún no está commiteada a git al momento de esta nota.

- Se agregó `rawMonthsElapsedInServiceYear(sy, currentDate)`, un conteo de meses
  transcurridos sin acotar (a diferencia de `monthsElapsedInServiceYear`, que sigue
  acotado a `[0,12]`).
- Se agregó `currentMonthDayFraction(currentDate)`, que calcula
  `currentDate.getDate() / daysInMonth`.
- `countActiveMonths()` ahora identifica el único mes en curso (cuando `rawElapsed` cae
  en `[1,12]`) y le suma `inProgressFraction` en vez de un `1` completo; todo otro mes
  activo ya transcurrido sigue sumando `1` completo — exactamente el prorrateo uniforme
  para `regular` y `auxiliary` que la Decision anticipaba.
- `activeMonthsElapsed` solo se redondea con `round2()` en el objeto final
  `GoalProgress`; la aritmética interna (`projection`, `targetToDate`,
  `hoursDifference`) usa precisión completa hasta ese punto.
- Verificación contra el escenario de reproducción de este mismo ADR (meta Regular, año
  de servicio 2027, fecha actual 2026-09-17, 33h acumuladas): ahora
  `targetToDate≈28.33`, `hoursDifference≈+4.67`, `projectedHours≈698.82`,
  `status='on-track'` — ya no se produce el falso `out-of-margin` descrito en Context.
- Suite de pruebas: 38/38 tests pasando en `goal.usecase.spec.ts` (se agregaron pruebas
  de regresión nuevas para el escenario exacto del issue, un caso límite de día 1 del
  año de servicio, y una variante para meta `auxiliary`); suite completa del proyecto
  690/690 pasando; cobertura 98.71%/96.23%/96.33%/99.06%
  (statements/branches/functions/lines).
