import type { SectionId } from '../data/content'
import { AboutBody } from './classic/About'
import { ContactBody } from './classic/Contact'
import { EducationBody } from './classic/Education'
import { ExperienceBody } from './classic/Experience'
import { ProjectsBody } from './classic/Projects'
import { SkillsBody } from './classic/Skills'

/** Section content, shared by the classic view and the fleet-view panels. */
export default function SectionBody({
  section,
  compact = false,
}: {
  section: SectionId
  compact?: boolean
}) {
  switch (section) {
    case 'about':
      return <AboutBody />
    case 'experience':
      return <ExperienceBody />
    case 'projects':
      return <ProjectsBody compact={compact} />
    case 'skills':
      return <SkillsBody compact={compact} />
    case 'education':
      return <EducationBody compact={compact} />
    case 'contact':
      return <ContactBody />
  }
}
