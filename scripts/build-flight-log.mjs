// Receives the same eligible public projects used by the workbench updater.
// Counts repositories by their primary language, not lines of code or bytes.
export function summarizeProjects(projects) {
  if (!projects.length) throw new Error('No public projects returned; keeping the existing flight log.');
  const languages = new Map();
  for (const project of projects) {
    const language = typeof project.language === 'string' && project.language.trim()
      ? project.language.trim() : 'Unspecified';
    languages.set(language, (languages.get(language) ?? 0) + 1);
  }
  return {
    total: projects.length,
    languages: [...languages].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
  };
}

const xml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[char]);

export function renderFlightLog(summary, { dark = false, compact = false } = {}) {
  const palette = dark
    ? { bg: '#211e2b', ink: '#fff5df', muted: '#d9cbb5', honey: '#ffc65b', orange: '#ef9866', line: '#514557', mint: '#a8ccbd' }
    : { bg: '#fff3d9', ink: '#42323f', muted: '#705449', honey: '#a35720', orange: '#cf673e', line: '#dfc9a6', mint: '#497765' };
  const width = compact ? 480 : 1000;
  const rows = summary.languages.slice(0, 5);
  const remaining = summary.languages.slice(5).reduce((sum, [, count]) => sum + count, 0);
  if (remaining) rows.push(['Other languages', remaining]);
  const height = compact ? 256 + rows.length * 59 : 158 + rows.length * 47;
  const chartX = compact ? 28 : 370;
  const chartWidth = compact ? 424 : 590;
  const firstY = compact ? 207 : 94;
  const colors = [palette.honey, palette.orange, palette.mint];
  const max = Math.max(...rows.map(([, count]) => count));
  const languageRows = rows.map(([name, count], index) => {
    const y = firstY + index * (compact ? 59 : 47);
    const label = name.length > 25 ? `${name.slice(0, 24)}…` : name;
    return `<g>
      <title>${xml(name)}: ${count} ${count === 1 ? 'repository' : 'repositories'}</title>
      <text x="${chartX}" y="${y}" font-size="${compact ? 20 : 21}" fill="${palette.ink}">${xml(label)}</text>
      <text x="${chartX + chartWidth}" y="${y}" text-anchor="end" font-size="20" fill="${palette.muted}">${count}</text>
      <rect x="${chartX}" y="${y + 11}" width="${chartWidth}" height="7" rx="3.5" fill="${palette.line}"/>
      <rect x="${chartX}" y="${y + 11}" width="${(count / max * chartWidth).toFixed(1)}" height="7" rx="3.5" fill="${colors[index % colors.length]}"/>
    </g>`;
  }).join('\n');
  const breakdown = summary.languages.map(([name, count]) => `${name}: ${count}`).join('; ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">ShadowNine's flight log — ${summary.total} public projects</title>
  <desc id="desc">Primary languages by repository count. ${xml(breakdown)}. Excludes forks, archived or disabled repositories, and the profile repository.</desc>
  <rect width="${width}" height="${height}" rx="22" fill="${palette.bg}"/>
  <g font-family="Trebuchet MS, Verdana, sans-serif">
    <text x="${compact ? 28 : 40}" y="${compact ? 52 : 57}" font-size="${compact ? 29 : 30}" font-weight="700" fill="${palette.ink}">The flight log</text>
    <text x="${compact ? 28 : 40}" y="${compact ? 123 : 168}" font-size="${compact ? 58 : 86}" font-weight="700" fill="${palette.honey}">${summary.total}</text>
    <text x="${compact ? 115 : 40}" y="${compact ? 119 : 206}" font-size="${compact ? 22 : 25}" fill="${palette.ink}">public projects</text>
    ${languageRows}
    <text x="${compact ? 28 : 40}" y="${height - 29}" font-size="${compact ? 16 : 18}" fill="${palette.muted}">Primary languages · public originals only</text>
  </g>
</svg>
`;
}
