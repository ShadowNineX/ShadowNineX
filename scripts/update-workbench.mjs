import { readFile, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const OWNER = 'ShadowNineX';
export const START = '<!-- WORKBENCH:START -->';
export const END = '<!-- WORKBENCH:END -->';

// API text is content, never Markdown or HTML. Escape before rendering.
export function escapeText(value) {
  return String(value).replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim()
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/[\\`*_{}\[\]()#!|~]/g, '\\$&');
}

export function selectProjects(repos) {
  if (!Array.isArray(repos)) throw new Error('Expected a repository array.');
  return repos.filter(repo => repo && repo.owner?.login?.toLowerCase() === OWNER.toLowerCase()
    && repo.private === false && !repo.fork && !repo.archived && !repo.disabled
    && typeof repo.name === 'string' && /^[\w.-]+$/.test(repo.name)
    && repo.name.toLowerCase() !== OWNER.toLowerCase()
    && typeof repo.pushed_at === 'string' && Number.isFinite(Date.parse(repo.pushed_at)))
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at) || a.name.localeCompare(b.name))
    .slice(0, 3);
}

export function renderWorkbench(projects) {
  if (!projects.length) throw new Error('No public projects returned; keeping the existing workbench.');
  const rows = projects.map(repo => {
    const url = `https://github.com/${OWNER}/${encodeURIComponent(repo.name)}`;
    const date = new Date(repo.pushed_at).toISOString().slice(0, 10);
    const language = repo.language ? ` · ${escapeText(repo.language)}` : '';
    const description = repo.description ? `\n\n${escapeText(repo.description)}` : '';
    return `**[${escapeText(repo.name)}](${url})**  \n<sub>Last push: ${date}${language}</sub>${description}`;
  });
  return `${rows.join('\n\n')}\n\n<sub>From my public repositories · refreshed daily · ordered by last push</sub>`;
}

export function replaceWorkbench(readme, content) {
  const count = marker => readme.split(marker).length - 1;
  if (count(START) !== 1 || count(END) !== 1 || readme.indexOf(START) > readme.indexOf(END)) {
    throw new Error('Expected one ordered pair of WORKBENCH markers; refusing to edit README.');
  }
  return readme.slice(0, readme.indexOf(START) + START.length)
    + `\n\n${content}\n\n` + readme.slice(readme.indexOf(END));
}

export async function fetchRepositories(fetcher = fetch, token = process.env.GITHUB_TOKEN) {
  const repos = [];
  for (let page = 1; page <= 10; page++) {
    const response = await fetcher(`https://api.github.com/users/${OWNER}/repos?type=owner&sort=pushed&per_page=100&page=${page}`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': `${OWNER}-profile`,
        'X-GitHub-Api-Version': '2022-11-28', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}; keeping the existing workbench.`);
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error('GitHub returned an invalid repository list.');
    repos.push(...batch);
    if (batch.length < 100) return repos;
  }
  throw new Error('Repository pagination exceeded its limit; keeping the existing workbench.');
}

async function main() {
  const readmePath = fileURLToPath(new URL('../README.md', import.meta.url));
  const original = await readFile(readmePath, 'utf8');
  const updated = replaceWorkbench(original, renderWorkbench(selectProjects(await fetchRepositories())));
  if (updated === original) return console.log('Workbench is already current.');
  // A failed network call never reaches this write; replace the file atomically.
  const tempPath = `${readmePath}.tmp`;
  await writeFile(tempPath, updated, 'utf8');
  await rename(tempPath, readmePath);
  console.log('Updated the public workbench.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
