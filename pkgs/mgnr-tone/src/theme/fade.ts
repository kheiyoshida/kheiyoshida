import { InstChannel } from '../mixer/Channel'
import * as Transport from '../tone-wrapper/Transport'
import { GridDirection } from './grid'
import { SceneComponentPosition } from './scene'

export type InOut = {
  in: PositionOutletMap
  out: PositionOutletMap
}
type PositionOutletMap = Partial<Record<SceneComponentPosition, string>>

const directionMap: Record<
  GridDirection,
  [inDirection: SceneComponentPosition, against: SceneComponentPosition]
> = {
  up: ['top', 'bottom'],
  down: ['bottom', 'top'],
  left: ['left', 'right'],
  right: ['right', 'left'],
}

export type Duration = `${number}m`

type DirectionDurationMap = {
  inDirection: Duration
  againstDirection: Duration
  neutral: Duration
}

export const makeFader = (
  channels: Record<string, InstChannel>,
  duration: DirectionDurationMap = {
    inDirection: '24m',
    againstDirection: '12m',
    neutral: '16m',
  },
  timing = '@4m',
  delay = '4m'
) => {
  const getDuration = (position: SceneComponentPosition, direction: GridDirection) => {
    const [inDirection, againstDirection] = directionMap[direction]
    if (position === inDirection) return duration.inDirection
    else if (position === againstDirection) return duration.againstDirection
    else return duration.neutral
  }
  const fadeOut = (fadeOutInstIds: PositionOutletMap, direction: GridDirection) => {
    const fade = () => {
      Object.entries(fadeOutInstIds).forEach(([k, instId]) => {
        const instCh = channels[instId]
        if (!instCh) throw Error(`channel not found: ${instId}`)
        const duration = getDuration(k as SceneComponentPosition, direction)
        instCh.dynamicVolumeFade(-instCh.volumeRangeDiff, duration)
      })
    }
    Transport.scheduleOnce((t) => {
      Transport.scheduleOnce(fade, t + Transport.toSeconds(delay))
    }, timing)
  }
  const fadeIn = (fadeInInstIds: PositionOutletMap, direction: GridDirection) => {
    const fade = (t: number) => {
      Object.entries(fadeInInstIds).forEach(([k, instId]) => {
        const instCh = channels[instId]
        if (!instCh) throw Error(`channel not found: ${instId}`)
        const duration = getDuration(k as SceneComponentPosition, direction)
        const [inDirection] = directionMap[direction]
        if (k === inDirection) {
          Transport.scheduleOnce(
            () => instCh.dynamicVolumeFade(instCh.volumeRangeDiff, duration),
            t + Transport.toSeconds(delay)
          )
        } else {
          instCh.dynamicVolumeFade(instCh.volumeRangeDiff, duration)
        }
      })
    }
    Transport.scheduleOnce((t) => fade(t), timing)
  }
  return (inOut: InOut, direction: GridDirection) => {
    fadeOut(inOut.out, direction)
    fadeIn(inOut.in, direction)
  }
}
