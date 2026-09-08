#!/usr/bin/env bash
# Verifica cobertura de tests contra umbral mínimo del 90%.
# Uso:
#   check-coverage.sh              → bloquea si < 90%
#   check-coverage.sh --warn-only  → reporta sin bloquear (informativo)
#   check-coverage.sh --report-only → igual que --warn-only (alias para issues.sh)

SUMMARY="coverage/coverage-summary.json"
MODE="${1:-}"

if [ ! -f "$SUMMARY" ]; then
  echo "⚠️  No se encontró $SUMMARY"
  echo "   Ejecuta: npx ng test --no-watch --code-coverage"
  exit 1
fi

WARN_ONLY=0
if [ "$MODE" = "--warn-only" ] || [ "$MODE" = "--report-only" ]; then
  WARN_ONLY=1
fi

WARN_ONLY="$WARN_ONLY" node - <<'NODEEOF'
const fs = require('fs');
const summary = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
const total = summary.total;
const metrics = ['statements', 'branches', 'functions', 'lines'];
const threshold = 90;
const warnOnly = process.env.WARN_ONLY === '1';

const rows = metrics.map(m => ({
  metric: m,
  pct: total[m] ? total[m].pct : 0,
  covered: total[m] ? total[m].covered : 0,
  total: total[m] ? total[m].total : 0,
  ok: total[m] ? total[m].pct >= threshold : false,
}));

console.log('\n### 📊 Cobertura de tests\n');
console.log('| Métrica | Cobertura | Estado |');
console.log('|---------|-----------|--------|');
rows.forEach(r => {
  const status = r.ok ? '✅' : (warnOnly ? '⚠️' : '❌');
  console.log(`| ${r.metric} | ${r.pct}% (${r.covered}/${r.total}) | ${status} |`);
});
console.log(`\n_Umbral objetivo: ${threshold}%_\n`);

const failed = rows.filter(r => !r.ok);
if (failed.length > 0) {
  if (warnOnly) {
    console.log('⚠️  Cobertura global por debajo del 90%. Meta: alcanzar el umbral en el próximo sprint.');
  } else {
    console.error('❌ Cobertura insuficiente en: ' + failed.map(r => `${r.metric} (${r.pct}%)`).join(', '));
    console.error(`   Mínimo requerido: ${threshold}% — escribe más tests antes de hacer commit.`);
    process.exit(1);
  }
} else {
  console.log('✅ Cobertura OK — todos los métricas ≥ ' + threshold + '%');
}
NODEEOF
