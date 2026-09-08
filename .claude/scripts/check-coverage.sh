#!/usr/bin/env bash
# Verifica cobertura de tests contra umbral mínimo del 90%.
# Uso: check-coverage.sh [--report-only]
#   --report-only: imprime el reporte sin verificar el umbral (para uso en issues.sh)

SUMMARY="coverage/coverage-summary.json"
REPORT_ONLY="${1:-}"

if [ ! -f "$SUMMARY" ]; then
  echo "⚠️  No se encontró $SUMMARY"
  echo "   Ejecuta: npx ng test --no-watch --code-coverage"
  exit 1
fi

REPORT_ONLY_FLAG=0
if [ "$REPORT_ONLY" = "--report-only" ]; then
  REPORT_ONLY_FLAG=1
fi

REPORT_ONLY="$REPORT_ONLY_FLAG" node - <<'NODEEOF'
const fs = require('fs');
const summary = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
const total = summary.total;
const metrics = ['statements', 'branches', 'functions', 'lines'];
const threshold = 90;
const reportOnly = process.env.REPORT_ONLY === '1';

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
  const status = r.ok ? '✅' : '❌';
  console.log(`| ${r.metric} | ${r.pct}% (${r.covered}/${r.total}) | ${status} |`);
});
console.log(`\n_Umbral mínimo: ${threshold}%_\n`);

if (!reportOnly) {
  const failed = rows.filter(r => !r.ok);
  if (failed.length > 0) {
    console.error('❌ Cobertura insuficiente en: ' + failed.map(r => `${r.metric} (${r.pct}%)`).join(', '));
    console.error(`   Mínimo requerido: ${threshold}% — escribe más tests antes de hacer commit.`);
    process.exit(1);
  }
  console.log('✅ Cobertura OK — todos los métricas ≥ ' + threshold + '%');
}
NODEEOF
