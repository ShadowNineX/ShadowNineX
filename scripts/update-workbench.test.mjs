import test from 'node:test';
import assert from 'node:assert/strict';
import { OWNER, START, END, selectProjects, renderWorkbench, replaceWorkbench, fetchRepositories } from './update-workbench.mjs';

const repo = (name, overrides = {}) => ({ name, owner: { login: OWNER }, private: false,
  fork: false, archived: false, pushed_at: '2026-09-01T10:00:00Z', language: 'TypeScript', ...overrides });

test('only the three newest eligible public projects appear', () => {
  const results = selectProjects([repo('old'), repo('new', { pushed_at: '2026-09-04T10:00:00Z' }),
    repo('third'), repo('fourth'), repo(OWNER), repo('secret', { private: true }),
    repo('unknown-visibility', { private: undefined }), repo('fork', { fork: true }),
    repo('archive', { archived: true }), repo('disabled', { disabled: true }),
    repo('other-owner', { owner: { login: 'someone-else' } }), repo('bad-date', { pushed_at: 'bad' }),
    repo('<script>'), null]);
  assert.deepEqual(results.map(r => r.name), ['new', 'fourth', 'old']);
});

test('untrusted metadata cannot insert HTML, images, headings, or links', () => {
  const output = renderWorkbench([repo('safe', { html_url: 'javascript:bad',
    description: '<img src=x>\n![click](https://evil.test) & # hi', language: '<script>' })]);
  assert.ok(output.includes('https://github.com/ShadowNineX/safe'));
  assert.ok(output.includes('&lt;img src=x&gt;'));
  assert.ok(output.includes('\\!\\[click\\]\\(https://evil.test\\)'));
  assert.ok(!output.includes('javascript:'));
  assert.ok(!output.includes('<script>'));
});

test('replacement preserves everything outside the markers and is idempotent', () => {
  const original = `My introduction\r\n${START}\r\nold\r\n${END}\r\nMy music`;
  const updated = replaceWorkbench(original, 'new');
  assert.equal(updated, `My introduction\r\n${START}\n\nnew\n\n${END}\r\nMy music`);
  assert.equal(replaceWorkbench(updated, 'new'), updated);
});

test('missing, duplicated, or reversed markers fail closed', () => {
  for (const value of ['', START, `${END}${START}`, `${START}${START}${END}`, `${START}${END}${END}`]) {
    assert.throws(() => replaceWorkbench(value, 'new'), /markers/);
  }
  assert.throws(() => renderWorkbench([]), /keeping/);
});

test('all public repository pages are fetched before selecting projects', async () => {
  const urls = [];
  const result = await fetchRepositories(async url => {
    urls.push(url);
    return { ok: true, json: async () => urls.length === 1
      ? Array.from({ length: 100 }, (_, i) => repo(`repo-${i}`)) : [repo('last-page')] };
  }, '');
  assert.equal(result.length, 101);
  assert.ok(urls[1].endsWith('page=2'));
});

test('API errors and malformed responses fail without publishing fallback data', async () => {
  await assert.rejects(fetchRepositories(async () => ({ ok: false, status: 403 }), ''), /HTTP 403/);
  await assert.rejects(fetchRepositories(async () => ({ ok: true, json: async () => ({ message: 'error' }) }), ''), /invalid/);
  await assert.rejects(fetchRepositories(async () => { throw new Error('offline'); }, ''), /offline/);
});
