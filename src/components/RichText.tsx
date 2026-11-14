/** Renders `**highlighted**` segments of a content string. */
export default function RichText({
  text,
  strongClassName = 'font-semibold text-safety',
}: {
  text: string
  strongClassName?: string
}) {
  const parts = text.split('**')
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={strongClassName}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}
