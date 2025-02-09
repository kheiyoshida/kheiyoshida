import { InstChannel } from '../mixer/Channel'
import * as Transport from '../tone-wrapper/Transport'
import { SceneComponentPosition } from './scene'
import { GridDirection } from './grid'

/**
 * specification for channels that should fade in/out on event
 */
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

  const _fader = _makeFader(channels, timing, delay)

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

type FadeSpec = {
  inOrOut: 'in' | 'out'
  instId: string
  duration: Duration
  timing?: Duration
  delay?: Duration
}

const _makeFader = (channels: Record<string, InstChannel>, timing = '@4m', delay = '4m') => {
  return (fadeList: FadeSpec[]) => {
    const fade = () => {
      fadeList.forEach(({ instId, duration, inOrOut }) => {
        const instCh = channels[instId]
        if (!instCh) throw Error(`channel not found: ${instId}`)
        instCh.dynamicVolumeFade(
          inOrOut === 'in' ? instCh.volumeRangeDiff : -instCh.volumeRangeDiff,
          duration
        )
      })
    }
    Transport.scheduleOnce((t) => {
      Transport.scheduleOnce(fade, t + Transport.toSeconds(delay))
    }, timing)
  }
}
