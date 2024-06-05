import { Middlewares, Scale } from 'mgnr-core'
import { Transport } from 'tone'
import { ToneOutletPort } from '../OutletPort'
import { getMixer } from '../commands'
import { Mixer } from '../mixer/Mixer'
import { ThemeAlignment } from './grid'
import { clamp } from 'utils'

export type Duration = `${number}m`

export type ThemeMaker = (startAt: number, scale: Scale, alignment: ThemeAlignment, ...args: unknown[]) => Theme

export type ThemeComponentPosition = 'top' | 'bottom' // | 'right' | 'left' | 'center'

export type Theme = {
  [k in ThemeComponentPosition]: ThemeComponent
} & { updateAlignment(alignment: ThemeAlignment): void }

export type ThemeComponentMakerMap = {[k in ThemeComponentPosition]: ThemeComponentMaker}

export const injectThemeAlignment = (
  theme: Omit<ThemeComponentMakerMap, 'updateAlignment'>
): ThemeMaker => (startAt, scale, alignment) => {
  const initialLevels = detemineInitialLevel(alignment)
  const top = theme.top(startAt, scale, initialLevels.top)
  const bottom = theme.bottom(startAt, scale, initialLevels.bottom)

  const updateAlignment = (alignment: ThemeAlignment) => {
    if (alignment.includes('top')) {
      top.playMore()
      bottom.playLess()
    }
    if (alignment.includes('bottom')) {
      bottom.playMore()
      top.playLess()
    }
  }
  return {
    top,
    bottom,
    updateAlignment,
  }
}

export const detemineInitialLevel = (alignment: ThemeAlignment): Record<ThemeComponentPosition, ComponentPlayLevel> => {
  return {
    top: alignment.includes('top') ? 4 : alignment.includes('bottom') ? 2 : 3,
    bottom: alignment.includes('bottom') ? 4 : alignment.includes('top') ? 2 : 3,
  }
}

export type ComponentPlayLevel = 1 | 2 | 3 | 4 | 5
export const clampPlayLevel = (l: number) => clamp(l, 1, 5) as ComponentPlayLevel
export const makeLevelMap = (values: number[]): Record<ComponentPlayLevel, number> => ({
  1: values[0],
  2: values[1],
  3: values[2],
  4: values[3],
  5: values[4],
})

export type ThemeComponentMaker = (
  startAt: number,
  scale: Scale,
  initialLevel: ComponentPlayLevel,
  ...args: unknown[]
) => ThemeComponent

export type ThemeComponent = {
  channel: ReturnType<Mixer['createInstChannel']>
  playMore: () => void
  playLess: () => void
  fadeIn: (duration: Duration) => void
  fadeOut: (duration: Duration) => void
}

export const injectFadeInOut = <MW extends Middlewares>(
  channel: ThemeComponent['channel'],
  ports: Array<ToneOutletPort<Middlewares> | ToneOutletPort<MW>>
): Pick<ThemeComponent, 'fadeIn' | 'fadeOut'> => {
  return {
    fadeIn: (duration) => channel.dynamicVolumeFade(channel.volumeRangeDiff, duration),
    fadeOut: (duration) => {
      channel.dynamicVolumeFade(-channel.volumeRangeDiff, duration)
      Transport.scheduleOnce(() => {
        getMixer().deleteChannel(channel)
        ports.forEach((port) => (port.numOfLoops = 0))
      }, `+${duration}`)
    },
  }
}
