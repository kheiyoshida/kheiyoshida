import { Scale } from "mgnr-core"
import { Mixer } from "../mixer/Mixer"

export type Duration = `${number}m`

export type ThemeMaker = (startAt: number, scale: Scale, ...args: unknown[]) => Theme

export type ThemeComponentPosition = 'top' | 'bottom' // | 'right' | 'left' | 'center'

export type Theme = {
  [k in ThemeComponentPosition]: ThemeComponent
}

export type ThemeComponentMaker = (startAt: number, scale: Scale, ...args: unknown[]) => ThemeComponent

export type ThemeComponent = {
  channel: ReturnType<Mixer['createInstChannel']>
  playMore: () => void
  playLess: () => void
  fadeIn: (duration: Duration) => void
  fadeOut: (duration: Duration) => void
}