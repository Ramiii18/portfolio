// One-time script: renders public/og-image.png (1200x630) from an SVG.
// Run with: npm run og
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const W = 1200
const H = 630
const CELL = 42

let grid = ''
for (let x = 0; x <= W; x += CELL) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`
for (let y = 0; y <= H; y += CELL) grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`

const rack = (x, y, w, h) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#12171C" stroke="#2A333D" stroke-width="2"/>`

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0B0E11"/>
  <g stroke="#1C232B" stroke-width="1">${grid}</g>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#2A333D" stroke-width="3"/>

  ${rack(830, 96, 250, 70)}
  ${rack(830, 216, 250, 70)}
  ${rack(860, 410, 200, 70)}

  <path d="M 830 548 H 1120" fill="none" stroke="#FFC531" stroke-width="4" stroke-dasharray="20 16" opacity="0.4"/>

  <path d="M 84 548 H 720 L 785 483 V 348 H 1100 L 1130 318 V 150" fill="none" stroke="#3DD6F5" stroke-width="5"
        stroke-dasharray="16 12" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="1130" cy="150" r="16" fill="none" stroke="#3DD6F5" stroke-width="4"/>
  <circle cx="1130" cy="150" r="5" fill="#3DD6F5"/>

  <g transform="translate(84 548)">
    <circle r="44" fill="none" stroke="#3DD6F5" stroke-width="2" opacity="0.5"/>
    <rect x="-30" y="-21" width="60" height="42" rx="11" fill="#12171C" stroke="#FFC531" stroke-width="5"/>
    <path d="M 4 -11 L 21 0 L 4 11 Z" fill="#FFC531"/>
  </g>

  <text x="72" y="118" font-family="Consolas, 'Courier New', monospace" font-size="26" fill="#FFC531"
        letter-spacing="3">FLEET//OS · AMR-01 · STATE: MOVING</text>
  <text x="68" y="262" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="104"
        fill="#E6EAEE">RAMI</text>
  <text x="68" y="366" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="104"
        fill="#E6EAEE">BOUCHNAG</text>
  <text x="72" y="430" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="#8A96A3">Optimization Engineer · AMR/AGV Fleets</text>
</svg>`

const png = new Resvg(svg, {
  fitTo: { mode: 'width', value: W },
  font: { loadSystemFonts: true, defaultFontFamily: 'Arial' },
})
  .render()
  .asPng()

const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url))
writeFileSync(out, png)
console.log(`og-image.png written (${(png.length / 1024).toFixed(1)} KB)`)
