#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath || !fs.existsSync(eventPath)) {
  console.error('GITHUB_EVENT_PATH not set or file not found');
  process.exit(2);
}

const payload = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
const pr = payload.pull_request;
if (!pr) {
  console.error('No pull_request found in event payload');
  process.exit(2);
}

const body = pr.body || '';
const labels = (pr.labels || []).map(l => l.name.toLowerCase());

const errors = [];

// 1) Ensure checklist has no unchecked boxes
if (body.includes('- [ ]')) {
  errors.push('PR checklist contains unchecked items. Please complete the checklist before requesting a review.');
}

// 2) Ensure at least one category label is present
const categoryLabels = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore'];
const hasCategory = labels.some(l => categoryLabels.includes(l));
if (!hasCategory) {
  errors.push('Missing category label. Add one of: ' + categoryLabels.join(', '));
}

// 3) Optionally warn if i18n/a11y/ci labels are missing when relevant files changed
const filesChanged = (payload && payload.pull_request && payload.pull_request.changed_files) || 0;
// If the PR touches src/assets/i18n or app files, recommend i18n/a11y labels
if (filesChanged > 0) {
  const needsI18n = pr.files && pr.files.some(f => f.filename && f.filename.startsWith('src/assets/i18n'));
}

if (errors.length) {
  console.error('PR validation failed:');
  errors.forEach(e => console.error('- ' + e));
  process.exit(1);
}

console.log('PR validation passed');
process.exit(0);
