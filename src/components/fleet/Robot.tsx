/** AMR-01, drawn in SVG units around its own origin. Heading in degrees, 0 = facing right. */
export default function Robot({
  x,
  y,
  heading,
  label,
}: {
  x: number
  y: number
  heading: number
  label?: string
}) {
  return (
    <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`} role="img" aria-label={label}>
      <circle
        className="lidar-ring"
        r="30"
        fill="none"
        stroke="var(--path)"
        strokeWidth="1.5"
      />
      <g transform={`rotate(${heading.toFixed(1)})`}>
        <rect x="-12" y="-14" width="8" height="4" rx="1" fill="var(--line)" />
        <rect x="4" y="-14" width="8" height="4" rx="1" fill="var(--line)" />
        <rect x="-12" y="10" width="8" height="4" rx="1" fill="var(--line)" />
        <rect x="4" y="10" width="8" height="4" rx="1" fill="var(--line)" />
        <rect
          x="-16"
          y="-11"
          width="32"
          height="22"
          rx="6"
          fill="var(--panel)"
          stroke="var(--safety)"
          strokeWidth="2.5"
        />
        <path d="M 2 -6 L 11 0 L 2 6 Z" fill="var(--safety)" />
        <circle cx="-8" cy="0" r="2.5" fill="var(--path)" />
      </g>
    </g>
  )
}
