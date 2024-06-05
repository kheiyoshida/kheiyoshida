import { Middlewares, Scale } from 'mgnr-core'
import { Transport } from 'tone'
import { ToneOutletPort } from '../OutletPort'
import { getMixer } from '../commands'
import { Mixer } from '../mixer/Mixer'
import { ThemeAlignment, ThemeGridDirection, ThemeGridPosition } from './grid'
import { clamp } from 'utils'

export type Duration = `${number}m`

export type ThemeMaker = (
  startAt: number,
  scale: Scale,
  alignment: ThemeAlignment,
  ...args: unknown[]
) => Theme

export type ThemeComponentPosition = 'top' | 'bottom' | 'right' | 'left' | 'center'

export type Theme = {
  [k in ThemeComponentPosition]: ThemeComponent
} & { updateAlignment(direction: ThemeGridDirection): void }

export type ThemeComponentMakerMap = { [k in ThemeComponentPosition]?: ThemeComponentMaker }

const makePseudoComponent = (): ThemeComponent => ({
  playMore: () => {},
  playLess: () => {},
  fadeIn: () => {},
  fadeOut: () => {},
})

export const injectThemeAlignment =
  (components: Omit<ThemeComponentMakerMap, 'updateAlignment'>): ThemeMaker =>
  (startAt, scale, alignment) => {
    const initialLevels = determineInitialLevel(alignment)
    const { top, bottom, left, right, center } = Object.entries(components).reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: v
          ? v(startAt, scale, initialLevels[k as ThemeComponentPosition])
          : makePseudoComponent(),
      }),
      {} as Theme
    )
    const updateAlignment = (direction: ThemeGridDirection) => {
      if (direction === 'up') {
        top.playMore()
        bottom.playLess()
      }
      if (direction === 'down') {
        bottom.playMore()
        top.playLess()
      }
    }
    return {
      top,
      bottom,
      left,
      right,
      center,
      updateAlignment,
    }
  }

export const determineInitialLevel = (
  alignment: ThemeAlignment
): Record<ThemeComponentPosition, ComponentPlayLevel> => {
  return {
    top: alignment.includes('top') ? 4 : alignment.includes('bottom') ? 2 : 3,
    bottom: alignment.includes('bottom') ? 4 : alignment.includes('top') ? 2 : 3,
    right: alignment.includes('right') ? 4 : alignment.includes('left') ? 2 : 3,
    left: alignment.includes('left') ? 4 : alignment.includes('right') ? 2 : 3,
    center: 3,
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
  playMore: () => void
  playLess: () => void
  fadeIn: (duration: Duration) => void
  fadeOut: (duration: Duration) => void
}

export const injectFadeInOut = <MW extends Middlewares>(
  channel: ReturnType<Mixer['createInstChannel']>,
  ports: Array<ToneOutletPort<Middlewares> | ToneOutletPort<MW>>
): Pick<ThemeComponent, 'fadeIn' | 'fadeOut'> => {
  return {
    fadeIn: (duration) => channel.dynamicVolumeFade(channel.volumeRangeDiff, duration),
    fadeOut: (duration) => {
      channel.dynamicVolumeFade(-channel.volumeRangeDiff, duration)
      Transport.scheduleOnce(() => {
        getMixer().deleteChannel(channel)
        ports.forEach((port) => port.stopLoop())
      }, `+${duration}`)
    },
  }
}
