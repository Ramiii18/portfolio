/**
 * Retrieval for the profile assistant. Pure TypeScript, runs in the browser.
 * The knowledge base is built from src/data/content.ts, so the assistant can only
 * answer with what the site already says. Ranking is BM25 over the chunk text,
 * its title and a few bilingual keywords.
 */
import type { Content, SectionId } from '../data/content'

export interface Chunk {
  id: string
  section: SectionId
  title: string
  lines: string[]
  /** Extra search terms (EN + FR), never displayed. */
  keywords: string
  /** Searchable text that is not displayed, weighted like body text. */
  hidden?: string
}

interface Doc {
  tf: Map<string, number>
  length: number
}

export interface Knowledge {
  chunks: Chunk[]
  docs: Doc[]
  df: Map<string, number>
  avgLength: number
}

const STOPWORDS = new Set(
  (
    'the a an is are was were be of in on at to for and or what which who whom whose does do did ' +
    'he his him she her rami bouchnag your you me my i about tell can could with has have had how ' +
    'where when why this that it its please any some know give show there ' +
    'le la les un une des est sont ete etre de du dans sur au aux pour et ou que quel quelle quels ' +
    'quelles qui il elle son sa ses ton ta tes vous votre vos moi mon ma mes avec ont comment ' +
    'ce cet cette ces en se ne pas plus peux peut parle dis donne fait faire quoi ' +
    'y t l d j qu s n c'
  ).split(' '),
)

/** Lowercase, strip accents, split on non-alphanumerics, drop stopwords, trim plural "s". */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/c#/g, 'csharp')
    .split(/[^a-z0-9+]+/)
    .filter((w) => w.length > 0 && !STOPWORDS.has(w))
    .map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w))
}

const plain = (s: string) => s.replace(/\*\*/g, '')

const KW = {
  about:
    'who profile summary introduce introduction presentation strengths qualities soft person ' +
    'profil resume presenter forces qualites personnalite',
  currentJob:
    'current job work working role position company employer isitec experience now today career ' +
    'deployment deployments robots fleet responsibilities missions ' +
    'poste actuel travail travaille entreprise employeur metier experience carriere deploiement flotte',
  pastJob: 'experience previous past internship intern stage stagiaire experience precedente',
  project: 'project projects built realisation projet projets realise',
  skill:
    'skills skill tools technologies stack expertise competence competences outils maitrise technique',
  languages:
    'languages language speak spoken english french arabic spanish level fluent ' +
    'langues langue parler parle anglais francais arabe espagnol niveau courant',
  education:
    'education school university degree diploma study studied studies engineering graduate graduated enit bac ' +
    'formation ecole universite diplome etude etudes etudie ingenieur',
  certifications: 'certifications certification certificates certificate certificat certificats cours courses',
  coursework: 'coursework subjects classes matieres enseignements cours',
  activities: 'clubs club community associations extracurricular volunteering associative',
  contact:
    'contact email mail e-mail reach message linkedin hire hiring recruit ' +
    'based location located live city country relocate remote international available availability ' +
    'joindre contacter recruter embaucher lieu habite ville pays disponible disponibilite tunis tunisia tunisie',
}

/** Splits the site content into answerable chunks. */
export function buildChunks(t: Content): Chunk[] {
  const chunks: Chunk[] = []

  chunks.push({
    id: 'about',
    section: 'about',
    title: `${t.meta.name} · ${t.meta.role}`,
    lines: t.about.paragraphs.map(plain),
    keywords: KW.about,
  })

  t.experience.jobs.forEach((job, i) => {
    chunks.push({
      id: `job-${i}`,
      section: 'experience',
      title: `${job.role} · ${job.company} (${job.period})`,
      lines: job.bullets.map(plain),
      keywords: `${i === 0 ? KW.currentJob : KW.pastJob} ${job.location}`,
    })
  })

  for (const p of t.projects.items) {
    chunks.push({
      id: `project-${p.id}`,
      section: 'projects',
      title: p.title,
      lines: [p.pitch, p.approach, p.result],
      keywords: KW.project,
      hidden: `${p.stack.join(' ')} ${p.problem}`,
    })
  }

  for (const m of t.skills.modules) {
    chunks.push({
      id: `skill-${m.code}`,
      section: 'skills',
      title: m.title,
      lines: [m.items.join(' · ')],
      keywords: KW.skill,
    })
  }

  chunks.push({
    id: 'languages',
    section: 'skills',
    title: t.skills.languagesTitle,
    lines: t.skills.languages.map((l) => `${l.name}: ${l.level}`),
    keywords: KW.languages,
  })

  chunks.push({
    id: 'education',
    section: 'education',
    title: t.education.schoolsTitle,
    lines: t.education.schools.map((s) => `${s.school}. ${s.degree} (${s.period})`),
    keywords: KW.education,
  })

  chunks.push({
    id: 'certifications',
    section: 'education',
    title: t.education.certificationsTitle,
    lines: t.education.certifications.map((c) => `${c.name} (${c.issuer})`),
    keywords: KW.certifications,
  })

  chunks.push({
    id: 'coursework',
    section: 'education',
    title: t.education.courseworkTitle,
    lines: [t.education.coursework.join(' · ')],
    keywords: KW.coursework,
  })

  chunks.push({
    id: 'activities',
    section: 'education',
    title: t.education.activitiesTitle,
    lines: t.education.activities.map((a) => `${a.name}: ${a.role} (${a.period})`),
    keywords: KW.activities,
  })

  chunks.push({
    id: 'contact',
    section: 'contact',
    title: t.stations.contact.label,
    lines: [t.contact.email, t.contact.linkedinLabel, t.contact.locationLine],
    keywords: KW.contact,
  })

  return chunks
}

export function buildKnowledge(t: Content): Knowledge {
  const chunks = buildChunks(t)
  const df = new Map<string, number>()
  const docs = chunks.map((chunk) => {
    // title and keywords weigh more than body text
    const tokens = [
      ...tokenize(`${chunk.lines.join(' ')} ${chunk.hidden ?? ''}`),
      ...tokenize(`${chunk.title} ${chunk.title} ${chunk.title}`),
      ...tokenize(`${chunk.keywords} ${chunk.keywords}`),
    ]
    const tf = new Map<string, number>()
    for (const tok of tokens) tf.set(tok, (tf.get(tok) ?? 0) + 1)
    for (const tok of tf.keys()) df.set(tok, (df.get(tok) ?? 0) + 1)
    return { tf, length: tokens.length }
  })
  const avgLength = docs.reduce((sum, d) => sum + d.length, 0) / Math.max(1, docs.length)
  return { chunks, docs, df, avgLength }
}

const K1 = 1.5
/** Low length normalisation: the long job entries must not lose to short chunks. */
const B = 0.25

/**
 * Returns the best-matching chunks for a question, best first.
 * An empty array means the profile holds no answer.
 */
export function ask(knowledge: Knowledge, question: string, max = 2): Chunk[] {
  const { chunks, docs, df, avgLength } = knowledge
  const terms = Array.from(new Set(tokenize(question)))

  // "tell me about Rami", "who is he?": only stopwords left, so give the profile summary
  if (terms.length === 0) {
    return question.trim().length > 0 ? chunks.filter((c) => c.id === 'about') : []
  }

  const scored = docs
    .map((doc, i) => {
      let score = 0
      for (const term of terms) {
        const tf = doc.tf.get(term)
        if (!tf) continue
        const n = df.get(term) ?? 0
        const idf = Math.log(1 + (docs.length - n + 0.5) / (n + 0.5))
        score += (idf * tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * doc.length) / avgLength))
      }
      return { i, score }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)

  if (scored.length === 0) return []
  const best = scored[0].score
  return scored
    .filter((s) => s.score >= best * 0.6)
    .slice(0, max)
    .map((s) => chunks[s.i])
}
