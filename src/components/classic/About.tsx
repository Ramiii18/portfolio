import { useLang } from '../../lib/lang-context'
import RichText from '../RichText'

export function AboutBody() {
  const { t } = useLang()
  return (
    <div className="max-w-3xl space-y-4 text-[1.05rem]">
      {t.about.paragraphs.map((p, i) => (
        <p key={i}>
          <RichText text={p} />
        </p>
      ))}
      <p className="label pt-2">
        {t.meta.role} · {t.meta.company} · {t.meta.location}
      </p>
    </div>
  )
}
