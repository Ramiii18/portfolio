import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { content, type Lang } from '../data/content'
import { LangContext } from '../lib/lang-context'
import { readLocal, writeLocal } from '../lib/storage'

const KEY = 'fleetos.lang'

export default function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (readLocal(KEY) === 'fr' ? 'fr' : 'en'))

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    writeLocal(KEY, next)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t: content[lang] }), [lang, setLang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
