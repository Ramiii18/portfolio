import { createContext, useContext, type MutableRefObject } from 'react'
import type { SectionId } from '../data/content'

export type View = 'fleet' | 'classic'

export interface NavOptions {
  /** Scroll to the Optimizer Playground once the section is shown. */
  playground?: boolean
}

export type FleetNavigate = (section: SectionId, options?: NavOptions) => void

export interface AppValue {
  /** View actually shown (always "classic" below 1024 px). */
  view: View
  isDesktop: boolean
  setView: (view: View) => void
  /** Go to a section: drives the robot in fleet view, scrolls in classic view. */
  navigate: FleetNavigate
  openPalette: () => void
  /** Fleet view registers its robot navigation here. */
  fleetNav: MutableRefObject<FleetNavigate | null>
}

export const AppContext = createContext<AppValue | null>(null)

export function useApp(): AppValue {
  const value = useContext(AppContext)
  if (!value) throw new Error('useApp must be used inside AppContext')
  return value
}
