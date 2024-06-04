import { Middlewares, Scale } from 'mgnr-core'
import { Transport } from 'tone'
import { ToneOutletPort } from '../OutletPort'
import { getMixer } from '../commands'
import { Mixer } from '../mixer/Mixer'

export type Duration = `${number}m`

export type ThemeMaker = (startAt: number, scale: Scale, ...args: unknown[]) => Theme

export type ThemeComponentPosition = 'top' | 'bottom' // | 'right' | 'left' | 'center'

export type Theme = {
  [k in ThemeComponentPosition]: ThemeComponent
}

export type ThemeComponentMaker = (
  startAt: number,
  scale: Scale,
  ...args: unknown[]
) => ThemeComponent

export type ThemeComponent = {
  channel: ReturnType<Mixer['createInstChannel']>
  playMore: () => void
  playLess: () => void
  fadeIn: (duration: Duration) => void
  fadeOut: (duration: Duration) => void
}

export const injectFadeInOut = (
  channel: ThemeComponent['channel'],
  ports: ToneOutletPort<Middlewares>[]
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
