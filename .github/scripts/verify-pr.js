const { Octokit } = require('@octokit/rest');
const token = process.env.GITHUB_TOKEN;
const prNumber = process.env.PR_NUMBER;
const repoFull = process.env.GITHUB_REPOSITORY;

if (!token || !prNumber || !repoFull) {
  console.error('Missing required environment variables');
  process.exit(2);
}

const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({ auth: token });

(async () => {
  const { data: pr } = await octokit.pulls.get({ owner, repo, pull_number: Number(prNumber) });
  const requiredLabels = ['i18n', 'a11y', 'ci:automation'];
  const labels = pr.labels.map(l => l.name);
  const missing = requiredLabels.filter(l => !labels.includes(l));

  const body = pr.body || '';
  const uncheckedMatches = body.match(/^\s*- \[ \].*/mg) || [];

  if (missing.length) {
    await octokit.issues.createComment({ owner, repo, issue_number: pr.number, body: `:warning: Missing required labels: ${missing.join(', ')}` });
    console.error('Missing required labels', missing);
    process.exit(1);
  }

  if (uncheckedMatches.length) {
    await octokit.issues.createComment({ owner, repo, issue_number: pr.number, body: ':warning: Please complete the PR checklist (there are unchecked items).' });
    console.error('Unchecked items in PR body');
    process.exit(1);
  }

  console.log('PR verification passed');
})();
