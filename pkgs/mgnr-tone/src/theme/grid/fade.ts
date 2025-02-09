import { InstChannel } from '../../mixer/Channel'
import { SceneComponentPosition } from '../scene'
import { GridDirection } from './types'
import { makeFader, Duration, FadeSpec, InOut } from '../fade'

const directionMap: Record<
  GridDirection,
  [inDirection: SceneComponentPosition, against: SceneComponentPosition]
> = {
  up: ['top', 'bottom'],
  down: ['bottom', 'top'],
  left: ['left', 'right'],
  right: ['right', 'left'],
}

export type DirectionDurationMap = {
  inDirection: Duration
  againstDirection: Duration
  neutral: Duration
}

export const makeGridFader = (
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

  const _fader = makeFader(channels, timing, delay)

  return (inOut: InOut, direction: GridDirection) => {
    const fadeList: FadeSpec[] = []

    Object.entries(inOut.in).forEach(([k, instId]) => {
      const instCh = channels[instId]
      if (!instCh) throw Error(`channel not found: ${instId}`)
      const duration = getDuration(k as SceneComponentPosition, direction)
      fadeList.push({
        inOrOut: 'in',
        instId,
        duration,
      })
    })
    Object.entries(inOut.out).forEach(([k, instId]) => {
      const instCh = channels[instId]
      if (!instCh) throw Error(`channel not found: ${instId}`)
      const duration = getDuration(k as SceneComponentPosition, direction)
      fadeList.push({
        inOrOut: 'out',
        instId,
        duration,
      })
    })

    _fader(fadeList)
  }
}
