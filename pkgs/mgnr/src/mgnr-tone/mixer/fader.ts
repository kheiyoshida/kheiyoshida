import { fireByRate as random } from 'utils'
import { Channel } from './Channel'
import { registerTimeEvents } from '../commands'

type FadeConfig = {
  volumeRange: {
    min: number
    max: number
  }
  autoFadeIn?: {
    fireRate: number
    duration: string
    fireInterval: string
  }
  autoFadeOut?: {
    fireRate: number
    duration: string
    fireInterval: string
  }
}

type FadeStateValue = 'muted' | 'ramping' | 'on'
type FadeState = ReturnType<typeof makeFadeState>

export type Fader = {
  fadeState: FadeState
  manualFadeIn: (duration: string) => void
  manualFadeOut: (duration: string) => void
}

const makeFadeState = (initial: FadeStateValue = 'on') => {
  let state: FadeStateValue = initial
  return {
    get value() {
      return state
    },
    set: (newState: FadeStateValue) => {
      state = newState
    },
  }
}

const _fadeIn = (fadeState: FadeState, channel: Channel, volumeTo: number, duration: string) => {
  if (fadeState.value === 'muted') {
    channel.mute('off')
    return {
      time: '+0m',
      handler: () => {
        fadeState.set('ramping')
        channel.staticVolumeFade([volumeTo, duration])
        return {
          time: `+${duration}`,
          handler: () => {
            fadeState.set('on')
          },
        }
      },
    }
  }
}

const _fadeOut = (fadeState: FadeState, channel: Channel, volumeTo: number, duration: string) => {
  if (fadeState.value === 'on') {
    fadeState.set('ramping')
    channel.staticVolumeFade([volumeTo, duration])
    return {
      time: `+${duration}`,
      handler: () => {
        channel.mute('on')
        fadeState.set('muted')
      },
    }
  }
}

export const makeFader = (
  channel: Channel,
  config: FadeConfig,
  initialState: FadeStateValue = 'on'
): Fader => {
  const fadeState = makeFadeState(initialState)

  if (initialState === 'muted') {
    channel.mute('on')
  }

  const fadeIn = (duration: string) => _fadeIn(fadeState, channel, config.volumeRange.max, duration)
  const fadeOut = (duration: string) =>
    _fadeOut(fadeState, channel, config.volumeRange.min, duration)

  if (config.autoFadeIn) {
    const { fireInterval, fireRate, duration } = config.autoFadeIn
    registerTimeEvents({
      repeat: [
        {
          interval: fireInterval,
          handler: () => {
            if (random(fireRate)) {
              return fadeIn(duration)
            }
          },
        },
      ],
    })
  }
  if (config.autoFadeOut) {
    const { fireInterval, fireRate, duration } = config.autoFadeOut
    registerTimeEvents({
      repeat: [
        {
          interval: fireInterval,
          handler: () => {
            if (random(fireRate)) {
              return fadeOut(duration)
            }
          },
        },
      ],
    })
  }

  return {
    fadeState,
    manualFadeIn: (duration: string) => {
      registerTimeEvents({
        once: [
          {
            time: '+0m',
            handler: () => fadeIn(duration),
          },
        ],
      })
    },
    manualFadeOut: (duration: string) => {
      registerTimeEvents({
        once: [
          {
            time: '+0m',
            handler: () => fadeOut(duration),
          },
        ],
      })
    },
  }
}

export const manageFade = (fadeList: Fader[]) => {
  registerTimeEvents({
    repeat: [
      {
        interval: '4m',
        handler: () => {
          if (detectSilence(fadeList)) {
            fadeList[0].manualFadeIn('4m')
          }
        },
      },
    ],
  })
}

const detectSilence = (fadeList: Fader[]): boolean =>
  fadeList.every((fade) => fade.fadeState.value === 'muted')
