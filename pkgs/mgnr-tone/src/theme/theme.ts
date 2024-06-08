import { Middlewares, Scale, ScaleSource } from 'mgnr-core'
import { Transport } from 'tone'
import { clamp } from 'utils'
import { ToneOutletPort } from '../OutletPort'
import { getMixer } from '../commands'
import { Mixer } from '../mixer/Mixer'
import { ThemeAlignment, ThemeGridDirection } from './grid'

export type Duration = `${number}m`

export type ThemeMaker = (
  startAt: number,
  source: ScaleSource,
  alignment: ThemeAlignment,
  ...args: unknown[]
) => Theme

export type ThemeComponentPosition = 'top' | 'bottom' | 'right' | 'left' | 'center'

export type Theme = {
  [k in ThemeComponentPosition]: ThemeComponent
} & { updateAlignment(direction: ThemeGridDirection): void }

export type ThemeComponentMakerMap = { [k in ThemeComponentPosition]?: ThemeComponentMaker }

const makePseudoComponent = (): ThemeComponent => ({
  playMore: () => undefined,
  playLess: () => undefined,
  fadeIn: () => undefined,
  fadeOut: () => undefined,
})

export const injectThemeAlignment =
  (components: Omit<ThemeComponentMakerMap, 'updateAlignment'>): ThemeMaker =>
  (startAt, source, alignment, ...rest) => {
    const initialLevels = determineInitialLevel(alignment)
    const keys: ThemeComponentPosition[] = ['top', 'bottom', 'right', 'left', 'center']
    const { top, bottom, left, right, center } = Object.fromEntries(
      keys.map((k) => {
        const component = components[k]
        return [
          k,
          component ? component(startAt, source, initialLevels[k], ...rest) : makePseudoComponent(),
        ]
      })
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
  source: ScaleSource,
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
  ports: Array<ToneOutletPort<Middlewares> | ToneOutletPort<MW>>,
  scale: Scale
): Pick<ThemeComponent, 'fadeIn' | 'fadeOut'> => {
  return {
    fadeIn: (duration) => channel.dynamicVolumeFade(channel.volumeRangeDiff, duration),
    fadeOut: (duration, ) => {
      channel.dynamicVolumeFade(-channel.volumeRangeDiff, duration)
      Transport.scheduleOnce(() => {
        getMixer().deleteChannel(channel)
        ports.forEach((port) => port.stopLoop())
        scale.dispose()
      }, `+${duration}`)
    },
  }
}

const directionMap: Record<ThemeGridDirection, [ThemeComponentPosition, ThemeComponentPosition]> = {
  up: ['top', 'bottom'], // inDirection, against
  down: ['bottom', 'top'],
  left: ['left', 'right'],
  right: ['right', 'left'],
}

type DirectionDurationMap = {
  inDirection: Duration
  againstDirection: Duration
  neutral: Duration
}

export const makeFadeOutTheme =
  (
    duration: DirectionDurationMap = {
      inDirection: '24m',
      againstDirection: '8m',
      neutral: '16m',
    },
    timing = '@4m',
    delay = '4m'
  ) =>
  (theme: Theme, direction: ThemeGridDirection) => {
    const [inDirection, againstDirection] = directionMap[direction]
    const keys: ThemeComponentPosition[] = ['top', 'left', 'right', 'bottom', 'center']
    const fadeOut = () => {
      keys.forEach((k) => {
        const v = theme[k]
        if (k === inDirection) {
          v.fadeOut(duration.inDirection)
        } else if (k === againstDirection) {
          v.fadeOut(duration.againstDirection)
        } else {
          v.fadeOut(duration.neutral)
        }
      })
    }
    Transport.scheduleOnce((t) => {
      Transport.scheduleOnce(fadeOut, t + Transport.toSeconds(delay))
    }, timing)
  }

export const makeFadeInTheme =
  (
    duration: DirectionDurationMap = {
      inDirection: '24m',
      againstDirection: '8m',
      neutral: '16m',
    },
    timing = '@4m',
    delay = '4m'
  ) =>
  (theme: Theme, direction: ThemeGridDirection) => {
    const [inDirection, againstDirection] = directionMap[direction]
    const keys: ThemeComponentPosition[] = ['top', 'left', 'right', 'bottom', 'center']
    const fadeIn = (t: number) => {
      keys.forEach((k) => {
        const v = theme[k]
        if (k === inDirection) {
          Transport.scheduleOnce(
            () => v.fadeIn(duration.inDirection),
            t + Transport.toSeconds(delay)
          )
        } else if (k === againstDirection) {
          v.fadeIn(duration.againstDirection)
        } else {
          v.fadeIn(duration.neutral)
        }
      })
    }
    Transport.scheduleOnce((t) => fadeIn(t), timing)
  }
