#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    console.error('GITHUB_EVENT_PATH is not set');
    process.exit(2);
  }
  const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const pr = event.pull_request || event.pull_request_target || event.issue && event.issue.pull_request ? event.pull_request : null;
  // when not available, try to read from env
  const prNumber = (event.pull_request && event.pull_request.number) || process.env.PR_NUMBER;
  if (!prNumber) {
    console.error('PR number not found in event payload or PR_NUMBER');
    process.exit(2);
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN is required to validate PR');
    process.exit(2);
  }

  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) {
    console.error('GITHUB_REPOSITORY is not set');
    process.exit(2);
  }

  const prResp = await fetch(`https://api.github.com/repos/${repo}/pulls/${prNumber}`, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
  });
  const prJson = await prResp.json();

  const requiredChecklist = [
    'Tests pass',
    'Build passes',
    'New/updated tests',
    'i18n',
    'Accessibility',
    'Documentation updated'
  ];

  const body = (prJson.body || '').toLowerCase();
  const missingChecklist = requiredChecklist.filter(item => !body.includes(item.toLowerCase()));

  const labels = (prJson.labels || []).map(l => l.name.toLowerCase());
  const requiredLabelGroups = ['i18n', 'a11y', 'ci:automation'];
  const hasAnyCategory = labels.some(l => requiredLabelGroups.includes(l));

  if (missingChecklist.length || !hasAnyCategory) {
    console.error('PR validation failed');
    if (missingChecklist.length) {
      console.error('Missing checklist items (body should mention):');
      missingChecklist.forEach(m => console.error(` - ${m}`));
    }
    if (!hasAnyCategory) console.error(`PR does not include any category label (${requiredLabelGroups.join(', ')})`);
    process.exit(1);
  }

  console.log('PR validation passed');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(2);
});
