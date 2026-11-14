/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        grid: 'var(--grid)',
        line: 'var(--line)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        safety: 'var(--safety)',
        path: 'var(--path)',
        ok: 'var(--ok)',
        warn: 'var(--warn)',
      },
      fontFamily: {
        sans: ['"Archivo Variable"', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
