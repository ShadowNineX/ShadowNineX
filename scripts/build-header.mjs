import { mkdir, writeFile } from 'node:fs/promises';

const output = new URL('../assets/', import.meta.url);
await mkdir(output, { recursive: true });

for (const dark of [false, true]) {
  for (const compact of [false, true]) {
    const palette = dark
      ? { bg: '#211e2b', ink: '#fff5df', muted: '#d9cbb5', honey: '#ffc65b', orange: '#ef9866', line: '#514557', mint: '#a8ccbd' }
      : { bg: '#fff3d9', ink: '#42323f', muted: '#705449', honey: '#a35720', orange: '#cf673e', line: '#dfc9a6', mint: '#497765' };
    const w = compact ? 600 : 1200;
    const h = compact ? 420 : 360;
    const trails = compact ? 'translate(390 291) scale(.55)' : 'translate(964 163)';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
  <title id="title">ShadowNine — a little workshop for good ideas.</title>
  <desc id="desc">A small fox and lantern in honey and twilight colors, with twin looping trails inspired by Tails. The decorative motion settles after four seconds.</desc>
  <style>
    .ink { fill: ${palette.ink}; }
    .muted { fill: ${palette.muted}; }
    .honey { fill: ${palette.honey}; }
    .trail { stroke-dasharray: 1200; stroke-dashoffset: 0; animation: trace 3.8s cubic-bezier(.16,1,.3,1) 1; }
    .trail-second { animation-delay: .18s; }
    @keyframes trace { from { stroke-dashoffset: 1200; } to { stroke-dashoffset: 0; } }
    @media (prefers-reduced-motion: reduce) { .trail { animation: none; } }
  </style>
  <rect width="${w}" height="${h}" rx="22" fill="${palette.bg}"/>
  <path d="M32 ${h - 27}H${w - 32}" stroke="${palette.line}"/>
  <g transform="${trails}" fill="none" stroke-linecap="round">
    <ellipse rx="147" ry="91" transform="rotate(-35)" stroke="${palette.line}"/>
    <ellipse rx="147" ry="91" transform="rotate(35)" stroke="${palette.line}"/>
    <path class="trail" d="M-167 112C-80 128 156 47 112-64C78-154-61-84-38 7C-18 84 101 132 178 78" stroke="${palette.honey}" stroke-width="22"/>
    <path class="trail trail-second" d="M-154 139C-70 158 166 66 138-28C117-101 34-85 33-17C33 34 96 63 147 37" stroke="${palette.orange}" stroke-width="13"/>
    <path d="M145 88Q163 84 178 78" stroke="${palette.ink}" stroke-width="22"/>
    <path d="M127 43Q139 41 147 37" stroke="${palette.ink}" stroke-width="13"/>
    <path d="M-4 -105V-135M-19 -120H11" stroke="${palette.mint}" stroke-width="3"/>
    <circle cx="-160" cy="-18" r="5" fill="${palette.orange}"/>
    <circle cx="165" cy="-100" r="3" fill="${palette.mint}"/>
    <g transform="translate(-125 -66)" stroke="${palette.ink}" stroke-width="3" stroke-linejoin="round">
      <path d="M0 10L-12-12L-17 19L0 35L17 19L12-12Z" fill="${palette.bg}"/>
      <path d="M-13 20L0 26L13 20M0 26V32"/>
      <path d="M-8 13H-6M6 13H8"/>
      <path d="M35 9V3a7 7 0 0 1 14 0v6M32 10H52L49 39H35Z" fill="${palette.bg}"/>
      <path d="M42 17V30" stroke="${palette.honey}" stroke-width="5"/>
      <path d="M30 40H54"/>
    </g>
  </g>
  <g font-family="Trebuchet MS, Verdana, sans-serif">
    <text x="${compact ? 32 : 54}" y="${compact ? 108 : 156}" font-size="${compact ? 66 : 100}" font-weight="700" letter-spacing="-4" class="ink">Shadow<tspan class="honey">Nine</tspan></text>
    <text x="${compact ? 35 : 58}" y="${compact ? 163 : 212}" font-size="${compact ? 27 : 27}" class="ink">${compact ? 'A little workshop' : 'A little workshop for good ideas.'}</text>
    ${compact ? '<text x="35" y="201" font-size="27" class="ink">for good ideas.</text>' : ''}
    <text x="${compact ? 35 : 58}" y="${h - 56}" font-size="${compact ? 20 : 19}" class="muted">Make yourself at home.</text>
  </g>
</svg>
`;
    const name = `hello-${dark ? 'dark' : 'light'}${compact ? '-compact' : ''}.svg`;
    await writeFile(new URL(name, output), svg);
  }
}
console.log('Built four self-contained header variants.');
