import test from 'node:test';
import assert from 'node:assert/strict';
import { selectPublicProjects } from './update-workbench.mjs';
import { summarizeProjects, renderFlightLog } from './build-flight-log.mjs';

const repo = (name, language, extra = {}) => ({ name, language, owner: { login: 'ShadowNineX' },
  private: false, fork: false, archived: false, pushed_at: '2026-09-01T00:00:00Z', ...extra });

test('flight log uses all eligible projects, excluding private, forked and unrelated work', () => {
  const projects = selectPublicProjects([
    repo('one', 'TypeScript'), repo('two', 'TypeScript'), repo('three', 'C#'), repo('four', null),
    repo('secret', 'Secret', { private: true }), repo('fork', 'Go', { fork: true }),
    repo('old', 'Java', { archived: true }), repo('disabled', 'Lua', { disabled: true }),
    repo('ShadowNineX', 'JavaScript'), repo('other', 'Swift', { owner: { login: 'SomeoneElse' } }),
  ]);
  assert.deepEqual(summarizeProjects(projects), {
    total: 4, languages: [['TypeScript', 2], ['C#', 1], ['Unspecified', 1]],
  });
  assert.throws(() => summarizeProjects([]), /keeping the existing/);
});

test('languages beyond the first five retain their counts and accessible descriptions', () => {
  const summary = summarizeProjects(['A', 'B', 'C', 'D', 'E', 'F', 'F', 'G'].map((lang, i) => repo(`p${i}`, lang)));
  const svg = renderFlightLog(summary);
  assert.match(svg, /8 public projects/);
  assert.match(svg, /Other languages: 2 repositories/);
  for (const lang of ['A', 'B', 'C', 'D', 'E', 'F', 'G']) assert.ok(svg.includes(`${lang}:`));
});

test('all theme and size variants escape API text and contain bounded chart geometry', () => {
  const summary = summarizeProjects([repo('one', '<script>&"\''), repo('two', 'TypeScript')]);
  for (const dark of [false, true]) for (const compact of [false, true]) {
    const svg = renderFlightLog(summary, { dark, compact });
    assert.ok(!svg.includes('<script>'));
    assert.match(svg, /&lt;script&gt;&amp;&quot;&apos;/);
    assert.ok(!/NaN|Infinity|undefined/.test(svg));
    assert.ok(svg.includes(`width="${compact ? 480 : 1000}"`));
    assert.ok(svg.includes(dark ? '#211e2b' : '#fff3d9'));
  }
});
