import { createContext, useContext } from 'react'
import { content, type Content, type Lang } from '../data/content'

export interface LangValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Content
}

export const LangContext = createContext<LangValue>({
  lang: 'en',
  setLang: () => {},
  t: content.en,
})

export function useLang(): LangValue {
  return useContext(LangContext)
}
