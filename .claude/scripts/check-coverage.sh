#!/usr/bin/env bash
# Verify test coverage against the 90% minimum threshold.
# Usage:
#   check-coverage.sh              → blocks if < 90%
#   check-coverage.sh --warn-only  → reports without blocking (informational)
#   check-coverage.sh --report-only → same as --warn-only (alias for issues.sh)

SUMMARY="coverage/coverage-summary.json"
MODE="${1:-}"

if [ ! -f "$SUMMARY" ]; then
  echo "⚠️  $SUMMARY not found"
  echo "   Run: npx ng test --no-watch --code-coverage"
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

console.log('\n### 📊 Test coverage\n');
console.log('| Metric | Coverage | Status |');
console.log('|--------|----------|--------|');
rows.forEach(r => {
  const status = r.ok ? '✅' : (warnOnly ? '⚠️' : '❌');
  console.log(`| ${r.metric} | ${r.pct}% (${r.covered}/${r.total}) | ${status} |`);
});
console.log(`\n_Target threshold: ${threshold}%_\n`);

const failed = rows.filter(r => !r.ok);
if (failed.length > 0) {
  if (warnOnly) {
    console.log('⚠️  Global coverage below 90%. Goal: reach the threshold in the next sprint.');
  } else {
    console.error('❌ Cobertura insuficiente en: ' + failed.map(r => `${r.metric} (${r.pct}%)`).join(', '));
    console.error(`   Minimum required: ${threshold}% — write more tests before committing.`);
    process.exit(1);
  }
} else {
  console.log('✅ Coverage OK — all metrics ≥ ' + threshold + '%');
}
NODEEOF
