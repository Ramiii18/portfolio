import { describe, expect, it } from 'vitest'
import { content } from '../data/content'
import { ask, buildChunks, buildKnowledge, tokenize } from './qa'

const en = buildKnowledge(content.en)
const fr = buildKnowledge(content.fr)
const top = (k: typeof en, q: string) => ask(k, q)[0]?.id

describe('tokenize', () => {
  it('lowercases, strips accents and stopwords, trims plurals', () => {
    expect(tokenize('Quelles sont ses compétences ?')).toEqual(['competence'])
    expect(tokenize('What are his SKILLS in C#?')).toEqual(['skill', 'csharp'])
  })
})

describe('ask (English)', () => {
  it('answers the suggested questions from the right chunk', () => {
    expect(top(en, 'What does he do at ISITEC?')).toBe('job-0')
    expect(top(en, 'Which languages does he speak?')).toBe('languages')
    expect(top(en, 'Where did he study?')).toBe('education')
    expect(top(en, 'How can I contact him?')).toBe('contact')
    expect(top(en, 'What are his optimization skills?')).toBe('skill-OPT-01')
  })

  it('finds specific facts', () => {
    expect(top(en, 'Does he know Python?')).toBe('skill-PY-02')
    expect(top(en, 'What is his email?')).toBe('contact')
    expect(top(en, 'Where is he based?')).toBe('contact')
    expect(top(en, 'Any certifications?')).toBe('certifications')
    expect(ask(en, 'Tell me about the CPLEX project').map((c) => c.id)).toContain('project-pfe-milp')
  })

  it('gives the profile summary for generic questions', () => {
    expect(top(en, 'Tell me about Rami')).toBe('about')
    expect(top(en, 'Who is he?')).toBe('about')
  })

  it('returns nothing when the profile has no answer', () => {
    expect(ask(en, 'What is the weather tomorrow?')).toEqual([])
    expect(ask(en, 'salary expectations')).toEqual([])
    expect(ask(en, '   ')).toEqual([])
  })
})

describe('ask (French)', () => {
  it('answers the suggested questions from the right chunk', () => {
    expect(top(fr, 'Que fait-il chez ISITEC ?')).toBe('job-0')
    expect(top(fr, 'Quelles langues parle-t-il ?')).toBe('languages')
    expect(top(fr, 'Où a-t-il étudié ?')).toBe('education')
    expect(top(fr, 'Comment le contacter ?')).toBe('contact')
    expect(top(fr, 'Quelles sont ses compétences en optimisation ?')).toBe('skill-OPT-01')
  })
})

describe('knowledge base', () => {
  it('never contains private details or the outdated customer wording', () => {
    for (const lang of [content.en, content.fr]) {
      const all = buildChunks(lang)
        .map((c) => `${c.title} ${c.lines.join(' ')}`)
        .join(' ')
      expect(all).not.toMatch(/56 223|Aouina|Moroccan|marocain|French client|client français/i)
    }
  })
})
