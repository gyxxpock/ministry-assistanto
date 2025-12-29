#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function collectKeys(obj, prefix = '') {
  const keys = new Set();
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const childKeys = collectKeys(v, key);
      for (const ck of childKeys) keys.add(ck);
    } else {
      keys.add(key);
    }
  }
  return keys;
}

function readJson(file) {
  const raw = fs.readFileSync(file, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse JSON file ${file}:`, err.message);
    process.exit(2);
  }
}

function main() {
  const dir = path.resolve(__dirname, '../public/assets/i18n');
  if (!fs.existsSync(dir)) {
    console.error('i18n directory not found:', dir);
    process.exit(2);
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  if (!files.length) {
    console.error('No JSON locale files found in', dir);
    process.exit(2);
  }

  const locales = {};
  for (const file of files) {
    const p = path.join(dir, file);
    locales[file] = readJson(p);
  }

  const refFile = files.includes('en.json') ? 'en.json' : files[0];
  const refKeys = collectKeys(locales[refFile]);

  let failed = false;
  for (const file of files) {
    if (file === refFile) continue;
    const keys = collectKeys(locales[file]);

    const missing = [...refKeys].filter(k => !keys.has(k));
    const extra = [...keys].filter(k => !refKeys.has(k));

    if (missing.length || extra.length) {
      failed = true;
      console.error(`\nLocale ${file} differs from ${refFile}:`);
      if (missing.length) {
        console.error(`  Missing keys (${missing.length}):`);
        missing.forEach(k => console.error(`    - ${k}`));
      }
      if (extra.length) {
        console.error(`  Extra keys (${extra.length}):`);
        extra.forEach(k => console.error(`    - ${k}`));
      }
    }
  }

  if (failed) {
    console.error('\ni18n key check failed');
    process.exit(1);
  }

  console.log('i18n key check passed: all locale files match reference', refFile);
}

main();
